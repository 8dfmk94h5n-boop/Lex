# Variante 1 — Terminaciones: auditoría de botones y 3 líneas de diseño

> **Decisión aplicada:** ninguna de las tres líneas. Se aplicó la línea SpaceX de texto puro definida por Lex (ver `ENTREGA-V1.md` §5b y `capturas/botones-estados-aplicados.jpg` en la carpeta de la variante). Este documento queda como registro de la exploración.

En esta carpeta hay tres hojas de estilo, una por línea: `linea-1-…`, `linea-2-…` y `linea-3-…`. Para las capturas se aplicaron solo como vista previa; el sitio publicado no cambia hasta que elijas una. Las capturas están en `capturas/`:
- `N-…-escritorio-es-en.jpg`: Hero, Contacto y formulario, en ES y EN.
- `N-…-movil-es-en.jpg`: lo mismo a 390×844.
- `N-…-estados.jpg`: CTA en reposo, hover, presionado y foco por teclado, más el selector de idioma en reposo y en hover.
- `0-estados-comparados.jpg`: las tres líneas una debajo de otra.

## 1. Auditoría (estado actual de la Variante 1)

Medí 58 elementos interactivos en escritorio y 49 en móvil (gate, menú, idiomas, CTAs, calculadora, formulario, lightbox) con un script que mide cada caja en pantalla.

| Hallazgo | Estado |
|---|---|
| Selector de idioma ES/EN/中文: 40×40 px | **Corregido**: 44×44 |
| Campo de monto de la calculadora: 28 px de alto | **Corregido**: 44 |
| "Ver detalle" de la calculadora: 24 px | **Corregido**: 44 |
| Casilla del gate: 18 px | **Corregido**: la etiqueta extiende la zona clicable a ≥44 px alrededor de la casilla (verificado con clics a ±14–16 px) |
| Enlaces "Términos" / "Aviso" dentro de la frase del gate: 18 px | **Corregido**: zona clicable vertical ampliada sin mover el texto |
| **Bug:** el contenedor de la escena siguiente tapaba el CTA del Hero, así que un clic real con mouse o dedo no abría el formulario | **Corregido**: verificado con clics reales en cada escena, en escritorio y móvil |
| Sin estado de "presionado" en ningún botón | Lo resuelven las tres líneas |
| Hover = solo cambio de color; foco = contorno genérico | Lo resuelven las tres líneas, con un lenguaje propio cada una |
| Mezcla de formas: CTA de 2 px de radio, selector cuadrado, botón flotante con otro estilo | Cada línea unifica todos los botones bajo un mismo sistema |

Hoy, con cualquiera de las tres líneas, **todos los elementos miden ≥44 px** (escritorio y móvil). La casilla del gate se ve de 22 px, pero su zona clicable efectiva, a través de la etiqueta, es mayor.

## 2. Referencias estudiadas

Los sitios no fueron accesibles desde este entorno (la red los bloquea), así que trabajé con lo que está documentado de sus sistemas:
- **Apple:** píldora de radio completo. El primario va relleno y sin flecha; el secundario es un enlace con chevron "›". El hover apenas aclara y el press reduce la escala. El foco es un anillo de alto contraste separado del botón. El idioma se elige en una página de país/región.
- **Google (Material 3):** jerarquía relleno / tonal / contorno / texto. Capas de estado superpuestas (8% en hover, 12% en press), anillo de foco y transiciones cortas. El idioma va en un menú desplegable.
- **SpaceX:** rectángulo recto con filete fino, mayúsculas espaciadas, y en hover inversión total (fondo claro, texto oscuro). Sin selector de idioma.

## 3. Las tres líneas

### Línea 1 · Precisión industrial (registro SpaceX + placa de contenedor)
- **Forma:** rectángulo exacto, filete de 1 px, mono en mayúsculas espaciadas. La flecha vive en su **propia celda**, separada por un filete, como una placa estampada.
- **Estados:** en hover, una barra de ámbar **barre** el botón de izquierda a derecha y lo invierte (fondo ámbar, texto tinta). Al presionar baja 1 px. El foco es un contorno ámbar de 2 px con separación.
- **Idiomas:** un bloque con divisiones; el activo va en ámbar con una barra inferior.
- **Formulario:** campos rectos; con el foco, la línea base se engrosa en ámbar.
- **Carácter:** el más técnico y seco; dice "operación real".

### Línea 2 · Editorial sobria (registro Apple)
- **Forma:** píldora, texto en minúsculas de oración, el primario sin flecha y el secundario tonal.
- **Estados:** en hover el relleno se aclara. Al presionar se reduce a 0.97, una respuesta física breve. El foco es un doble anillo (tinta + ámbar) que nunca se confunde con el hover.
- **Idiomas:** control segmentado de píldora.
- **Formulario:** campos rellenos con radio suave y anillo ámbar al enfocar.
- **Carácter:** el más calmado y "premium de producto"; el que menos compite con el mensaje.

### Línea 3 · Cinematográfica (capas de estado de Material + luz de cine)
- **Forma:** ámbar pulido como metal, con radio de 4 px. Los secundarios son de vidrio.
- **Estados:** en hover cruza un **destello de luz** (solo `transform`) y aparece un halo cálido. Al presionar, una capa oscura del 16%. El foco es un contorno ámbar con halo.
- **Idiomas:** una **cápsula con un indicador iluminado que se desliza** al idioma activo, en CSS puro, sin JavaScript.
- **Formulario:** campos de vidrio con línea encendida al enfocar.
- **Carácter:** el más expresivo; acompaña el escenario de video.

## 4. Reglas que cumplen las tres
- Acento único #C9A96A sobre acero oscuro. Contraste AA en texto de botones: ámbar sobre tinta ≈8.9:1, tinta sobre ámbar ≈8.9:1.
- Objetivos ≥44 px, verificados con el script de medición en cada línea.
- Foco visible por teclado en todos los controles.
- Con movimiento reducido se desactivan todas las transiciones; barrido, destello e indicador deslizante quedan estáticos.
- Sin librerías de componentes: CSS propio.

## 5. Cómo se aplica la elegida
Se copia su hoja dentro del `<style>` de la Variante 1 sin el prefijo `html[data-btn="N"]`. No hace falta tocar el HTML.
