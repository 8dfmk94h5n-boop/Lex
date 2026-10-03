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
    '  <div class="stage" role="img"><div class="sphere"></div><canvas></canvas></div>' +
    '  <div class="log" aria-live="polite"></div>' +
    '  <form class="ask" autocomplete="off"><input type="text" maxlength="1000"><button type="submit"></button></form>' +
    '  <footer><div class="ctl"><button class="mode" type="button"></button><button class="mute" type="button"></button>' +
    '    <button class="lang" type="button" aria-label="Idioma / Language"></button></div><span class="disc"></span></footer>' +
    '</section>' +
    '<button class="orb" type="button" aria-expanded="false"><span class="halo"></span><span class="core"></span></button>';
  var $ = function (s) { return root.querySelector(s); };
  var orb = $('.orb'), panel = $('.panel'), log = $('.log'), statusEl = $('.status');
  var form = $('.ask'), input = $('.ask input');
  var stage = $('.stage'), canvas = $('.stage canvas'), ctx2d = canvas.getContext('2d');

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

  // ---------- escenario de voz: esfera blanca difuminada + olas orbitando ----------
  // Olas azules al ritmo de la voz de la AI; rojas mientras el visitante habla.
  // El pulso sigue la amplitud real (RMS) de cada voz.
  var BLUE = [72, 140, 255], RED = [255, 66, 66];
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function startStage() {
    cancelAnimationFrame(state.raf);
    var aiLvl = 0, meLvl = 0, mix = 0, heardAt = -1e9, t0 = performance.now();
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
      drawWaves((now - t0) / 1000 * (REDUCED ? 0.25 : 1), lvl, mix);
      state.raf = requestAnimationFrame(frame);
    })(t0);
  }

  function drawWaves(t, lvl, mix) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    var c = ctx2d;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, w, h);
    c.globalCompositeOperation = 'lighter';
    var col = [0, 1, 2].map(function (i) { return Math.round(BLUE[i] + (RED[i] - BLUE[i]) * mix); }).join(',');
    var m = Math.min(w, h), cx = w / 2, cy = h / 2, N = 140;
    var breath = 0.5 + 0.5 * Math.sin(t * 0.9); // respiración en reposo
    for (var i = 0; i < 4; i++) {
      var R = m * (0.25 + i * 0.05);
      var amp = m * (0.008 + 0.006 * breath + 0.085 * lvl) * (1 - i * 0.14);
      var k = 3 + i, dir = i % 2 ? -1 : 1;
      var rot = t * (0.22 + 0.09 * i) * dir;
      var ph = t * (1.1 + 0.35 * i);
      c.beginPath();
      for (var j = 0; j <= N; j++) {
        var a = (j / N) * Math.PI * 2;
        var r = R + amp * Math.sin(k * a + ph) + amp * 0.45 * Math.sin((k + 2) * a - ph * 1.3);
        var x = cx + r * Math.cos(a + rot), y = cy + r * Math.sin(a + rot);
        j ? c.lineTo(x, y) : c.moveTo(x, y);
      }
      c.closePath();
      c.strokeStyle = 'rgba(' + col + ',' + (0.5 + 0.4 * lvl - i * 0.08).toFixed(3) + ')';
      c.lineWidth = m * (0.02 - i * 0.003) * (1 + lvl * 0.8);
      c.stroke();
    }
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
      '.stage{position:relative;height:300px;overflow:hidden;background:radial-gradient(ellipse at center,#0D1014 0%,#0B0E11 70%)}',
      '.sphere{position:absolute;left:50%;top:50%;width:42%;aspect-ratio:1;border-radius:50%;',
      '  background:radial-gradient(circle,rgba(255,255,255,.95) 0%,rgba(255,255,255,.7) 32%,rgba(255,255,255,.18) 58%,rgba(255,255,255,0) 72%);',
      '  filter:blur(14px);transform:translate(-50%,-50%) scale(calc(.86 + .26*var(--lvl)));opacity:calc(.78 + .22*var(--lvl));transition:transform .06s linear}',
      '.stage canvas{position:absolute;inset:0;width:100%;height:100%;filter:blur(7px)}',
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
      '  .panel{position:fixed;left:12px;right:12px;bottom:84px;width:auto;max-height:calc(100dvh - 104px)}.stage{height:260px}}',
      '@media (prefers-reduced-motion:reduce){.halo,.core,.status::before{animation:none!important}}',
    ].join('\n');
  }
})();
