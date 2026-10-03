// Transcripción: formato + envío por email o WhatsApp.

const ROLE = { ES: { user: 'Visitante', assistant: 'Presston' }, EN: { user: 'Visitor', assistant: 'Presston' } };

/** turns: [{role: 'user'|'assistant', text}] → texto plano. */
export function formatTranscript(turns, lang = 'ES') {
  const r = ROLE[lang] || ROLE.ES;
  const date = new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC';
  const header =
    lang === 'EN'
      ? `Presston — Concierge AI · Conversation transcript · ${date}`
      : `Presston — Concierge AI · Transcripción de la conversación · ${date}`;
  const footer =
    lang === 'EN'
      ? 'Figures discussed are projections from the operating plan, not guarantees.'
      : 'Las cifras conversadas son proyecciones del plan operativo, no garantías.';
  const body = turns
    .filter((t) => t && t.text && (t.role === 'user' || t.role === 'assistant'))
    .map((t) => `${r[t.role]}: ${String(t.text).trim()}`)
    .join('\n\n');
  return `${header}\n\n${body}\n\n— ${footer}`;
}

/**
 * Email vía Resend (https://resend.com) — opción más simple para un Worker: una llamada HTTP.
 * INACTIVO hasta coordinar la credencial con Lex: requiere RESEND_API_KEY (secreto) y EMAIL_FROM (var).
 */
export async function sendEmail(env, to, transcript, lang = 'ES') {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) return { status: 'pendiente', motivo: 'email no configurado' };
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.EMAIL_FROM,
      to: [to],
      subject: lang === 'EN' ? 'Your conversation with Presston' : 'Tu conversación con Presston',
      text: transcript,
    }),
  });
  if (!res.ok) return { status: 'error', motivo: `Resend ${res.status}: ${await res.text()}` };
  return { status: 'enviado' };
}

/**
 * WhatsApp Cloud API (Meta) — PREPARADO, no activo (API pendiente de activación).
 * Fuera de la ventana de 24 h Meta exige una plantilla aprobada; se envía una plantilla con
 * un parámetro de texto (máx. ~1024 caracteres), así que la transcripción va recortada.
 * Activar con: WHATSAPP_TOKEN (secreto), WHATSAPP_PHONE_NUMBER_ID y WHATSAPP_TEMPLATE (vars).
 */
export async function sendWhatsApp(env, to, transcript, lang = 'ES') {
  if (!env.WHATSAPP_TOKEN || !env.WHATSAPP_PHONE_NUMBER_ID || !env.WHATSAPP_TEMPLATE) {
    return { status: 'pendiente', motivo: 'WhatsApp API no activada' };
  }
  const number = String(to).replace(/[^\d]/g, '');
  const excerpt = transcript.length > 1000 ? transcript.slice(0, 997) + '...' : transcript;
  const res = await fetch(`https://graph.facebook.com/v21.0/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: number,
      type: 'template',
      template: {
        name: env.WHATSAPP_TEMPLATE,
        language: { code: lang === 'EN' ? 'en' : 'es' },
        components: [{ type: 'body', parameters: [{ type: 'text', text: excerpt }] }],
      },
    }),
  });
  if (!res.ok) return { status: 'error', motivo: `WhatsApp ${res.status}: ${await res.text()}` };
  return { status: 'enviado' };
}

export async function deliverTranscript(env, lead, transcript) {
  if (lead.medio_transcripcion === 'email' && lead.email) return sendEmail(env, lead.email, transcript, lead.idioma);
  if (lead.medio_transcripcion === 'whatsapp' && lead.whatsapp) return sendWhatsApp(env, lead.whatsapp, transcript, lead.idioma);
  return { status: 'no_solicitado' };
}
