# Variante 1 — Definida · Entrega

**Abrir:** sirve la carpeta `presston-site/` (por ejemplo `python3 -m http.server` dentro de ella) y abre `variante-1-definida/`. Es un `index.html` estático, sin build. Las rutas a `../assets/` y `../assets-extra/` dependen de que se despliegue la carpeta `presston-site/` completa.
**Acceso:** la página pública carga directo, sin código (la puerta PSP se retiró; ver §8). El plan operativo completo se abre en Evidencia con el código de prueba `PLAN2030`.
**Capturas:** están en `capturas/`: 11 de escritorio a 1440×900 y una hoja de móvil a 390×844.

---

## 1. Escena por escena (estado final)

En todas las escenas el fondo es fijo y nunca se desplaza. El puerto de noche es el escenario base y hace un zoom muy lento, tanto de forma continua (28 s, de ida y vuelta) como ligado al scroll (escala de 1 a 1.08 a lo largo de toda la página). Los demás entornos se funden sobre él y vuelven a salir.

| # | Escena | Modo | Video asignado | Qué cambia sobre el fondo |
|---|---|---|---|---|
| 1 | Hero | Escenario | `assets-extra/video-puerto-noche.mp4` (fondo base) | Manifiesto, bajada, frase "Contamos con experiencia real…", CTA y nota de participación privada. El riel empieza en **Puerto**. |
| 2 | Quiénes somos | Escenario | `assets-extra/video-soldador.mp4` | El soldador se funde **sobre** el puerto en 2.6 s, sin corte seco. Titular "Formamos jóvenes operadores…", LLC y "Los socios aportan capital y tiempo." |
| 3 | Cómo funciona | Escenario, 5 tiempos | `assets/origin-sequence.mp4` | Rejilla de datos al máximo, con su escala ligada al scroll ("respira"). Los 4 pasos se encienden uno por gesto y en el 5.º tiempo entra el bloque **Administración centrada en AI**. El riel pasa a **Aduana**. |
| 4 | Programas | Escenario, 5 tiempos | `assets/steps-bg.mp4` (cohetes) | Acero · Ronda 01 ("En preparación · Evaluación abierta", con CTA) y los otros 4 sectores ("En estudio técnico", "Sin captación"), uno por gesto. |
| 5 | Evidencia | **Flujo** (excepción) | Puerto, atenuado | Prueba piloto 2025, nota de documentos protegidos y 2 tarjetas (documentos, fotos). El riel pasa a **Almacén**. |
| 6 | Plan operativo (gancho) | **Flujo** | Puerto, atenuado | Tres bloques alineados al modelo de la calculadora (3 años / 3 ciudades). A La economía: por contenedor $23,269 / $36,232 / $12,963; 29 contenedores el año 1, 36 al año por ciudad en régimen, ciudad 2 desde el año 2, ciudad 3 desde el año 3. B La proyección: 1.01x año 1, 1.28x año 2, 1.77x en distribuciones acumuladas a 3 años, 5.49x total con el 15%, y la recuperación en 12 meses. C El control. Debajo, el CTA y una línea sobre el plan privado. La línea de alcance "Proyección del modelo a 3 años / 3 ciudades" aparece aquí y en la calculadora. |
| 7 | Financiamiento | **Flujo** (excepción) | Puerto, atenuado | Panel (Demostración), reglas de distribución, capital y plazo, calculadora (Demostración) y custodia con los candidatos en evaluación. |
| 8 | Trazabilidad y gobernanza | Escenario, 3 tiempos (flujo en móvil) | `assets/trace-bg.mp4` | Análisis continuo, reglas de gobernanza y propuestas en votación, una por gesto. Lleva badge Demostración. El riel pasa a **Distribución**. |
| 9 | FAQ | **Flujo** (excepción) | Puerto, atenuado | Las 9 preguntas del punto 7. |
| 10 | Contacto | Escenario | Puerto | "Solicitar evaluación privada" a gran tamaño, con contacto comercial y WhatsApp "por completar". El riel llega a **Liquidación**. A continuación va el pie. |

En todos los modos y tamaños probados el texto queda completo y legible: 1440×900, 1280×720, 390×844, español, inglés y chino, movimiento reducido y sin JavaScript.

## 2. Checklist QA (punto 8)

