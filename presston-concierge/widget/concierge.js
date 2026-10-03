/*!
 * Presston — Concierge AI · widget (vanilla JS, sin dependencias).
 * Integración en el index.html del sitio, antes de </body>:
 *   <script src="/concierge.js" data-endpoint="https://concierge.<cuenta>.workers.dev" defer></script>
 * Todo vive en un Shadow DOM: no toca el diseño ni el copy del sitio.
 * Diseño: V5 "Turno de noche" — negro acero, hairlines, latón; Archivo + Fragment Mono.
 */
(function () {
  'use strict';
  if (window.__presstonConcierge) return;
  window.__presstonConcierge = true;

  var script = document.currentScript || document.querySelector('script[data-endpoint][src*="concierge"]');
  var ENDPOINT = ((script && script.getAttribute('data-endpoint')) || '').replace(/\/+$/, '');
  var REALTIME_CALLS = 'https://api.openai.com/v1/realtime/calls';

  // Apertura: siempre en inglés, con la invitación a cambiar a español.
  var GREETING = "I'm Presston — Concierge AI, Presston's AI. What brings you here? Si prefieres español, dime «español».";

  var T = {
    ES: {
      open: 'Hablar con Presston — Concierge AI',
      close: 'Cerrar',
      title: 'Presston — Concierge AI',
      seal: 'AI Governed',
      connecting: 'Conectando',
      listening: 'Escuchando',
      speaking: 'Hablando',
      thinking: 'Procesando',
      online: 'En línea',
      textMode: 'Modo texto',
      voiceMode: 'Modo voz',
      mute: 'Silenciar',
      unmute: 'Activar micrófono',
      placeholder: 'Escribe tu pregunta',
      send: 'Enviar →',
      greeting: GREETING,
      noMic: 'Sin acceso al micrófono. Seguimos por texto.',
      noVoice: 'La voz no está disponible ahora. Seguimos por texto.',
      error: 'No pude responder. Intenta de nuevo en un momento.',
      you: 'Tú',
      disclaimer: 'AI de Presston · Proyecciones, no garantías',
      stage: 'Conversación por voz con Presston — Concierge AI',
    },
    EN: {
      open: 'Talk to Presston — Concierge AI',
      close: 'Close',
      title: 'Presston — Concierge AI',
      seal: 'AI Governed',
      connecting: 'Connecting',
      listening: 'Listening',
      speaking: 'Speaking',
      thinking: 'Processing',
      online: 'Online',
      textMode: 'Text mode',
      voiceMode: 'Voice mode',
      mute: 'Mute',
      unmute: 'Unmute',
      placeholder: 'Type your question',
      send: 'Send →',
      greeting: GREETING,
      noMic: 'No microphone access. We can continue by text.',
      noVoice: 'Voice is unavailable right now. We can continue by text.',
      error: "I couldn't answer. Please try again in a moment.",
      you: 'You',
      disclaimer: "Presston's AI · Projections, not guarantees",
      stage: 'Voice conversation with Presston — Concierge AI',
    },
  };

  function detectLang() {
    var l = (document.documentElement.getAttribute('lang') || navigator.language || 'es').toLowerCase();
    return l.indexOf('en') === 0 ? 'EN' : 'ES';
  }

  // ---------- estado ----------
  var state = {
    lang: detectLang(),
    open: false,
    mode: null, // 'voice' | 'text'
    gen: 0, // generación de la sesión de voz (cancela conexiones en curso)
    pc: null,
    dc: null,
    mic: null,
    muted: false,
    audioCtx: null,
    analyser: null, // voz de la AI
    micAnalyser: null, // voz del visitante (solo visual)
    raf: 0,
    speaking: false, // la AI habla
    userTalking: false, // VAD del servidor: el visitante habla
    busy: false,
    leadDone: false,
    items: [], // transcripción ordenada: {id, role, text}
    textHistory: [], // modo texto: {role, content}
  };

  // Fragment Mono para estados (Archivo ya la carga la página). @font-face debe vivir en el documento.
  (function ensureMonoFont() {
    if (document.querySelector('link[href*="Fragment+Mono"]')) return;
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Fragment+Mono&display=swap';
    (document.head || document.documentElement).appendChild(l);
  })();

  // ---------- DOM ----------
  var host = document.createElement('div');
  host.id = 'presston-concierge';
  var root = host.attachShadow({ mode: 'open' });
  root.innerHTML =
    '<style>' + CSS() + '</style>' +
    '<section class="panel" role="dialog" aria-modal="false" aria-labelledby="pc-title" hidden>' +
    '  <header>' +
    '    <div class="row"><h2 id="pc-title"></h2><button class="x" type="button"><span aria-hidden="true"></span></button></div>' +
    '    <div class="row meta"><span class="seal"></span><span class="status" aria-live="polite"></span></div>' +
    '  </header>' +
    '  <div class="stage" role="img"><div class="glass"><canvas class="metal"></canvas></div><canvas class="pane"></canvas></div>' +
    '  <div class="log" aria-live="polite"></div>' +
    '  <form class="ask" autocomplete="off"><input type="text" maxlength="1000"><button type="submit"></button></form>' +
    '  <footer><div class="ctl"><button class="mode" type="button"></button><button class="mute" type="button"></button>' +
    '    <button class="lang" type="button" aria-label="Idioma / Language"></button></div><span class="disc"></span></footer>' +
    '</section>' +
    '<button class="orb" type="button" aria-expanded="false"><span class="halo"></span><span class="core"></span></button>';
  var $ = function (s) { return root.querySelector(s); };
  var orb = $('.orb'), panel = $('.panel'), log = $('.log'), statusEl = $('.status');
  var form = $('.ask'), input = $('.ask input');
  var stage = $('.stage'), glassEl = $('.glass');
  var canvas = $('.metal'), ctx2d = canvas.getContext('2d'); // metal líquido (bajo el vidrio)
  var pane = $('.pane'), paneCtx = pane.getContext('2d'); // vidrio esmerilado (nítido)

  function mount() { document.body.appendChild(host); applyLang(); }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);

  function t(k) { return T[state.lang][k]; }

  function applyLang() {
    panel.setAttribute('data-mode', state.mode || '');
    orb.setAttribute('aria-label', state.open ? t('close') : t('open'));
    $('#pc-title').textContent = t('title');
    $('.seal').textContent = t('seal');
    $('.x').setAttribute('aria-label', t('close'));
    stage.setAttribute('aria-label', t('stage'));
    input.placeholder = t('placeholder');
    input.setAttribute('aria-label', t('placeholder'));
    $('.ask button').textContent = t('send');
    $('.mode').textContent = state.mode === 'voice' ? t('textMode') : t('voiceMode');
    $('.mute').textContent = state.muted ? t('unmute') : t('mute');
    $('.mute').hidden = state.mode !== 'voice';
    $('.lang').textContent = state.lang === 'ES' ? 'EN' : 'ES';
    $('.disc').textContent = t('disclaimer');
  }

  function setStatus(key) {
    statusEl.textContent = key ? t(key) : '';
    statusEl.setAttribute('data-state', key || '');
  }

  function setLevel(v) { host.style.setProperty('--lvl', String(Math.max(0, Math.min(1, v)).toFixed(3))); }

  function addLine(role, text, id) {
    var p = document.createElement('p');
    p.className = role;
    if (id) p.dataset.id = id;
    var who = document.createElement('b');
    who.textContent = role === 'user' ? t('you') : 'Presston';
    var span = document.createElement('span');
    span.textContent = text;
    p.appendChild(who);
    p.appendChild(span);
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
    return span;
  }

  // ---------- abrir / cerrar ----------
  orb.addEventListener('click', function () { state.open ? closePanel() : openPanel(); });
  $('.x').addEventListener('click', closePanel);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && state.open) closePanel(); });

  function openPanel() {
    state.open = true;
    panel.hidden = false;
    orb.setAttribute('aria-expanded', 'true');
    host.classList.add('is-open');
    applyLang();
    if (!state.mode) startVoice();
  }

  function closePanel() {
    state.open = false;
    panel.hidden = true;
    orb.setAttribute('aria-expanded', 'false');
    host.classList.remove('is-open');
    stopVoice();
    state.mode = null;
    applyLang();
    orb.focus();
  }

  $('.mode').addEventListener('click', function () {
    if (state.mode === 'voice') { stopVoice(); startText(); } else { startVoice(); }
  });
  $('.mute').addEventListener('click', function () {
    state.muted = !state.muted;
    if (state.mic) state.mic.getAudioTracks().forEach(function (tr) { tr.enabled = !state.muted; });
    applyLang();
  });
  $('.lang').addEventListener('click', function () {
    state.lang = state.lang === 'ES' ? 'EN' : 'ES';
    applyLang();
    if (state.mode === 'voice') {
      send({ type: 'conversation.item.create', item: { type: 'message', role: 'user', content: [{ type: 'input_text', text: state.lang === 'EN' ? 'Please continue in English.' : 'Por favor sigue en español.' }] } });
      send({ type: 'response.create' });
    }
  });

  // ---------- modo voz (OpenAI Realtime por WebRTC) ----------
  function startVoice() {
    state.mode = 'voice';
    applyLang();
    setStatus('connecting');
    if (!navigator.mediaDevices || !window.RTCPeerConnection) return fallbackToText('noVoice');

    // AudioContext dentro del gesto del usuario (requisito iOS/Safari).
    try { state.audioCtx = state.audioCtx || new (window.AudioContext || window.webkitAudioContext)(); state.audioCtx.resume(); } catch (e) {}

    var gen = ++state.gen;
    var stale = function () { return gen !== state.gen; };
    startStage();
    navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } })
      .then(function (mic) {
        if (stale()) { mic.getTracks().forEach(function (tr) { tr.stop(); }); return; }
        state.mic = mic;
        return api('/session', { lang: state.lang }).then(function (s) { if (!stale()) return connect(s, mic); });
      })
      .catch(function (err) {
        if (stale()) return;
        console.warn('[concierge] voz no disponible:', err);
        stopVoice();
        fallbackToText(err && err.name === 'NotAllowedError' ? 'noMic' : 'noVoice');
      });
  }

  function connect(session, mic) {
    var pc = new RTCPeerConnection();
    state.pc = pc;
    var audio = document.createElement('audio');
    audio.autoplay = true;
    audio.setAttribute('playsinline', '');
    pc.ontrack = function (e) { audio.srcObject = e.streams[0]; state.analyser = analyserFor(e.streams[0]); };
    mic.getTracks().forEach(function (tr) { pc.addTrack(tr, mic); });
    state.micAnalyser = analyserFor(mic);

    var dc = pc.createDataChannel('oai-events');
    state.dc = dc;
    dc.onopen = function () {
      setStatus('listening');
      send({ type: 'response.create', response: { instructions: session.greeting } });
    };
    dc.onmessage = function (e) { try { onEvent(JSON.parse(e.data)); } catch (err) { console.warn(err); } };
    pc.onconnectionstatechange = function () {
      if (pc.connectionState === 'failed') { stopVoice(); fallbackToText('noVoice'); }
    };

    return pc.createOffer()
      .then(function (offer) { return pc.setLocalDescription(offer); })
      .then(function () {
        return fetch(REALTIME_CALLS, {
          method: 'POST',
          body: pc.localDescription.sdp,
          headers: { Authorization: 'Bearer ' + session.client_secret, 'Content-Type': 'application/sdp' },
        });
      })
      .then(function (r) { if (!r.ok) throw new Error('realtime ' + r.status); return r.text(); })
      .then(function (sdp) { return pc.setRemoteDescription({ type: 'answer', sdp: sdp }); });
  }

  function stopVoice() {
    state.gen++; // invalida conexiones en curso
    cancelAnimationFrame(state.raf);
    state.raf = 0;
    if (state.dc) try { state.dc.close(); } catch (e) {}
    if (state.pc) try { state.pc.close(); } catch (e) {}
    if (state.mic) state.mic.getTracks().forEach(function (tr) { tr.stop(); });
    state.dc = state.pc = state.mic = state.analyser = state.micAnalyser = null;
    state.speaking = state.userTalking = false;
    setLevel(0);
    host.classList.remove('is-speaking', 'is-hearing');
  }

  function send(evt) { if (state.dc && state.dc.readyState === 'open') state.dc.send(JSON.stringify(evt)); }

  function analyserFor(stream) {
    if (!state.audioCtx) return null;
    try {
      var an = state.audioCtx.createAnalyser();
      an.fftSize = 512;
      state.audioCtx.createMediaStreamSource(stream).connect(an);
      an._buf = new Uint8Array(an.fftSize);
      return an;
    } catch (e) { console.warn('[concierge] analyser:', e); return null; }
  }

  function rms(an) {
    if (!an) return 0;
    an.getByteTimeDomainData(an._buf);
    var sum = 0;
    for (var i = 0; i < an._buf.length; i++) { var v = (an._buf[i] - 128) / 128; sum += v * v; }
    return Math.sqrt(sum / an._buf.length);
  }

  function itemFor(id, role) {
    for (var i = 0; i < state.items.length; i++) if (state.items[i].id === id) return state.items[i];
    var it = { id: id, role: role, text: '' };
    state.items.push(it);
    return it;
  }

  var live = null; // línea del bot en curso (el registro solo se ve en modo texto)
  function onEvent(ev) {
    switch (ev.type) {
      case 'conversation.item.added':
      case 'conversation.item.created':
        if (ev.item && ev.item.type === 'message') itemFor(ev.item.id, ev.item.role);
        break;
      case 'conversation.item.input_audio_transcription.completed':
        var u = itemFor(ev.item_id, 'user');
        u.text = (ev.transcript || '').trim();
        if (u.text) addLine('user', u.text, ev.item_id);
        break;
      case 'response.output_audio_transcript.delta':
        if (!live) live = addLine('assistant', '', ev.item_id);
        live.textContent += ev.delta || '';
        log.scrollTop = log.scrollHeight;
        break;
      case 'response.output_audio_transcript.done':
        itemFor(ev.item_id, 'assistant').text = ev.transcript || '';
        if (live) live.textContent = ev.transcript || live.textContent;
        live = null;
        break;
      case 'input_audio_buffer.speech_started':
        state.userTalking = true;
        break;
      case 'input_audio_buffer.speech_stopped':
        state.userTalking = false;
        break;
      case 'output_audio_buffer.started':
        state.speaking = true; host.classList.add('is-speaking'); setStatus('speaking');
        break;
      case 'output_audio_buffer.stopped':
      case 'output_audio_buffer.cleared':
        state.speaking = false; host.classList.remove('is-speaking'); setStatus('listening');
        break;
      case 'response.done':
        var calls = ((ev.response && ev.response.output) || []).filter(function (o) { return o.type === 'function_call'; });
        if (calls.length) runTools(calls);
        break;
      case 'error':
        console.warn('[concierge] realtime error:', ev.error);
        break;
    }
  }

  function runTools(calls) {
    setStatus('thinking');
    Promise.all(calls.map(function (c) {
      var args = {};
      try { args = JSON.parse(c.arguments || '{}'); } catch (e) {}
      var p;
      if (c.name === 'buscar_corpus') p = api('/search', { consulta: args.consulta || '', lang: state.lang });
      else if (c.name === 'registrar_lead') {
        if (state.leadDone) p = Promise.resolve({ ok: true, nota: 'ya registrado' });
        else p = api('/lead', { lead: args, transcript: transcript() }).then(function (r) {
          state.leadDone = true;
          return { ok: true, transcripcion: r.transcripcion && r.transcripcion.status };
        });
      } else p = Promise.resolve({ error: 'herramienta desconocida' });
      return p.catch(function () { return { error: 'no se pudo completar' }; }).then(function (out) {
        send({ type: 'conversation.item.create', item: { type: 'function_call_output', call_id: c.call_id, output: JSON.stringify(out) } });
      });
    })).then(function () { send({ type: 'response.create' }); });
  }

  function transcript() {
    return state.items.filter(function (i) { return i.text; }).map(function (i) { return { role: i.role, text: i.text }; });
  }

  // ---------- escenario de voz: metal líquido tras vidrio esmerilado (diseño aprobado) ----------
  // Una marea de color dentro de la esfera: azul cuando habla la AI, roja cuando habla el visitante.
  // Su altura y oleaje siguen la amplitud real (RMS) de cada voz. Encima, una lámina de vidrio
  // esmerilado: blur parejo de 18px sobre toda la esfera, grano fino y el canto del vidrio nítido.
  var AI_RGB = [90, 146, 255], CLIENT_RGB = [232, 72, 79], WHITE = [255, 255, 255];
  var GLASS_BLUR = 18; // px, calibrado y aprobado
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var sphereState = {}, grainTile = null, stageBox = '';

  function startStage() {
    cancelAnimationFrame(state.raf);
    var aiLvl = 0, meLvl = 0, mix = 0, heardAt = -1e9, t0 = performance.now();
    sphereState = {};
    (function frame(now) {
      if (state.mode !== 'voice' || !state.open) { state.raf = 0; return; }
      now = now || t0;
      aiLvl = aiLvl * 0.72 + Math.min(1, rms(state.analyser) * 4.5) * 0.28;
      meLvl = meLvl * 0.72 + (state.muted ? 0 : Math.min(1, rms(state.micAnalyser) * 5)) * 0.28;
      if (state.userTalking || (!state.speaking && meLvl > 0.14)) heardAt = now;
      var hearing = now - heardAt < 300; // sostener entre palabras para que no parpadee
      mix += ((hearing ? 1 : 0) - mix) * (hearing ? 0.22 : 0.06); // entra rápido, sale lento
      var lvl = hearing ? meLvl : aiLvl;
      host.classList.toggle('is-hearing', hearing);
      setLevel(lvl);
      drawSphere((now - t0) / 1000 * (REDUCED ? 0.25 : 1), lvl, mix);
      state.raf = requestAnimationFrame(frame);
    })(t0);
  }

  function colorAt(m) { return [0, 1, 2].map(function (i) { return Math.round(AI_RGB[i] + (CLIENT_RGB[i] - AI_RGB[i]) * m); }); }
  function toward(c, t, f) { return [0, 1, 2].map(function (i) { return Math.round(c[i] + (t[i] - c[i]) * f); }); }
  function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + Math.max(0, Math.min(1, a)).toFixed(3) + ')'; }

  function drawSphere(t, lvl, mix) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h) return;
    var R = Math.min(w, h) * 0.4, cx = w / 2, cy = h / 2, box = w + 'x' + h + '@' + dpr;
    if (box !== stageBox) { // la esfera de vidrio recorta el metal difuminado a su círculo
      stageBox = box;
      pane.width = canvas.width = Math.round(w * dpr);
      pane.height = canvas.height = Math.round(h * dpr);
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      canvas.style.left = -(cx - R) + 'px'; canvas.style.top = -(cy - R) + 'px';
      glassEl.style.left = (cx - R) + 'px'; glassEl.style.top = (cy - R) + 'px';
      glassEl.style.width = glassEl.style.height = 2 * R + 'px';
    }
    ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx2d.globalCompositeOperation = 'source-over';
    ctx2d.clearRect(0, 0, w, h);
    drawLiquid(ctx2d, cx, cy, R, t, lvl, mix, sphereState);
    paneCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paneCtx.clearRect(0, 0, w, h);
    drawGlass(paneCtx, cx, cy, R, GLASS_BLUR / 28);
  }

  function drawLiquid(c, cx, cy, R, t, lvl, m, s) {
    var col = colorAt(m);
    s.tide = (s.tide || 0) + ((0.18 + 0.5 * lvl) - (s.tide || 0)) * 0.06; // la marea sube con la voz
    c.save(); c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.clip();
    var bg = c.createRadialGradient(cx - R * 0.25, cy - R * 0.3, R * 0.05, cx, cy, R);
    bg.addColorStop(0, '#2a3139'); bg.addColorStop(1, '#07090b');
    c.fillStyle = bg; c.fillRect(cx - R, cy - R, R * 2, R * 2);
    var g = c.createLinearGradient(cx, cy - R, cx, cy + R); // cromo oscuro
    g.addColorStop(0, 'rgba(70,80,92,.35)'); g.addColorStop(0.45, 'rgba(11,14,17,0)'); g.addColorStop(0.55, 'rgba(11,14,17,.4)'); g.addColorStop(1, 'rgba(40,46,54,.35)');
    c.fillStyle = g; c.fillRect(cx - R, cy - R, R * 2, R * 2);
    var base = cy + R - s.tide * R * 2;
    function surface(ph, ampK) {
      c.beginPath(); c.moveTo(cx - R, cy + R);
      for (var x = -R; x <= R; x += 3) {
        var y = base + R * (0.02 + ampK * lvl) * Math.sin(x * 0.028 + t * 2.2 + ph) + R * 0.018 * Math.sin(x * 0.065 - t * 3.1 + ph);
        c.lineTo(cx + x, y);
      }
      c.lineTo(cx + R, cy + R); c.closePath();
    }
    var lg = c.createLinearGradient(cx, base - R * 0.1, cx, cy + R);
    lg.addColorStop(0, rgba(col, 0.55 + 0.3 * lvl)); lg.addColorStop(1, rgba(col, 0.08));
    surface(1.7, 0.06); c.fillStyle = rgba(col, 0.18); c.fill();
    surface(0, 0.1); c.fillStyle = lg; c.fill();
    c.strokeStyle = rgba(toward(col, WHITE, 0.5), 0.85); c.lineWidth = 1.2; c.stroke();
    c.globalCompositeOperation = 'lighter';
    for (var i = 0; i < 4; i++) { // destellos horizontales sobre el líquido
      var yy = base + R * (0.12 + i * 0.16), ww = R * (0.5 - i * 0.08) * (0.6 + 0.4 * Math.sin(t * 0.8 + i));
      c.fillStyle = rgba(toward(col, WHITE, 0.4), 0.10 + 0.12 * lvl); c.fillRect(cx - ww / 2 + Math.sin(t + i) * R * 0.1, yy, ww, 1);
    }
    var sh = c.createRadialGradient(cx - R * 0.18, cy - R * 0.22, R * 0.35, cx, cy, R * 1.02); // volumen esférico
    sh.addColorStop(0, 'rgba(0,0,0,0)'); sh.addColorStop(1, 'rgba(0,0,0,.85)');
    c.globalCompositeOperation = 'source-over'; c.fillStyle = sh; c.fillRect(cx - R, cy - R, R * 2, R * 2);
    c.globalCompositeOperation = 'lighter';
    var hl = c.createRadialGradient(cx - R * 0.35, cy - R * 0.45, 0, cx - R * 0.35, cy - R * 0.45, R * 0.4);
    hl.addColorStop(0, 'rgba(232,234,237,.10)'); hl.addColorStop(1, 'rgba(232,234,237,0)');
    c.fillStyle = hl; c.fillRect(cx - R, cy - R, R * 2, R * 2);
    c.restore();
    c.beginPath(); c.arc(cx, cy, R - 0.5, 0, Math.PI * 2); c.strokeStyle = '#2b333d'; c.lineWidth = 1; c.stroke();
  }

  function drawGlass(c, cx, cy, R, k) {
    if (!grainTile) {
      grainTile = document.createElement('canvas'); grainTile.width = grainTile.height = 128;
      var gx = grainTile.getContext('2d'), img = gx.createImageData(128, 128);
      for (var i = 0; i < img.data.length; i += 4) {
        var v = Math.random() < 0.5 ? 0 : 255;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = Math.random() * 26;
      }
      gx.putImageData(img, 0, 0);
    }
    c.save(); c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.clip();
    c.fillStyle = 'rgba(200,210,222,' + (0.05 * k).toFixed(3) + ')'; c.fillRect(cx - R, cy - R, R * 2, R * 2); // velo lechoso
    c.globalAlpha = Math.min(1, 0.35 + 0.65 * k);
    c.fillStyle = c.createPattern(grainTile, 'repeat'); c.fillRect(cx - R, cy - R, R * 2, R * 2); // grano esmerilado
    c.globalAlpha = 1;
    var hl = c.createLinearGradient(cx, cy - R, cx, cy - R * 0.25); // luz superior sobre el vidrio
    hl.addColorStop(0, 'rgba(232,234,237,' + (0.09 * k).toFixed(3) + ')'); hl.addColorStop(1, 'rgba(232,234,237,0)');
    c.fillStyle = hl; c.beginPath(); c.ellipse(cx, cy - R * 0.5, R * 0.7, R * 0.42, 0, 0, Math.PI * 2); c.fill();
    var edge = c.createRadialGradient(cx, cy, R * 0.82, cx, cy, R); // espesor del canto
    edge.addColorStop(0, 'rgba(0,0,0,0)'); edge.addColorStop(1, 'rgba(0,0,0,' + (0.45 * k).toFixed(3) + ')');
    c.fillStyle = edge; c.fillRect(cx - R, cy - R, R * 2, R * 2);
    c.restore();
    c.beginPath(); c.arc(cx, cy, R - 0.5, 0, Math.PI * 2); c.strokeStyle = 'rgba(232,234,237,' + (0.06 + 0.12 * k).toFixed(3) + ')'; c.lineWidth = 1; c.stroke();
    c.beginPath(); c.arc(cx, cy, R - 2.5, Math.PI * 1.1, Math.PI * 1.45); c.strokeStyle = 'rgba(232,234,237,' + (0.25 * k).toFixed(3) + ')'; c.lineWidth = 1.2; c.stroke();
  }

  // ---------- modo texto ----------
  function fallbackToText(msgKey) {
    if (msgKey) addLine('assistant', t(msgKey)).parentNode.classList.add('note');
    startText();
  }

  function startText() {
    state.mode = 'text';
    applyLang();
    setStatus('online');
    if (!state.textHistory.length && !log.querySelector('.assistant:not(.note)')) {
      state.textHistory.push({ role: 'assistant', content: t('greeting') });
      addLine('assistant', t('greeting'));
    }
    input.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text || state.busy) return;
    input.value = '';
    addLine('user', text);

    if (state.mode === 'voice' && state.dc && state.dc.readyState === 'open') {
      // Texto dentro de la sesión de voz: el bot responde por voz.
      var id = 'txt_' + Date.now();
      state.items.push({ id: id, role: 'user', text: text });
      send({ type: 'conversation.item.create', item: { type: 'message', role: 'user', content: [{ type: 'input_text', text: text }] } });
      send({ type: 'response.create' });
      return;
    }
    if (state.mode !== 'text') startText();
    state.textHistory.push({ role: 'user', content: text });
    state.busy = true;
    setStatus('thinking');
    host.classList.add('is-thinking');
    api('/chat', { messages: state.textHistory, lang: state.lang })
      .then(function (r) {
        var reply = r.reply || t('error');
        state.textHistory.push({ role: 'assistant', content: reply });
        addLine('assistant', reply);
        if (r.lead) state.leadDone = true;
      })
      .catch(function () { state.textHistory.pop(); addLine('assistant', t('error')).parentNode.classList.add('note'); })
      .then(function () { state.busy = false; setStatus('online'); host.classList.remove('is-thinking'); });
  });

  // ---------- red ----------
  function api(path, body) {
    return fetch(ENDPOINT + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(function (r) {
      return r.json().then(function (d) { if (!r.ok) throw new Error(d.error || r.status); return d; });
    });
  }

  // ---------- estilos: V5 "Turno de noche" ----------
  function CSS() {
    return [
      ':host{--lvl:0;--bg:#0B0E11;--bg-2:#0D1014;--line:#222A33;--ink:#E8EAED;--dim:#9AA3AD;--brass:#C9A96A;',
      '  --sans:Archivo,"Helvetica Neue",Arial,system-ui,sans-serif;--mono:"Fragment Mono",ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;',
      '  position:fixed;right:max(24px,env(safe-area-inset-right));bottom:max(24px,env(safe-area-inset-bottom));z-index:2147483000;',
      '  font:400 14px/1.55 var(--sans);color:var(--ink);-webkit-font-smoothing:antialiased}',
      '*{box-sizing:border-box}',
      'button{font:inherit;color:inherit;cursor:pointer;background:none;border:0;padding:0}',
      'button:focus-visible,input:focus-visible{outline:1px solid var(--brass);outline-offset:3px}',

      // Nodo flotante: anillo fino de latón + núcleo pequeño
      '.orb{position:relative;display:block;margin-left:auto;width:52px;height:52px;border-radius:50%;',
      '  border:1px solid var(--brass);background:rgba(11,14,17,.82);transition:border-color .3s,background .3s}',
      '.orb:hover{background:rgba(13,16,20,.95)}',
      '.core{position:absolute;left:50%;top:50%;width:6px;height:6px;margin:-3px 0 0 -3px;border-radius:50%;background:var(--brass);',
      '  transform:scale(calc(1 + 1.6*var(--lvl)));transition:transform .06s linear}',
      '.halo{position:absolute;inset:-1px;border-radius:50%;border:1px solid var(--brass);opacity:0;',
      '  transform:scale(calc(1 + .4*var(--lvl)));transition:transform .06s linear,opacity .2s}',
      ':host(.is-speaking) .halo,:host(.is-hearing) .halo{opacity:calc(.15 + .6*var(--lvl))}',
      ':host(:not(.is-open)) .halo{animation:ping 3.2s cubic-bezier(.2,.6,.3,1) infinite}',
      ':host(.is-thinking) .core{animation:blink 1.2s ease-in-out infinite}',
      '@keyframes ping{0%{opacity:.5;transform:scale(1)}70%,100%{opacity:0;transform:scale(1.45)}}',
      '@keyframes blink{0%,100%{opacity:1}50%{opacity:.25}}',

      // Panel
      '.panel{position:absolute;right:0;bottom:68px;width:min(368px,calc(100vw - 32px));max-height:min(580px,calc(100vh - 110px));display:flex;flex-direction:column;',
      '  background:rgba(11,14,17,.97);border:1px solid var(--line);border-radius:10px;box-shadow:0 30px 80px rgba(0,0,0,.6);overflow:hidden}',
      '.panel[hidden]{display:none}',
      'header{padding:16px 18px 12px;border-bottom:1px solid var(--line)}',
      '.row{display:flex;align-items:center;justify-content:space-between;gap:12px}',
      'h2{margin:0;font:600 11px/1 var(--sans);letter-spacing:.24em;text-transform:uppercase;color:var(--ink)}',
      '.x{position:relative;width:28px;height:28px;margin-right:-6px;color:var(--dim)}',
      '.x span::before,.x span::after{content:"";position:absolute;left:7px;top:13.5px;width:14px;height:1px;background:currentColor;transform:rotate(45deg)}',
      '.x span::after{transform:rotate(-45deg)}',
      '.x:hover{color:var(--ink)}',
      '.meta{margin-top:10px}',
      '.seal{font:400 9.5px/1 var(--mono);letter-spacing:.22em;text-transform:uppercase;color:var(--brass);display:inline-flex;align-items:center;gap:8px}',
      '.seal::before{content:"";width:14px;height:1px;background:var(--brass)}',
      '.status{font:400 9.5px/1 var(--mono);letter-spacing:.2em;text-transform:uppercase;color:var(--dim);display:inline-flex;align-items:center;gap:7px}',
      '.status:not(:empty)::before{content:"";width:5px;height:5px;border-radius:50%;background:var(--dim)}',
      '.status[data-state=speaking]::before{background:rgb(72,140,255)}',
      ':host(.is-hearing) .status::before{background:rgb(255,66,66)}',
      '.status[data-state=online]::before,.status[data-state=listening]::before{background:var(--brass)}',
      '.status[data-state=connecting]::before,.status[data-state=thinking]::before{animation:blink 1s ease-in-out infinite}',

      // Escenario de voz (solo visual: sin transcripción ni input)
      '.stage{position:relative;height:360px;overflow:hidden;background:radial-gradient(ellipse at center,#0D1014 0%,#0B0E11 72%)}',
      '.glass{position:absolute;border-radius:50%;overflow:hidden;background:#07090b;isolation:isolate}',
      '.glass .metal{position:absolute;filter:blur(18px) saturate(1.22)}',
      '.stage .pane{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}',
      '.panel:not([data-mode=voice]) .stage{display:none}',
      '.panel[data-mode=voice] .log,.panel[data-mode=voice] .ask{display:none}',

      // Registro (modo texto)
      '.log{flex:1;overflow-y:auto;padding:6px 18px 14px;min-height:150px;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:var(--line) transparent}',
      '.log p{margin:16px 0 0;white-space:pre-wrap;word-wrap:break-word;color:var(--ink)}',
      '.log b{display:block;margin-bottom:5px;font:400 9.5px/1 var(--mono);letter-spacing:.2em;text-transform:uppercase;color:var(--dim)}',
      '.log .assistant b{color:var(--brass)}',
      '.log .note span{color:var(--dim)}',
      '.ask{display:flex;align-items:center;gap:14px;margin:0 18px;padding:6px 0;border-top:1px solid var(--line)}',
      '.ask input{flex:1;min-width:0;height:44px;padding:0;border:0;background:transparent;color:var(--ink);font:400 16px var(--sans);outline:none}',
      '.ask input::placeholder{color:var(--dim)}',
      '.ask button{flex:none;height:44px;font:600 11px/1 var(--sans);letter-spacing:.22em;text-transform:uppercase;color:var(--brass);transition:color .2s,letter-spacing .2s}',
      '.ask button:hover{color:var(--ink);letter-spacing:.28em}',

      // Pie
      'footer{display:flex;flex-direction:column;gap:8px;padding:12px 18px 14px;border-top:1px solid var(--line)}',
      '.ctl{display:flex;flex-wrap:wrap;gap:4px 18px}',
      'footer button{padding:4px 0;font:400 9.5px/1 var(--mono);letter-spacing:.2em;text-transform:uppercase;color:var(--dim);transition:color .2s}',
      'footer button:hover{color:var(--brass)}',
      'footer button[hidden]{display:none}',
      '.disc{font:400 9px/1.4 var(--mono);letter-spacing:.14em;text-transform:uppercase;color:#5E6670}',

      '@media (max-width:480px){:host{right:16px;bottom:max(16px,env(safe-area-inset-bottom))}',
      '  .panel{position:fixed;left:12px;right:12px;bottom:84px;width:auto;max-height:calc(100dvh - 104px)}.stage{height:300px}}',
      '@media (prefers-reduced-motion:reduce){.halo,.core,.status::before{animation:none!important}}',
    ].join('\n');
  }
})();
