# Variante 2 — Checklist QA escena por escena

Cada punto se verificó con pruebas automáticas en Chromium y con revisión visual de las capturas en EN, ES y ZH, a 1920×1080 (escritorio) y 390×844 (móvil). Además se probaron 1280×720, 1366×768, 1440×900, 1536×864, 1180×800, 1024×768, 820×1180, 430×932 y 375×667.

**Leyenda:** ✓ cumple · = igual a la V1 · ▲ mejor que la V1.

## Verificaciones globales

| Punto | Resultado |
|---|---|
| Contenido idéntico a la V1 (diccionario, 263 textos, 9 CTAs, texto visible completo, legal, calculadora, cifras) | ✓ en EN, ES y ZH, comparado de forma automática contra la V1 |
| Cifras $120,000 · $5,600 · 4.67% · 1.01x–5.49x · 36 meses | ✓ presentes y sin cambios |
| Mismas 10 secciones, mismo orden | ✓ hero, about, how, programs, evidence, plan, funding, trace, faq, contact |
| Inglés por defecto · selector EN · ES · ZH (barra y visor del plan) | ✓ |
| Sin puerta de entrada | ✓ |
| Sello AI Monograma + "AI GOVERNED" / "GOBERNADO POR AI" / "AI 治理" | ✓ con la franja metalizada; quieta con movimiento reducido |
| Tipografía #2 (Archivo ensanchada, Archivo, Fragment Mono) | ✓ mismas variables |
| CTAs en línea SpaceX | ✓ mismos estilos y textos |
| Plan privado con PLAN2030 | ✓ 15/15 chequeos × 3 idiomas × 2 tamaños: el plan no está en el código ni en la red antes del código, un código erróneo es rechazado, abre con el correcto, sin textos cortados, las tablas caben y Escape cierra |
| Errores de consola o peticiones fallidas | ✓ ninguno en las 6 combinaciones |
| Textos cortados o fuera de pantalla | ✓ ninguno. Única marca: el falso positivo de "Solicitar evaluación privada" con movimiento reducido, que la V1 ya tenía y que en la captura se ve completo |
| Escenas escenificadas frente a la V1 | ▲ iguales o más en todos los tamaños. A 1366×768: V1 4, V2 6. A 1180×800: V1 4, V2 6. A 1536×864: V1 5, V2 6. A 1024×768: V1 3, V2 4 |
| Contenido de cada paso dentro de la pantalla | ✓ en 3 idiomas × 6 tamaños (390×844, 375×667, 1280×720, 1180×800, 1024×768, 1920×1080) |
| Movimiento reducido | ✓ sin monitor ni animaciones; todo se lee en flujo normal sobre acero |
| Sin JavaScript | ✓ sin monitor; los 65 bloques de texto visibles, salvo la nota ampliable de la calculadora, que está oculta por diseño (igual que en la V1) |
| Solo se anima transform y opacity | ✓ el barrido del monitor usa clip-path en una capa a la vez |
| Contraste | ▲ el texto ya no va sobre video: va sobre acero sólido (#0B0E11) |
| Objetivos táctiles ≥ 44 px y foco visible | = no cambian respecto a la V1 (mismos controles y estilos) |

## Escena por escena

| # | Escena | Escritorio | Móvil | Notas |
|---|---|---|---|---|
| 01 | **Hero** | ✓ texto a la izquierda; monitor con el puerto, "Ruta analizada con AI · Puerto", coordenadas y ruta; sello AI sobre el kicker | ✓ el monitor se cierra porque manda el texto; el CTA es visible sin hacer scroll | La telemetría usa elementos que ya existían en la V1 |
| 02 | **Quiénes somos** | ✓ el monitor muestra el soldador | ✓ banda amplia (el texto es corto) | El monitor cambia de señal con barrido vertical y línea de escaneo |
| 03 | **Cómo funciona** (5 pasos) | ✓ título, bloque AI y 4 pasos en la columna; cabe a 1440×900 | ✓ banda angosta | Bloque AI compactado sin cambiar su texto |
| 04 | **Programas** (5 pasos) | ✓ lista y tarjeta lado a lado; el monitor muestra el despegue | ✓ | A 1280×720 entra en flujo normal (mecanismo de la V1) |
| 05 | **Evidencia** | ✓ ancho completo, el monitor se retira; bloque del plan privado | ✓ | |
| 06 | **Plan operativo** (gancho) | ✓ ancho completo, tres bloques | ✓ | |
| 07 | **Financiamiento** | ✓ ancho completo; la calculadora es idéntica | ✓ | |
| 08 | **Trazabilidad y gobierno** (3 pasos) | ✓ texto y panel en la columna; el monitor muestra el contenedor con su ubicación | ✓ | Insignia "Demostración" presente |
| 09 | **FAQ** | ✓ ancho completo | ✓ | |
| 10 | **Contacto** | ✓ CTA grande a la izquierda; el monitor muestra el puerto con la ruta completa (Liquidación) | ✓ banda amplia | |
| — | **Pie** | ✓ el monitor se retira al aparecer el pie, en cualquier tamaño | ✓ | Corrección incluida en esta entrega |

## Capturas
`capturas/escenas-{en,es,zh}-{1920x1080,390x844}.jpg` contienen todas las escenas y pasos. `hero-*-escritorio.jpg`, `monitor-escritorio-es.jpg`, `movil-es-detalle.jpg` y `plan-privado-v2.jpg` son tomas a tamaño completo.

## Notas abiertas (heredadas de la V1, sin cambios)
- La tabla "Los 120,000" del plan privado termina con $2,646 de caja el día 74, junto a la línea de la reserva de $22,922.
- `FORMSPREE_ID`, `WHATSAPP_NUMBER` y la clave de PostHog siguen como marcadores.
