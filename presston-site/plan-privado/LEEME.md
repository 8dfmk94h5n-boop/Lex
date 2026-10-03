# Plan operativo privado — Variante 1

El plan operativo completo **no forma parte de la página pública**. Esta carpeta guarda su contenido en claro y el script que lo convierte en archivos cifrados. Nada de esta carpeta se publica.

| Archivo | Qué es |
|---|---|
| `plan_es.py`, `plan_en.py`, `plan_zh.py` | El contenido del plan. Narrativa, producto, costos por contenedor y negociación vienen de `assets/plan-operativo-acero-{es,en,zh}.pdf`. Volumen, ciudades, resultados y retorno siguen el modelo de la calculadora del sitio (el modelo financiero de 3 ciudades, con la base llevada a USD 120,000). |
| `codigos.json` | Los códigos de acceso. Hoy solo existe el de prueba, `PLAN2030`. |
| `construir.py` | Renderiza el plan con el diseño de la Variante 1, lo cifra y escribe `variante-1-definida/privado/`. |

## Cómo funciona
1. El visitante escribe el código en el bloque **"Plan operativo completo — documento privado"** de la sección Evidencia.
2. La página calcula `SHA-256("presston-plan-v1|" + CÓDIGO)` y busca `privado/acceso/<id>.json`. Con un código incorrecto ese archivo no existe: no se descarga nada del plan.
3. Con el código correcto, el archivo de acceso se descifra (PBKDF2-SHA256 con 250 000 iteraciones + AES-256-GCM) y entrega la clave y la ruta del documento.
4. El documento `privado/doc/<aleatorio>.json` se descarga y se descifra **en ese momento**, y se muestra en el visor con la nota "Documento privado — bajo confidencialidad".

La página y su código fuente no contienen ningún texto ni cifra del plan, ni la ruta del documento. Lo verifica `construir.py` al cifrar, y `deploy/variante-1/build.sh` al empaquetar.

El código no distingue mayúsculas de minúsculas e ignora los espacios: `plan2030` y `PLAN 2030` también abren.

## Dar o quitar acceso
- **Dar acceso:** añade una línea a `codigos.json`, por ejemplo `{ "codigo": "K7QP-M2XD-9WRT", "etiqueta": "socio-juan" }`. Después ejecuta `python3 construir.py` y vuelve a publicar.
- **Quitar acceso:** borra su línea, reconstruye y publica. Cada construcción cambia la clave y la ruta del documento, así que los accesos anteriores dejan de servir.
- **Etiqueta:** identifica a la persona en la analítica (evento `plan_unlocked`) cuando esté configurada.
- **Requisito:** `python3` con el paquete `cryptography`.

## Límites, para decidir con información
- **Fuerza del código.** El cifrado es fuerte, pero la protección real depende del código. `PLAN2030` sirve para la prueba; es corto y adivinable. Para códigos por persona conviene usar códigos largos y aleatorios, como el del ejemplo.
- **Intentos.** Cada intento es una petición al servidor. En Cloudflare se puede limitar la frecuencia de peticiones a `/privado/acceso/*` con una regla de rate limiting.
- **Lo que el código no impide.** Quien tiene el código ve el documento y puede copiarlo o fotografiarlo. El código controla quién entra, no lo que hace después.
- **Contenido en claro en el repositorio.** Esta carpeta contiene el plan sin cifrar. El repositorio debe seguir siendo privado. Si se prefiere, `codigos.json` puede sacarse del repositorio (agregarlo a `.gitignore`) y guardarse aparte.
