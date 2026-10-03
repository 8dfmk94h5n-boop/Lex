# Variante 5 — Changelog

**Regla:** contenido bloqueado, paleta bloqueada; arte guiado por tres referencias reales (Terminal Industries, SpaceX, Illoca / Unseen Studio), resuelto como **una sola visión**. Es la última variante.

## Qué NO cambia (verificado automáticamente contra la V1, en EN, ES y ZH)
Son idénticos a la V1:
- el diccionario de traducciones;
- todos los textos traducidos;
- **todos los nodos de texto visibles**, comparados como multiconjunto;
- el pie;
- el texto legal;
- los 9 CTAs (ninguno nuevo);
- la calculadora y las cifras ($120,000, $5,600, 4.67%, 1.01x–5.49x, 36 meses).

Tampoco cambian:
- la tipografía #2;
- el sello AI Monograma con "AI GOVERNED";
- el idioma: inglés por defecto, selector EN · ES · ZH;
- el acceso, sin puerta de entrada;
- los CTAs en línea SpaceX;
- el plan privado: mismos archivos cifrados, abre con PLAN2030.

Cambian solo los números de capítulo (02–10), por el orden nuevo.

## Dirección: "Turno de noche"
La página es una sucesión de capítulos de cine nocturno: una cámara recorre la operación y, al final, se abre la hoja técnica.

### Lo que viene de cada referencia (y cómo se funde)
- **SpaceX → la disciplina de la banda.**
  - Cada capítulo es una banda de video a pantalla completa. En su **primer tiempo** solo hay kicker, titular y, si el capítulo ya lo tenía, su CTA, abajo a la izquierda sobre un piso de sombra. Nada más.
  - El resto del texto del capítulo **no se quita: llega en los tiempos siguientes**, mientras la cámara avanza.
  - La barra de navegación es transparente y en mayúsculas, y **se recoge al bajar y vuelve al subir**.
- **Illoca / Unseen → la cámara.**
  - Cada capítulo declara un movimiento de cámara real, que el scroll conduce:
    - Puerto: *dolly* hacia adentro con paneo;
    - Soldador: empuje hacia las chispas;
    - Cómo funciona: grúa que sube;
    - Programas: inclinación que sigue al cohete;
    - Trazabilidad: paneo lateral;
    - Contacto: retroceso que abre el plano.
  - El movimiento se asienta con **inercia**: la cámara sigue un instante después de que la mano se detiene, como un carro de cámara, no como una animación.
  - **El corte es un empuje a través de la imagen.** El plano saliente sigue acercándose al lente mientras se disuelve, y el entrante llega un poco cerca y se asienta.
- **Terminal Industries → el alma industrial.**
  - Los capítulos numerados avanzan con el scroll.
  - Un **riel de capítulo** en el borde derecho muestra las paradas de la ruta; la actual se alarga en ámbar y muestra su nombre.
  - El **expediente es una hoja técnica**: Evidencia, Plan operativo, Financiamiento y FAQ sobre acero sólido, cada una con su **numeral de hoja grande** (06, 07, 08, 09).

### Paleta
Noche de acero. El metraje va con menos color y negros más profundos, así que el ámbar vive en las luces prácticas del propio video (grúas, chispas, el escape del cohete) y en las señales (riel, flechas, numerales activos). El hueso es la voz.

### Orden
Hero, Quiénes somos, Cómo funciona, Programas, **Trazabilidad** (antes del expediente, para que el cine sea una sola cadena de cinco bandas), Evidencia, Plan operativo, Financiamiento, FAQ y Contacto.

Las paradas de la ruta: Puerto = Hero, Aduana = Cómo funciona, Almacén = Programas, Distribución = Trazabilidad, Liquidación = Contacto.

### Tiempos por banda
| Banda | Tiempo 1 (SpaceX) | Tiempos siguientes (la cámara avanza) |
|---|---|---|
| Hero | sello, kicker, titular, CTA | la bajada y la declaración |
| Quiénes somos | kicker, titular | semilla de vocación, párrafo, cierre |
| Cómo funciona | kicker, titular | los 4 pasos → la Administración gobernada por AI |
| Programas | kicker, titular | la lista y cada ficha, una por tiempo (5) |
| Trazabilidad | kicker, "Demostración", titular | el texto y los paneles de análisis, gobernanza y votación |
| Contacto | el CTA | — |

### Legibilidad (se ajustó el efecto, nunca el texto)
- Piso de sombra inferior en todas las bandas.
- En móvil la placa se oscurece de forma pareja, y el soldador, el destello y la escena del contenedor se atenúan.
- En teléfonos bajos, la tipografía se compacta.
- Los thumbnails de Evidencia llevan un degradado de pie de foto para que "Ver documentos" se lea sobre la factura blanca.
- En móvil, el texto y los paneles de Trazabilidad se turnan en el mismo lugar, en vez de apilarse.

### Sin regresiones (la mejor marca de las cinco variantes)
- **Las 6 secciones escenificadas en los 27 casos probados** (3 idiomas × 9 tamaños, de 375×667 a 1920×1080).
- A 375×667, la V1 y la V2 escenificaban 1, la V3 2 y la V4 4; **la V5 escenifica 6**.
- **Movimiento reducido o sin JavaScript:** no hay cámara; todo se lee en flujo sobre acero.
- **Qué se anima:** solo transform y opacity (cámara, corte, entradas y riel).
- **Capas:** las placas quedan siempre por debajo del oscurecimiento y de la sombra (apilado fijo: puerto 0, saliente 1, entrante 2).

## Archivos
- `index.html`: la página, un solo archivo estático, sin frameworks ni build.
- `privado/`: el plan cifrado, idéntico al de la V1.
- `capturas/`: cada banda y cada tiempo en 3 idiomas, escritorio (1920×1080) y móvil (390×844), más tomas de cámara y corte y los modos de respaldo.
- `QA-V5.md`: el checklist escena por escena.

La fuente está en `presston-site/fuente/variante-5/` (plantillas + `assemble.py`; el arte también está aparte en `v5-art.css`). Para reconstruir: `python3 assemble.py`.
