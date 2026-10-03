#!/usr/bin/env python3
"""Assemble variante-1-definida/index.html from the template parts plus the
preserved modules of the original site (extracted verbatim by line range,
with a short, explicit list of patches — each asserted to match once)."""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = "/home/user/Lex/presston-site"
ORIG = open(os.path.join(SITE, "index.html"), encoding="utf-8").read().split("\n")
OUT = os.path.join(SITE, "variante-5", "index.html")

def lines(a, b):
    """1-based inclusive line range from the original file."""
    return "\n".join(ORIG[a-1:b])

def patch(text, old, new, count=1, regex=False):
    if regex:
        n = len(re.findall(old, text))
        assert n == count, f"regex {old!r}: expected {count}, found {n}"
        return re.sub(old, new, text)
    n = text.count(old)
    assert n == count, f"{old[:70]!r}: expected {count}, found {n}"
    return text.replace(old, new)

def expect_start(a, prefix):
    assert ORIG[a-1].strip().startswith(prefix), f"line {a}: {ORIG[a-1][:80]!r} does not start with {prefix!r}"

# ---- preserved blocks (line ranges verified against the original) ----
expect_start(1412, "const CALC = {")
calc_const = lines(1412, 1432)
# Round goal decision (Lex): USD 120,000 everywhere. Partner-level amounts are
# scaled by 120/125 so every per-dollar term of the plan is unchanged
# (Y1 cash 100.6% of capital = recovery by month 12; multiples 1.01x/1.28x/5.49x).
for old, new in [
    ("TARGET_RAISE: 125000,   // this round's own goal — keep equal to FUNDING.goal",
     "TARGET_RAISE: 120000,   // this round's own goal — keep equal to FUNDING.goal"),
    ("MAX: 125000,            // ceiling — a single contribution can't exceed the round",
     "MAX: 120000,            // ceiling — a single contribution can't exceed the round"),
    ("EQUITY_PCT_FULL: 15,    // % of the company the full $125,000 round represents",
     "EQUITY_PCT_FULL: 15,    // % of the company the full USD 120,000 round represents"),
    ("{ grossSales: 1050728, netProfit: 260370, cashDist: 125778 },", "{ grossSales: 1050728, netProfit: 260370, cashDist: 120747 },"),
    ("{ grossSales: 1811600, netProfit: 461678, cashDist: 34626 },", "{ grossSales: 1811600, netProfit: 461678, cashDist: 33241 },"),
    ("{ grossSales: 3115952, netProfit: 813680, cashDist: 61026 },", "{ grossSales: 3115952, netProfit: 813680, cashDist: 58585 },"),
    ("CASH_ACCUM_3Y: 221430,         // sum of the 3 years' cash distribution, at the full $125,000",
     "CASH_ACCUM_3Y: 212573,         // sum of the 3 years' cash distribution, at the full USD 120,000 (plan x 120/125)"),
    ("EQUITY_VALUE_Y3: 464331,       // value of the 15% stake at Year 3, at the full $125,000",
     "EQUITY_VALUE_Y3: 445758,       // value of the 15% stake at Year 3, at the full USD 120,000 (plan x 120/125)"),
]:
    calc_const = patch(calc_const, old, new)

expect_start(1439, "const I18N = {")
legacy = lines(1439, 1779)
legacy = patch(legacy, "const I18N = {", "const LEGACY_I18N = {")

expect_start(1782, "const LEGAL_TEXT = {")
legal = lines(1782, 1807)

expect_start(2221, "/* ============ Evidence data")
evidence = lines(2221, 2370)
evidence = patch(evidence, r'document\.body\.style\.overflow\s*=\s*"hidden";', "lockScroll();", regex=True)
evidence = patch(evidence, r'document\.body\.style\.overflow\s*=\s*"";', "unlockScroll();", regex=True)

# The operating plan (PLAN_PAGES + viewer, lines 2379-2841) is NOT extracted:
# the plan leaves the public site (Lex, decision 3). It stays in the repo only.

expect_start(2870, "/* ---- Participation calculator")
calc_fn = lines(2870, 2959)

expect_start(3315, "/* ============================================================")
analytics = lines(3315, 3405)
analytics = patch(analytics,
    'const TRACK_SECTION_IDS = ["layer-hero","layer-about","layer-how","layer-programs","layer-evidence","funding","traceability","faq"];',
    'const TRACK_SECTION_IDS = ["evidence","funding","faq"]; // stage scenes report from the scene engine')
analytics = patch(analytics, "}, { threshold: 0.4 });", '}, { rootMargin: "-45% 0px -45% 0px" });')
analytics = patch(analytics, 'const TRACK_SECTION_IDS = ["evidence","funding","faq"];', 'const TRACK_SECTION_IDS = ["evidence","plan","funding","faq"];')
analytics = patch(analytics, """/* ---- Plan viewer events ---- */
let planOpenedAt = 0;
const planPagesSeen = new Set();
let printedViaButton = false;
addEventListener("beforeprint", ()=>{
  if (printedViaButton){ printedViaButton = false; return; } // already tracked by the button handler
  trackEvent("plan_printed", { page: planPage });
});
""", "")

expect_start(3410, "const GLOBE = {")
globe = lines(3407, 3609)
globe = patch(globe, "63,166,114", "201,169,106", count=globe.count("63,166,114"))
globe = patch(globe, '"#3FA672"', '"#C9A96A"')

