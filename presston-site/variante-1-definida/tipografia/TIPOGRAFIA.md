# Variante 1 — Auditoría tipográfica y 3 candidatas

Capturas en esta carpeta: `0-actual-…` (referencia), `1-…`, `2-…`, `3-…`. Hay Hero e interior (sección Plan operativo) a 1440×900, y `movil-1-2-3.jpg` con las tres a 390×844. Todo se muestra con el mismo layout, copy y colores; solo cambia la tipografía.

## Auditoría de la actual

| Rol | Fuente | Diagnóstico |
|---|---|---|
| Titulares | **Fraunces** (variable, opsz) | Tiene carácter, pero su registro es "boutique/editorial blando": terminales redondeados, contraste suave y curvas amables. Lee cálido y algo artesanal, no institucional. Además fue una elección muy repetida en 2023–24, lo que la acerca a lo genérico. |
| Cuerpo | **Inter** | Correcta y legible, pero es la sans más genérica de la web actual. No aporta identidad. |
| Cifras | **IBM Plex Mono** | Tabular e industrial; funciona. En tamaños grandes ("1.37x") se ve algo a terminal de código. |

**Conclusión:** el problema principal es la pareja Fraunces + Inter: carácter blando arriba y cero carácter abajo. Las tres candidatas cambian los tres roles.

## Candidatas

### 1 · Newsreader + Public Sans + IBM Plex Mono — "Editorial financiero"
- **Titulares:** Newsreader (tamaños ópticos de display, peso 440), diseñada para prensa. Sobria, de alto contraste contenido; el registro del FT o de un informe anual. Es la de más autoridad y menos ruido.
- **Cuerpo:** Public Sans, la sans del gobierno de EE. UU. (USWDS): institucional y neutra sin ser Inter.
- **Cifras:** IBM Plex Mono, tabular.
- **Riesgo:** es la más conservadora de las tres; su fuerza está en el contenido, no en la letra.

### 2 · Archivo semi-expandida + Fragment Mono — "Grotesca industrial"
- **Titulares:** Archivo con ancho 116% y peso 600, tracking cerrado. Una grotesca pulida con anchura de señalética portuaria y de contenedor; encaja con el "escenario industrial".
- **Cuerpo:** Archivo a ancho normal (una sola familia: coherencia total).
- **Cifras:** Fragment Mono, una mono de dibujo grotesco, más elegante y menos "código" que Plex en tamaños grandes.
- **Riesgo:** al ser sans en titulares pierde algo de la "autoridad editorial" de una serif. Si se elige, conviene bajar a peso 500 los textos de display pequeños (por ejemplo la frase de recuperación).

### 3 · Gloock + Hanken Grotesk + DM Mono — "Serif de carácter"
- **Titulares:** Gloock, una serif de alto contraste y remates afilados, con presencia fuerte y nada de plantilla. Es la más memorable.
- **Cuerpo:** Hanken Grotesk, una grotesca limpia y algo más cálida que Inter.
- **Cifras:** DM Mono, tabular, de trazo fino y elegante.
- **Riesgo:** Gloock tiene un solo peso (400). Es ideal para titulares grandes, pero en títulos chicos (pasos, FAQ) se ve densa; ahí convendría usar la grotesca.

## Notas comunes
- Todas vienen de Google Fonts (el mismo proveedor que hoy), con la misma carga diferida.
- El chino sigue en Noto Serif SC / Noto Sans SC en las tres.
- Peso, tracking y ancho del titular ya están en variables (`--w-display`, `--ls-display`, `--stretch-display`), así que aplicar la elegida es un cambio de pocas líneas.
- Mi recomendación, si sirve: **1 (Newsreader)** por autoridad y legibilidad para un público inversor. **3 (Gloock)** si se busca más presencia de marca.
