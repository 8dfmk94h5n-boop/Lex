# Variante 2 — Changelog

**Regla:** contenido bloqueado, arte libre. La V2 parte de la V1 aprobada (commit `28d96f6`) y solo cambia la dirección de arte.

## Qué NO cambia (verificado automáticamente contra la V1)

En EN, ES y ZH son idénticos a la V1:
- el diccionario de traducciones;
- los 263 textos traducidos;
- los 9 CTAs;
- el texto visible completo;
- el texto legal;
- la calculadora y las cifras ($120,000, $5,600, 4.67%, 1.01x–5.49x, 36 meses).

Tampoco cambian:
- las 10 secciones, en el mismo orden;
- la tipografía (Archivo ensanchada, Archivo, Fragment Mono);
- el sello AI Monograma con "AI GOVERNED";
- el idioma (inglés por defecto, selector EN · ES · ZH);
- el acceso, sin puerta de entrada;
- el plan privado: son los mismos archivos cifrados de la V1 y abre con PLAN2030.

## Dirección de arte nueva: "Sala de control"

### Composición
- **El video deja de ser fondo a sangre y pasa a ser un monitor** enmarcado a la derecha (44 % del ancho; 36 % en laptops). Lleva marcas de corte ámbar en las esquinas. El texto vive a la izquierda sobre acero sólido, con más contraste que en la V1, donde el texto iba sobre el video.
- **Telemetría dentro del monitor**, armada con elementos que ya existían en la V1:
  - arriba a la izquierda, "Ruta analizada con AI" y la etapa actual (Puerto, Aduana…);
  - arriba a la derecha, las coordenadas con su insignia "Demostración";
  - abajo, la ruta del contenedor como manifiesto horizontal de 5 paradas.
- **Escenas densas a ancho completo.** En Evidencia, Plan, Financiamiento, FAQ y el pie, el monitor se retira y el contenido ocupa todo el ancho.
- **Barra de control.** La navegación pasa de píldora flotante a una barra completa con filete inferior, que no se colapsa al hacer scroll.
- **Tablet y móvil.** El monitor es una banda superior **adaptativa**: cada escena mide su texto y el monitor ocupa el espacio libre. Se abre ancho en Quiénes somos y Contacto, queda angosto en Cómo funciona y se cierra en el Hero, donde manda el texto.

### Atmósfera
- La imagen está graduada en acero: desaturada al 58 % y con contraste levemente más alto. El ámbar es el único color.
- Una luz de monitor muy tenue se derrama sobre el acero de la izquierda.
- Se quitó el halo de grano de la V1: con el texto sobre acero sólido ya no hace falta.

### Ritmo y motion
- **Cambio de ambiente:** el monitor cambia de señal con un **barrido vertical** de abajo hacia arriba, acompañado de una línea de escaneo ámbar que recorre el borde. En la V1 era un fundido.
- **Entrada del texto:** cada línea entra en horizontal, como una línea de bitácora. En la V1 subía.
- **Se mantiene de la V1:** el motor de escenas, los pasos con encaje, Lenis, el recorrido de la ruta y el "respiro" del puerto.
- Solo se anima transform y opacity; el barrido usa clip-path en una capa a la vez. Con movimiento reducido, o si falla el JavaScript, no hay monitor y la página se lee completa sobre acero.

### Ajustes para no retroceder respecto a la V1
- **Titulares que escalan con la altura** de la pantalla, el monitor más angosto en laptops y un bloque de AI más compacto. Así **la V2 escenifica las mismas escenas que la V1 o más en todos los tamaños probados**. Por ejemplo, a 1366×768 la V1 escenifica 4 escenas y la V2 las 6.
- **Corrección del motor:** en el pie, el monitor ahora se retira. El fondo cambia cuando cambia la escena *o* su atenuación.

## Archivos
- `index.html`: la página, un solo archivo estático, sin frameworks ni build.
- `privado/`: el plan cifrado, idéntico al de la V1.
- `capturas/`: todas las escenas en 3 idiomas, en escritorio y móvil.
- `QA-V2.md`: el checklist escena por escena.

La fuente está en `presston-site/fuente/variante-2/` (plantillas + `assemble.py`); para reconstruir: `python3 assemble.py`.
