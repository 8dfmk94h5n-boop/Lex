// Búsqueda simple (BM25) sobre el corpus público, dentro del Worker. Sin vector DB.
import { CORPUS } from './corpus.generated.js';

const STOPWORDS = new Set(
  (
    // ES
    'a al algo como con cual cuales cuando de del el ella ellos en es esa ese eso esta este esto ' +
    'estos ha hay la las le les lo los me mi mis muy no nos o para pero por que se si sin sobre ' +
    'su sus te tengo ti tu tus un una uno unos y ya yo quiero puedo hacer hace son ser esta estan ' +
    // EN
    'a an and are as at be by can do does for from have how i if in is it its me my of on or ' +
    'so that the this to what when where which who why will with you your'
  ).split(/\s+/),
);

// Temas privados (know-how): producto, proveedor, precios, márgenes, plan operativo privado.
const PRIVATE_PATTERNS = [
  /\bproveedor/, /\bsupplier/, /\bvendor/, /\bfabricante/, /\bmanufacturer/,
  /\bprecio/, /\bpricing\b/, /\bprice/, /\bcuanto cuesta/, /\bcost(o|e)s?\b/, /\btarifa/,
  /\bmargen/, /\bmargin/, /\bmarkup\b/,
  /\bque producto/, /\bwhich product/, /\bwhat product/, /\bproducto exacto/, /\bexact product/,
  /\bplan operativo privado/, /\bprivate (operating )?plan/, /\bde donde compran/, /\bwhere do you (buy|source)/,
];

export function normalize(s) {
  return String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9$.,x ]+/g, ' ');
}

function stem(t) {
  // Stemming mínimo ES/EN: plurales y algunas terminaciones frecuentes.
  if (t.length > 5) t = t.replace(/(aciones|acion|ciones|cion|mente|ing|ed)$/, '');
  if (t.length > 4) t = t.replace(/(es|s)$/, '');
  return t;
}

export function tokenize(s) {
  return normalize(s)
    .replace(/[.,]/g, ' ')
    .split(/\s+/)
    .filter((t) => t && !STOPWORDS.has(t))
    .map(stem);
}

export function isPrivateTopic(query) {
  const q = normalize(query);
  return PRIVATE_PATTERNS.some((re) => re.test(q));
}

// Índice BM25 precalculado al cargar el módulo.
const DOCS = CORPUS.map((c) => {
  const tokens = [...tokenize(c.title), ...tokenize(c.title), ...tokenize(c.text)]; // título pesa doble
  const tf = new Map();
  for (const t of tokens) tf.set(t, (tf.get(t) || 0) + 1);
  return { chunk: c, tf, len: tokens.length };
});
const AVGDL = DOCS.reduce((a, d) => a + d.len, 0) / Math.max(DOCS.length, 1);
const DF = new Map();
for (const d of DOCS) for (const t of d.tf.keys()) DF.set(t, (DF.get(t) || 0) + 1);

function bm25(queryTokens, doc, k1 = 1.4, b = 0.75) {
  let score = 0;
  for (const t of new Set(queryTokens)) {
    const f = doc.tf.get(t);
    if (!f) continue;
    const df = DF.get(t);
    const idf = Math.log(1 + (DOCS.length - df + 0.5) / (df + 0.5));
    score += idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * doc.len) / AVGDL)));
  }
  return score;
}

/** Sustituye el marcador ROUND_COMMITTED por las cifras vivas de la ronda. */
export function applyRoundFigures(text, env = {}) {
  const target = Number(env.ROUND_TARGET || 120000);
  const committed = Number(env.ROUND_COMMITTED);
  const valid = env.ROUND_COMMITTED !== undefined && env.ROUND_COMMITTED !== '' && Number.isFinite(committed) && committed >= 0;
  const usd = (n) => '$' + Math.round(n).toLocaleString('en-US');
  const pct = valid ? ((committed / target) * 100).toFixed(2) : '';
  const es = valid
    ? `Hay ${usd(committed)} comprometidos (${pct}%); restan ${usd(Math.max(target - committed, 0))}.`
    : 'El monto comprometido a la fecha se confirma en la evaluación privada.';
  const en = valid
    ? `${usd(committed)} is committed (${pct}%); ${usd(Math.max(target - committed, 0))} remains.`
    : 'The amount committed to date is confirmed in the private evaluation.';
  return text
    .replace(/El monto comprometido[^.]*ROUND_COMMITTED[^.]*\./g, es)
    .replace(/The amount committed[^.]*ROUND_COMMITTED[^.]*\./g, en);
}

/**
 * Busca en el corpus. Devuelve { privado, resultados: [{titulo, texto, idioma}] }.
 * Si la consulta es de un tema privado, no devuelve fragmentos: el bot debe desviar.
 */
export function searchCorpus(query, { lang, limit = 3, env = {} } = {}) {
  if (isPrivateTopic(query)) {
    return {
      privado: true,
      instruccion:
        'TEMA PRIVADO. No respondas el contenido. Desvía con elegancia: ese detalle se ve en la evaluación privada con el equipo humano.',
      resultados: [],
    };
  }
  const q = tokenize(query);
  const rank = (docs) =>
    docs
      .map((d) => ({ d, s: bm25(q, d) }))
      .filter((x) => x.s > 0.5)
      .sort((a, b) => b.s - a.s);

  // El corpus ES/EN es espejo: buscar en el idioma del visitante; si no hay nada, en ambos
  // (p. ej. una consulta en inglés con la sesión en ES).
  let scored = lang ? rank(DOCS.filter((d) => d.chunk.lang === lang)) : [];
  if (!scored.length) scored = rank(DOCS);

  const resultados = scored.slice(0, limit).map(({ d }) => ({
    titulo: d.chunk.title,
    texto: applyRoundFigures(d.chunk.text, env),
    idioma: d.chunk.lang,
  }));
  return {
    privado: false,
    instruccion: resultados.length
      ? 'Responde solo con esta información, en frases cortas. Cifras = proyecciones, no garantías.'
      : 'SIN RESULTADOS en el corpus. No inventes. Dilo con sobriedad y ofrece verlo en la evaluación privada.',
    resultados,
  };
}
