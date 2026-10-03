# Presston — Concierge AI (Fase 1)

Widget de voz en la web + Cloudflare Worker `concierge`. Atiende visitantes, responde solo con el corpus público aprobado, perfila y clasifica el lead en HubSpot. El humano cierra.

Especificación: [`docs/prompt-claude-code-concierge.md`](docs/prompt-claude-code-concierge.md) (aprobado por Lex, 3 oct 2026) · Doctrina: [`docs/estrategia-cierre.md`](docs/estrategia-cierre.md) · Resoluciones: [`docs/respuesta-para-code.md`](docs/respuesta-para-code.md).

Sin dependencias ni frameworks: JS puro en el widget y en el Worker. `wrangler` solo se usa vía `npx` para desplegar.

## Estructura

```
corpus/                  Corpus RAG (solo público). Una sección "### Título" = un fragmento.
  faq-extendida(.md|-en.md)    FAQ aprobada ES/EN
  cifras-publicas(.md|-en.md)  $120k meta, $25k ticket, múltiplos 1.01x/1.28x/5.49x (proyecciones)
  sitio-es.md / sitio-en.md    PENDIENTE: copy de la Variante 1
worker/
  wrangler.toml          Worker `concierge` (independiente del sitio) + variables
  src/index.js           Rutas: /session /search /lead /chat /health
  src/prompt.js          System prompt (identidad, tono, doctrina, guardarraíles) + herramientas
  src/search.js          Búsqueda BM25 sobre el corpus + filtro de temas privados + ROUND_COMMITTED
  src/hubspot.js         Contacto + negocio en pipeline "Concierge" (`default`) + nota con transcripción
  src/transcript.js      Formato de la transcripción; email (Resend) y WhatsApp (preparado)
  src/corpus.generated.js  Generado por `npm run corpus` — no editar
widget/concierge.js      Esfera + panel (Shadow DOM: no toca estilos ni copy del sitio)
widget/demo.html         Página de prueba local
scripts/acceptance.mjs   Pruebas de aceptación en vivo (requiere secretos)
test/                    Pruebas unitarias (`npm test`, sin red)
```

## Cómo funciona

**Voz (vía principal).** Al abrir la esfera, el navegador pide micrófono y llama a `POST /session`. El Worker pide a OpenAI un token efímero (`/v1/realtime/client_secrets`) con el system prompt y las herramientas, y devuelve solo ese token; la `OPENAI_API_KEY` nunca sale del Worker. El navegador conecta por WebRTC directo a OpenAI Realtime. La esfera pulsa con la amplitud real de la voz del bot.

Cuando el modelo llama una herramienta, el widget la reenvía al Worker:
- `buscar_corpus` → `POST /search`. Temas privados (producto, proveedor, precios, márgenes, plan privado) no devuelven contenido: el bot recibe la orden de desviar a la evaluación privada. Sin resultados → no inventa.
- `registrar_lead` → `POST /lead` con el perfil y la transcripción. El Worker crea/actualiza el contacto (`origen_concierge = "voz web"`), crea/actualiza el negocio en la etapa de su temperatura, adjunta la transcripción como nota y la envía por el medio elegido.

**Texto (alternativa discreta).** Si no hay micrófono o la voz falla, o el visitante elige "Modo texto", el widget usa `POST /chat` (mismo prompt, corpus y herramientas, resueltas en el Worker; `origen_concierge = "texto web"`). Con la voz activa, lo que se escribe entra a la misma sesión de voz.

**Idioma.** Se detecta del `lang` del sitio o del navegador; el visitante puede cambiar ES/EN en el panel o simplemente hablando en el otro idioma.

**HubSpot.** Pipeline `default` ("Concierge"). Temperatura → etapa: caliente `4390053582`, tibio `4390053583`, curioso `4390053584` (sin datos → Nuevo `4390053581`). Si el contacto ya tiene un negocio abierto en el pipeline, se actualiza en lugar de duplicarlo; si está en "En evaluación" (o después), el bot no le cambia la etapa — eso es del humano.

## Configuración

