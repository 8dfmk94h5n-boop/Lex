# Variante 1 — Recorrido completo

| Archivo | Formato | Duración | Peso |
|---|---|---|---|
| `variante-1-recorrido-1920x1080.mp4` | H.264, 1920×1080, 30 fps | 57.6 s | ~14.7 MB |
| `variante-1-recorrido.gif` | GIF 640×360, 10 fps, a 2× de velocidad | 28.8 s | ~9 MB |

El recorrido parte del Hero, después de pasar el acceso con PSP, y llega hasta el pie de página. Está en español y tiene activo el Halo de lectura.

## Cómo se grabó (`grabar-recorrido.js`)
- **Fuente:** el `index.html` de esta carpeta, servido en local, en Chromium headless (Playwright).
- **Reloj virtual:** `performance.now`, `Date.now`, `requestAnimationFrame` y los temporizadores avanzan exactamente 1/30 s por cuadro. GSAP, ScrollTrigger, Lenis, las animaciones CSS y los videos de fondo quedan sincronizados, aunque capturar cada cuadro tome más tiempo que eso.
- **Scroll:** se detiene en cada paso de las escenas fijas (Hero, Quiénes somos, Cómo funciona ×5, Programas ×5, Trazabilidad ×3, Contacto). Cada transición usa una curva suave de entrada y salida. Las secciones de lectura (Evidencia, Plan, Financiamiento, FAQ) se recorren a ~420 px/s.
- **Videos:** el Chromium de pruebas no decodifica H.264. Para la grabación, los 5 videos de fondo se sirvieron como copias WebM de los mismos archivos; el sitio no cambió.
- **Ensamblado:** ffmpeg, con `libx264 -crf 18` para el MP4 y paleta optimizada para el GIF.
