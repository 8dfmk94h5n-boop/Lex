# Variante 4 — Changelog

**Regla:** contenido bloqueado, paleta bloqueada; arte libre **con experimentación de estructura**. La V4 hereda de la V1 solo el contenido y la base del motor de escenas.

## Qué NO cambia (verificado automáticamente contra la V1, en EN, ES y ZH)
Son idénticos a la V1:
- el diccionario de traducciones;
- todos los textos traducidos;
- **todo el texto visible**: los 319 nodos de texto, comparados como multiconjunto, independientemente de la estructura;
- el pie;
- el texto legal;
- los 9 CTAs;
- la calculadora y las cifras ($120,000, $5,600, 4.67%, 1.01x–5.49x, 36 meses).

Tampoco cambian:
- la tipografía #2 (Archivo ensanchada, Archivo, Fragment Mono);
- el sello AI Monograma con "AI GOVERNED";
- el idioma: inglés por defecto, selector EN · ES · ZH;
- el acceso, sin puerta de entrada;
- los CTAs en línea SpaceX;
- el plan privado: mismos archivos cifrados, abre con PLAN2030.

Lo único añadido es navegación que **repite** textos existentes: el índice del expediente usa los kickers de sus secciones. También cambian los números de capítulo (02–10).

## Dirección: "Ruta"

### 1 · Estructura nueva (el experimento)
Antes había 10 escenas sueltas. Ahora la página tiene **tres movimientos y un cierre**:

1. **ORIGEN** (fusión). El hero y "Quiénes somos" son una sola escena de dos pasos: la promesa ("Construimos el comercio…") y quién la cumple ("Forjamos a los jóvenes operadores…"). La placa pasa del puerto al soldador.
2. **LA RUTA** (fusión y escena nueva). Cómo funciona, la AI, Trazabilidad y Programas son **un solo viaje horizontal de 12 estaciones**: el scroll vertical mueve el contenedor de lado, a lo largo de la ruta.
   - **Cómo funciona:** los 4 pasos se encienden uno tras otro al pasar.
   - **La AI, escena propia (nueva):** el bloque "Administración gobernada por AI" sale de "Cómo funciona" y se vuelve estación, con el Monograma grande. Sus cuatro frentes (Inventario, Logística, Liquidación, Decisiones de socios) se validan en secuencia.
   - **Trazabilidad:** la cabeza del capítulo y sus 3 paneles (análisis, gobernanza, votación) son estaciones en fila.
   - **Programas:** la cabeza con la lista y las 5 fichas en fila. La lista lleva a cada ficha, y la ficha activa se marca en la lista.
   - **La ruta física:** una línea de suelo cruza todo el viaje. El ámbar avanza bajo los paneles con el contenedor, y cada capítulo es un **poste plantado en el suelo**, con su rombo ámbar. Las paradas de la ruta (Aduana, Almacén, Distribución) son esos postes.
3. **EL EXPEDIENTE.** Evidencia, Plan operativo, Financiamiento y FAQ, en acero sólido, con un **índice fijo** que marca dónde estás. En escritorio ancho va como columna a la izquierda; en laptop, tablet y móvil, como franja bajo la barra.
4. **CIERRE.** Contacto, de vuelta al puerto.

### 2 · Arte
- **Paleta: el ámbar como señal.** La imagen va graduada en acero frío, casi monocroma. El ámbar aparece solo donde algo *pasa* o *está*: la línea de la ruta, los postes, el índice activo, las validaciones de la AI, las flechas de los CTAs y los pulsos. El hueso es la voz.
- **Las placas viajan con la ruta.** Al avanzar, el ambiente siguiente entra **desde la derecha** y el actual se desliza a la izquierda (al volver, al revés). La V1 hacía un fundido, la V2 un barrido vertical y la V3 un avance de película vertical.
- **La estación en la compuerta manda.** Lee pleno lo que está en la compuerta; lo que llega y lo que ya pasó espera un paso atrás, atenuado. Así nunca compiten dos textos.
- **Hero en diagonal.** El titular arriba a la izquierda (hasta 132 px). El CTA abajo a la izquierda y la declaración abajo a la derecha.
- **Barra abierta sobre el cine, sólida sobre el expediente.** El indicador activo es un rombo ámbar.
- **Telemetría abajo a la izquierda, en una línea:** "Ruta analizada con AI", la parada actual, la ruta en miniatura y las coordenadas con "Demostración".
- **"Desliza" al centro del hero:** aquí la indicación importa más que nunca, porque el scroll se vuelve horizontal.

### 3 · Legibilidad (se ajustó el efecto, nunca el texto)
- En móvil la placa se oscurece de forma pareja, y el soldador, el destello y la escena del contenedor se atenúan detrás del texto.
- Las estaciones que no están en la compuerta se atenúan, para que nunca haya dos bloques de texto compitiendo.

### 4 · Corrección técnica
En el cambio de placa, la capa entrante quedaba **por encima** del oscurecimiento (scrim) y de la sombra. Se ordenó el apilado (puerto 0, saliente 1, entrante 2, scrim y sombra encima). Así cada placa se oscurece como está diseñado.

### Sin regresiones
- **Contenido escenificado.** La V4 tiene menos escenas porque fusiona. Medido en secciones de la V1 que quedan escenificadas: **6 en todos los tamaños de escritorio y tablet**, igual o más que la V1, la V2 y la V3. A 390×844 también son 6. A 375×667 son **4**, frente a 1 (V1), 1 (V2) y 2 (V3).
- **Movimiento reducido o sin JavaScript:** la ruta se apila en vertical, estación por estación, cada una con su placa; el expediente y su índice siguen funcionando.
- **Qué se anima:** solo transform y opacity.

## Archivos
- `index.html`: la página, un solo archivo estático, sin frameworks ni build.
- `privado/`: el plan cifrado, idéntico al de la V1.
- `capturas/`: cada escena y cada estación en 3 idiomas, escritorio (1920×1080) y móvil (390×844), más tomas de motion y de los modos de respaldo.
- `QA-V4.md`: el checklist escena por escena.

La fuente está en `presston-site/fuente/variante-4/` (plantillas + `assemble.py`; el arte nuevo también está aparte en `v4-art.css`). Para reconstruir: `python3 assemble.py`.
