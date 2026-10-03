# Concierge AI · Presston Strategic Partners — Plan Fase 1
*Borrador para depurar con Lex — 2 oct 2026*

## 1. Objetivo de la Fase 1
Un concierge de VOZ dentro de la web que atiende visitantes, responde dudas **solo con información pública aprobada**, pre-vende con técnica (escucha, encuadre, psicología inversa), perfila al visitante y lo pasa calificado a HubSpot. **El humano cierra.**

## 2. Alcance
**Incluye**
- Esfera flotante tipo GPT que se ilumina al hablar (diseño línea SpaceX)
- Voz en tiempo real (OpenAI Realtime API) como vía principal; texto como alternativa discreta
- Cerebro con RAG solo sobre contenido público
- Flujo pre-vendedor: perfila (capital, horizonte, referido, interés), extrae datos sutilmente, ofrece la evaluación privada
- Integración HubSpot: crea contacto + negocio en pipeline (caliente / tibio / curioso + resumen)
- ES + EN desde el día 1

**No incluye (fases 2–3)**
- WhatsApp como canal del bot, idioma chino, outreach proactivo, agenda automática de llamadas

## 3. Arquitectura
- **Front:** esfera flotante + panel de voz, vanilla JS en el `index.html` actual
- **Back:** Cloudflare Worker (el sitio ya vive en Workers) → OpenAI Realtime API (voz) → HubSpot API (private app)
- **RAG:** embeddings del copy público ES+EN + FAQ extendida; el prompt del sistema prohíbe responder fuera del corpus
- **Transcript:** cada conversación se transcribe y archiva; al cierre el bot pregunta el medio preferido (email o WhatsApp) y la envía por ahí

## 4. Corpus RAG (solo público)
- Copy público del sitio (ES+EN) + FAQ del sitio
- Cifras: solo las aprobadas del modelo calculadora ($120k meta, $25k ticket mínimo, 29 cont. año 1, 36 por ciudad en régimen, 1.01x / 1.28x / 5.49x)
- Nada del plan operativo privado; nada de producto / proveedor / precios (know-how)

## 5. Tono (decidido 2 oct 2026)
Sobrio y directo, línea SpaceX. Frases cortas, cero humo, cero emojis. El encuadre de venta va en la estructura de la conversación, no en adornos. Se presenta abiertamente como la AI de Presston.

## 6. Flujo de conversación (corazón pre-vendedor)
1. Saludo sobrio + pregunta abierta (escucha primero)
2. Responde dudas con el corpus; si preguntan lo privado → desvío elegante a la evaluación privada
3. Encuadre de calificación mutua ("la evaluación es para ver si hay encaje, no todos califican") — psicología inversa
4. Cierre de datos vía transcripción: "¿a dónde te envío la transcripción de todo lo que hablamos?" — email/WhatsApp salen como un favor, nunca como formulario; de paso se perfila rango de capital y horizonte
5. Oferta de la evaluación privada → guarda el lead en HubSpot con etiqueta + resumen + transcripción → el humano cierra

## 7. Calificación → HubSpot
- **Campos que guarda:** nombre, contacto, rango de capital, horizonte, referido, nivel de interés, idioma, resumen del bot
- **Pipeline:** Nuevo → Caliente / Tibio / Curioso → En evaluación → Cerrado / Descartado
- (Detalle fino de campos y etapas: a depurar)

## 8. Guardarraíles (no negociables)
- Jamás promete retornos: "proyecciones, no garantías"
- Jamás solicita inversión directa; ofrece la evaluación privada
- Si algo no está en el corpus, no lo inventa: desvía
- Se identifica como concierge AI de Presston

## 9. Idiomas
- ES + EN en Fase 1; ZH después

## 10. Costos estimados Fase 1
- OpenAI Realtime API (voz): ~$0.50–1.00 por minuto de conversación (con el volumen bajo del prototipo: decenas de USD/mes)
- Cloudflare Workers: $0–5/mes
- HubSpot CRM: $0 (plan gratis)
- **Total estimado inicial: ~$50–100/mes** (la voz manda: a más conversaciones, más costo)

## 11. Criterios de aceptación
- Responde solo con el corpus (prueba: preguntar por lo privado → debe desviar, jamás filtrar)
- Califica y crea el lead en HubSpot con etiqueta + resumen correctos
- Cero promesas de retorno en 20 conversaciones de prueba
- Widget con estética línea SpaceX, funcional en móvil y escritorio

## 12. Preguntas abiertas para depurar
1. ~~Tono del bot~~ → decidido: sobrio y directo, línea SpaceX (2 oct 2026)
2. ~~FAQ: la del sitio existe (9 preguntas~~ → decidido: se extiende con preguntas de objeciones de venta; "la mayor información posible, que el pre-vendedor tenga herramientas a la mano" (2 oct 2026). Borrador redactado en `faq-extendida.md`, en revisión de Lex.
3. ~~Widget: ¿el botón CHAT WITH US actual abre el panel, o se pone un botón flotante nuevo?~~ → decidido: botón flotante tipo GPT, esfera que se ilumina/pulsa mientras el bot responde (Fase 1: pulso con el streaming de texto; Fase 2: con la voz real). Estética línea SpaceX.
4. ~~¿El bot se presenta abiertamente como AI, o como "concierge de Presston" sin aclararlo?~~ → decidido: se presenta como la AI de Presston (2 oct 2026)
5. ~~Canal de envío de la transcripción: ¿email, WhatsApp o ambos?~~ → decidido: el bot pregunta sutilmente el medio preferido (email o WhatsApp) y la envía por ahí (2 oct 2026). WhatsApp Business API entra en Fase 1 solo para el envío del transcript.
