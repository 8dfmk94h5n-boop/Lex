<script>
/* ============================================================
   PRESSTON — VARIANTE 5 (TURNO DE NOCHE)
   Static, no build step. GSAP + ScrollTrigger + Lenis arrive by CDN;
   if any of them fails, the page falls back to plain document flow.
   Blocks marked "preserved" are carried over verbatim from the
   original site (gate, legal text, plan viewer, evidence lightbox,
   participation calculator, analytics).
   ============================================================ */

/* ---------- Tunables ---------- */
const MOTION = {
  SCRUB: 0.6,          // master timeline catch-up (s) — punto 2.2
  LERP: 0.09,          // Lenis smoothing — punto 2.2
  ENTER: 0.6,          // scene entrance (s), power3.out
  EXIT: 0.4,           // scene exit (s)
  STAGGER: 0.08,       // internal stagger (s)
  SHIFT: 24,           // max displacement (px) for scene cross-fades
  BD_XFADE: 1.2,       // backdrop environment cross-fade (s)
  CAM: 1.1,            // V5: camera inertia (s)
  CUT: 1.25,           // V5: push-through cut (s)
  WELDER_XFADE: 2.6,   // welder layer over the port: long cross-fade, 2–3 s (punto 2.3)
  BEAT_VH: 0.75,       // scroll length of one beat, in viewport heights (desktop)
  BEAT_VH_MOBILE: 0.62,
  LOAD_AHEAD_VH: 0.6,  // start loading a scene's video when it is this close
  POSTER_AHEAD_VH: 1.6,
};
const TUNE = {
  THUMB_RATIO: "4 / 3",
  MEDIA_MAX_W_PX: 1440,
  ZOOM_MAX: 3,
  PREVIEW_CAROUSEL_MS: 3400,
};
const ASSET = "../assets/";

/*@@CALC_CONST@@*/
document.documentElement.style.setProperty("--thumb-ratio", TUNE.THUMB_RATIO);

/* ---------- Copy ----------
   LEGACY_I18N is the original dictionary, kept whole so the gate, legal
   panel and calculator read exactly as before. I18N below carries the
   approved copy (punto 7) and overrides any legacy key it shares. */
