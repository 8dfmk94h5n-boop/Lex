# Prompt técnico — Concierge AI Presston (Fase 1)
*Borrador para aprobación de Lex · 3 oct 2026 · APROBADO por Lex el 3 oct 2026 — listo para construir*

**Nota de precedencia:** en caso de conflicto con `brief-fase-1.md`, este prompt manda. Es el documento posterior y refleja las decisiones finales: voz desde el día 1 y búsqueda simple sobre el corpus (sin vector DB).

---

Construye el **"Presston — Concierge AI"**: widget de voz en la web que atiende visitantes, responde preguntas con información pública aprobada, perfila al interesado y lo clasifica en el CRM. Texto como alternativa discreta.

## Stack (obligatorio)
- Widget: vanilla JS puro, sin frameworks, integrado como overlay al `index.html` de la **Variante 1 aprobada** (la que ya te indiqué). No tocar su diseño ni su copy.
- Backend: Cloudflare Worker nuevo (`concierge`), sin romper el sitio actual.
- Voz: OpenAI Realtime API (modelo vigente de la API). El navegador conecta por WebRTC; el Worker genera tokens efímeros de sesión. La API key NUNCA va en el frontend.
- RAG: corpus = copy público del sitio + `faq-extendida.md` + `faq-extendida-en.md` (te los doy). Doctrina comercial de referencia: `estrategia-cierre.md` (te la doy). Búsqueda simple sobre el corpus dentro del Worker. Sin vector DB externa.
- CRM: HubSpot (cuenta free). El Worker crea el contacto y el negocio con la Service Key (va como secreto del Worker, nunca en el frontend).

## Widget
- Botón flotante tipo esfera (estilo GPT), estética línea SpaceX: acero oscuro, ámbar, minimalista.
- La esfera se ilumina y pulsa mientras el bot habla.
- Al abrir: saludo breve de voz. Panel de texto discreto como alternativa.
- Idiomas: español e inglés. Detectar el idioma del visitante o preguntarlo al inicio.

## Comportamiento del bot (system prompt)
- Identidad: "Presston — Concierge AI", la AI de Presston (siempre con doble s: Presston).
- Tono: sobrio y directo, línea SpaceX. Frases cortas. Sin humo, sin emojis.
- Es un **pre-vendedor**: escucha, refleja, reencuadra y perfila. El humano hace el cierre final.
- Obtiene dentro de la conversación, **nunca como formulario**: nombre, capital de interés, horizonte, interés principal.
- Encuadre: "la evaluación es mutua; vemos si hay encaje", no "te quiero vender".
- Al finalizar: ofrece enviar la transcripción y pregunta el medio preferido (**email o WhatsApp**). El dato se obtiene como un favor.

## Guardarraíles (inviolables)
- Jamás promete retornos: "proyecciones, no garantías".
- Los múltiplos públicos 1.01x / 1.28x / 5.49x solo se citan como proyecciones del plan operativo, jamás como retornos prometidos.
- Jamás solicita una inversión directamente.
- No inventa información fuera del corpus.
- No negocia términos, tickets ni plazos.
- Si preguntan algo privado (producto, proveedor, precios, método de márgenes): desvía hacia la evaluación privada con el humano.
- Nota: el corpus (incluida la FAQ) fue aprobado por Lex como copy público del sitio; el bot lo presenta tal cual, siempre enmarcado como proyecciones.

## Clasificación en HubSpot (verificado en la API)
- Pipeline: "Concierge" (id `default` — el plan free permite un solo pipeline; es el pipeline renombrado y verificado, no el de ventas genérico).
- Stage IDs verificados: Nuevo `4390053581`, Caliente `4390053582`, Tibio `4390053583`, Curioso `4390053584`, En evaluación `4390053585`, Cerrado `4390053587`, Descartado `4390053588`.
- Propiedades verificadas (nombres internos exactos) — deal: `capital_interes`, `horizonte`, `referido_por`, `interes_principal`, `idioma`, `resumen_conversacion`; contacto: `origen_concierge`.
- Nota: existe un deal de muestra ("HubSpot - Brand Campaign (Sample Deal)") en etapa Nuevo — ignorarlo; se borra después.
- El bot clasifica por temperatura según la conversación y crea/actualiza el contacto + negocio con estas propiedades.

## Transcripción
- Al cierre, el Worker genera la transcripción y la ofrece.
- Si elige **email**: enviarla (implementar con el método más simple disponible; coordinar conmigo la credencial antes de elegir).
- Si elige **WhatsApp**: dejar el envío preparado en el Worker para conectarlo cuando se active la API (pendiente, no bloquear el resto por esto).

## Criterios de aceptación (probar todo antes de entregar)
1. Cero filtración privada: preguntar por producto / proveedor / precios y verificar que desvía al humano.
2. Cero garantías o promesas de retorno en las respuestas.
3. Clasificación correcta: probar un perfil caliente, uno tibio y uno curioso.
4. Contacto y negocio creados en HubSpot con los campos llenos.
5. Funciona en ES y EN.
6. Funciona en móvil y escritorio.
7. `OPENAI_API_KEY` y `HUBSPOT_TOKEN` solo como secretos del Worker. Nada hardcodeado.

## Secretos y configuración (te los doy al momento del build)
- `OPENAI_API_KEY`, `HUBSPOT_TOKEN` — solo como secretos del Worker. Nada hardcodeado.
- `ROUND_COMMITTED` — monto comprometido a la fecha de la Ronda Acero (USD). Variable de configuración del Worker (env), NO parte fija del corpus. El bot la usa para responder el estado de la ronda y calcula el restante contra la meta de $120,000.

## NO hacer
- No pedir capturas, videos ni GIFs.
- No rediseñar el sitio ni tocar el copy existente.
- No agregar dependencias ni frameworks.
