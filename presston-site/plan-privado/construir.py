#!/usr/bin/env python3
"""Construye el plan operativo privado de la Variante 1.

Lee el contenido (plan_es.py, plan_en.py, plan_zh.py) y los códigos
(codigos.json), renderiza el plan a HTML con el diseño de la Variante 1 y
lo CIFRA. Solo los archivos cifrados se publican, en
  variante-1-definida/privado/
Ningún texto del plan sale de esta carpeta en claro.

Esquema (todo verificable en el navegador con WebCrypto):
  · K = clave de contenido aleatoria (AES-256-GCM), nueva en cada build.
  · privado/doc/<aleatorio>.json = {iv, ct}: AES-GCM(K, JSON con el HTML de ES/EN/ZH), en base64.
  · Por cada código: privado/acceso/<id>.json, con
      id   = SHA-256("presston-plan-v1|" + CÓDIGO) en hex (40 caracteres)
      clave = PBKDF2-SHA256(CÓDIGO, sal aleatoria, 250 000 iteraciones)
      ct   = AES-GCM(clave, {k: K, doc: ruta del documento, label: etiqueta})
    Sin el código no se conoce ni el nombre del archivo de acceso ni la ruta
    del documento, y aunque se obtengan los archivos, no se pueden descifrar.

Uso:  python3 construir.py
Para dar acceso a una persona: añade {"codigo": "...", "etiqueta": "..."} a
codigos.json y vuelve a construir. Para quitarlo: bórralo y vuelve a construir
(el build rota K y la ruta del documento, así que los accesos viejos dejan de
servir).
"""
import base64, hashlib, html, importlib.util, json, os, re, secrets, shutil, sys
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "variante-1-definida", "privado")
ITER = 250_000
ID_PREFIX = "presston-plan-v1|"
LANGS = ["en", "es", "zh"]


def norm_code(c):
    """Same rule as the page: trim, drop inner whitespace, uppercase."""
    return re.sub(r"\s+", "", c).upper()


def code_id(code):
    return hashlib.sha256((ID_PREFIX + code).encode()).hexdigest()[:40]


def b64(b):
    return base64.b64encode(b).decode()


# ---------------------------------------------------------------- render
def rich(s):
    """Escape, then turn **x** into <strong>x</strong>."""
    s = html.escape(s, quote=False)
    return re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", s)


def cell(v, align, tag):
    # Figures (right-aligned columns) set in Fragment Mono; left-column labels
    # stay in the text face so "0.80" reads like its neighbour "0.76 · ...".
    cls = ["r" if align == "r" else "l"]
    if align == "r":
        cls.append("n")
    return f'<{tag} class="{" ".join(cls)}">{rich(v)}</{tag}>'


def render(plan, meta, lang):
    out = [f'<article class="pv-doc" lang="{"zh-CN" if lang == "zh" else lang}">']
    open_sec = False
    for b in plan:
        kind = b[0]
        if kind == "cover":
            c = b[1]
            figs = "".join(
                f'<div class="pv-fig"><dt>{rich(l)}</dt><dd><span class="pv-fig-v">{rich(v)}</span>'
                + (f'<span class="pv-fig-t">· {rich(t)}</span>' if t else "") + "</dd></div>"
                for l, v, t in c["figures"])
            out.append(
                '<header class="pv-cover">'
                f'<div class="pv-brand"><span class="pv-dot" aria-hidden="true"></span>{rich(c["brand"])}</div>'
                f'<div class="pv-eyebrow">{rich(c["eyebrow"])}</div>'
                '<h1 class="pv-title">' + "".join(f"<span>{rich(t)}</span>" for t in c["title"]) + "</h1>"
                f'<p class="pv-sub">{rich(c["sub"])}</p>'
                f'<dl class="pv-figs">{figs}</dl>'
                f'<p class="pv-cfoot"><span class="pv-rule" aria-hidden="true"></span>{rich(c["foot"])}</p>'
                "</header>")
        elif kind == "sec":
            if open_sec:
                out.append("</section>")
            out.append(f'<section class="pv-sec"><div class="pv-secnum">{b[1]}</div><h2 class="pv-h2">{rich(b[2])}</h2>')
            open_sec = True
        elif kind == "lead":
            out.append(f'<p class="pv-lead">{rich(b[1])}</p>')
        elif kind == "p":
            out.append(f"<p>{rich(b[1])}</p>")
        elif kind == "call":
            _, label, paras, tone = b
            cls = "pv-call" + (" is-accent" if tone == "accent" else "") + ("" if label else " is-plain")
            lab = f'<div class="pv-k">{rich(label)}</div>' if label else ""
            out.append(f'<aside class="{cls}">{lab}' + "".join(f"<p>{rich(p)}</p>" for p in paras) + "</aside>")
        elif kind == "unit":
            _, label, lines, last = b
            out.append(f'<div class="pv-unit"><div class="pv-k">{rich(label)}</div><ul>'
                       + "".join(f"<li>{rich(x)}</li>" for x in lines)
                       + f'<li class="is-hl">{rich(last)}</li></ul></div>')
        elif kind == "sub":
            out.append(f'<div class="pv-subhead">{rich(b[1])}</div>')
        elif kind == "h3":
            out.append(f'<h3 class="pv-h3">{rich(b[1])}</h3>')
        elif kind == "table":
            _, cols, align, rows, opts = b
            strong, hl = set(opts.get("strong", [])), set(opts.get("hl", []))
            head = "".join(cell(c, align[i], "th") for i, c in enumerate(cols))
            body = ""
            for ri, r in enumerate(rows):
                rc = " ".join(x for x in ["is-strong" if ri in strong else "", "is-hl" if ri in hl else ""] if x)
                tr = f'<tr class="{rc}">' if rc else "<tr>"
                body += tr + "".join(cell(v, align[i], "td") for i, v in enumerate(r)) + "</tr>"
            out.append(f'<div class="pv-tw" tabindex="0"><table class="pv-t pv-c{len(cols)}"><thead><tr>{head}</tr></thead><tbody>{body}</tbody></table></div>')
        elif kind == "caption":
            out.append(f'<p class="pv-caption">{rich(b[1])}</p>')
        elif kind == "bar":
            _, label, segs, text = b
            track = "".join(f'<span class="pv-seg s{i+1}" style="flex:{v} 1 0"><b>{v}</b></span>' for i, (n, v) in enumerate(segs))
            legend = "".join(f'<li><i class="s{i+1}" aria-hidden="true"></i>{rich(n)} <span class="pv-lv">{v}</span></li>' for i, (n, v) in enumerate(segs))
            out.append(f'<figure class="pv-bar"><figcaption class="pv-k">{rich(label)}</figcaption>'
                       f'<div class="pv-track" aria-hidden="true">{track}</div><ul class="pv-legend">{legend}</ul>'
                       f"<p>{rich(text)}</p></figure>")
        elif kind == "note":
            out.append(f'<p class="pv-note">{rich(b[1])}</p>')
        elif kind == "terms":
            out.append('<ol class="pv-terms">' + "".join(
                f'<li><span class="pv-tn">{n}</span><p><strong>{rich(h)}</strong> {rich(t)}</p></li>' for n, h, t in b[1]) + "</ol>")
        elif kind == "risks":
            out.append('<div class="pv-risks">' + "".join(
                f'<div class="pv-risk"><div class="pv-rk"><strong>{rich(n)}</strong>'
                + (f"<span>{rich(s)}</span>" if s else "") + f"</div><p>{rich(m)}</p></div>" for n, s, m in b[1]) + "</div>")
        elif kind == "result":
            _, label, big, l1, l2, amber = b
            out.append(f'<div class="pv-result"><div class="pv-k">{rich(label)}</div><div class="pv-big">{rich(big)}</div>'
                       f'<p>{rich(l1)}</p><p>{rich(l2)}<span class="pv-amber">{rich(amber)}</span></p></div>')
        else:
            raise ValueError(f"bloque desconocido: {kind}")
    if open_sec:
        out.append("</section>")
    out.append(f'<footer class="pv-end"><span>{rich(meta["footer"])}</span><span>{rich(meta["running_left"])} · {rich(meta["running_right"])}</span></footer></article>')
    return "".join(out)


