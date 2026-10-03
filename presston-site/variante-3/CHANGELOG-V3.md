# Variante 3 — Changelog

**Regla:** contenido intocable, paleta bloqueada; arte, estructura, orden, ritmo y motion libres. La V3 no parte del arte de la V1 ni de la V2. Hereda de la V1 solo el contenido y el motor de escenas.

## Qué NO cambia (verificado automáticamente contra la V1, en EN, ES y ZH)
Son idénticos a la V1:
- el diccionario de traducciones;
- todos los textos traducidos, comparados como conjunto;
- el texto de cada sección, comparado sección por sección;
- el pie;
- el texto legal;
- los 9 CTAs;
- la calculadora y las cifras ($120,000, $5,600, 4.67%, 1.01x–5.49x, 36 meses).

Tampoco cambian:
- la tipografía #2 (Archivo ensanchada, Archivo, Fragment Mono);
- el sello AI Monograma con "AI GOVERNED";
- el idioma: inglés por defecto, selector EN · ES · ZH en la barra y en el visor del plan;
- el acceso, sin puerta de entrada;
- los CTAs en línea SpaceX;
- el plan privado: son los mismos archivos cifrados de la V1 y abre con PLAN2030.

Solo cambian los **números de capítulo** (02–10), porque siguen el nuevo orden.

## Dirección de arte: "Expediente"
Dos materiales, una sola paleta.

### 1 · Acero: el cine
- **El marco es la interfaz.** La película va en *letterbox*, entre dos barras de acero:
  - **barra superior:** la navegación;
  - **barra inferior:** a la izquierda, la claqueta del capítulo (por ejemplo, "03 / 10 · Cómo funciona"); al centro, la ruta del contenedor como manifiesto horizontal (Puerto → Aduana → Almacén → Distribución → Liquidación); a la derecha, "Ruta analizada con AI" y las coordenadas con su insignia "Demostración".
- **Telón de entrada.** Al cargar, las barras están cerradas y se abren sobre el puerto, como un telón.
- **Avance de película.** El cambio de ambiente ya no es un fundido (V1) ni un barrido de monitor (V2). La siguiente placa sube a la ventanilla, o baja si se hace scroll hacia arriba, y la anterior se desplaza un poco en el mismo sentido.
- **Titulares que emergen de una máscara.** El resto del texto entra después, escalonado.
- **Grading.** El acero va desaturado y con más contraste, y el ámbar se queda en las luces altas, con más peso que en la V1. Lleva grano de película tenue.
- **Tipografía grande.** El hero llega a 124 px y el CTA de contacto a 116 px. Los titulares escalan también con la altura de la pantalla, para que cada escena quepa.
- **Un solo borde izquierdo.** El logo, la claqueta y cada capítulo se alinean en el mismo margen.

### 2 · Hueso: el expediente
- **Evidencia, Plan operativo, Financiamiento y FAQ se imprimen sobre hueso**, con tinta de acero oscuro. Cada sección abre con un folio: un filete de tinta a todo lo ancho, el número de capítulo y el titular grande.
- **El papel sube sobre el cine.** Cuando entra el expediente, la película retrocede: se encoge un 6 % y se oscurece bajo el papel. El borde del papel lleva un filete ámbar y su sombra sobre el acero.
- **El marco toma el tono del papel.** Al llegar el papel, la barra superior cambia a hueso con tinta, la barra inferior se retira y el botón de WhatsApp pasa a tinta.
- **Al final, el papel se levanta** y el puerto vuelve a estar ahí para el cierre (Contacto).
- **Ámbar sobre hueso.** Es el mismo ámbar, graduado a latón (#7E5F26) solo donde funciona como texto sobre el papel. Así alcanza contraste AA (4.9:1). Rellenos, puntos y filetes conservan el ámbar original.

### 3 · Estructura y orden nuevos
Antes: hero, about, how, programs, evidence, plan, funding, trace, faq, contact.

Ahora la página es un relato en tres actos:

1. **Cine.** Hero, Quiénes somos, Cómo funciona, **Trazabilidad y gobierno** (sube del lugar 8 al 4: la confianza va justo después del cómo) y Programas. Es una sola cadena de 15 pasos con encaje, sin cortes.
2. **Expediente.** Evidencia, Plan operativo, Financiamiento y FAQ, en papel continuo.
3. **Cierre.** Contacto, de vuelta al puerto.

Las paradas de la ruta se reasignan al nuevo orden: Puerto = Hero, Aduana = Cómo funciona, Almacén = Trazabilidad, Distribución = Programas, Liquidación = Contacto.

### Legibilidad (se ajustó el efecto, nunca el texto)
- En móvil, el texto cubre toda la placa, así que el grading oscurece de forma pareja. El soldador y el destello de "Cómo funciona" se atenúan detrás del texto.
- Los thumbnails de Evidencia llevan un degradado de pie de foto, para que "Ver documentos" se lea incluso sobre la factura blanca. En la V1 era casi ilegible.

### Sin regresiones
- **Escenas escenificadas:** iguales o más que la V1 y la V2 en los 9 tamaños probados. Por ejemplo, a 1024×768 son V1 3, V2 4, V3 5; a 390×844, V1 5, V2 5, V3 6.
- **Movimiento reducido o sin JavaScript:** no hay marco. Los capítulos de acero conservan su placa detrás y el expediente sigue en papel; todo se lee en flujo normal.
- **Qué se anima:** solo transform y opacity. La máscara del titular usa clip-path, en un elemento a la vez.

## Archivos
- `index.html`: la página, un solo archivo estático, sin frameworks ni build.
- `privado/`: el plan cifrado, idéntico al de la V1.
- `capturas/`: cada escena en 3 idiomas, en escritorio (1920×1080) y móvil (390×844), más tomas de motion.
- `QA-V3.md`: el checklist escena por escena.

La fuente está en `presston-site/fuente/variante-3/` (plantillas + `assemble.py`; el arte nuevo también está aparte en `v3-art.css`). Para reconstruir: `python3 assemble.py`.
