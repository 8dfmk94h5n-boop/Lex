# Fuentes de las variantes

Cada variante se arma desde tres plantillas (`head.html`, `body.html` y `script.js`) más los módulos que se conservan del sitio original, que `assemble.py` extrae de `presston-site/index.html`.

    cd presston-site/fuente/variante-1 && python3 assemble.py   # escribe variante-1-definida/index.html
    cd presston-site/fuente/variante-2 && python3 assemble.py   # escribe variante-2/index.html

En `variante-2/`, `v2-art.css` es una copia de referencia de la capa de arte de la V2, que ya está incluida en `head.html`.
