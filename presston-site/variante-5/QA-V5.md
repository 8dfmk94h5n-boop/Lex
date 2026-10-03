# Variante 5 — Checklist QA escena por escena

Cada punto se verificó con pruebas automáticas en Chromium y con revisión visual de las capturas en EN, ES y ZH, a 1920×1080 (escritorio) y 390×844 (móvil). El escenificado se midió en 9 tamaños y el encaje en 6.

**Leyenda:** ✓ cumple · ▲ mejor que la V1–V4.

## Verificaciones globales

| Punto | Resultado |
|---|---|
| Contenido idéntico a la V1 | ✓ en EN, ES y ZH: diccionario, todos los textos traducidos, **todos los nodos de texto visibles comparados como multiconjunto**, pie, legal, 9 CTAs (ninguno nuevo), calculadora y cifras. Solo cambian los números de capítulo |
| Cifras $120,000 · $5,600 · 4.67% · 1.01x–5.49x · 36 meses | ✓ presentes y sin cambios |
| Las 10 secciones | ✓ orden: hero, about, how, programs, trace, evidence, plan, funding, faq, contact |
| Inglés por defecto · selector EN · ES · ZH (barra y visor del plan) | ✓ |
| Sin puerta de entrada | ✓ |
| Sello AI Monograma + "AI GOVERNED" / "GOBERNADO POR AI" / "AI 治理" | ✓ |
| Tipografía #2 | ✓ mismas variables |
| CTAs en línea SpaceX | ✓ mismos estilos y textos |
| Paleta: acero oscuro, ámbar, hueso | ✓ sin colores nuevos. El numeral de hoja usa el gris acero de la paleta, legible sobre acero |
| Plan privado con PLAN2030 | ✓ 15/15 chequeos × 3 idiomas × 2 tamaños: el plan no está en el código ni en la red antes del código, un código erróneo es rechazado, abre con el correcto, sin textos cortados, las tablas caben y Escape cierra |
| Errores de consola o peticiones fallidas | ✓ ninguno en las 6 combinaciones |
| Textos cortados o fuera de pantalla | ✓ ninguno. Única marca: el falso positivo de "Solicitar evaluación privada" con movimiento reducido, heredado de la V1; en la captura se ve completo |
| Encaje de cada tiempo dentro de la pantalla | ✓ 3 idiomas × 6 tamaños (390×844, 375×667, 1024×768, 1280×720, 1366×768, 1920×1080) |
| Escenas escenificadas | ▲ **6 de 6 en los 27 casos** (3 idiomas × 9 tamaños) |
| Movimiento reducido | ✓ sin cámara ni animaciones; todo en flujo sobre acero |
| Sin JavaScript | ✓ todo el texto visible salvo la nota ampliable de la calculadora, oculta por diseño (igual que en la V1) |
| Solo se anima transform y opacity | ✓ cámara (scale y desplazamiento de la placa), corte, entradas y riel |
| Sin 3D en CSS, sin experimentos de luz o foco, sin stock | ✓ solo los videos y pósters existentes; la "cámara" es escala y desplazamiento 2D de la placa |

### Escenas escenificadas (de 6 posibles)

| Tamaño | V1 | V2 | V3 | V4* | V5 (EN · ES · ZH) |
|---|---|---|---|---|---|
| 390×844 | 5 | 5 | 6 | 6 | **6 · 6 · 6** |
| 375×667 | 1 | 1 | 2 | 4 | **6 · 6 · 6** ▲ |
| 1024×768 | 3 | 4 | 5 | 6 | **6 · 6 · 6** |
| 1180×800 | 5 | 6 | 6 | 6 | **6 · 6 · 6** |
| 1280×720 | 5 | 5 | 6 | 6 | **6 · 6 · 6** |
| 1366×768 | 5 | 6 | 6 | 6 | **6 · 6 · 6** |
| 1440×900 | 6 | 6 | 6 | 6 | **6 · 6 · 6** |
| 1536×864 | 6 | 6 | 6 | 6 | **6 · 6 · 6** |
| 1920×1080 | 6 | 6 | 6 | 6 | **6 · 6 · 6** |

\*V4 fusiona escenas; se cuentan las secciones de la V1 que quedan escenificadas. V1–V4 medidas en inglés.

## Escena por escena

| # | Banda / sección | Tiempo 1 | Tiempos siguientes | Cámara | Escritorio | Móvil |
|---|---|---|---|---|---|---|
| 01 | **Hero** (Puerto) | sello, kicker, titular, CTA y nota | bajada y declaración a la derecha del CTA | *dolly* hacia adentro + paneo | ✓ | ✓ CTA visible sin hacer scroll |
| 02 | **Quiénes somos** | kicker, titular | semilla, párrafo, cierre | empuje hacia las chispas | ✓ | ✓ soldador atenuado |
| 03 | **Cómo funciona** (Aduana) | kicker, titular | los 4 pasos → la AI, en el mismo lugar | grúa que sube | ✓ | ✓ |
| 04 | **Programas** (Almacén) | kicker, titular | la lista + una ficha por tiempo (5) | inclinación con el cohete | ✓ | ✓ una ficha por tiempo |
| 05 | **Trazabilidad** (Distribución) | kicker, "Demostración", titular | texto + análisis, gobernanza, votación | paneo lateral | ✓ | ✓ el texto entra con el titular y los paneles se turnan |
| 06 | **Evidencia** (hoja) | — | — | — | ✓ numeral 06, thumbnails con pie de foto legible, plan privado | ✓ |
| 07 | **Plan operativo** (hoja) | — | — | — | ✓ numeral 07, tres bloques, 5.49x | ✓ |
| 08 | **Financiamiento** (hoja) | — | — | — | ✓ numeral 08, calculadora idéntica | ✓ |
| 09 | **FAQ** (hoja) | — | — | — | ✓ numeral 09 | ✓ |
| 10 | **Contacto** (Liquidación) | el CTA grande | — | retroceso que abre el plano | ✓ | ✓ |
| — | **Barra** | — | — | — | ✓ se recoge al bajar y vuelve al subir | ✓ |
| — | **Riel de capítulo** | — | — | — | ✓ borde derecho; se oculta sobre la hoja | ✓ línea de progreso arriba |

## Capturas (`capturas/`)
- `escenas-{en,es,zh}-{1920x1080,390x844}.jpg`: cada banda, cada tiempo y cada hoja.
- `motion-escritorio-es.jpg`:
  - la cámara (Trazabilidad al inicio y al final de su paneo; el Puerto antes y después del *dolly*);
  - el corte de Programas a Trazabilidad a los 300, 700 y 1600 ms.
- `plan-privado-v5.jpg`: el bloque del plan y el visor abierto.
- `movimiento-reducido-es.jpg` y `sin-javascript.jpg`: los modos de respaldo.

## Notas abiertas (heredadas de la V1, sin cambios)
- La tabla "Los 120,000" del plan privado termina con $2,646 de caja el día 74, junto a la línea de la reserva de $22,922.
- `FORMSPREE_ID`, `WHATSAPP_NUMBER` y la clave de PostHog siguen como marcadores.