/*@@LEGACY_I18N@@*/
const I18N_NEW = {
  es:{
    scope:"Proyección del modelo a 3\u00a0años / 3\u00a0ciudades",
    pbA_y1:"Año 1 · ciudad 1", pbA_containers:"contenedores", pbA_steady:"En régimen, por ciudad", pbA_peryear:"al año",
    pbA_c2:"Ciudad 2", pbA_from2:"entra en el año 2", pbA_c3:"Ciudad 3", pbA_from3:"entra en el año 3",
    pbB_y1:"Año 1", pbB_y2:"Año 2", pbB_dist3:"Distribuciones acumuladas a 3 años", pbB_total3:"Total a 3 años, incluido el valor de la participación del 15%",
    plan_kicker:"Plan operativo",
    plan_title:"El plan operativo, en tres bloques.",
    pbA_t:"La economía", pbA_per:"Por contenedor", pbA_landed:"Costo landed", pbA_sale:"Valor de venta", pbA_gross:"Bruto por contenedor",
    pbA_pace:"Ritmo", pbB_t:"La proyección", pbB_recovery:"El capital se recupera en 12 meses mediante las distribuciones de ganancias del plan.",
    pbC_t:"El control", pbC_1:"Asamblea mensual de socios", pbC_2:"Voto ponderado por capital aportado", pbC_3:"Capital en custodia de tercero independiente",
    pbC_4:"Reservas de aranceles e impuestos antes de cada distribución", pbC_5:"Plazo de 36 meses, con revisiones a los 12 y a los 24",
    plan_private:"El plan operativo completo, con cifras, proveedores, logística y método, es un documento privado disponible bajo confidencialidad una vez admitido como socio.",
    skip:"Saltar al contenido", close:"Cerrar", menu:"Menú", nav_aria:"Secciones", print:"Imprimir",
    route_ai:"Ruta analizada con AI",
    stop_port:"Puerto", stop_customs:"Aduana", stop_warehouse:"Almacén", stop_distribution:"Distribución", stop_settlement:"Liquidación",
    demo:"Demostración",
    hero_kicker:"Norteamérica · Sectores estratégicos",
    hero_title:"Construimos el comercio que construye una nación.",
    hero_sub:"Compañía privada que ejecuta operaciones reales de importación, exportación, distribución y venta en sectores estratégicos de Norteamérica.",
    hero_trust:"Contamos con experiencia real y alianzas dentro de la industria.",
    hero_private:"Participación privada, por invitación y relación previa; no abierta al público.",
    cta_eval:"Solicitar evaluación privada",
    about_kicker:"Quiénes somos",
    about_title:"Forjamos a los jóvenes operadores del mañana.",
    about_seed:"Sumamos jóvenes con inclinación mecánica y los profesionalizamos junto a un coach de altísima experticia y un equipo fenomenal que comparte lo que sabe.",
    about_p1:"Cada operación es una LLC independiente con un grupo definido y privado de socios que ingresan por acuerdo escrito, asumen responsabilidades reales de gestión y participan de forma directa, transparente y trazable.",
    about_p2:"Los socios aportan capital y tiempo.",
    how_kicker:"Cómo funciona",
    how_title:"Una forma directa de ser parte del comercio que mueve al mundo.",
    step1_t:"Evaluación privada", step2_t:"Conversación inicial por WhatsApp", step3_t:"Llamada", step3_s:"Con confidencialidad antes de la llamada.", step4_t:"Acuerdo y custodia",
    ai_live:"AI · en tiempo real",
    ai_seal:"GOBERNADO POR AI",
    ai_label:"Administración gobernada por AI",
    ai_text:"La AI gobierna y valida en tiempo real cada movimiento de la operación:",
    ai_f1:"Inventario",
    ai_f2:"Logística",
    ai_f3:"Liquidación",
    ai_f4:"Decisiones de socios",
    ai_close:"La gente lidera. La AI minimiza el error.",
    prog_kicker:"Programas",
    prog_round:"Ronda 01",
    prog_steel_status:"En preparación · Evaluación abierta",
    prog_hold_status:"En estudio técnico",
    prog_no_raise:"Sin captación",
    pgm1_name:"Acero", pgm1_hook:"El músculo de la infraestructura norteamericana.",
    pgm1_body:"Operaciones reales de importación y exportación de acero, un sector impulsado por el gobierno que nunca deja de moverse y la columna de lo que operamos.",
    pgm2_name:"Aluminio", pgm2_hook:"Ligero, resistente e imparable.",
    pgm2_body:"Operaciones de importación y exportación de aluminio, un metal esencial para la industria, el transporte y la energía del futuro.",
    pgm3_name:"Agro", pgm3_hook:"Donde las Américas alimentan al mundo.",
    pgm3_body:"Comercio de productos frescos en ambos sentidos: frutas y verduras premium de México hacia Estados Unidos y Canadá (aguacate, berries, cítricos, tomate y chiles), y productos base de EE. UU. como queso, soya y maíz hacia México y el mundo. Una categoría de altísima demanda y rotación constante.",
    pgm4_name:"Semiconductores", pgm4_hook:"El motor de la economía digital.",
    pgm4_body:"Operaciones en uno de los sectores más estratégicos de la actualidad, impulsado por programas gubernamentales de gran alcance para asegurar el suministro nacional. Los chips y semiconductores son el núcleo de la tecnología, la defensa y las industrias del futuro.",
    pgm5_name:"Energía y químicos", pgm5_hook:"La energía de la industria y de lo que viene.",
    pgm5_body:"Operaciones de insumos industriales esenciales y energía, incluyendo paneles solares, baterías y componentes relacionados en el corazón de la transición energética. Un pilar estratégico que el gobierno prioriza para impulsar la manufactura, la infraestructura y las cadenas de suministro de energía limpia a gran escala.",
    fund_plan_cta:"Ver el plan operativo completo",
    ev_kicker:"Evidencia",
    ev_title:"Prueba piloto 2025",
    ev_lede:"Un ciclo de importación completo ejecutado por Presston: importado, vendido y cobrado.",
    ev_note:"Documentos públicos protegidos; venta y cobro solo en privado bajo confidencialidad.",
    pp_tag:"Documento privado",
    pp_title:"Plan operativo completo",
    pp_title_dim:"— documento privado",
    pp_desc:"El documento íntegro, con todo su detalle operativo: la economía, la cadencia, el capital y los resultados. Se abre con un código personal, entregado bajo confidencialidad.",
    pp_label:"Código de acceso",
    pp_placeholder:"Escribe tu código",
    pp_open:"Abrir",
    pp_empty:"Escribe el código de acceso.",
    pp_busy:"Verificando…",
    pp_err:"Código no válido. Verifica e intenta de nuevo.",
    pp_fail:"No se pudo abrir el documento. Intenta de nuevo en un momento.",
    pp_terms_pre:"Al abrirlo aceptas mantenerlo bajo confidencialidad.",
    pp_terms_link:"Ver términos",
    pp_unlocked_note:"Acceso verificado en esta visita.",
    pp_reopen:"Abrir el plan",
    pv_note:"Documento privado — bajo confidencialidad",
    pv_close:"Cerrar",
    evidence_docs_badge:"Ver documentos", evidence_photos_badge:"Ver fotos", evidence_plan_badge:"Ver plan completo",
    fund_kicker:"Financiamiento",
    fund_proj:"Proyecto en recaudación",
    fund_anon:"aporte anónimo",
    fund_min:"Mínimo",
    fund_min_share:"= {pct} de la ronda",
    fund_dist_lab:"Distribuciones", fund_dist_txt:"Utilidades libres mensuales pro-rata tras reponer el ciclo, costos y reservas.",
    fund_cap_lab:"Capital", cap1_t:"Recuperación en 12 meses:", cap1_d:"vía las distribuciones mensuales de ganancias recuperas lo aportado.", cap2_t:"Tu capital sigue trabajando:", cap2_d:"la base permanece en la operación y tu participación se valoriza a medida que la empresa crece.", cap3_t:"Devolución al liquidar:", cap3_d:"al cierre del programa se te devuelve el capital.",
    fund_term_lab:"Plazo", fund_term_txt:"36 meses, con revisiones a los 12 y a los 24, y liquidación ordenada en 90–120 días.",
    fund_trust_lab:"Custodia", fund_trust_title:"Cuenta de propósito restringido",
    fund_trust_text:"Cuenta de propósito restringido bajo escrow/custodia independiente.",
    fund_cand:"Candidato en evaluación",
    trace_kicker:"Trazabilidad y gobernanza",
    trace_an_lab:"Análisis continuo",
    trace_k1:"Mercancía", trace_v1:"Geolocalizada", trace_k2:"Monitoreo", trace_v2:"Cámaras en vivo",
    trace_k3:"Inventario", trace_v3:"Documentado", trace_k4:"Liquidación", trace_v4:"Auditable",
    gov_lab:"Gobernanza", gov_title:"Los socios deciden en conjunto.",
    gov_r1:"Asamblea mensual.", gov_r2:"Voto proporcional al capital.", gov_r3:"Decisiones ordinarias por mayoría ponderada.",
    gov_r4:"Cambios estructurales: 75% del capital + aprobación de la administración.",
    gov_prop_lab:"Propuestas en votación",
    gov_p1:"Ampliar la distribución a una segunda ciudad", gov_p2:"Priorizar acero sobre aluminio en la próxima ronda", gov_p3:"Sumar un segundo proveedor como respaldo",
    faq_kicker:"Preguntas frecuentes",
    fq1:"¿Qué significa ser socio?",
    fa1:"Te conviertes en miembro de una LLC independiente creada para una operación de comercio específica. Tienes una participación real, asumes responsabilidades reales y participas directamente en su ejecución. La membresía es privada y por contrato. No es comprar acciones ni un producto financiero ofrecido al público.",
    fq2:"¿Cómo hago seguimiento de la operación?",
    fa2:"A través de nuestra plataforma de trazabilidad. Tienes tracking de la naviera en tiempo real, cámaras y localización en nuestro centro de procesamiento y en los vehículos de distribución, y una plataforma contable con sistema POS que muestra cifras en tiempo real. Como socio, sabes siempre dónde está la mercancía y cómo se está liquidando.",
    fq3:"¿Cómo se distribuyen los resultados?",
    fa3:"Las distribuciones son utilidades libres mensuales, pro-rata, tras reponer el ciclo, costos y reservas. Con ellas recuperas lo aportado en 12 meses; la base de capital permanece en la operación y se te devuelve al liquidar.",
    fq4:"¿Cómo es la salida?",
    fa4:"Es una salida ordenada: la participación se ofrece primero a los socios, después a la compañía y luego a un comprador aprobado, con valoración objetiva y pago escalonado.",
    fq5:"¿Cuál es la estructura legal?",
    fa5:"Cada operación es una LLC independiente con un grupo definido y privado de socios que ingresan por acuerdo escrito. El capital se mantiene en una cuenta de propósito restringido bajo escrow/custodia independiente; los candidatos a custodio están en evaluación. Recomendamos asesoría legal y financiera independiente.",
    fq6:"¿Cuánto necesito para participar?",
    fa6:"El aporte mínimo es de $25,000.",
    fq7:"¿Qué pasa tras la evaluación?",
    fa7:"Sigue una conversación inicial por WhatsApp, después una llamada con confidencialidad previa y, si avanzamos, el acuerdo escrito y la custodia.",
    fq8:"¿Presston garantiza rendimientos?",
    fa8:"No. Los resultados provienen de operaciones reales de comercio y pueden variar; no garantizamos rendimientos. Lo que sí hacemos es estudiar a fondo cada operación y gestionar el riesgo de forma activa, para que nuestros socios participen con claridad y confianza.",
    fq9:"¿Qué es la Referencia?",
    fa9:"Es la persona que te presentó. La participación es por invitación y relación previa, por eso te la pedimos en el formulario.",
    contact_kicker:"Contacto",
    contact_l1:"Contacto comercial: por completar",
    contact_l2:"WhatsApp comercial: por completar",
    foot_pie:"Participación privada; no es una oferta pública. Se recomienda asesoría legal y financiera independiente.",
    disclaimer:"Presston Strategic Partners no comercializa valores, no ofrece inversiones al público ni garantiza rendimientos financieros. La participación es privada y está limitada a socios identificados admitidos mediante acuerdo escrito; no está abierta al público general ni constituye oferta o solicitud de inversión. Cada operación es una LLC independiente; el capital de los socios se mantendrá en una cuenta de propósito restringido bajo escrow/custodia independiente, hoy con candidatos en evaluación. La información aquí contenida es de carácter general y está sujeta a revisión, elegibilidad y a la ley aplicable.",
    foot_note:"La membresía es privada y por acuerdo escrito.",
    modal_sub:"Solicitud sobre",
    f_proto_note:"Formulario de prototipo: el envío está deshabilitado y no se transmite ningún dato.",
    f_ref:"Referencia: ¿quién te presentó?",
    f_submit:"Enviar (deshabilitado)", f_cancel:"Cerrar",
    f_note:"Esto es una solicitud de información, no una solicitud de compra, y no genera obligación alguna. La participación es privada y está sujeta a acuerdo escrito y a la ley aplicable.",
  },
  en:{
    scope:"Model projection over 3\u00a0years / 3\u00a0cities",
    pbA_y1:"Year 1 · city 1", pbA_containers:"containers", pbA_steady:"Steady state, per city", pbA_peryear:"per year",
    pbA_c2:"City 2", pbA_from2:"joins in year 2", pbA_c3:"City 3", pbA_from3:"joins in year 3",
    pbB_y1:"Year 1", pbB_y2:"Year 2", pbB_dist3:"Cumulative distributions over 3 years", pbB_total3:"3-year total, including the value of the 15% stake",
    plan_kicker:"Operating plan",
    plan_title:"The operating plan, in three blocks.",
    pbA_t:"The economics", pbA_per:"Per container", pbA_landed:"Landed cost", pbA_sale:"Sale value", pbA_gross:"Gross per container",
    pbA_pace:"Pace", pbB_t:"The projection", pbB_recovery:"Capital is recovered in 12 months through the plan's profit distributions.",
    pbC_t:"The controls", pbC_1:"Monthly partners' assembly", pbC_2:"Votes weighted by capital contributed", pbC_3:"Capital held in custody by an independent third party",
    pbC_4:"Tariff and tax reserves before every distribution", pbC_5:"36-month term, with reviews at months 12 and 24",
    plan_private:"The full operating plan, with figures, suppliers, logistics, and method, is a private document available under confidentiality once you are admitted as a partner.",
    skip:"Skip to content", close:"Close", menu:"Menu", nav_aria:"Sections", print:"Print",
    route_ai:"Route analyzed with AI",
    stop_port:"Port", stop_customs:"Customs", stop_warehouse:"Warehouse", stop_distribution:"Distribution", stop_settlement:"Settlement",
    demo:"Demonstration",
    hero_kicker:"North America · Strategic sectors",
    hero_title:"We build the trade that builds a nation.",
    hero_sub:"A private company running real import, export, distribution, and sales operations in strategic sectors across North America.",
    hero_trust:"We bring real experience and alliances within the industry.",
    hero_private:"Private participation, by invitation and prior relationship; not open to the public.",
    cta_eval:"Request a private evaluation",
    about_kicker:"Who we are",
    about_title:"We forge the young operators of tomorrow.",
    about_seed:"Young people with a mechanical bent join us and become professionals, guided by a coach of the highest expertise and a phenomenal team that shares what it knows.",
    about_p1:"Each operation is an independent LLC with a defined, private group of partners who join by written agreement, take on real management responsibilities, and participate directly, transparently, and traceably.",
    about_p2:"Partners contribute capital and time.",
    how_kicker:"How it works",
    how_title:"A direct way to be part of the trade that moves the world.",
    step1_t:"Private evaluation", step2_t:"Initial conversation on WhatsApp", step3_t:"Call", step3_s:"With confidentiality in place before the call.", step4_t:"Agreement and custody",
    ai_live:"AI · real time",
    ai_seal:"AI GOVERNED",
    ai_label:"AI-governed administration",
    ai_text:"AI governs and validates every movement of the operation in real time:",
    ai_f1:"Inventory",
    ai_f2:"Logistics",
    ai_f3:"Settlement",
    ai_f4:"Partner decisions",
    ai_close:"People lead. AI minimizes error.",
    prog_kicker:"Programs",
    prog_round:"Round 01",
    prog_steel_status:"In preparation · Evaluation open",
    prog_hold_status:"In technical study",
    prog_no_raise:"Not raising capital",
    pgm1_name:"Steel", pgm1_hook:"The muscle of North American infrastructure.",
    pgm1_body:"Real import and export operations in steel, a government-driven sector that never stops moving and the backbone of what we run.",
    pgm2_name:"Aluminum", pgm2_hook:"Light, resilient, unstoppable.",
    pgm2_body:"Import and export operations in aluminum, a metal essential to industry, transport, and the energy of the future.",
    pgm3_name:"Agro", pgm3_hook:"Where the Americas feed the world.",
    pgm3_body:"Two-way produce trade: premium Mexican fruits and vegetables into the US and Canada (avocado, berries, citrus, tomatoes, peppers), and US staples such as cheese, soybeans, and corn out to Mexico and worldwide. A high-demand category with constant turnover.",
    pgm4_name:"Semiconductors", pgm4_hook:"The engine of the digital economy.",
    pgm4_body:"Operations in one of the most strategic sectors of the decade, propelled by landmark government programs to secure domestic supply. Chips and semiconductors power technology, defense, and the industries of the future.",
    pgm5_name:"Energy & Chemicals", pgm5_hook:"Powering industry and what comes next.",
    pgm5_body:"Operations across essential industrial inputs and energy, including solar panels, batteries, and related components at the core of the energy transition. A strategic backbone the government prioritizes to power manufacturing, infrastructure, and clean-energy supply chains at scale.",
    fund_plan_cta:"View the full operating plan",
    ev_kicker:"Evidence",
    ev_title:"2025 pilot",
    ev_lede:"A complete import cycle executed by Presston: imported, sold, and collected.",
    ev_note:"Public documents are protected; sale and collection are shown only in private, under confidentiality.",
    pp_tag:"Private document",
    pp_title:"Full operating plan",
    pp_title_dim:"— private document",
    pp_desc:"The complete document, with all its operating detail: the economics, the cadence, the capital and the results. It opens with a personal code, shared under confidentiality.",
    pp_label:"Access code",
    pp_placeholder:"Enter your code",
    pp_open:"Open",
    pp_empty:"Enter the access code.",
    pp_busy:"Verifying…",
    pp_err:"Invalid code. Check it and try again.",
    pp_fail:"The document couldn't be opened. Please try again in a moment.",
    pp_terms_pre:"Opening it means you agree to keep it confidential.",
    pp_terms_link:"View terms",
    pp_unlocked_note:"Access verified for this visit.",
    pp_reopen:"Open the plan",
    pv_note:"Private document — under confidentiality",
    pv_close:"Close",
    evidence_docs_badge:"View documents", evidence_photos_badge:"View photos", evidence_plan_badge:"View full plan",
    fund_kicker:"Financing",
    fund_proj:"Project raising",
    fund_anon:"anonymous contribution",
    fund_min:"Minimum",
    fund_min_share:"= {pct} of the round",
    fund_dist_lab:"Distributions", fund_dist_txt:"Monthly free profits, pro rata, after replenishing the cycle, costs, and reserves.",
    fund_cap_lab:"Capital", cap1_t:"12-month recovery:", cap1_d:"through the monthly profit distributions, you recover what you contributed.", cap2_t:"Your capital keeps working:", cap2_d:"the base stays in the operation and your stake gains value as the company grows.", cap3_t:"Return at liquidation:", cap3_d:"when the program closes, your capital is returned to you.",
    fund_term_lab:"Term", fund_term_txt:"36 months, with reviews at months 12 and 24, and an orderly liquidation over 90–120 days.",
    fund_trust_lab:"Custody", fund_trust_title:"Restricted-purpose account",
    fund_trust_text:"Restricted-purpose account under independent escrow/custody.",
    fund_cand:"Candidate under evaluation",
    trace_kicker:"Traceability and governance",
    trace_an_lab:"Continuous analysis",
    trace_k1:"Merchandise", trace_v1:"Geolocated", trace_k2:"Monitoring", trace_v2:"Live cameras",
    trace_k3:"Inventory", trace_v3:"Documented", trace_k4:"Settlement", trace_v4:"Auditable",
    gov_lab:"Governance", gov_title:"Partners decide together.",
    gov_r1:"Monthly assembly.", gov_r2:"Votes proportional to capital.", gov_r3:"Ordinary decisions by weighted majority.",
    gov_r4:"Structural changes: 75% of capital + approval by the administration.",
    gov_prop_lab:"Proposals under vote",
    gov_p1:"Expand distribution to a second city", gov_p2:"Prioritize steel over aluminum next round", gov_p3:"Add a second supplier for redundancy",
    faq_kicker:"Frequently asked questions",
    fq1:"What does it mean to be a partner?",
    fa1:"You become a member of an independent LLC created for a specific trade operation. You hold a real stake, take on real responsibilities, and take part directly in how it runs. Membership is private and by agreement. It is not buying shares, and it is not a financial product offered to the public.",
    fq2:"How do I track the operation?",
    fa2:"Through our traceability platform. You get real-time shipping tracking from the carrier, live cameras and tracking at our processing center and distribution vehicles, and an accounting platform with POS that shows figures in real time. As a member you always know where the merchandise is and how it is being settled.",
    fq3:"How are results distributed?",
    fa3:"Distributions are monthly free profits, pro rata, after replenishing the cycle, costs, and reserves. Through them you recover your contribution in 12 months; the capital base stays in the operation and is returned to you at liquidation.",
    fq4:"How does exit work?",
    fa4:"It is an orderly exit: the stake is offered first to the partners, then to the company, and then to an approved buyer, with an objective valuation and staggered payment.",
    fq5:"What is the legal structure?",
    fa5:"Each operation is an independent LLC with a defined, private group of partners who join by written agreement. Capital is held in a restricted-purpose account under independent escrow/custody; custodian candidates are under evaluation. We recommend independent legal and financial advice.",
    fq6:"How much do I need to participate?",
    fa6:"The minimum contribution is $25,000.",
    fq7:"What happens after the evaluation?",
    fa7:"An initial conversation on WhatsApp follows, then a call with confidentiality in place beforehand and, if we move forward, the written agreement and custody.",
    fq8:"Does Presston guarantee returns?",
    fa8:"No. Results come from real trade operations and can vary; we do not guarantee returns. What we do is study each operation thoroughly and manage risk actively, so our members can take part with clarity and confidence.",
    fq9:"What is the Reference?",
    fa9:"It is the person who introduced you. Participation is by invitation and prior relationship, which is why we ask for it in the form.",
    contact_kicker:"Contact",
    contact_l1:"Business contact: to be completed",
    contact_l2:"Business WhatsApp: to be completed",
    foot_pie:"Private participation; this is not a public offering. Independent legal and financial advice is recommended.",
    disclaimer:"Presston Strategic Partners does not deal in securities, does not offer investments to the public, and does not guarantee financial returns. Participation is private and limited to identified partners admitted by written agreement; it is not open to the general public and is not an offer or solicitation to invest. Each operation is an independent LLC; partner capital will be held in a restricted-purpose account under independent escrow/custody, with candidates currently under evaluation. The information herein is general and subject to review, eligibility, and applicable law.",
    foot_note:"Membership is private and by written agreement.",
    modal_sub:"Request about",
    f_proto_note:"Prototype form: submission is disabled and no data is transmitted.",
    f_ref:"Reference: who introduced you?",
    f_submit:"Send (disabled)", f_cancel:"Close",
    f_note:"This is a request for information, not an application to buy anything, and creates no obligation. Participation is private and subject to a written agreement and applicable law.",
  },
  zh:{
    scope:"模型预测：3 年 / 3 座城市",
    pbA_y1:"第 1 年 · 城市 1", pbA_containers:"个集装箱", pbA_steady:"稳定运营期，每座城市", pbA_peryear:"每年",
    pbA_c2:"城市 2", pbA_from2:"第 2 年加入", pbA_c3:"城市 3", pbA_from3:"第 3 年加入",
    pbB_y1:"第 1 年", pbB_y2:"第 2 年", pbB_dist3:"3 年累计分配", pbB_total3:"3 年合计（含 15% 股权价值）",
    plan_kicker:"运营计划",
    plan_title:"运营计划，分为三个板块。",
    pbA_t:"经济模型", pbA_per:"每个集装箱", pbA_landed:"到岸成本", pbA_sale:"销售价值", pbA_gross:"每箱毛利",
    pbA_pace:"节奏", pbB_t:"预测", pbB_recovery:"资本通过计划中的利润分配在 12 个月内收回。",
    pbC_t:"管控", pbC_1:"每月合伙人大会", pbC_2:"按出资额加权投票", pbC_3:"资本由独立第三方托管",
    pbC_4:"每次分配前预留关税与税费储备", pbC_5:"36 个月期限，第 12 和第 24 个月进行评估",
    plan_private:"完整运营计划包含数据、供应商、物流与方法，为私密文件，在您获准成为合伙人后，可在保密条件下查阅。",
    skip:"跳至内容", close:"关闭", menu:"菜单", nav_aria:"页面导航", print:"打印",
    route_ai:"AI 分析的路线",
    stop_port:"港口", stop_customs:"海关", stop_warehouse:"仓库", stop_distribution:"配送", stop_settlement:"结算",
    demo:"演示",
    hero_kicker:"北美 · 战略性行业",
    hero_title:"我们构建建设国家的贸易。",
    hero_sub:"一家私营公司，在北美战略性行业中开展真实的进口、出口、分销与销售业务。",
    hero_trust:"我们拥有真实的行业经验，并在业内建立了合作关系。",
    hero_private:"私密参与，基于邀请与既有关系；不向公众开放。",
    cta_eval:"申请私密评估",
    about_kicker:"关于我们",
    about_title:"我们锻造明日的年轻运营者。",
    about_seed:"我们吸纳具有机械天赋的年轻人，由一位经验极其丰富的教练和一支乐于分享知识的出色团队带领，让他们成长为专业人才。",
    about_p1:"每一项业务都是一家独立的 LLC，拥有一个明确且私密的合伙人群体：他们通过书面协议加入，承担真实的管理责任，并以直接、透明、可追溯的方式参与。",
    about_p2:"合伙人投入资本与时间。",
    how_kicker:"运作方式",
    how_title:"参与推动世界运转之贸易的直接方式。",
    step1_t:"私密评估", step2_t:"通过 WhatsApp 初步沟通", step3_t:"通话", step3_s:"通话之前先确立保密。", step4_t:"协议与托管",
    ai_live:"AI · 实时",
    ai_seal:"AI 治理",
    ai_label:"由 AI 治理的管理",
    ai_text:"AI 实时治理并验证业务中的每一个动作：",
    ai_f1:"库存",
    ai_f2:"物流",
    ai_f3:"结算",
    ai_f4:"合伙人决策",
    ai_close:"人来引领，AI 将错误降到最低。",
    prog_kicker:"项目",
    prog_round:"第 01 轮",
    prog_steel_status:"筹备中 · 评估开放",
    prog_hold_status:"技术评估中",
    prog_no_raise:"不募集资金",
    pgm1_name:"钢铁", pgm1_hook:"北美基础设施的中坚力量。",
    pgm1_body:"钢铁的真实进出口业务，一个由政府推动、永不停歇的行业，也是我们运营的支柱。",
    pgm2_name:"铝", pgm2_hook:"轻盈、坚韧、势不可挡。",
    pgm2_body:"铝的进出口业务，一种对工业、运输和未来能源至关重要的金属。",
    pgm3_name:"农业", pgm3_hook:"美洲的餐桌，供给世界。",
    pgm3_body:"双向流动的生鲜与农产品贸易：将墨西哥优质果蔬（牛油果、浆果、柑橘、番茄与辣椒）输入美国和加拿大，同时把奶酪、大豆、玉米等美国主要农产品输往墨西哥及全球市场。这是一个需求极高、周转不断的品类。",
    pgm4_name:"半导体", pgm4_hook:"数字经济的引擎。",
    pgm4_body:"当今最具战略意义行业之一的相关业务，其背后有旨在巩固本土供应的重大政府举措推动。芯片与半导体是科技、国防及未来产业的核心。",
    pgm5_name:"能源与化工", pgm5_hook:"为工业与未来供能。",
    pgm5_body:"关键工业投入与能源产品的相关业务，包括太阳能板、电池及处于能源转型核心的相关组件。这是政府优先支持的战略支柱，为制造业、基础设施及清洁能源供应链提供大规模支撑。",
    fund_plan_cta:"查看完整运营计划",
    ev_kicker:"实证",
    ev_title:"2025 年试点",
    ev_lede:"由 Presston 执行的一个完整进口周期：进口、销售并完成收款。",
    ev_note:"公开文件已做保护处理；销售与收款信息仅在保密条件下私下提供。",
    pp_tag:"私密文件",
    pp_title:"完整运营计划",
    pp_title_dim:"— 私密文件",
    pp_desc:"完整文件，包含全部运营细节：经济模型、节奏、资金与业绩。凭个人访问码打开，在保密条件下提供。",
    pp_label:"访问码",
    pp_placeholder:"输入您的访问码",
    pp_open:"打开",
    pp_empty:"请输入访问码。",
    pp_busy:"正在验证…",
    pp_err:"访问码无效，请核对后重试。",
    pp_fail:"文件暂时无法打开，请稍后重试。",
    pp_terms_pre:"打开即表示您同意对其保密。",
    pp_terms_link:"查看条款",
    pp_unlocked_note:"本次访问已验证。",
    pp_reopen:"打开计划",
    pv_note:"私密文件 — 受保密约束",
    pv_close:"关闭",
    evidence_docs_badge:"查看文件", evidence_photos_badge:"查看照片", evidence_plan_badge:"查看完整计划",
    fund_kicker:"融资",
    fund_proj:"募集中的项目",
    fund_anon:"匿名出资",
    fund_min:"最低出资",
    fund_min_share:"= 本轮的 {pct}",
    fund_dist_lab:"分配", fund_dist_txt:"在补足周期、成本与储备后，按比例每月分配可支配利润。",
    fund_cap_lab:"资本", cap1_t:"12 个月收回：", cap1_d:"通过每月利润分配，收回您的出资。", cap2_t:"资本持续运作：", cap2_d:"资本基础留在业务中，您的份额随公司成长而增值。", cap3_t:"清算时返还：", cap3_d:"项目结束时，向您返还资本。",
    fund_term_lab:"期限", fund_term_txt:"36 个月，第 12 和第 24 个月进行评估，并在 90–120 天内有序清算。",
    fund_trust_lab:"托管", fund_trust_title:"限定用途账户",
    fund_trust_text:"由独立托管（escrow）机构管理的限定用途账户。",
    fund_cand:"候选机构，评估中",
    trace_kicker:"可追溯性与治理",
    trace_an_lab:"持续分析",
    trace_k1:"货物", trace_v1:"已定位", trace_k2:"监控", trace_v2:"实时摄像",
    trace_k3:"库存", trace_v3:"有完整记录", trace_k4:"结算", trace_v4:"可审计",
    gov_lab:"治理", gov_title:"合伙人共同决策。",
    gov_r1:"每月召开合伙人大会。", gov_r2:"按出资比例投票。", gov_r3:"日常决策以加权多数通过。",
    gov_r4:"结构性变更：需 75% 资本同意并经管理层批准。",
    gov_prop_lab:"投票中的提案",
    gov_p1:"将配送扩展到第二座城市", gov_p2:"下一轮优先钢铁而非铝", gov_p3:"增加第二家供应商以增强保障",
    faq_kicker:"常见问题",
    fq1:"成为合伙人意味着什么？",
    fa1:"您成为一家为特定贸易业务而设立的独立 LLC 的成员。您拥有真实的份额，承担真实的责任，并直接参与其运作。成员资格为私密且基于协议。这不是购买股票，也不是面向公众提供的金融产品。",
    fq2:"我如何追踪业务进展？",
    fa2:"通过我们的可追溯平台。您可获得承运方提供的实时物流追踪、我们处理中心与配送车辆的实时摄像与定位，以及带 POS 的会计平台实时显示数据。作为成员，您始终清楚货物身在何处、如何结算。",
    fq3:"收益如何分配？",
    fa3:"分配为每月可支配利润，在补足周期、成本与储备后按比例分配。您通过分配在 12 个月内收回出资；资本基础留在业务中，并在清算时返还给您。",
    fq4:"如何退出？",
    fa4:"退出有序进行：份额依次优先提供给其他合伙人、公司，然后是经批准的买方，采用客观估值并分期支付。",
    fq5:"法律结构是怎样的？",
    fa5:"每一项业务都是一家独立的 LLC，由一个明确且私密的合伙人群体通过书面协议加入。资本存放于由独立托管机构管理的限定用途账户；托管候选机构正在评估中。我们建议您寻求独立的法律与财务意见。",
    fq6:"参与需要多少资金？",
    fa6:"最低出资为 25,000 美元。",
    fq7:"评估之后会怎样？",
    fa7:"接下来是通过 WhatsApp 的初步沟通，然后是事先确立保密的通话；如果双方继续推进，将签署书面协议并安排托管。",
    fq8:"Presston 保证回报吗？",
    fa8:"不保证。收益来自真实的贸易业务，会有波动；我们不保证回报。我们所做的是对每一项业务进行深入研究并主动管理风险，让成员能够清晰、放心地参与。",
    fq9:"什么是“推荐人”？",
    fa9:"即介绍您的人。参与基于邀请与既有关系，因此我们会在表格中询问。",
    contact_kicker:"联系",
    contact_l1:"商务联系：待补充",
    contact_l2:"商务 WhatsApp：待补充",
    foot_pie:"私密参与；并非公开发行。建议寻求独立的法律与财务意见。",
    disclaimer:"Presston Strategic Partners 不经营证券，不向公众提供投资，也不保证任何财务回报。参与为私密性质，仅限于通过书面协议获准加入的已识别合伙人；不向公众开放，且不构成任何投资要约或招揽。每一项业务均为独立的 LLC；合伙人资本将存放于由独立托管机构管理的限定用途账户，目前候选机构正在评估中。本网站所载信息仅具一般性质，须经审核、资格核验并符合适用法律。",
    foot_note:"成员资格为私密且基于书面协议。",
    modal_sub:"申请项目：",
    f_proto_note:"原型表单：提交功能已停用，不会传输任何数据。",
    f_ref:"推荐人：谁介绍您来的？",
    f_submit:"发送（已停用）", f_cancel:"关闭",
    f_note:"这是信息咨询，并非购买申请，不产生任何义务。参与为私密性质，须签署书面协议并符合适用法律。",
  }
};
const I18N = {};
["es","en","zh"].forEach(l=>{ I18N[l] = Object.assign({}, LEGACY_I18N[l] || {}, I18N_NEW[l]); });

