// Presston — Concierge AI · Cloudflare Worker `concierge`.
//
// Rutas:
//   POST /session  → token efímero de OpenAI Realtime (el navegador conecta por WebRTC)
//   POST /search   → búsqueda en el corpus (herramienta buscar_corpus del modo voz)
//   POST /lead     → HubSpot + transcripción (herramienta registrar_lead del modo voz)
//   POST /chat     → modo texto (Chat Completions; herramientas resueltas aquí)
//   GET  /health
//
// Secretos: OPENAI_API_KEY, HUBSPOT_TOKEN (+ RESEND_API_KEY / WHATSAPP_TOKEN cuando se activen).
// Variables: ROUND_COMMITTED, ROUND_TARGET, ALLOWED_ORIGINS, REALTIME_MODEL, REALTIME_VOICE, TEXT_MODEL.
import { buildInstructions, greetingInstruction, realtimeTools, chatTools } from './prompt.js';
import { searchCorpus } from './search.js';
import { upsertLead } from './hubspot.js';
import { formatTranscript, deliverTranscript } from './transcript.js';

const MAX_BODY = 64 * 1024;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';
    const origin = request.headers.get('Origin');
    const cors = corsHeaders(origin, env);

    if (request.method === 'OPTIONS') return new Response(null, { status: cors ? 204 : 403, headers: cors || {} });
    if (path === '/health') return json({ ok: true }, 200, cors);
    if (request.method !== 'POST') return json({ error: 'not_found' }, 404, cors);
    if (!cors) return json({ error: 'origin_not_allowed' }, 403);

    if (env.RATE_LIMITER) {
      const ip = request.headers.get('CF-Connecting-IP') || 'anon';
      const { success } = await env.RATE_LIMITER.limit({ key: `${ip}:${path}` });
      if (!success) return json({ error: 'rate_limited' }, 429, cors);
    }

    let body;
    try {
      const raw = await request.text();
      if (raw.length > MAX_BODY) return json({ error: 'payload_too_large' }, 413, cors);
      body = raw ? JSON.parse(raw) : {};
    } catch {
      return json({ error: 'invalid_json' }, 400, cors);
    }

    try {
      switch (path) {
        case '/session':
          return json(await createRealtimeSession(env, lang(body.lang)), 200, cors);
        case '/search':
          return json(searchCorpus(str(body.consulta, 500), { lang: lang(body.lang), env }), 200, cors);
        case '/lead':
          return json(await handleLead(env, body.lead, body.transcript, 'voz'), 200, cors);
        case '/chat':
          return json(await handleChat(env, body), 200, cors);
        default:
          return json({ error: 'not_found' }, 404, cors);
      }
    } catch (e) {
      if (!e.httpStatus || e.httpStatus >= 500) console.error(path, e && e.stack ? e.stack : e);
      return json({ error: e.publicMessage || 'internal_error' }, e.httpStatus || 502, cors);
    }
  },
};

// ---------- Voz: sesión Realtime efímera ----------

async function createRealtimeSession(env, visitorLang) {
  requireSecret(env, 'OPENAI_API_KEY');
  const res = await fetch('https://api.openai.com/v1/realtime/client_secrets', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      expires_after: { anchor: 'created_at', seconds: 120 }, // solo para iniciar la conexión
      session: {
        type: 'realtime',
        model: env.REALTIME_MODEL || 'gpt-realtime',
        instructions: buildInstructions({ lang: visitorLang, channel: 'voz', env }),
        audio: {
          input: { transcription: { model: env.TRANSCRIBE_MODEL || 'gpt-4o-mini-transcribe' } },
          output: { voice: env.REALTIME_VOICE || 'cedar' },
        },
        tools: realtimeTools(),
        tool_choice: 'auto',
      },
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.value) {
    console.error('OpenAI client_secrets', res.status, JSON.stringify(data));
    throw publicError('voice_unavailable', 502);
  }
  return {
    client_secret: data.value,
    expires_at: data.expires_at,
    greeting: greetingInstruction(visitorLang),
  };
}

// ---------- Lead: HubSpot + transcripción ----------

