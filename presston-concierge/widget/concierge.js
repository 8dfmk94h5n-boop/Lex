/*!
 * Presston — Concierge AI · widget (vanilla JS, sin dependencias).
 * Integración en el index.html del sitio, antes de </body>:
 *   <script src="/concierge.js" data-endpoint="https://concierge.<cuenta>.workers.dev" defer></script>
 * Todo vive en un Shadow DOM: no toca el diseño ni el copy del sitio.
 */
(function () {
  'use strict';
  if (window.__presstonConcierge) return;
  window.__presstonConcierge = true;

  var script = document.currentScript || document.querySelector('script[data-endpoint][src*="concierge"]');
  var ENDPOINT = ((script && script.getAttribute('data-endpoint')) || '').replace(/\/+$/, '');
  var REALTIME_CALLS = 'https://api.openai.com/v1/realtime/calls';

  var T = {
    ES: {
      open: 'Hablar con Presston — Concierge AI',
      close: 'Cerrar',
      title: 'Presston — Concierge AI',
      connecting: 'Conectando…',
      listening: 'Escuchando',
      speaking: 'Hablando',
      thinking: 'Pensando…',
      textMode: 'Modo texto',
      voiceMode: 'Modo voz',
      mute: 'Silenciar micrófono',
      unmute: 'Activar micrófono',
      placeholder: 'Escribe tu pregunta',
      send: 'Enviar',
      greeting: 'Soy Presston — Concierge AI, la AI de Presston. ¿Qué te trae por aquí? (I can also continue in English.)',
      noMic: 'Sin acceso al micrófono. Seguimos por texto.',
      noVoice: 'La voz no está disponible ahora. Seguimos por texto.',
      error: 'No pude responder. Intenta de nuevo en un momento.',
      you: 'Tú',
      disclaimer: 'AI de Presston. Proyecciones, no garantías.',
    },
    EN: {
      open: 'Talk to Presston — Concierge AI',
      close: 'Close',
      title: 'Presston — Concierge AI',
      connecting: 'Connecting…',
      listening: 'Listening',
      speaking: 'Speaking',
      thinking: 'Thinking…',
      textMode: 'Text mode',
      voiceMode: 'Voice mode',
      mute: 'Mute microphone',
      unmute: 'Unmute microphone',
      placeholder: 'Type your question',
      send: 'Send',
      greeting: "I'm Presston — Concierge AI, Presston's AI. What brings you here? (También puedo seguir en español.)",
      noMic: 'No microphone access. We can continue by text.',
      noVoice: 'Voice is unavailable right now. We can continue by text.',
      error: "I couldn't answer. Please try again in a moment.",
      you: 'You',
      disclaimer: "Presston's AI. Projections, not guarantees.",
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
    analyser: null,
    raf: 0,
    speaking: false,
    busy: false,
    leadDone: false,
    items: [], // transcripción ordenada: {id, role, text}
    textHistory: [], // modo texto: {role, content}
  };

  // ---------- DOM ----------
  var host = document.createElement('div');
  host.id = 'presston-concierge';
  var root = host.attachShadow({ mode: 'open' });
  root.innerHTML =
    '<style>' + CSS() + '</style>' +
    '<section class="panel" role="dialog" aria-modal="false" aria-labelledby="pc-title" hidden>' +
    '  <header><h2 id="pc-title"></h2><button class="x" type="button"></button></header>' +
    '  <p class="status" aria-live="polite"></p>' +
    '  <div class="log" aria-live="polite"></div>' +
    '  <form class="ask" autocomplete="off"><input type="text" maxlength="1000"><button type="submit"></button></form>' +
    '  <footer><button class="mode" type="button"></button><button class="mute" type="button"></button>' +
    '    <button class="lang" type="button" aria-label="Idioma / Language"></button><span class="disc"></span></footer>' +
    '</section>' +
    '<button class="orb" type="button" aria-expanded="false"><span class="core"></span></button>';
  var $ = function (s) { return root.querySelector(s); };
  var orb = $('.orb'), panel = $('.panel'), log = $('.log'), statusEl = $('.status');
  var form = $('.ask'), input = $('.ask input');

  function mount() { document.body.appendChild(host); applyLang(); }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);

  function t(k) { return T[state.lang][k]; }

  function applyLang() {
    orb.setAttribute('aria-label', state.open ? t('close') : t('open'));
    $('#pc-title').textContent = t('title');
    $('.x').setAttribute('aria-label', t('close'));
    $('.x').textContent = '×';
    input.placeholder = t('placeholder');
    $('.ask button').textContent = t('send');
    $('.mode').textContent = state.mode === 'voice' ? t('textMode') : t('voiceMode');
    $('.mute').textContent = state.muted ? t('unmute') : t('mute');
    $('.mute').hidden = state.mode !== 'voice';
    $('.lang').textContent = state.lang === 'ES' ? 'EN' : 'ES';
    $('.disc').textContent = t('disclaimer');
  }

  function setStatus(key) { statusEl.textContent = key ? t(key) : ''; }

  function setLevel(v) { host.style.setProperty('--lvl', String(Math.max(0, Math.min(1, v)))); }

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
    pc.ontrack = function (e) { audio.srcObject = e.streams[0]; meter(e.streams[0]); };
    mic.getTracks().forEach(function (tr) { pc.addTrack(tr, mic); });

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
    if (state.dc) try { state.dc.close(); } catch (e) {}
    if (state.pc) try { state.pc.close(); } catch (e) {}
    if (state.mic) state.mic.getTracks().forEach(function (tr) { tr.stop(); });
    state.dc = state.pc = state.mic = state.analyser = null;
    state.speaking = false;
    setLevel(0);
    host.classList.remove('is-speaking');
  }

  function send(evt) { if (state.dc && state.dc.readyState === 'open') state.dc.send(JSON.stringify(evt)); }

  // La esfera sigue la amplitud real de la voz del bot.
  function meter(stream) {
    if (!state.audioCtx) return;
    try {
      var src = state.audioCtx.createMediaStreamSource(stream);
      var an = state.audioCtx.createAnalyser();
      an.fftSize = 512;
      src.connect(an);
      state.analyser = an;
      var buf = new Uint8Array(an.fftSize);
      var smooth = 0;
      (function tick() {
        if (!state.analyser) return;
        an.getByteTimeDomainData(buf);
        var sum = 0;
        for (var i = 0; i < buf.length; i++) { var v = (buf[i] - 128) / 128; sum += v * v; }
        var rms = Math.sqrt(sum / buf.length);
        smooth = smooth * 0.7 + Math.min(1, rms * 4) * 0.3;
        setLevel(smooth);
        state.raf = requestAnimationFrame(tick);
      })();
    } catch (e) { console.warn('[concierge] analyser:', e); }
  }

  function itemFor(id, role) {
    for (var i = 0; i < state.items.length; i++) if (state.items[i].id === id) return state.items[i];
    var it = { id: id, role: role, text: '' };
    state.items.push(it);
    return it;
  }

  var live = null; // línea del bot en curso
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

  // ---------- modo texto ----------
  function fallbackToText(msgKey) {
    if (msgKey) addLine('assistant', t(msgKey)).parentNode.classList.add('note');
    startText();
  }

  function startText() {
    state.mode = 'text';
    applyLang();
    setStatus('');
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
      // Texto dentro de la sesión de voz: el bot responde por voz y subtítulo.
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
      .then(function () { state.busy = false; setStatus(''); host.classList.remove('is-thinking'); });
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

  // ---------- estilos (línea SpaceX: acero oscuro, ámbar, minimalista) ----------
  function CSS() {
    return [
      ':host{--lvl:0;--steel-0:#0b0d10;--steel-1:#14181c;--steel-2:#22282e;--steel-3:#3a424a;--ink:#d8dde2;--mute:#8a949e;--amber:#ffab2e;',
      '  position:fixed;right:max(20px,env(safe-area-inset-right));bottom:max(20px,env(safe-area-inset-bottom));z-index:2147483000;',
      '  font:14px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;color:var(--ink)}',
      '*{box-sizing:border-box}',
      'button{font:inherit;color:inherit;cursor:pointer}',
      // Esfera
      '.orb{position:relative;display:block;margin-left:auto;width:64px;height:64px;padding:0;border:0;border-radius:50%;',
      '  background:radial-gradient(circle at 34% 28%,#6b747d 0%,#2b3137 42%,#0d1013 100%);',
      '  box-shadow:0 0 0 1px rgba(255,171,46,calc(.28 + .5*var(--lvl))),0 0 calc(10px + 46px*var(--lvl)) rgba(255,160,30,calc(.18 + .6*var(--lvl))),0 10px 30px rgba(0,0,0,.45);',
      '  transform:scale(calc(1 + .1*var(--lvl)));transition:transform .08s linear,box-shadow .08s linear;animation:breathe 4.5s ease-in-out infinite}',
      '.orb:focus-visible{outline:2px solid var(--amber);outline-offset:4px}',
      '.core{position:absolute;inset:22%;border-radius:50%;background:radial-gradient(circle,rgba(255,196,110,.95) 0%,rgba(255,150,20,.55) 45%,rgba(255,140,0,0) 72%);',
      '  opacity:calc(.12 + .88*var(--lvl));transform:scale(calc(.75 + .5*var(--lvl)));transition:opacity .08s linear,transform .08s linear}',
      ':host(.is-thinking) .core{animation:think 1.1s ease-in-out infinite}',
      ':host(.is-speaking) .orb,:host(.is-thinking) .orb{animation:none}',
      '@keyframes breathe{0%,100%{box-shadow:0 0 0 1px rgba(255,171,46,.28),0 0 10px rgba(255,160,30,.16),0 10px 30px rgba(0,0,0,.45)}50%{box-shadow:0 0 0 1px rgba(255,171,46,.45),0 0 22px rgba(255,160,30,.3),0 10px 30px rgba(0,0,0,.45)}}',
      '@keyframes think{0%,100%{opacity:.25;transform:scale(.8)}50%{opacity:.9;transform:scale(1.1)}}',
      // Panel
      '.panel{position:absolute;right:0;bottom:80px;width:min(360px,calc(100vw - 32px));max-height:min(560px,calc(100vh - 120px));display:flex;flex-direction:column;',
      '  background:rgba(12,14,17,.96);border:1px solid var(--steel-2);border-radius:14px;box-shadow:0 24px 60px rgba(0,0,0,.55);backdrop-filter:blur(10px);overflow:hidden}',
      '.panel[hidden]{display:none}',
      'header{display:flex;align-items:center;justify-content:space-between;padding:14px 16px 6px;border-bottom:1px solid var(--steel-1)}',
      'h2{margin:0;font-size:11px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--ink)}',
      '.x{width:32px;height:32px;border:0;background:none;font-size:22px;line-height:1;color:var(--mute);border-radius:8px}',
      '.x:hover,.x:focus-visible{color:var(--ink);background:var(--steel-1);outline:none}',
      '.status{margin:0;padding:6px 16px 0;min-height:22px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--amber)}',
      '.log{flex:1;overflow-y:auto;padding:8px 16px 12px;min-height:120px;overscroll-behavior:contain}',
      '.log p{margin:10px 0;white-space:pre-wrap;word-wrap:break-word}',
      '.log b{display:block;font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--mute);margin-bottom:2px}',
      '.log .assistant b{color:var(--amber)}',
      '.log .note span{color:var(--mute);font-style:italic}',
      '.ask{display:flex;gap:8px;padding:10px 12px;border-top:1px solid var(--steel-1)}',
      '.ask input{flex:1;min-width:0;height:40px;padding:0 12px;border:1px solid var(--steel-2);border-radius:8px;background:var(--steel-0);color:var(--ink);font:inherit;font-size:16px}',
      '.ask input:focus{outline:none;border-color:var(--amber)}',
      '.ask button{height:40px;padding:0 14px;border:1px solid var(--steel-3);border-radius:8px;background:var(--steel-1);font-size:12px;letter-spacing:.1em;text-transform:uppercase}',
      '.ask button:hover,.ask button:focus-visible{border-color:var(--amber);outline:none}',
      'footer{display:flex;flex-wrap:wrap;align-items:center;gap:6px 12px;padding:0 16px 12px;font-size:11px;color:var(--mute)}',
      'footer button{border:0;background:none;padding:6px 0;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute);text-decoration:underline;text-underline-offset:3px}',
      'footer button:hover,footer button:focus-visible{color:var(--amber);outline:none}',
      'footer button[hidden]{display:none}',
      '.disc{flex-basis:100%;font-size:10px;letter-spacing:.04em}',
      '@media (max-width:480px){:host{right:16px;bottom:max(16px,env(safe-area-inset-bottom))}.panel{position:fixed;left:16px;right:16px;bottom:92px;width:auto;max-height:calc(100dvh - 120px)}}',
      '@media (prefers-reduced-motion:reduce){.orb,.core{animation:none!important;transition:none!important}}',
    ].join('\n');
  }
})();