/*@@LEGAL_TEXT@@*/

const FUNDING = {
  goal: 120000,        // Meta — punto 7
  committed: 5600,     // aporte anónimo
  min: 25000,
  currency: "USD"
};
const COORDS = [
  ["22.15°N / 101.99°W","LAT 22.15 · LON −101.99"],
  ["25.79°N / 100.31°W","LAT 25.79 · LON −100.31"],
  ["31.76°N / 106.49°W","LAT 31.76 · LON −106.49"],
  ["32.71°N / 117.16°W","LAT 32.71 · LON −117.16"],
  ["43.65°N / 79.38°W","LAT 43.65 · LON −79.38"]
];
const IMPORT_DOCS = [2,3,4,5,6,7,1].map(n=> ASSET + "evidence/imports/doc-" + n + ".jpg");
const LOGISTICS_PHOTOS = ["container-1","container-2","truck","van-loading","warehouse"].map(n=> ASSET + "evidence/" + n + ".jpg");

let lang = "en";
// English is the reference language: any missing key falls back to it.
const t = (k)=> (I18N[lang] && I18N[lang][k] !== undefined ? I18N[lang][k] : (I18N.en[k] !== undefined ? I18N.en[k] : (I18N.es[k] || "")));
const clamp = (n,a,b)=> Math.max(a, Math.min(b,n));
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const supportsWebP = (function(){ try { return document.createElement("canvas").toDataURL("image/webp").indexOf("data:image/webp") === 0; } catch(e){ return false; } })();
const withWebp = (jpgPath)=> supportsWebP ? jpgPath.replace(/\.jpe?g$/i, ".webp") : jpgPath;
if (prefersReduced) document.body.classList.add("reduced");
const root = document.documentElement;