export function sanitizeLead(raw) {
  if (!raw || typeof raw !== 'object') throw publicError('invalid_lead', 400);
  const lead = {
    nombre: str(raw.nombre, 120),
    email: str(raw.email, 200).toLowerCase(),
    whatsapp: str(raw.whatsapp, 40).replace(/[^\d+]/g, ''),
    capital_interes: str(raw.capital_interes, 200),
    horizonte: str(raw.horizonte, 200),
    referido_por: str(raw.referido_por, 200),
    interes_principal: str(raw.interes_principal, 500),
    temperatura: ['caliente', 'tibio', 'curioso'].includes(raw.temperatura) ? raw.temperatura : 'curioso',
    idioma: raw.idioma === 'EN' ? 'EN' : 'ES',
    resumen: str(raw.resumen, 2000),
    medio_transcripcion: ['email', 'whatsapp'].includes(raw.medio_transcripcion) ? raw.medio_transcripcion : 'ninguno',
  };
  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) lead.email = '';
  if (lead.whatsapp && !/^\+?\d{7,15}$/.test(lead.whatsapp)) lead.whatsapp = '';
  if (!lead.nombre && !lead.email && !lead.whatsapp) throw publicError('lead_without_identity', 400);
  return lead;
}

function sanitizeTurns(turns) {
  if (!Array.isArray(turns)) return [];
  return turns
    .slice(-200)
    .filter((t) => t && (t.role === 'user' || t.role === 'assistant'))
    .map((t) => ({ role: t.role, text: str(t.text, 4000) }))
    .filter((t) => t.text);
}

async function handleLead(env, rawLead, rawTurns, canal) {
  const lead = sanitizeLead(rawLead);
  const transcript = formatTranscript(sanitizeTurns(rawTurns), lead.idioma);
  const crm = await upsertLead(env, lead, { canal, transcript });
  const entrega = await deliverTranscript(env, lead, transcript);
  return { ok: true, crm, transcripcion: entrega };
}

// ---------- Texto: Chat Completions con herramientas ----------

async function handleChat(env, body) {
  requireSecret(env, 'OPENAI_API_KEY');
  const visitorLang = lang(body.lang);
  const history = (Array.isArray(body.messages) ? body.messages : [])
    .slice(-40)
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant'))
    .map((m) => ({ role: m.role, content: str(m.content, 2000) }))
    .filter((m) => m.content);
  if (!history.length || history[history.length - 1].role !== 'user') throw publicError('invalid_messages', 400);

  const messages = [{ role: 'system', content: buildInstructions({ lang: visitorLang, channel: 'texto', env }) }, ...history];
  let leadResult = null;

  for (let i = 0; i < 5; i++) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: env.TEXT_MODEL || 'gpt-5-mini', messages, tools: chatTools() }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error('OpenAI chat', res.status, JSON.stringify(data));
      throw publicError('chat_unavailable', 502);
    }
    const msg = data.choices?.[0]?.message;
    if (!msg) throw publicError('chat_unavailable', 502);
    if (!msg.tool_calls?.length) return { reply: msg.content || '', lead: leadResult };

    messages.push(msg);
    for (const call of msg.tool_calls) {
      let output;
      try {
        const args = JSON.parse(call.function.arguments || '{}');
        if (call.function.name === 'buscar_corpus') {
          output = searchCorpus(str(args.consulta, 500), { lang: visitorLang, env });
        } else if (call.function.name === 'registrar_lead') {
          if (leadResult) output = { ok: true, nota: 'ya registrado' };
          else {
            const turns = history.map((m) => ({ role: m.role, text: m.content }));
            leadResult = await handleLead(env, args, turns, 'texto');
            output = { ok: true, transcripcion: leadResult.transcripcion.status };
          }
        } else output = { error: 'herramienta desconocida' };
      } catch (e) {
        console.error('tool', call.function?.name, e && e.stack ? e.stack : e);
        output = { error: 'no se pudo completar; continúa la conversación sin mencionarlo en detalle' };
      }
      messages.push({ role: 'tool', tool_call_id: call.id, content: JSON.stringify(output) });
    }
  }
  throw publicError('chat_unavailable', 502);
}

// ---------- utilidades ----------

export function corsHeaders(origin, env) {
  const allowed = String(env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (!origin) return null;
  if (!allowed.includes('*') && !allowed.includes(origin)) return null;
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...(extra || {}) },
  });
}

function str(v, max) {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

function lang(v) {
  return v === 'EN' ? 'EN' : 'ES';
}

function requireSecret(env, name) {
  if (!env[name]) {
    console.error(`Falta el secreto ${name}`);
    throw publicError('not_configured', 503);
  }
}

function publicError(message, status) {
  const e = new Error(message);
  e.publicMessage = message;
  e.httpStatus = status;
  return e;
}
