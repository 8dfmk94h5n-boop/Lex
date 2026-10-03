# Respuesta a Claude Code — OK para construir (3 oct 2026)

Lex confirma el OK para construir. Resoluciones a tus 6 puntos:

1. **FAQ #3 y la "garantía"**: se mantiene la redacción aprobada — es copy público aprobado del sitio por Lex. El criterio de aceptación #2 (cero garantías) aplica a lo que el bot afirme por su cuenta; el corpus aprobado se presenta tal cual, siempre enmarcado como proyecciones, no garantías.

2. **Múltiplos 1.01x / 1.28x / 5.49x**: son cifras públicas del sitio. El prompt ahora exige citarlos únicamente como "proyecciones del plan operativo, no garantías", jamás como retornos prometidos.

3. **Posición legal**: anotado como revisión pre-lanzamiento del lado de Lex. No bloquea el build.

4. **HubSpot**: la configuración SÍ existe y fue verificada en la API. El plan free permite un solo pipeline, por eso se reutilizó el id `default` (renombrado a "Concierge", etapas reemplazadas). Datos verificados, ya incluidos en el prompt:
   - Pipeline "Concierge", id `default`.
   - Stage IDs: Nuevo `4390053581`, Caliente `4390053582`, Tibio `4390053583`, Curioso `4390053584`, En evaluación `4390053585`, Cerrado `4390053587`, Descartado `4390053588`.
   - Propiedades (nombres internos exactos): deal `capital_interes`, `horizonte`, `referido_por`, `interes_principal`, `idioma`, `resumen_conversacion`; contacto `origen_concierge`.
   - Ignorar el deal de muestra "HubSpot - Brand Campaign (Sample Deal)" en etapa Nuevo.

5. **Brief vs prompt**: el prompt manda (documento posterior; voz desde el día 1 y búsqueda simple sin vector DB son decisiones finales de Lex).

6. **Cifra $5,600**: sacada del corpus fijo. Ahora es la variable de configuración `ROUND_COMMITTED` del Worker (env). La FAQ #5 (ES/EN) fue actualizada en consecuencia.

**Puedes construir**: scaffold + build completo, con `OPENAI_API_KEY`, `HUBSPOT_TOKEN` y `ROUND_COMMITTED` como secretos/variables (placeholders hasta el deploy). El envío por WhatsApp queda preparado sin bloquear el resto (API de Meta pendiente).

**Falta del lado de Lex**: acceso al repo de la Variante 1 aprobada y los secretos al momento del deploy.
