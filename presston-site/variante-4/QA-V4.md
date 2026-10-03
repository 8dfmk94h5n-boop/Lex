# Variante 4 — Checklist QA escena por escena

Cada punto se verificó con pruebas automáticas en Chromium y con revisión visual de las capturas en EN, ES y ZH, a 1920×1080 (escritorio) y 390×844 (móvil). El encaje se probó además a 375×667, 1024×768, 1280×720 y 1366×768, y el escenificado en 9 tamaños.

**Leyenda:** ✓ cumple · ▲ mejor que la V1, la V2 y la V3.

## Verificaciones globales

| Punto | Resultado |
|---|---|
| Contenido idéntico a la V1 | ✓ en EN, ES y ZH: diccionario, todos los textos traducidos, **todos los nodos de texto visibles (319) comparados como multiconjunto**, pie, legal, 9 CTAs, calculadora y cifras. Solo cambian los números de capítulo; el índice del expediente repite kickers existentes |
| Cifras $120,000 · $5,600 · 4.67% · 1.01x–5.49x · 36 meses | ✓ presentes y sin cambios |
| Estructura | ✓ Origen (hero + quiénes somos) → La Ruta (cómo funciona, AI, trazabilidad ×4, programas ×6: 12 estaciones horizontales) → Expediente (evidencia, plan, financiamiento, FAQ, con índice) → Contacto |
| Inglés por defecto · selector EN · ES · ZH (barra y visor del plan) | ✓ |
| Sin puerta de entrada | ✓ |
| Sello AI Monograma + "AI GOVERNED" / "GOBERNADO POR AI" / "AI 治理" | ✓ en el hero; el Monograma se repite en grande como marca de la estación AI (decorativo, oculto a lectores de pantalla) |
| Tipografía #2 | ✓ mismas variables |
| CTAs en línea SpaceX | ✓ mismos estilos y textos |
| Paleta: acero oscuro, ámbar, hueso | ✓ sin colores nuevos; el ámbar solo como señal |
| Plan privado con PLAN2030 | ✓ 15/15 chequeos × 3 idiomas × 2 tamaños: el plan no está en el código ni en la red antes del código, un código erróneo es rechazado, abre con el correcto, sin textos cortados, las tablas caben y Escape cierra |
| Errores de consola o peticiones fallidas | ✓ ninguno en las 6 combinaciones |
| Textos cortados o fuera de pantalla | ✓ ninguno |
| Encaje: cada paso y cada estación entre la barra y la línea de suelo | ✓ 3 idiomas × 6 tamaños (390×844, 375×667, 1024×768, 1280×720, 1366×768, 1920×1080) |
| Contenido escenificado frente a la V1, la V2 y la V3 | ✓/▲ ver la tabla siguiente |
| Movimiento reducido | ✓ sin animaciones; la ruta se apila en vertical, estación por estación, cada una con su placa; el índice del expediente sigue funcionando |
| Sin JavaScript | ✓ todo el texto visible salvo la nota ampliable de la calculadora, oculta por diseño (igual que en la V1) |
| Solo se anima transform y opacity | ✓ el viaje horizontal (translateX del carril), las placas, el suelo ámbar (scaleX) y las entradas |
| Sin 3D en CSS, sin experimentos de luz o foco, sin stock | ✓ solo los videos y pósters existentes |

### Contenido escenificado (secciones de la V1 que quedan escenificadas, en inglés)
La V4 fusiona escenas, así que se cuentan las secciones de la V1 que viven en una escena escenificada: Origen = hero + about, La Ruta = how + trace + programs, Contacto.

| Tamaño | V1 | V2 | V3 | V4 |
|---|---|---|---|---|
| 390×844 | 5 | 5 | 6 | **6** |
| 375×667 | 1 | 1 | 2 | **4** ▲ |
| 1024×768 | 3 | 4 | 5 | **6** ▲ |
| 1180×800 | 5 | 6 | 6 | **6** |
| 1280×720 | 5 | 5 | 6 | **6** |
| 1366×768 | 5 | 6 | 6 | **6** |
| 1440×900 | 6 | 6 | 6 | **6** |
| 1536×864 | 6 | 6 | 6 | **6** |
| 1920×1080 | 6 | 6 | 6 | **6** |

En español y chino, la V4 también escenifica las 6 en todos esos tamaños, salvo 375×667. Ahí, en ES, el Origen se lee en flujo y la Ruta queda escenificada.

## Escena por escena

| # | Escena / estación | Escritorio | Móvil | Notas |
|---|---|---|---|---|
| 01 | **Origen · paso 1: Hero** | ✓ composición en diagonal: titular arriba (hasta 132 px), CTA abajo a la izquierda, declaración abajo a la derecha; sello AI; "Desliza" al centro | ✓ CTA visible sin hacer scroll | Telemetría "Puerto" abajo a la izquierda |
| 02 | **Origen · paso 2: Quiénes somos** | ✓ la placa pasa al soldador | ✓ soldador atenuado detrás del texto | Fusión: la promesa y quién la cumple |
| 03 | **Ruta · Cómo funciona** (Aduana) | ✓ los 4 pasos se encienden en secuencia | ✓ pasos en lista | Primer poste en el suelo |
| 04 | **Ruta · AI** (escena nueva) | ✓ Monograma grande, título de 54 px, los 4 frentes se validan en secuencia, cierre "La gente lidera…" | ✓ | La AI deja de ser un recuadro dentro de "Cómo funciona" |
| 05 | **Ruta · Trazabilidad** (Almacén) | ✓ cabeza con "Demostración" | ✓ | Poste |
| 06–08 | **Ruta · Análisis, Gobernanza, Votación** | ✓ una estación cada una; la de la compuerta en pleno | ✓ una pantalla cada una | Contenido de la V1, ahora a la vista uno por uno |
| 09 | **Ruta · Programas** (Distribución) | ✓ cabeza con la lista; la lista lleva a cada ficha y marca la activa | ✓ | Poste |
| 10–14 | **Ruta · Acero, Aluminio, Agro, Semiconductores, Energía** | ✓ fichas en fila; al final del carril la compuerta avanza ficha por ficha | ✓ | Acero conserva su CTA |
| 15 | **Expediente · Evidencia** | ✓ índice fijo a la izquierda (≥1366 px); bloque del plan privado | ✓ índice como franja bajo la barra | |
| 16 | **Expediente · Plan operativo** | ✓ tres bloques; 5.49x | ✓ | |
| 17 | **Expediente · Financiamiento** | ✓ calculadora idéntica | ✓ | |
| 18 | **Expediente · FAQ** | ✓ | ✓ | |
| 19 | **Contacto** (Liquidación) | ✓ CTA a 116 px sobre el puerto | ✓ | |
| — | **Pie** | ✓ | ✓ | |

## Capturas (`capturas/`)
- `escenas-{en,es,zh}-{1920x1080,390x844}.jpg`: cada paso y cada estación.
- `motion-escritorio-es.jpg`: el cambio de placa del Origen, el avance horizontal de la Ruta con su suelo ámbar, y el expediente con el índice.
- `plan-privado-v4.jpg`: el bloque del plan y el visor abierto.
- `movimiento-reducido-es.jpg` y `sin-javascript.jpg`: los modos de respaldo.

## Notas abiertas (heredadas de la V1, sin cambios)
- La tabla "Los 120,000" del plan privado termina con $2,646 de caja el día 74, junto a la línea de la reserva de $22,922.
- `FORMSPREE_ID`, `WHATSAPP_NUMBER` y la clave de PostHog siguen como marcadores.
