# Variante 1 — Sistema de grano sutil: 5 variantes

**Estado publicado:** **2 · Halo de lectura** (`data-grain="halo"`), elegida por Lex.

## Interruptor
Está en `index.html`, en el atributo del fondo fijo:

```html
<div class="backdrop" id="backdrop" aria-hidden="true" data-grain="off">
```

Valores: `off` · `original` · `polvo` · `halo` · `penumbra` · `pelicula` · `velo`.

- Es CSS puro: funciona sin JavaScript.
- Cualquier valor desconocido equivale a `off`.
- El CSS está en el bloque `SISTEMA DE GRANO` del `<style>` y usa dos capas: `.bd-veil` (oscurecido/viñeta) y `.bd-grain` (textura).
- El grano nuevo es ruido vectorial de ~1 px (SVG `feTurbulence` en línea). No añade archivos ni peticiones. El original usaba `grain.png`, de 64 px estirado a 200 px; por eso se veía "sucio".

## Las cinco
| # | Nombre | Qué hace | Por qué ayuda al texto |
|---|---|---|---|
| 1 | **Polvo fino** | Grano de 1 px en toda la pantalla, opacidad .05 en modo *overlay* | Da textura de papel al video, sin manchas sobre la letra. Es la más cercana a "sin grano". |
| 2 | **Halo de lectura** | Grano (.09) y un oscurecido leve **solo** en la columna del texto; los bordes quedan limpios | Asienta la letra sobre una base mate. Es la que más contraste le da al titular. |
| 3 | **Penumbra** | Sin grano: viñeta suave que baja los bordes, más un leve oscurecido a la izquierda | Concentra la mirada en el centro, donde está el texto. Cero textura. |
| 4 | **Película tenue** | Grano fino (.06) que salta a otra posición cada 0.9 s, en 8 pasos y solo con `transform` | Le da vida "de cine" al fondo estático. Con movimiento reducido queda quieto. |
| 5 | **Velo editorial** (mezcla) | Penumbra mínima en los bordes, polvo fino en toda la imagen y algo más de textura y sombra detrás del texto | Equilibrio: casi invisible como efecto, pero la letra gana peso. |

## Capturas (Hero, ES, 1920×1080, mismo fotograma congelado)
- `comparacion-hero.jpg`: las 7 pantallas completas lado a lado.
- `comparacion-detalle.jpg`: la zona del texto a tamaño real. Ahí se aprecia mejor la diferencia.
- `N-…-hero-1920x1080.jpg` y `N-…-detalle-texto.jpg`: cada variante por separado.

Nota: el video del puerto se ve como póster porque el navegador de pruebas no reproduce H.264. La variante 4 se muestra como un fotograma; su movimiento solo se aprecia en vivo.

## Para aplicar la elegida
Cambia `data-grain="off"` por el nombre elegido. No hace falta tocar nada más.