/* ---------- Scroll lock (modals, private plan viewer) — Lenis-aware ---------- */
let lenis = null, lockCount = 0;
function lockScroll(){
  lockCount++;
  root.style.overflow = "hidden";
  if (lenis) lenis.stop();
}
function unlockScroll(){
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount) return;
  root.style.overflow = "";
  document.body.style.overflow = "";
  if (lenis) lenis.start();
}

/*@@ANALYTICS@@*/

/* ============ Funding (Demostración) ============ */
const money = (n)=> "$" + Math.round(n).toLocaleString("en-US");
const fundMoney = (n)=> money(n);
function renderFunding(){
  const f = FUNDING;
  const pct = f.goal > 0 ? (f.committed / f.goal * 100) : 0;
  document.getElementById("fundName").textContent = t("pgm1_name") + " · " + t("prog_round");
  document.getElementById("fundPct").textContent = pct.toFixed(2);
  document.getElementById("fundGoal").textContent = money(f.goal);
  document.getElementById("fundCommitted").textContent = money(f.committed);
  document.getElementById("fundRemaining").textContent = money(Math.max(0, f.goal - f.committed));
  document.getElementById("fundMin").textContent = money(f.min);
  document.getElementById("fundMinShare").textContent = t("fund_min_share").replace("{pct}", (f.min / f.goal * 100).toFixed(2) + "%");
  document.getElementById("fundDeployTxt").textContent = f.committed >= f.goal ? t("fund_reached") : t("fund_deploy");
  fundFillTarget = clamp(pct / 100, 0, 1);
  if (fundFillShown) document.getElementById("fundFill").style.transform = "scaleY(" + fundFillTarget + ")";
}
let fundFillTarget = 0, fundFillShown = false;
(function initFundFill(){
  const panel = document.querySelector(".fund-panel");
  const show = ()=>{ fundFillShown = true; document.getElementById("fundFill").style.transform = "scaleY(" + fundFillTarget + ")"; };
  if (!panel || !("IntersectionObserver" in window)) { show(); return; }
  const io = new IntersectionObserver((es)=>{ es.forEach(e=>{ if (e.isIntersecting){ show(); io.disconnect(); } }); }, { threshold:.3 });
  io.observe(panel);
})();