| Punto | Estado | Motivo / evidencia |
|---|---|---|
| JS total < 180 KB gzip | **Cumple** | 100.6 KB: GSAP 27.4 + ScrollTrigger 17.3 + Lenis 3.7 + 52.3 inline. |
| Imágenes WebP con lazy-load | **Cumple** | Los pósters y la evidencia se sirven en WebP si el navegador lo soporta. Creé `poster-puerto-noche.webp` y `poster-soldador.webp` a partir de sus JPG. La evidencia carga en lazy. |
| Ningún video se carga de golpe | **Cumple** | No se pide ningún video antes de abrir el gate. Al abrirlo solo se pide el del puerto. Los demás se piden cuando su escena está a menos de 0.6 pantallas (verificado). |
| Video que falla → póster | **Cumple** | Todos tienen póster. Si un video da error, el póster sigue siendo el fondo de la escena. |
| Móvil primero: titular y CTA claros | **Cumple** | A 390×844 el titular y el CTA se ven en la primera pantalla. Si una escena no cabe en la pantalla, pasa automáticamente a flujo normal (en móvil le ocurre a Trazabilidad). |
| Targets ≥ 44 px | **Cumple** | Botones, navegación, idiomas, controles de la calculadora y lightbox. |
| Contraste AA | **Cumple** | #E8EAED, #9AA3AD y #C9A96A sobre #0B0E11 superan 4.5:1. El gris más tenue (#7D8690) es ≈5:1. |
| Focos visibles | **Cumple** | Contorno ámbar de 2 px con `:focus-visible`. |
| Landmarks semánticos y alt | **Cumple** | `header`, `nav`, `main`, `section` con `aria-labelledby`, `footer` y enlace "Saltar al contenido". Las imágenes decorativas llevan `alt=""` y el fondo `aria-hidden`. |
| Sin JS: contenido completo en flujo | **Cumple** | Verificado con JS desactivado: los 85 bloques de texto son visibles, en español. |
| `prefers-reduced-motion` | **Cumple** | Sin pin, sin scrub y sin Lenis. Las escenas se apilan y el fondo cambia de póster sin animación. |
| Fluidez ≥ ~55 fps en teléfono medio | **No verificable aquí** | En emulación (CPU ×4, 390×844, sin GPU) da ≈53 fps, lo mismo que el sitio original en esas condiciones (52.3). El perfil muestra que el JS de la página pesa poco. Hay que medirlo en un teléfono real. |
| Reproducción de video | **No verificable aquí** | El Chromium de este entorno no decodifica H.264, así que las pruebas mostraron los pósters. Los 5 videos son H.264, que reproducen Chrome, Safari y Edge. |
| Cada cifra contrastada con el prompt | **Cumple, con conflictos** | El panel muestra 120,000 / 5,600 (4.67%) / 114,400 / 25,000 = 20.83%, verificado por prueba. Hay cifras heredadas que no cuadran (ver §4). |
| Gate, calculadora, evidencia y sección del plan | **Cumple** | Los 28 chequeos automáticos pasan: gate (código erróneo y correcto), modal, plan fuera del sitio (sin visor, páginas ni PDF en el código fuente), cifras del gancho, enlace "Plan operativo", lightbox (7 documentos), calculadora, idiomas y Escape. |
| Una rueda = un paso | **Cumple** | El scroll aterriza exacto en cada tiempo, hacia abajo y hacia arriba. En las escenas en flujo el scroll es libre. |

## 3. Changelog

**Qué cambió**
- Nueva arquitectura de escenario fijo con 9 escenas en el orden cerrado. Usa GSAP, ScrollTrigger (scrub 0.6) y Lenis (lerp 0.09) por CDN, con una `masterTimeline` y etiquetas `hero … contact`. Las entradas duran 600 ms con `power3.out`, las salidas 400 ms, el escalonado es de 80 ms y el desplazamiento máximo de 24 px. Solo se animan `transform` y `opacity`.
- El riel del viaje del contenedor (Puerto → Aduana → Almacén → Distribución → Liquidación) va a la izquierda en escritorio y como barra superior en móvil, con la etiqueta "Ruta analizada con AI".
- Tokens del punto 4: acero casi negro, ámbar #C9A96A como único acento, Fraunces, Inter e IBM Plex Mono (más Noto Serif/Sans SC para chino).
- Copy del punto 7 en español, inglés y chino. Las traducciones al inglés y al chino del copy nuevo son mías, hechas fielmente desde el español.
- AI aparece exactamente en 3 lugares: el bloque en Cómo funciona, el riel y el panel "Análisis continuo" de Trazabilidad.
- Reglas del punto 6: CTA único "Solicitar evaluación privada". Escrow solo como "Candidato en evaluación", también en el pie de página y en la FAQ legal, que antes lo daban por contratado. Badge "Demostración" en financiamiento, calculadora, trazabilidad/gobernanza y telemetría. Campo "Referencia: ¿quién te presentó?" en lugar de "Mentor". Formulario de prototipo deshabilitado con nota visible y sin "Mensaje recibido" falso. Eliminé "Texto sujeto a revisión legal".
- Gate, términos, calculadora, evidencia y analítica: el código se copió íntegro del original. Solo cambié el bloqueo de scroll (para que funcione con Lenis), los colores del globo y el idioma por defecto (ES).
- "Productos frescos" pasa a llamarse "Agro". Gobernanza se movió de Financiamiento a la escena 7, según la estructura del punto 5.