def load(lang):
    spec = importlib.util.spec_from_file_location(f"plan_{lang}", os.path.join(HERE, f"plan_{lang}.py"))
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m.PLAN, m.META


# ---------------------------------------------------------------- crypto
def main():
    codes = json.load(open(os.path.join(HERE, "codigos.json"), encoding="utf-8"))
    assert codes, "codigos.json está vacío"
    doc = {"v": 1, "langs": {}}
    for lang in LANGS:
        plan, meta = load(lang)
        doc["langs"][lang] = {"html": render(plan, meta, lang), "running": [meta["running_left"], meta["running_right"]]}

    if os.path.isdir(OUT):
        shutil.rmtree(OUT)
    os.makedirs(os.path.join(OUT, "acceso"))
    os.makedirs(os.path.join(OUT, "doc"))

    K = AESGCM.generate_key(bit_length=256)
    doc_path = f"privado/doc/{secrets.token_hex(16)}.json"
    iv = secrets.token_bytes(12)
    ct = AESGCM(K).encrypt(iv, json.dumps(doc, ensure_ascii=False).encode(), None)
    json.dump({"v": 1, "iv": b64(iv), "ct": b64(ct)}, open(os.path.join(OUT, "..", doc_path), "w"))

    seen = set()
    for entry in codes:
        code = norm_code(entry["codigo"])
        assert code and code not in seen, f"código vacío o repetido: {entry}"
        seen.add(code)
        salt = secrets.token_bytes(16)
        key = PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=salt, iterations=ITER).derive(code.encode())
        civ = secrets.token_bytes(12)
        payload = json.dumps({"k": b64(K), "doc": doc_path, "label": entry.get("etiqueta", "")}).encode()
        rec = {"v": 1, "iter": ITER, "salt": b64(salt), "iv": b64(civ), "ct": b64(AESGCM(key).encrypt(civ, payload, None))}
        json.dump(rec, open(os.path.join(OUT, "acceso", code_id(code) + ".json"), "w"))

    # Simple static servers list directories; an empty index stops that.
    for d in ["", "acceso", "doc"]:
        open(os.path.join(OUT, d, "index.html"), "w").write("")

    # Guard: no plaintext from the plan may appear in what gets published.
    published = b"".join(open(os.path.join(dp, f), "rb").read() for dp, _, fs in os.walk(OUT) for f in fs)
    for probe in ["0.8247", "Línea A", "558,456", "Arancel retroactivo", "Retroactive duty", "关税追溯调整", "27,816"]:
        assert probe.encode() not in published, f"texto del plan en claro en la salida: {probe}"
    sizes = {lang: len(doc["langs"][lang]["html"]) for lang in LANGS}
    print(f"plan cifrado → {doc_path} ({len(ct)} bytes); HTML por idioma: {sizes}; accesos: {len(seen)}")


if __name__ == "__main__":
    main()