/*@@CALC_FN@@*/

/*@@EVIDENCE@@*/

/* Evidence lightbox keyboard (the original shared this handler with the plan viewer). */
document.addEventListener("keydown",(e)=>{
  if (!evLb.classList.contains("open")) return;
  if (e.key==="Escape") evLbClose_(); else if (e.key==="ArrowLeft") evLbStep(-1); else if (e.key==="ArrowRight") evLbStep(1);
});

/* ============ Apply modal — prototype: submission disabled, never fakes a send ============ */
const overlay = document.getElementById("overlay");
let applyLastFocus = null;
function programLabel(id){
  if (id === "steel") return t("pgm1_name") + " · " + t("prog_round");
  return t("pgm1_name") + " · " + t("prog_round");
}
function openApply(programId){
  applyLastFocus = document.activeElement;
  document.getElementById("fProgram").value = programId;
  document.getElementById("modalProgram").textContent = programLabel(programId);
  overlay.classList.add("open"); lockScroll();
  setTimeout(()=>{ const c = document.getElementById("modalClose"); if (c) c.focus(); }, 60);
  trackEvent("apply_opened", { program: programId });
}
function closeApply(){
  if (!overlay.classList.contains("open")) return;
  overlay.classList.remove("open"); unlockScroll();
  if (applyLastFocus) applyLastFocus.focus();
}
document.addEventListener("click",(e)=>{
  const trigger = e.target.closest("[data-open-apply]");
  if (trigger){ e.preventDefault(); openApply(trigger.getAttribute("data-program") || "steel"); }
});
document.getElementById("modalClose").addEventListener("click", closeApply);
document.getElementById("cancelBtn").addEventListener("click", closeApply);
overlay.addEventListener("click",(e)=>{ if (e.target === overlay) closeApply(); });
document.addEventListener("keydown",(e)=>{ if (e.key === "Escape" && overlay.classList.contains("open")) closeApply(); });
document.getElementById("applyForm").addEventListener("submit",(e)=>{ e.preventDefault(); });

/* ============ WhatsApp links ============ */
function updateWaLinks(){
  const msg = encodeURIComponent(t("wa_prefill"));
  document.querySelectorAll(".wa-link").forEach(a=>{
    const base = a.getAttribute("data-wa-base") || a.href;
    a.href = base + "?text=" + msg;
  });
  const wa = document.getElementById("waFloat");
  if (wa) wa.setAttribute("aria-label", t("wa_label"));
}
setTimeout(()=> document.getElementById("waFloat").classList.add("show"), 1400);

/* ============ Language ============ */
function applyLang(l){
  const changed = lang !== l;
  lang = I18N[l] ? l : "en";
  try { sessionStorage.setItem("presstonLang", lang); } catch(e){}
  root.setAttribute("data-lang", lang);
  root.setAttribute("lang", lang === "zh" ? "zh-CN" : lang);
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const k = el.getAttribute("data-i18n"); const v = t(k);
    if (v !== "") el.textContent = v;
  });
  document.querySelectorAll("[data-i18n-aria]").forEach(el=>{ const v = t(el.getAttribute("data-i18n-aria")); if (v) el.setAttribute("aria-label", v); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el=>{ const v = t(el.getAttribute("data-i18n-placeholder")); if (v) el.setAttribute("placeholder", v); });
  document.querySelectorAll("[data-set-lang]").forEach(b=> b.setAttribute("aria-pressed", b.getAttribute("data-set-lang") === lang ? "true" : "false"));
  updateWaLinks();
  renderFunding(); renderCalc();
  if (typeof renderGateCheckboxLabel === "function") renderGateCheckboxLabel();
  if (typeof renderLegalBody === "function" && legalOverlay && legalOverlay.classList.contains("open")) renderLegalBody();
  if (typeof PrivatePlan !== "undefined") PrivatePlan.onLangChange();
  Stage.onLangChange();
  if (changed) trackEvent("language_selected", { lang: lang });
}
document.querySelectorAll("[data-set-lang]").forEach(b=> b.addEventListener("click", ()=> applyLang(b.getAttribute("data-set-lang"))));

/* ============ Nav ============ */
const navWrap = document.getElementById("navWrap");
const navMenuBtn = document.getElementById("navMenuBtn");
const navDrop = document.getElementById("navDrop");
function closeNavDrop(){ navDrop.classList.remove("open"); navMenuBtn.setAttribute("aria-expanded","false"); }
navMenuBtn.addEventListener("click", ()=>{ const open = navDrop.classList.toggle("open"); navMenuBtn.setAttribute("aria-expanded", open ? "true" : "false"); });
navDrop.querySelectorAll("[data-set-lang]").forEach(b=> b.addEventListener("click", closeNavDrop));
document.addEventListener("click",(e)=>{ if (navDrop.classList.contains("open") && !navDrop.contains(e.target) && !navMenuBtn.contains(e.target)) closeNavDrop(); });
document.querySelectorAll("[data-goto]").forEach(a=> a.addEventListener("click",(e)=>{ e.preventDefault(); closeNavDrop(); Stage.goTo(a.getAttribute("data-goto")); }));

/* ============================================================
   STAGE ENGINE
   One fixed backdrop (the stage) + scenes in document order.
   - Stage scenes: a sticky frame inside a tall spacer; consecutive stage
     scenes overlap by one viewport, so the frame never travels — only
     the content inside it changes (600 ms in / 400 ms out, ≤24 px).
   - Flow scenes (Evidencia, Financiamiento, FAQ): the justified hybrid
     exception — normal scroll over the same stage.
   - masterTimeline: one GSAP timeline scrubbed by the global progress
     (0→1) with a label per scene; it drives the route rail and the slow
     camera on the port. Environment swaps (video layers, scrim, data grid)
     are time-based cross-fades triggered when a scene takes the stage.
   - Snap: the wheel/touch advances beats and scenes, never loose pixels,
     inside the staged chains; flow sections scroll freely.
   ============================================================ */