| Nombre | Tipo | Uso |
|---|---|---|
| `OPENAI_API_KEY` | secreto | Realtime (voz) y Chat Completions (texto) |
| `HUBSPOT_TOKEN` | secreto | Private app token de HubSpot |
| `ROUND_COMMITTED` | var | Monto comprometido de la Ronda Acero (USD). Vacío → "se confirma en la evaluación privada" |
| `ROUND_TARGET` | var | Meta de la ronda (120000) |
| `ALLOWED_ORIGINS` | var | Dominios del sitio que pueden usar el widget, separados por coma |
| `REALTIME_MODEL` / `REALTIME_VOICE` / `TRANSCRIBE_MODEL` / `TEXT_MODEL` | var | Modelos de OpenAI (por defecto `gpt-realtime`, `cedar`, `gpt-4o-mini-transcribe`, `gpt-5-mini`) |
| `RESEND_API_KEY` + `EMAIL_FROM` | secreto + var | Email de la transcripción. **Inactivo hasta acordar la credencial.** |
| `WHATSAPP_TOKEN` + `WHATSAPP_PHONE_NUMBER_ID` + `WHATSAPP_TEMPLATE` | secreto + vars | WhatsApp Cloud API. **Preparado, inactivo.** Requiere una plantilla aprobada por Meta. |

Mientras email o WhatsApp no estén activos, el lead se registra igual y la transcripción queda en HubSpot como nota del negocio; la respuesta indica `transcripcion: pendiente`.

## Desplegar

```bash
cd presston-concierge
npm test                                   # pruebas unitarias
cd worker
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put HUBSPOT_TOKEN
# editar wrangler.toml: ALLOWED_ORIGINS = "https://<dominio del sitio>", ROUND_COMMITTED = "<monto>"
cd .. && npm run deploy                    # regenera el corpus y despliega
```

En el `index.html` de la Variante 1, antes de `</body>` (única línea que se agrega; no se toca diseño ni copy):

```html
<script src="/concierge.js" data-endpoint="https://concierge.<cuenta>.workers.dev" defer></script>
```

y copiar `widget/concierge.js` junto al `index.html`. El sitio debe servirse por HTTPS (requisito del micrófono).

**Recomendado en producción:** activar el bloque `[[ratelimits]]` de `wrangler.toml` (límite por IP); los endpoints son públicos por naturaleza y el chequeo de origen no frena a un script.

## Probar en local

```bash
cd presston-concierge/worker
printf 'OPENAI_API_KEY=sk-...\nHUBSPOT_TOKEN=pat-...\nROUND_COMMITTED=5600\n' > .dev.vars   # no se versiona
npx wrangler dev                                  # http://localhost:8787
npx http-server ../widget -p 8080                 # abrir http://localhost:8080/demo.html
```

Aceptación en vivo (criterios 1–5; crea registros de prueba `concierge-test+…@example.com` en HubSpot, borrarlos después):

```bash
CONCIERGE_URL=http://localhost:8787 ORIGIN=http://localhost:8080 HUBSPOT_TOKEN=pat-... npm run acceptance
```

El criterio 6 (móvil/escritorio) y la voz se prueban a mano con el widget.

## Pendientes

- **Copy del sitio (Variante 1):** pegarlo en `corpus/sitio-es.md` y `sitio-en.md` y correr `npm run corpus`. Hasta entonces el corpus es la FAQ + cifras públicas. Al hacerlo, revisar que el significado de los múltiplos 1.01x / 1.28x / 5.49x quede tal como lo dice el sitio (hoy el bot solo los cita como proyecciones, sin interpretarlos).
- **Email:** acordar la credencial (propuesta: Resend, una API key + dominio verificado).
- **WhatsApp:** activar la API de Meta y aprobar una plantilla.
- **HubSpot:** si `origen_concierge` o `idioma` son propiedades de tipo enumeración, sus valores internos deben ser exactamente `voz web` / `texto web` y `ES` / `EN`; si `capital_interes` es numérica, cambiarla a texto (el bot guarda el rango tal como lo dice el visitante).
- **Revisión legal** pre-lanzamiento (lado de Lex).