**Simplificaciones por rendimiento**
- `origin-sequence.mp4` se reproduce en bucle y no ligado al scroll. Su código decía "all-intra", pero tiene solo 4 keyframes en 294 frames, así que ligarlo al scroll se trabaría, sobre todo hacia atrás.
- Quité la mezcla `mix-blend-mode` del tono ámbar y el desenfoque detrás del botón de WhatsApp.
- Quité el precargador original, que bajaba un video completo antes de mostrar el sitio.
- Cada video se pausa mientras otra capa lo tapa por completo.

**Excepciones híbridas (punto 1)**
- **Evidencia, Financiamiento y FAQ** van en flujo normal: tienen demasiados documentos, cifras o preguntas para transformarse con claridad dentro de una pantalla. Comparten el mismo fondo y la misma identidad.
- **Escape automático:** si en un dispositivo concreto el contenido de una escena de escenario no cabe en la pantalla, esa escena pasa a flujo en lugar de recortarse. En las pruebas solo le ocurrió a Trazabilidad en móvil (390×844).

**Reasignaciones de video (punto 2.3), reportadas**
- `steps-bg.mp4` (cohetes) estaba en **Cómo funciona** en el sitio original. Lo moví a **Programas** porque el prompt lo indica expresamente.
- El soldador generado y `origin-sequence.mp4` (que también muestra un soldador) **compiten** en la transición Hero → Quiénes somos. Usé el soldador generado ahí y reservé `origin-sequence.mp4` para Cómo funciona, como permite el punto 2.3.

**Assets**
- No falta ninguno. Los 5 videos y los 5 pósters están presentes.

## 4. Conflictos que necesitan tu decisión (no los adiviné)

1. **Meta USD 120,000: resuelto.** Panel, calculadora (base y máximo, con los montos del socio × 120/125 para conservar los términos por dólar) y narrativa de recuperación en 12 meses intacta.
2. **Plan operativo: fuera del sitio público (resuelto).** Eliminé el visor, sus 13 páginas, la impresión/descarga, la tarjeta de vista previa y los botones "Ver el plan". El texto del plan ya no está ni en el código fuente de la página. Los PDF y las páginas siguen en el repositorio (`presston-site/assets/`, `presston-site/index.html` original) y el paquete de Cloudflare no los incluye. Con esto desaparece también el problema del método de precios.
3. **Calculadora y gancho: resuelto.** Ambos muestran el mismo modelo (verificado: la calculadora con $120,000 da 1.01x / 1.28x / 5.49x y $212,573 acumulados = 1.77x). No queda visible ninguna cifra del plan base (24 contenedores/año, 1.37x, 1.05x, ~15 días) en ES, EN ni ZH.
3b. **Plazo y capital: resuelto.** El plazo es "36 meses, con revisiones a los 12 y a los 24" en el bloque de control y en Financiamiento. El capital es un bloque de tres partes (recuperación en 12 meses, el capital sigue trabajando, devolución al liquidar). La respuesta de FAQ sobre resultados se actualizó para no contradecirlo. Está en ES, EN y ZH, y verifiqué que no quede la redacción vieja.
4. **Logos de terceros en el video del puerto.** `video-puerto-noche.mp4` y su póster muestran contenedores con "MAERSK" y "MSC" legibles. El punto 4 dice "sin logos de aliados". No son aliados, pero son marcas de terceros visibles en el Hero.
5. **Personas en video.** El soldador aparece con careta, sin rostro, y lo asigna el propio prompt. Lo menciono por la regla "sin fotos de personas".
6. **Gate sin JavaScript.** Como el fallback sin JS es obligatorio, sin JS el gate se oculta y el contenido se lee. El gate siempre fue solo de cliente (el contenido ya estaba en el HTML), así que no cambia la seguridad real.

## 5. Copy derivado (no estaba literal en el punto 7)