const Stage = (function(){
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);
  const motion = hasGSAP && !prefersReduced && root.classList.contains("motion");
  if (!motion) root.classList.remove("motion");

  const mqMobile = window.matchMedia("(max-width:640px)");
  const mqSide = window.matchMedia("(min-width:1025px)");
  const scenes = Array.from(document.querySelectorAll("main > .scene")).map((el,i)=>({
    el, id: el.id, index: i,
    stage: el.classList.contains("scene--stage"),
    beats: parseInt(el.style.getPropertyValue("--beats"), 10) || 1,
    bd: el.dataset.bd || "port",
    scrim: parseFloat(el.dataset.scrim || ".5"),
    grid: parseFloat(el.dataset.grid || "0"),
    cam: el.dataset.cam ? el.dataset.cam.trim().split(/\s+/).map(Number) : null,
    content: el.querySelector(".scene-content"),
    staged: false, top: 0, h: 0, start: 0, end: 0, beat: -1
  }));
  const byId = {}; scenes.forEach(s=> byId[s.id] = s);
  const stageScenes = scenes.filter(s=> s.stage);

  /* ---- backdrop layers & videos ---- */
  const layers = {}; document.querySelectorAll(".bd-layer").forEach(l=> layers[l.dataset.bd] = l);
  const vidOf = (bd)=> layers[bd] ? layers[bd].querySelector("video") : null;
  const bdScrim = document.getElementById("bdScrim");
  const bdGrid = document.getElementById("bdGrid");
  const bdPortMove = document.getElementById("bdPortMove");
  let videosAllowed = false;
  function primeVideo(v){ if (!v || v._primed) return; v._primed = true; v.poster = withWebp(v.dataset.poster); }
  function loadVideo(v){
    if (!v || v._loaded || !videosAllowed || prefersReduced) return;
    primeVideo(v); v._loaded = true;
    v.preload = "auto"; v.src = v.dataset.src;
    v.addEventListener("error", ()=>{ v._failed = true; }, { once:true }); // poster stays as the scene
    try { v.load(); } catch(e){}
  }
  function playVideo(v){
    if (!v || prefersReduced || !videosAllowed) return;
    loadVideo(v);
    const p = v.play(); if (p && p.catch) p.catch(()=>{});
  }
  function pauseVideo(v){ if (v && !v.paused) try { v.pause(); } catch(e){} }

  /* ---- route rail ---- */
  const routeFill = document.getElementById("routeFill");
  const routeStops = Array.from(document.querySelectorAll(".route-stop"));
  const routeHere = document.getElementById("routeHere");
  function updateRoute(y){
    let here = 0;
    routeStops.forEach((li,k)=>{
      const s = byId[li.dataset.stop];
      const lit = k === 0 || (s && y >= stopY(s) - 2);
      li.classList.toggle("is-lit", lit);
      if (lit) here = k;
    });
    routeStops.forEach((li,k)=> li.classList.toggle("is-here", k === here));
    const lbl = routeStops[here].querySelector(".lbl");
    if (routeHere && lbl && routeHere.textContent !== lbl.textContent) routeHere.textContent = lbl.textContent;
  }
  function stopY(s){ return s.staged ? s.start : Math.max(0, s.top - vhPx * 0.5); }

  /* ---- nav state ---- */
  const NAV_OF = { hero:"hero", about:"hero", how:"how", programs:"programs", trace:"programs", evidence:"evidence", plan:"plan", funding:"plan", faq:"plan", contact:"plan" };
  const navLinks = document.querySelectorAll(".nav-links a, .nav-drop a");
  let lastNav = null, lastScrolled = null;
  function updateNav(y, sceneId){
    const id = NAV_OF[sceneId] || "hero";
    if (id !== lastNav){ lastNav = id; navLinks.forEach(a=> a.classList.toggle("active", a.getAttribute("data-goto") === id)); }
    const sc = y > 40;
    if (sc !== lastScrolled){ lastScrolled = sc; navWrap.classList.toggle("scrolled", sc); }
    const sheet = !!(byId[sceneId] && !byId[sceneId].stage);
    if (sheet !== lastSheet){ lastSheet = sheet; root.classList.toggle("in-sheet", sheet); }
    const hide = y > vhPx * 0.6 && dir > 0 && !navDrop.classList.contains("open");
    if (hide !== lastHide){ lastHide = hide; navWrap.classList.toggle("is-tucked", hide); }
  }
  let lastHide = null, lastSheet = null;

  /* ---- geometry ---- */
  let vhPx = innerHeight, maxScroll = 1;
  function beatLen(){ return (mqMobile.matches ? MOTION.BEAT_VH_MOBILE : MOTION.BEAT_VH) * vhPx; }
  function setVh(){
    vhPx = Math.max(1, innerHeight);
    root.style.setProperty("--vh", vhPx + "px");
    root.style.setProperty("--beat-len", beatLen() + "px");
  }
  function measure(){
    const y = window.scrollY || 0;
    scenes.forEach(s=>{
      const r = s.el.getBoundingClientRect();
      s.top = r.top + y; s.h = r.height;
      s.start = s.top; s.end = s.top + Math.max(0, s.h - vhPx);
    });
    maxScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  }
  function anchorsOf(s){
    const out = [];
    if (s.id === "hero"){ out.push(s.start); for (let k=1;k<s.beats;k++) out.push(s.start + (k + 0.5) / s.beats * (s.end - s.start)); return out; }
    for (let k=0;k<s.beats;k++) out.push(s.start + (k + 0.5) / s.beats * (s.end - s.start));
    return out;
  }
  function beatAt(s, y){
    if (s.end <= s.start) return 0;
    const p = clamp((y - s.start) / (s.end - s.start), 0, 0.9999);
    return Math.min(s.beats - 1, Math.floor(p * s.beats));
  }

  /* ---- fit check: the runtime escape hatch (regla absoluta) ----
     A stage scene whose tallest beat does not fit the frame on this
     device is left in normal flow instead of being cropped. */
  function fitScenes(){
    stageScenes.forEach(s=>{
      s.el.classList.add("is-staged");
      const g = s.content.querySelector(".grid12");
      g.style.alignSelf = "flex-start";
      const need = g.offsetHeight;
      g.style.alignSelf = "";
      const fits = need <= vhPx + 1;
      if (!fits){
        s.el.classList.remove("is-staged");
        gsap.set([s.content, ...s.content.querySelectorAll("[data-anim],[data-show]")], { clearProps:"all" });
      }
      s.staged = fits;
    });
  }

  /* ---- master timeline (scrubbed) ---- */
  let masterTL = null, masterST = null;
  function buildMaster(){
    masterTL.clear();
    const P = (y)=> clamp(y / maxScroll, 0, 1);
    const side = mqSide.matches;
    const axis = side ? "scaleY" : "scaleX";
    gsap.set(routeFill, side ? { scaleX:1, scaleY:0 } : { scaleY:1, scaleX:0 });
    const stopP = routeStops.map((li,k)=> k === 0 ? 0 : P(stopY(byId[li.dataset.stop])));
    for (let k=1;k<stopP.length;k++){
      masterTL.fromTo(routeFill, { [axis]:(k-1)/(stopP.length-1) }, { [axis]:k/(stopP.length-1), duration:Math.max(0.0001, stopP[k]-stopP[k-1]), immediateRender:false }, stopP[k-1]);
    }

    const how = byId.how;
    if (how && how.staged) masterTL.fromTo(bdGrid, { scale:1 }, { scale:1.06, duration:Math.max(0.0001, P(how.end) - P(how.start)), immediateRender:false }, P(how.start));
    scenes.forEach(s=> masterTL.addLabel(s.id, P(s.top)));
    masterTL.set({}, {}, 1);
  }

  /* ---- snapping: beats inside staged chains, free in flow ----
     Driven by Lenis itself (not ScrollTrigger.snap) so the two never pull
     against each other: once a gesture's glide settles, its direction is
     the sign of (settled − last settled) and the page moves to the next
     beat anchor in that direction. One gesture = one beat. */
  let lastY = 0, dir = 1, settledY = 0, settleTimer = 0, snapping = false, snapGuard = 0, touching = false;
  function stagedAt(y){ let hit = null; stageScenes.forEach(s=>{ if (s.staged && y >= s.start - 2 && y <= s.end + 2) hit = s; }); return hit; }
  function chainOf(s){
    let a = s.index, b = s.index;
    while (a-1 >= 0 && scenes[a-1].stage && scenes[a-1].staged) a--;
    while (b+1 < scenes.length && scenes[b+1].stage && scenes[b+1].staged) b++;
    return scenes.slice(a, b+1);
  }
  function snapTarget(y, d){
    const s = stagedAt(y);
    if (!s) return null;                       // flow: scroll freely
    const anchors = [];
    chainOf(s).forEach(c=> anchorsOf(c).forEach(v=> anchors.push(v)));
    if (d > 0){ for (const v of anchors){ if (v > y + 1) return v; } }
    else { for (let i=anchors.length-1;i>=0;i--){ if (anchors[i] < y - 1) return anchors[i]; } }
    return null;                               // leaving the chain into flow
  }
  function settle(){
    if (lockCount || touching) return;
    if (lenis && lenis.isScrolling){ settleTimer = setTimeout(settle, 80); return; }
    const y = window.scrollY || 0;
    if (Math.abs(y - settledY) < 3) return;
    const d = y > settledY ? 1 : -1;
    // a gesture that already landed exactly on an anchor needs no correction
    const s = stagedAt(y);
    if (s && chainOf(s).some(c=> anchorsOf(c).some(v=> Math.abs(v - y) < 3))){ settledY = y; return; }
    const target = snapTarget(d > 0 ? Math.max(settledY, y - 1) : Math.min(settledY, y + 1), d);
    const tgt = target === null ? null : (d > 0 ? (target >= y - 1 ? target : snapTarget(y, d)) : (target <= y + 1 ? target : snapTarget(y, d)));
    if (tgt === null || Math.abs(tgt - y) < 2){ settledY = y; return; }
    snapping = true;
    clearTimeout(snapGuard); snapGuard = setTimeout(()=>{ snapping = false; settledY = window.scrollY || 0; }, 1100);
    scrollToY(tgt, 0.55, ()=>{ snapping = false; clearTimeout(snapGuard); settledY = tgt; });
  }
  function onScrollForSnap(){
    if (snapping) return;
    clearTimeout(settleTimer);
    settleTimer = setTimeout(settle, 120);
  }
  addEventListener("touchstart", ()=>{ touching = true; }, { passive:true });
  addEventListener("touchend", ()=>{ touching = false; onScrollForSnap(); }, { passive:true });

  /* ---- scene choreography ---- */
  let curStage = null, curBd = null, curBdScene = null;
  function animItems(s){
    return Array.from(s.content.querySelectorAll("[data-anim]")).filter(el=> !el.hasAttribute("data-show") || el._on);
  }
  function enterScene(s){
    const c = s.content;
    c.classList.add("is-active");
    gsap.killTweensOf(c);
    gsap.set(c, { autoAlpha:1, y:0 });
    applyBeat(s, s.beat < 0 ? 0 : s.beat, true);
    gsap.fromTo(animItems(s), { autoAlpha:0, y:MOTION.SHIFT }, { autoAlpha:1, y:0, duration:MOTION.ENTER, ease:"power3.out", stagger:MOTION.STAGGER, overwrite:true });
    trackEvent("section_view", { section: s.id });
  }
  function exitScene(s){
    const c = s.content;
    c.classList.remove("is-active");
    gsap.to(c, { autoAlpha:0, y:-MOTION.SHIFT*0.66, duration:MOTION.EXIT, ease:"power2.in", overwrite:true, onComplete:()=> gsap.set(c, { y:0 }) });
  }
  function showList(el){
    const raw = (mqMobile.matches && el.dataset.showM !== undefined) ? el.dataset.showM : el.dataset.show;
    return raw.split(",").map(Number);
  }
  function applyBeat(s, beat, instant){
    s.beat = beat;
    s.el.querySelectorAll("[data-show]").forEach(el=>{
      const on = showList(el).includes(beat);
      if (el._on === on && !instant) return;
      el._on = on;
      if (instant){ gsap.set(el, { autoAlpha: on ? 1 : 0, y:0 }); return; }
      if (on) gsap.fromTo(el, { autoAlpha:0, y:MOTION.SHIFT }, { autoAlpha:1, y:0, duration:MOTION.ENTER, ease:"power3.out", delay:0.08, overwrite:true });
      else gsap.to(el, { autoAlpha:0, y:-12, duration:MOTION.EXIT, ease:"power2.in", overwrite:true });
    });
    s.el.querySelectorAll("[data-step]").forEach(el=>{
      const k = +el.dataset.step;
      el.classList.toggle("is-on", k === beat);
      el.classList.toggle("is-past", k < beat);
    });
  }
  const bdRoot = document.getElementById("backdrop");
  function setBackdrop(s, scrimOverride){
    const bd = s.bd;
    // Tells the grain "halo" which scene's text it should sit behind.
    if (bdRoot) bdRoot.setAttribute("data-scene", scrimOverride === 0.8 ? "end" : s.id);
    const scrim = scrimOverride !== undefined ? scrimOverride : s.scrim;
    gsap.to(bdScrim, { opacity:scrim, duration:1, ease:"power1.inOut", overwrite:"auto" });
    gsap.to(bdGrid, { opacity:s.grid, duration:1, ease:"power1.inOut", overwrite:"auto" });
    if (bd === curBd) return;
    const prev = curBd; curBd = bd;
    // V5 · the cut is a push through the image: the outgoing plate keeps
    // moving toward the lens as it dissolves; the incoming one arrives a
    // touch close and settles back onto its own camera.
    const dur = MOTION.CUT;
    Object.keys(layers).forEach(k=>{ layers[k].style.zIndex = k === bd ? 2 : (k === prev ? 1 : 0); });
    const cam = camAt(s, window.scrollY || 0), q = camTo[bd];
    if (cam && q) gsap.set(q.mv, { scale:cam.s, xPercent:cam.x, yPercent:cam.y });
    playVideo(vidOf(bd));
    const inc = layers[bd];
    gsap.killTweensOf(inc);
    if (bd !== "port") gsap.fromTo(inc, { autoAlpha:0, scale:1.07 }, { autoAlpha:1, scale:1, duration:dur, ease:"power2.out",
      onComplete:()=>{ if (curBd === bd) pauseVideo(vidOf("port")); } });
    else gsap.fromTo(inc, { scale:1.05 }, { autoAlpha:1, scale:1, duration:dur * 1.1, ease:"power2.out" });
    if (prev && prev !== "port"){
      const pv = prev, out = layers[pv];
      gsap.killTweensOf(out);
      gsap.to(out, { autoAlpha:0, scale:1.12, duration:dur * 0.85, ease:"power1.in",
        onComplete:()=>{ if (curBd !== pv){ gsap.set(out, { scale:1 }); pauseVideo(vidOf(pv)); } } });
    }
  }
  function proximityLoad(y){
    scenes.forEach(s=>{
      const v = vidOf(s.bd); if (!v) return;
      const d = s.start - y;
      if (d < MOTION.POSTER_AHEAD_VH * vhPx) primeVideo(v);
      if (d < MOTION.LOAD_AHEAD_VH * vhPx && y < s.top + s.h) loadVideo(v);
    });
  }

  function update(y, force){
    dir = y > lastY ? 1 : (y < lastY ? -1 : dir); lastY = y;
    const st = stagedAt(y);
    if (st !== curStage){
      if (curStage) exitScene(curStage);
      if (st){ st.beat = beatAt(st, y); enterScene(st); }
      curStage = st;
    } else if (st){
      const b = beatAt(st, y);
      if (b !== st.beat) applyBeat(st, b, false);
      else if (force) applyBeat(st, b, true);
    }
    // backdrop follows the staged scene, or the flow scene under the viewport centre
    let bs = st, scrimOverride;
    if (!bs){
      const probe = y + vhPx * 0.5;
      scenes.forEach(s=>{ if (probe >= s.top && probe < s.top + s.h) bs = s; });
      if (!bs){ bs = scenes[scenes.length-1]; scrimOverride = 0.8; }
      else if (bs.stage && !bs.staged) scrimOverride = Math.max(bs.scrim, 0.6);
    }
    if (bs !== curBdScene || force){ curBdScene = bs; setBackdrop(bs, scrimOverride); }
    proximityLoad(y);
    updateRoute(y);
    updateNav(y, bs.id);
    updateCamera(y, bs, force);
  }

  /* ---- V5 · the camera ----
     Each chapter declares a move (data-cam: scale from→to, x from→to,
     y from→to, in %). The move is scrubbed by the scroll through that
     chapter, then eased with inertia (quickTo), so the plate behaves like
     a camera on a dolly: it keeps travelling a breath after the hand stops. */
  const camTo = {};
  Object.keys(layers).forEach(k=>{
    const mv = layers[k].querySelector(".bd-move"); if (!mv) return;
    camTo[k] = { s: gsap.quickTo(mv, "scale", { duration:MOTION.CAM, ease:"power3" }),
                 x: gsap.quickTo(mv, "xPercent", { duration:MOTION.CAM, ease:"power3" }),
                 y: gsap.quickTo(mv, "yPercent", { duration:MOTION.CAM, ease:"power3" }), mv };
  });
  function camAt(s, y){
    if (!s || !s.cam) return null;
    const c = s.cam;
    let p;
    if (s.staged && s.end > s.start) p = clamp((y - s.start) / (s.end - s.start), 0, 1);
    else p = clamp((y + vhPx - s.top) / (s.h + vhPx), 0, 1);
    const L = (a,b)=> a + (b - a) * p;
    return { s:L(c[0],c[1]), x:L(c[2],c[3]), y:L(c[4],c[5]) };
  }
  let camScene = null;
  function updateCamera(y, bs, instant){
    const src = (bs && bs.cam) ? bs : camScene;
    if (!src) return;
    camScene = src;
    const v = camAt(src, y), q = camTo[src.bd];
    if (!v || !q) return;
    if (instant){ gsap.set(q.mv, { scale:v.s, xPercent:v.x, yPercent:v.y }); }
    q.s(v.s); q.x(v.x); q.y(v.y);
  }

  /* ---- flow scene reveals (once) ---- */
  function initFlowReveals(){
    const items = Array.from(document.querySelectorAll(".scene--flow [data-anim]"));
    gsap.set(items, { autoAlpha:0, y:MOTION.SHIFT });
    ScrollTrigger.batch(items, {
      start:"top 90%", once:true,
      onEnter:(batch)=> gsap.to(batch, { autoAlpha:1, y:0, duration:MOTION.ENTER, ease:"power3.out", stagger:MOTION.STAGGER, overwrite:true })
    });
  }

  /* ---- telemetry (Demostración) ---- */
  function initTelemetry(){
    const tel = document.getElementById("telCoord"), map = document.getElementById("mapCoord");
    if (prefersReduced) return;
    let ci = 0;
    setInterval(()=>{ ci = (ci+1) % COORDS.length; if (tel) tel.textContent = COORDS[ci][0]; if (map) map.textContent = COORDS[ci][1]; }, 3200);
  }

  /* ---- programme list → beat ---- */
  document.querySelectorAll("[data-pgm]").forEach(b=> b.addEventListener("click", ()=> goToBeat("programs", +b.dataset.pgm)));

  function scrollToY(y, dur, done){
    const fin = ()=>{ settledY = y; if (done) done(); };
    if (lenis) lenis.scrollTo(y, { duration: dur || 1.1, easing:(x)=> x < .5 ? 4*x*x*x : 1 - Math.pow(-2*x + 2, 3) / 2, onComplete: fin });
    else { window.scrollTo({ top:y, behavior: prefersReduced ? "auto" : "smooth" }); setTimeout(fin, 700); }
  }
  function goToBeat(id, k){
    const s = byId[id]; if (!s) return;
    if (!motion || !s.staged){ s.el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" }); return; }
    const a = anchorsOf(s); scrollToY(a[clamp(k,0,a.length-1)]);
  }
  function goTo(id){
    const s = byId[id]; if (!s) return;
    if (!motion){ s.el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" }); return; }
    if (s.staged) scrollToY(anchorsOf(s)[0]);
    else scrollToY(Math.max(0, s.top));
  }

  /* ---- static mode (reduced motion / CDN failure): stacked flow ---- */
  function initStatic(){
    videosAllowed = true;
    const show = (s)=>{
      Object.keys(layers).forEach(k=>{ if (k !== "port") layers[k].classList.toggle("is-on", k === s.bd); });
      const v = vidOf(s.bd); primeVideo(v);
      if (!prefersReduced){ Object.keys(layers).forEach(k=>{ const vv = vidOf(k); if (k !== s.bd && k !== "port") pauseVideo(vv); }); playVideo(v); }
      bdScrim.style.opacity = Math.max(s.scrim, s.stage ? 0.55 : s.scrim);
      bdGrid.style.opacity = s.grid * 0.6;
      updateNav(window.scrollY || 0, s.id);
    };
    primeVideo(vidOf("port"));
    if ("IntersectionObserver" in window){
      const io = new IntersectionObserver((es)=>{ es.forEach(e=>{ if (e.isIntersecting){ const s = scenes.find(x=> x.el === e.target); if (s) show(s); } }); }, { rootMargin:"-50% 0px -50% 0px" });
      scenes.forEach(s=> io.observe(s.el));
    }
    show(scenes[0]);
    measure(); updateRoute(window.scrollY || 0);
    addEventListener("resize", ()=>{ vhPx = innerHeight; measure(); }, { passive:true });
    addEventListener("scroll", ()=>{
      const y = window.scrollY || 0, sc = y > 40;
      if (sc !== lastScrolled){ lastScrolled = sc; navWrap.classList.toggle("scrolled", sc); }
      updateRoute(y);
    }, { passive:true });
  }

  /* ---- motion mode ---- */
  function initMotion(){
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize:true });
    if (window.Lenis){
      lenis = new Lenis({ lerp:MOTION.LERP, smoothWheel:true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time)=> lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
      if (lockCount) lenis.stop();
    }
    setVh();
    stageScenes.forEach(s=> gsap.set(s.content, { autoAlpha:0 }));
    Object.keys(layers).forEach(k=>{ if (k !== "port") gsap.set(layers[k], { autoAlpha:0 }); });
    gsap.set(layers.port, { autoAlpha:1 });
    gsap.set(bdGrid, { opacity:0 });

    ScrollTrigger.addEventListener("refreshInit", ()=>{ setVh(); fitScenes(); });
    masterTL = gsap.timeline({ paused:true, defaults:{ ease:"none" } });
    masterST = ScrollTrigger.create({
      start:0, end:"max", scrub:MOTION.SCRUB, animation:masterTL,
      onUpdate:(self)=>{ update(self.scroll(), false); onScrollForSnap(); },
      onRefresh:(self)=>{ measure(); buildMaster(); update(self.scroll(), true); settledY = self.scroll(); }
    });
    initFlowReveals();
    root.classList.add("engine-ready");
    window.__presstonMotionReady = true;
    ScrollTrigger.refresh();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(()=> ScrollTrigger.refresh());
    addEventListener("load", ()=> ScrollTrigger.refresh());
  }

  function start(){
    initTelemetry();
    if (motion) initMotion(); else { root.classList.add("engine-ready"); window.__presstonMotionReady = true; initStatic(); }
  }
  function allowVideos(){
    videosAllowed = true;
    if (motion){ curBd = null; update(window.scrollY || 0, true); }
    else { const s = curBdScene || scenes[0]; playVideo(vidOf("port")); }
  }
  function replayCurrent(){ if (motion && curStage) enterScene(curStage); }
  function onLangChange(){ if (motion && masterST) ScrollTrigger.refresh(); }

  return { start, goTo, allowVideos, replayCurrent, onLangChange, get motion(){ return motion; } };
})();

