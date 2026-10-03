# Variante 3 — Checklist QA escena por escena

Cada punto se verificó con pruebas automáticas en Chromium y con revisión visual de las capturas en EN, ES y ZH, a 1920×1080 (escritorio) y 390×844 (móvil). Las escenas escenificadas se compararon además a 375×667, 1024×768, 1180×800, 1280×720, 1366×768, 1440×900 y 1536×864.

**Leyenda:** ✓ cumple · ▲ mejor que la V1 y la V2.

## Verificaciones globales

| Punto | Resultado |
|---|---|
| Contenido idéntico a la V1 | ✓ en EN, ES y ZH: diccionario, todos los textos traducidos, texto de cada sección (sección por sección), pie, legal, 9 CTAs, calculadora y cifras. Solo cambian los números de capítulo, por el orden nuevo |
| Cifras $120,000 · $5,600 · 4.67% · 1.01x–5.49x · 36 meses | ✓ presentes y sin cambios |
| Las 10 secciones | ✓ todas presentes; orden nuevo: hero, about, how, trace, programs, evidence, plan, funding, faq, contact |
| Inglés por defecto · selector EN · ES · ZH (barra y visor del plan) | ✓ |
| Sin puerta de entrada | ✓ |
| Sello AI Monograma + "AI GOVERNED" / "GOBERNADO POR AI" / "AI 治理" | ✓ |
| Tipografía #2 (Archivo ensanchada, Archivo, Fragment Mono) | ✓ mismas variables |
| CTAs en línea SpaceX | ✓ mismos estilos; sobre el papel pierden la sombra y usan tinta |
| Paleta: acero oscuro, ámbar, hueso | ✓ sin colores nuevos. Sobre hueso, el ámbar se gradúa a latón solo donde es texto, para alcanzar AA (4.9:1) |
| Plan privado con PLAN2030 | ✓ 15/15 chequeos × 3 idiomas × 2 tamaños: el plan no está en el código ni en la red antes del código, un código erróneo es rechazado, abre con el correcto, sin textos cortados, las tablas caben y Escape cierra |
| Errores de consola o peticiones fallidas | ✓ ninguno en las 6 combinaciones |
| Textos cortados o fuera de pantalla | ✓ ninguno. Única marca: el falso positivo de "Solicitar evaluación privada" con movimiento reducido, heredado de la V1; en la captura se ve completo |
| Cada paso escenificado cabe entre las dos barras del marco | ✓ 3 idiomas × 5 tamaños (390×844, 375×667, 1024×768, 1280×720, 1920×1080) |
| Escenas escenificadas frente a la V1 y la V2 | ▲ iguales o más en los 9 tamaños (ver la tabla siguiente) |
| Movimiento reducido | ✓ sin marco, sin ruta y sin animaciones; los capítulos de acero conservan su placa y el expediente sigue en papel |
| Sin JavaScript | ✓ el póster del puerto cubre la pantalla y no aparece ningún reproductor vacío; los 65 bloques de texto se ven, salvo la nota ampliable de la calculadora, oculta por diseño (igual que en la V1) |
| Solo se anima transform y opacity | ✓ telón, avance de película, retroceso bajo el papel y entradas. La máscara del titular usa clip-path, en un elemento a la vez |
| Sin 3D en CSS, sin experimentos de luz o foco, sin stock | ✓ solo los videos y pósters existentes |

### Escenas escenificadas (en inglés)

| Tamaño | V1 | V2 | V3 |
|---|---|---|---|
| 390×844 | 5 | 5 | **6** |
| 375×667 | 1 | 1 | **2** |
| 1024×768 | 3 | 4 | **5** |
| 1180×800 | 5 | 6 | **6** |
| 1280×720 | 5 | 5 | **6** |
| 1366×768 | 5 | 6 | **6** |
| 1440×900 | 6 | 6 | **6** |
| 1536×864 | 6 | 6 | **6** |
| 1920×1080 | 6 | 6 | **6** |

En español a 390×844, Trazabilidad usa el flujo normal (su texto es más largo) y se escenifican 5 escenas. Es el mecanismo de la V1: si un paso no cabe, se lee en flujo y nunca se recorta. En esa escena la placa se atenúa para que el texto se lea.

## Escena por escena

| # | Escena | Escritorio | Móvil | Notas |
|---|---|---|---|---|
| 01 | **Hero** · Puerto | ✓ telón de entrada; titular a 124 px; sello AI sobre el kicker; claqueta "01 / 10" y la ruta en la barra inferior | ✓ CTA visible sin hacer scroll | El grading deja el ámbar en las luces del puerto |
| 02 | **Quiénes somos** | ✓ el soldador sube a la ventanilla con el avance de película | ✓ el soldador se atenúa detrás del texto para que se lea | "We forge the young operators of tomorrow." intacto |
| 03 | **Cómo funciona** · Aduana (5 pasos) | ✓ título arriba, pasos abajo; el bloque AI entra en el paso 5 | ✓ el destello se atenúa; los 4 pasos y el bloque AI caben | |
| 04 | **Trazabilidad y gobierno** · Almacén (3 pasos) | ✓ texto e insignia "Demostración"; panel de análisis, gobernanza y votación | ✓ | Sube del lugar 8 al 4: la confianza llega justo después del cómo |
| 05 | **Programas** · Distribución (5 pasos) | ✓ lista y tarjeta; el despegue de fondo | ✓ tarjeta por paso | Cierra el primer acto, el cine |
| 06 | **Evidencia** (papel) | ✓ el papel sube sobre el cine, que retrocede; la barra superior pasa a hueso; bloque del plan privado | ✓ | Los thumbnails llevan un degradado de pie de foto: "Ver documentos" se lee incluso sobre la factura blanca |
| 07 | **Plan operativo** (papel) | ✓ tres bloques; 5.49x en tinta | ✓ | |
| 08 | **Financiamiento** (papel) | ✓ calculadora idéntica; medidor ámbar; insignias en latón | ✓ | |
| 09 | **FAQ** (papel) | ✓ | ✓ | Al terminar, el papel se levanta y aparece el puerto |
| 10 | **Contacto** · Liquidación | ✓ CTA a 116 px; la ruta llega completa a Liquidación | ✓ | |
| — | **Pie** | ✓ sobre acero | ✓ | |

## Capturas (`capturas/`)
- `escenas-{en,es,zh}-{1920x1080,390x844}.jpg`: todas las escenas y todos los pasos.
- `motion-escritorio-es.jpg`: el telón (150, 500 y 900 ms), el avance de película (250, 550 y 1500 ms) y el papel subiendo sobre el cine.
- `plan-privado-v3.jpg`: el bloque del plan sobre papel y el visor abierto.
- `movimiento-reducido-es.jpg` y `sin-javascript.jpg`: los modos de respaldo.

## Notas abiertas (heredadas de la V1, sin cambios)
- La tabla "Los 120,000" del plan privado termina con $2,646 de caja el día 74, junto a la línea de la reserva de $22,922.
- `FORMSPREE_ID`, `WHATSAPP_NUMBER` y la clave de PostHog siguen como marcadores.