- Paso 3: "Con confidencialidad antes de la llamada." Sale de "Llamada (confidencialidad antes)".
- Respuestas de FAQ armadas solo con hechos del punto 7: resultados, salida ordenada, estructura legal, mínimo $25,000, qué pasa tras la evaluación y Referencia. Las de "ser socio", "seguimiento" y "garantía" son las del sitio original.
- Títulos conservados del sitio original: "Una forma directa de ser parte del comercio que mueve al mundo.", "Los sectores donde operamos.", "La ronda, a la vista.", "Tu operación tiene ubicación." y "Cómo funciona, en claro."

## 5a. Tipografía aplicada

Candidata #2: Archivo ensanchada (116%, 600) en titulares, Archivo en texto y Fragment Mono en cifras. Los textos de display chicos bajan a 500. El chino sigue en Noto Serif/Sans SC.

## 5b. Terminaciones (botones)

**Aplicado: línea SpaceX de texto puro.** Los CTAs no tienen borde, caja ni relleno. Van en mayúsculas en Archivo semibold de 14 px, con espaciado .26em (.20em en teléfonos de 420 px o menos, para que la flecha no quede sola en otra línea), en hueso con la flecha → en ámbar y una sombra sutil. En hover el texto pasa a ámbar y la flecha avanza 6 px; al presionar baja 1 px; el foco es un anillo ámbar. El secundario va en #9AA3AD y en hover sube a hueso. El selector de idioma es "ES | EN | ZH", con separadores finos y el activo en ámbar. Aplica a CTAs, formulario, calculadora, gate, visor de evidencia y botón de chat. El CTA grande de Contacto conserva su tamaño de titular, con el mismo comportamiento.

`botones/BOTONES.md` contiene la auditoría y las 3 líneas propuestas, con capturas. Ya están aplicadas en la base las correcciones de objetivos táctiles (≥44 px) y la del bug de puntero: el CTA del Hero no respondía a un clic real porque la escena siguiente lo tapaba.

## 6. Sitio de prueba en Cloudflare

`presston-site/deploy/variante-1/` contiene `build.sh`, que empaqueta solo esta variante con los assets que usa (30 MB, 41 archivos), y `wrangler.jsonc`, que la publica como Worker aparte llamado `presston-variante-1`, sin tocar el sitio actual. Para publicar: `./build.sh && npx wrangler deploy` con `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID` definidos.

## 7. Fuera de alcance observado

- `FORMSPREE_ID`, `WHATSAPP_NUMBER` y la clave de PostHog siguen como marcadores del original. El botón flotante de WhatsApp apunta a un número vacío.
- El único código del plan privado es el de prueba, "PLAN2030".
- No hay favicon.
- El texto legal (Términos y privacidad, que ahora se abre desde el bloque del plan privado) tiene marcadores (`[correo de contacto]`, `[fecha]`).
- Las referencias del punto 2 (Terminal Industries y Apple) se estudiaron como técnica, no como fuente. Este entorno no tiene acceso a esos sitios, así que apliqué lo que el prompt destila de cada una.

## 8. Prueba del plan privado

- **Sin puerta de acceso.** Se retiró la puerta PSP: el código, el globo y su CSS ya no están en la página. Del módulo original solo quedan el panel de Términos y privacidad y la detección de idioma. La analítica no se inicia sola, porque la casilla de la puerta era el momento de consentimiento.
- **Bloque en Evidencia.** "Plan operativo completo — documento privado", con campo de código, mensaje de error y enlace a los términos de confidencialidad, en ES, EN y ZH.
- **El plan fuera del paquete público.** El contenido vive en `presston-site/plan-privado/`, que nunca se publica, y se cifra en `privado/`. La página lo pide solo después de validar el código. Los detalles están en `plan-privado/LEEME.md`.
- **Visor.** El documento se abre dentro de la página, con la nota "Documento privado — bajo confidencialidad", y sigue el idioma del sitio. Se cierra con "Cerrar" o con Escape, y el foco queda atrapado dentro mientras está abierto.
- **Rediseño.** El contenido (textos, cifras y tablas) es el de los PDF de `assets/`, sin cambios. La presentación es la de la Variante 1: fondo acero oscuro, Archivo ensanchada en titulares, Archivo en texto, Fragment Mono en cifras, acento ámbar y filetes de 1 px sin cajas.
- **Verificación.** 15 chequeos en cada idioma, en escritorio y en móvil, todos aprobados:
  - antes del código, el plan no está en el código fuente, en el DOM ni en la red;
  - un código erróneo no descarga el documento;
  - el código correcto sí lo descarga;
  - no hay textos cortados y las tablas caben sin desplazamiento lateral;
  - Escape cierra el visor y devuelve el scroll de la página.

  Capturas en `capturas/plan-privado/`.