/* Hero entrance: videos allowed and the first scene played in. */
function armHeroReveal(){
  Stage.allowVideos();
  Stage.replayCurrent();
}

/*@@LEGAL_PANEL@@*/

/* ============ Private plan (Evidence) ============
   The operating plan is NOT part of this page or its source. A valid code
   locates and decrypts it:
     id   = SHA-256("presston-plan-v1|" + CODE), first 40 hex chars
     privado/acceso/<id>.json  → PBKDF2(CODE) → AES-GCM → { k, doc, label }
     privado/doc/<random>.json → AES-GCM(k)   → { langs:{ en, es, zh } }
   A wrong code finds no file (or cannot decrypt one), so nothing of the plan
   is ever fetched. Files are built by presston-site/plan-privado/construir.py.
   ============================================================ */
const PrivatePlan = (function(){
  const ID_PREFIX = "presston-plan-v1|";
  const ACCESS_DIR = "privado/acceso/";
  const $ = (id)=> document.getElementById(id);
  const block = $("privatePlan"), form = $("ppForm"), input = $("ppCode"), openBtn = $("ppOpen"), msg = $("ppMsg");
  const unlockedBox = $("ppUnlocked"), reopenBtn = $("ppReopen");
  const viewer = $("planViewer"), bodyEl = $("pvBody"), scroller = $("pvScroll"), closeBtn = $("pvClose");
  if (!block || !viewer) return { onLangChange(){} };
  const enc = new TextEncoder(), dec = new TextDecoder();
  const unb64 = (s)=> Uint8Array.from(atob(s), (c)=> c.charCodeAt(0));
  const hex = (buf)=> Array.from(new Uint8Array(buf)).map((b)=> b.toString(16).padStart(2,"0")).join("");
  const norm = (s)=> String(s || "").replace(/\s+/g, "").toUpperCase();
  let doc = null, busy = false, isOpen = false, lastFocus = null, msgKey = "", msgKind = "", renderedLang = "";

  function say(key, kind){ msgKey = key || ""; msgKind = kind || ""; msg.textContent = key ? t(key) : ""; msg.setAttribute("data-kind", msgKind); }

  async function fetchPlan(code){
    const id = hex(await crypto.subtle.digest("SHA-256", enc.encode(ID_PREFIX + code))).slice(0, 40);
    const r = await fetch(ACCESS_DIR + id + ".json", { cache:"no-store", credentials:"same-origin" });
    if (r.status === 404 || r.status === 403 || r.status === 410) return null;
    if (!r.ok) throw new Error("access " + r.status);
    let rec; try { rec = await r.json(); } catch(e){ return null; }   // a host may answer 200 with an HTML fallback
    if (!rec || !rec.ct) return null;
    const base = await crypto.subtle.importKey("raw", enc.encode(code), "PBKDF2", false, ["deriveKey"]);
    const key = await crypto.subtle.deriveKey({ name:"PBKDF2", salt:unb64(rec.salt), iterations:rec.iter, hash:"SHA-256" },
      base, { name:"AES-GCM", length:256 }, false, ["decrypt"]);
    let inner;
    try { inner = JSON.parse(dec.decode(await crypto.subtle.decrypt({ name:"AES-GCM", iv:unb64(rec.iv) }, key, unb64(rec.ct)))); }
    catch(e){ return null; }
    const d = await fetch(inner.doc, { cache:"no-store", credentials:"same-origin" });
    if (!d.ok) throw new Error("doc " + d.status);
    const box = await d.json();
    const k = await crypto.subtle.importKey("raw", unb64(inner.k), "AES-GCM", false, ["decrypt"]);
    const plain = await crypto.subtle.decrypt({ name:"AES-GCM", iv:unb64(box.iv) }, k, unb64(box.ct));
    return { doc: JSON.parse(dec.decode(plain)), label: inner.label || "" };
  }

  async function submit(e){
    if (e) e.preventDefault();
    if (busy) return;
    const code = norm(input.value);
    if (!code){ say("pp_empty", "error"); input.focus(); return; }
    if (!(window.crypto && crypto.subtle)){ say("pp_fail", "error"); return; }
    busy = true; openBtn.disabled = true; say("pp_busy", "busy");
    try {
      const res = await fetchPlan(code);
      if (!res){ say("pp_err", "error"); input.select(); trackEvent("plan_code_rejected", {}); return; }
      doc = res.doc;
      input.value = "";
      say("", "");
      form.hidden = true; unlockedBox.hidden = false;
      trackEvent("plan_unlocked", { code: res.label, lang: lang });
      open();
    } catch(err){
      say("pp_fail", "error");
    } finally {
      busy = false; openBtn.disabled = false;
    }
  }

  function render(){
    if (!doc) return;
    const L = doc.langs[lang] || doc.langs.en;
    const y = scroller.scrollTop;
    bodyEl.innerHTML = L.html;
    renderedLang = lang;
    scroller.scrollTop = y;
  }
  function open(){
    if (!doc || isOpen) return;
    lastFocus = document.activeElement;
    render();
    viewer.hidden = false;
    void viewer.offsetWidth;
    viewer.classList.add("open");
    isOpen = true;
    lockScroll();
    scroller.scrollTop = 0;
    closeBtn.focus({ preventScroll:true });
  }
  function close(){
    if (!isOpen) return;
    isOpen = false;
    viewer.classList.remove("open");
    unlockScroll();
    setTimeout(()=>{ if (!isOpen) viewer.hidden = true; }, prefersReduced ? 0 : 320);
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll:true });
    else if (reopenBtn) reopenBtn.focus({ preventScroll:true });
  }

  form.addEventListener("submit", submit);
  input.addEventListener("input", ()=>{ if (msgKind === "error") say("", ""); });
  reopenBtn.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  const legalBtn = $("ppLegal");
  if (legalBtn) legalBtn.addEventListener("click", (e)=>{ e.preventDefault(); if (typeof openLegal === "function") openLegal(); });
  document.addEventListener("keydown", (e)=>{
    if (!isOpen) return;
    if (e.key === "Escape"){ e.preventDefault(); close(); return; }
    if (e.key !== "Tab") return;
    const f = Array.from(viewer.querySelectorAll("button, [href], [tabindex='0']")).filter((el)=> !el.disabled && el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || !viewer.contains(document.activeElement))){ e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  });

  return {
    onLangChange(){
      if (msgKey) msg.textContent = t(msgKey);
      if (isOpen && renderedLang !== lang) render();
    }
  };
})();


/* ============ Bootstrap ============ */
applyLang(detectInitialLang());
Stage.start();
armHeroReveal();
</script>
</body>
</html>
