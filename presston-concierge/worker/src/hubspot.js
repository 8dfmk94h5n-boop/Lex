// HubSpot CRM (plan free). Pipeline "Concierge" = id `default` (verificado por Lex, 3 oct 2026).
const API = 'https://api.hubapi.com';

export const PIPELINE_ID = 'default';
export const STAGES = {
  nuevo: '4390053581',
  caliente: '4390053582',
  tibio: '4390053583',
  curioso: '4390053584',
  en_evaluacion: '4390053585',
  cerrado: '4390053587',
  descartado: '4390053588',
};
// Etapas que el bot puede (re)clasificar por temperatura. "En evaluación" y posteriores son del humano.
const BOT_STAGES = new Set([STAGES.nuevo, STAGES.caliente, STAGES.tibio, STAGES.curioso]);
const OPEN_STAGES = new Set([...BOT_STAGES, STAGES.en_evaluacion]);

// IDs de asociación HUBSPOT_DEFINED.
const ASSOC = { dealToContact: 3, noteToContact: 202, noteToDeal: 214 };

async function hs(env, method, path, body) {
  const res = await fetch(API + path, {
    method,
    headers: { Authorization: `Bearer ${env.HUBSPOT_TOKEN}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    const err = new Error(`HubSpot ${method} ${path} → ${res.status}: ${data.message || text}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

/** Quita campos vacíos para no borrar datos existentes en un update. */
function compact(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== ''));
}

async function findContact(env, { email, whatsapp }) {
  const filters = email
    ? [{ propertyName: 'email', operator: 'EQ', value: email }]
    : whatsapp
      ? [{ propertyName: 'phone', operator: 'EQ', value: whatsapp }]
      : null;
  if (!filters) return null;
  const r = await hs(env, 'POST', '/crm/v3/objects/contacts/search', {
    filterGroups: [{ filters }],
    properties: ['email', 'phone', 'firstname'],
    limit: 1,
  });
  return r.results?.[0]?.id || null;
}

async function upsertContact(env, lead, canal) {
  const [firstname, ...rest] = (lead.nombre || '').trim().split(/\s+/);
  const props = compact({
    firstname,
    lastname: rest.join(' '),
    email: lead.email,
    phone: lead.whatsapp,
    origen_concierge: canal === 'voz' ? 'voz web' : 'texto web',
  });
  const existing = await findContact(env, lead);
  if (existing) {
    await hs(env, 'PATCH', `/crm/v3/objects/contacts/${existing}`, { properties: props });
    return { id: existing, created: false };
  }
  try {
    const c = await hs(env, 'POST', '/crm/v3/objects/contacts', { properties: props });
    return { id: c.id, created: true };
  } catch (e) {
    // Carrera: otro request creó el contacto entre la búsqueda y la creación.
    const dup = e.status === 409 && /Existing ID:\s*(\d+)/.exec(e.data?.message || '');
    if (!dup) throw e;
    await hs(env, 'PATCH', `/crm/v3/objects/contacts/${dup[1]}`, { properties: props });
    return { id: dup[1], created: false };
  }
}

async function findOpenDeal(env, contactId) {
  const assoc = await hs(env, 'GET', `/crm/v4/objects/contacts/${contactId}/associations/deals?limit=100`);
  const ids = (assoc.results || []).map((r) => String(r.toObjectId));
  if (!ids.length) return null;
  const deals = await hs(env, 'POST', '/crm/v3/objects/deals/batch/read', {
    inputs: ids.map((id) => ({ id })),
    properties: ['pipeline', 'dealstage'],
  });
  const open = (deals.results || []).find(
    (d) => d.properties?.pipeline === PIPELINE_ID && OPEN_STAGES.has(d.properties?.dealstage),
  );
  return open ? { id: open.id, stage: open.properties.dealstage } : null;
}

export function dealProperties(lead) {
  return compact({
    capital_interes: lead.capital_interes,
    horizonte: lead.horizonte,
    referido_por: lead.referido_por,
    interes_principal: lead.interes_principal,
    idioma: lead.idioma === 'EN' ? 'EN' : 'ES',
    resumen_conversacion: lead.resumen,
  });
}

export function stageFor(temperatura) {
  return STAGES[temperatura] || STAGES.nuevo;
}

/**
 * Crea/actualiza contacto + negocio y adjunta la transcripción como nota.
 * @returns {{contactId, dealId, dealCreated}}
 */
export async function upsertLead(env, lead, { canal = 'voz', transcript = '' } = {}) {
  if (!env.HUBSPOT_TOKEN) throw new Error('HUBSPOT_TOKEN no configurado');
  const contact = await upsertContact(env, lead, canal);
  const props = dealProperties(lead);
  const open = contact.created ? null : await findOpenDeal(env, contact.id);

  let dealId;
  if (open) {
    // No mover hacia atrás un negocio que el humano ya pasó a "En evaluación".
    if (BOT_STAGES.has(open.stage)) props.dealstage = stageFor(lead.temperatura);
    await hs(env, 'PATCH', `/crm/v3/objects/deals/${open.id}`, { properties: props });
    dealId = open.id;
  } else {
    const deal = await hs(env, 'POST', '/crm/v3/objects/deals', {
      properties: {
        dealname: `Concierge — ${lead.nombre || 'Visitante'}`,
        pipeline: PIPELINE_ID,
        dealstage: stageFor(lead.temperatura),
        ...props,
      },
      associations: [
        { to: { id: contact.id }, types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: ASSOC.dealToContact }] },
      ],
    });
    dealId = deal.id;
  }

  if (transcript) {
    await hs(env, 'POST', '/crm/v3/objects/notes', {
      properties: {
        hs_timestamp: new Date().toISOString(),
        hs_note_body: `<p><strong>Transcripción Concierge (${canal} web)</strong></p><pre>${escapeHtml(transcript)}</pre>`,
      },
      associations: [
        { to: { id: dealId }, types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: ASSOC.noteToDeal }] },
        { to: { id: contact.id }, types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: ASSOC.noteToContact }] },
      ],
    });
  }
  return { contactId: contact.id, dealId, dealCreated: !open };
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
}