expect_start(3616, "async function sha256Hex")
gate = lines(3611, 3757)
gate = patch(gate, 'document.documentElement.style.overflow = "";\n    document.body.style.overflow = "";', "unlockScroll();")
gate = patch(gate, 'document.documentElement.style.overflow = "hidden";\n  document.body.style.overflow = "hidden";', "lockScroll();")
# Language priority EN > ES > ZH: every first visit opens in English; only the
# visitor's own choice (remembered for the session) overrides it.
gate = patch(gate, '''  if (saved && I18N[saved]) return saved;
  const nav = (navigator.language || navigator.userLanguage || "en").toLowerCase();
  if (nav.indexOf("zh") === 0) return "zh";
  if (nav.indexOf("es") === 0) return "es";
  return "en";
}''', '''  if (saved && I18N[saved]) return saved;
  return "en";
}''')

# The access gate is gone (the public page loads directly). From the old gate
# module only the Terms/Privacy panel and the language detection survive.
gate = gate[gate.index("/* ---- Legal panel"):gate.index("function initGate(){")] + gate[gate.index("function detectInitialLang(){"):]
assert "gateEl" not in gate and "GATE_CODES" not in gate


# ---- Long-dash cleanup (punto 4): only where the dash read unnaturally ----
DASH_FIXES_LEGACY = [
    ('calc_block2_title:"What comes back in cash — and when"', 'calc_block2_title:"What comes back in cash, and when"'),
    ('calc_block3_title:"What you keep at the end — beyond cash"', 'calc_block3_title:"What you keep at the end, beyond cash"'),
    ('calc_frame_y1:"Year 1 — Capital recovery: you get almost all of your capital back."', 'calc_frame_y1:"Year 1: capital recovery. You get almost all of your capital back."'),
    ('calc_frame_y23:"Years 2–3 — Gain on capital already returned to you."', 'calc_frame_y23:"Years 2–3: gain on capital already returned to you."'),
    ('calc_equity_value_lab:"Value of your 15% stake — Year 3"', 'calc_equity_value_lab:"Value of your 15% stake in Year 3"'),
    ('calc_note_short:"Active partnership · studied projections, not guarantees — evaluate independently."', 'calc_note_short:"Active partnership · studied projections, not guarantees. Evaluate independently."'),
    ('No projection is a guaranteed result — your participation is proportional', 'No projection is a guaranteed result. Your participation is proportional'),
    ('calc_frame_y1:"第 1 年 — 收回本金：您几乎收回全部本金。"', 'calc_frame_y1:"第 1 年：收回本金，您几乎收回全部本金。"'),
    ('calc_frame_y23:"第 2–3 年 — 对已返还本金的额外收益。"', 'calc_frame_y23:"第 2–3 年：对已返还本金的额外收益。"'),
    ('calc_equity_value_lab:"您15%股权的价值——第3年"', 'calc_equity_value_lab:"第3年时您15%股权的价值"'),
    ('calc_note_short:"主动型合伙参与 · 基于研究的预测，非保证收益——请自行评估。"', 'calc_note_short:"主动型合伙参与 · 基于研究的预测，非保证收益，请自行评估。"'),
    ('任何预测均不构成保证结果——您的参与按比例计算', '任何预测均不构成保证结果。您的参与按比例计算'),
    ('calc_frame_y1:"Año 1 — Recuperación de capital: recuperas casi todo tu capital."', 'calc_frame_y1:"Año 1: recuperación de capital. Recuperas casi todo tu capital."'),
    ('calc_frame_y23:"Años 2–3 — Ganancia sobre capital que ya volvió a ti."', 'calc_frame_y23:"Años 2–3: ganancia sobre capital que ya volvió a ti."'),
    ('calc_equity_value_lab:"Valor de tu 15% — Año 3"', 'calc_equity_value_lab:"Valor de tu 15% en el año 3"'),
    ('calc_note_short:"Participación activa · proyecciones estudiadas, no garantizadas — evalúa con tu propio equipo."', 'calc_note_short:"Participación activa · proyecciones estudiadas, no garantizadas. Evalúa con tu propio equipo."'),
]
for old, new in DASH_FIXES_LEGACY:
    legacy = patch(legacy, old, new)
DASH_FIXES_LEGAL = [
    ("The information available here — including the operating plan, documents, figures, and projections — is confidential.",
     "The information available here, including the operating plan, documents, figures, and projections, is confidential."),
    ("此处提供的信息 —— 包括运营计划、文件、数据与预测 —— 均为保密信息。", "此处提供的信息（包括运营计划、文件、数据与预测）均为保密信息。"),
    ("La información aquí disponible — incluidos el plan operativo, los documentos, cifras y proyecciones — es confidencial.",
     "La información aquí disponible, incluidos el plan operativo, los documentos, las cifras y las proyecciones, es confidencial."),
]
for old, new in DASH_FIXES_LEGAL:
    legal = patch(legal, old, new)

# ---- template ----
head = open(os.path.join(HERE, "head.html"), encoding="utf-8").read()
body = open(os.path.join(HERE, "body.html"), encoding="utf-8").read()
script = open(os.path.join(HERE, "script.js"), encoding="utf-8").read()

for key, val in [
    ("CALC_CONST", calc_const), ("LEGACY_I18N", legacy), ("LEGAL_TEXT", legal),
    ("EVIDENCE", evidence),
    ("CALC_FN", calc_fn), ("ANALYTICS", analytics), ("LEGAL_PANEL", gate),
]:
    tag = f"/*@@{key}@@*/"
    assert script.count(tag) == 1, tag
    script = script.replace(tag, f"/* ---- preserved from the original site: {key.lower()} ---- */\n" + val)

assert "@@" not in script, "unfilled placeholder"
os.makedirs(os.path.dirname(OUT), exist_ok=True)
open(OUT, "w", encoding="utf-8").write(head + body + script)
print("wrote", OUT, len(head + body + script), "bytes")
