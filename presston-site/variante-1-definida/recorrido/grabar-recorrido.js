// node rec.js <url> <outdir> [fps] [W] [H]  — deterministic scroll-through recording
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs'); const path = require('path');
const [,, url, outdir, FPS='30', W='1920', H='1080'] = process.argv;
const fps=+FPS, DT=1000/fps;
const CDN = path.join(__dirname,'cdn');
const LIB = { 'gsap.min.js':'gsap/dist/gsap.min.js','ScrollTrigger.min.js':'gsap/dist/ScrollTrigger.min.js','lenis.min.js':'lenis/dist/lenis.min.js' };
const fontCache = path.join(__dirname,'fontcache');
function curl(u){ const k=path.join(fontCache,Buffer.from(u).toString('base64url').slice(0,200)); if(fs.existsSync(k)) return fs.readFileSync(k); const b=execFileSync('curl',['-sS','-A','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36',u]); fs.writeFileSync(k,b); return b; }

// Virtual clock: performance.now / Date.now / rAF / timers all run on `vt`.
// 'real' mode pumps vt from the real clock; 'manual' mode advances only via __step().
const CLOCK = () => {
  const oRAF = window.requestAnimationFrame.bind(window), oST = window.setTimeout.bind(window), oCT = window.clearTimeout.bind(window);
  const oNow = performance.now.bind(performance), oDate = Date.now;
  const p0 = oNow(), d0 = oDate();
  let vt = 0, mode = 'real', last = p0, rafQ = [], rafId = 1, timers = new Map(), tid = 1;
  performance.now = () => p0 + vt;
  Date.now = () => d0 + vt;
  window.requestAnimationFrame = cb => { const id = rafId++; rafQ.push([id, cb]); return id; };
  window.cancelAnimationFrame = id => { rafQ = rafQ.filter(x => x[0] !== id); };
  window.setTimeout = (cb, ms, ...a) => { const id = tid++; timers.set(id, { at: vt + (+ms || 0), cb, a }); return id; };
  window.clearTimeout = id => timers.delete(id);
  window.setInterval = (cb, ms, ...a) => { const id = tid++; const t = { at: vt + Math.max(+ms||0,1), cb, a, every: Math.max(+ms||0,1) }; timers.set(id, t); return id; };
  window.clearInterval = id => timers.delete(id);
  function fireTimers(){
    for (let guard=0; guard<1000; guard++){
      let best=null, bid=null; for (const [id,t] of timers){ if (t.at <= vt && (!best || t.at < best.at)){ best=t; bid=id; } }
      if (!best) break;
      if (best.every) best.at += best.every; else timers.delete(bid);
      try { typeof best.cb === 'function' ? best.cb(...best.a) : eval(best.cb); } catch(e){ console.error(e); }
    }
  }
  function step(dt){
    vt += dt; fireTimers();
    const q = rafQ; rafQ = []; const t = p0 + vt;
    for (const [, cb] of q){ try { cb(t); } catch(e){ console.error(e); } }
  }
  function pump(now){ if (mode === 'real'){ step(now - last); last = now; } oRAF(pump); }
  oRAF(n => { last = n; oRAF(pump); });
  // videos: never really play; their frame is seeked to virtual time
  const vids = new Map();
  const oPlay = HTMLMediaElement.prototype.play, oPause = HTMLMediaElement.prototype.pause;
  HTMLMediaElement.prototype.play = function(){ if (!vids.has(this)) vids.set(this, vt); return Promise.resolve(); };
  HTMLMediaElement.prototype.pause = function(){ vids.delete(this); return oPause.call(this); };
  // CSS / Web animations follow virtual time once recording starts
  const anims = new WeakMap();
  window.__rec = {
    manual(){ mode = 'manual'; },
    async step(){
      step(DT_MS);
      for (const a of document.getAnimations()){
        if (!anims.has(a)){ anims.set(a, { ct:(a.currentTime||0), vt }); a.pause(); }
        const s = anims.get(a); a.currentTime = s.ct + (vt - s.vt);
      }
      const seeks = [];
      for (const [v, start] of vids){
        const layer = v.closest('.bd-layer'); if (layer && parseFloat(getComputedStyle(layer).opacity) < 0.01) continue;
        if (!v.duration || !isFinite(v.duration) || v.readyState < 1) continue;
        const t = ((vt - start) / 1000) % v.duration;
        if (Math.abs(v.currentTime - t) < 0.001) continue;
        seeks.push(new Promise(r => { const done = () => { v.removeEventListener('seeked', done); r(); }; v.addEventListener('seeked', done); oST(done, 1500); v.currentTime = t; }));
      }
      await Promise.all(seeks);
      return vt;
    },
    get vt(){ return vt; }
  };
};

(async()=>{
  fs.mkdirSync(outdir,{recursive:true});
  for (const f of fs.readdirSync(outdir)) if (f.endsWith('.jpg')) fs.unlinkSync(path.join(outdir,f));
  const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium', args:['--autoplay-policy=no-user-gesture-required'] });
  const p = await b.newPage({ viewport:{width:+W,height:+H}, deviceScaleFactor:1 });
  const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{ if(m.type()==='error') errs.push(m.text()); });
  await p.route(/cdnjs\.cloudflare\.com|unpkg\.com/, r=>{ const f=LIB[path.basename(new URL(r.request().url()).pathname)]; return f? r.fulfill({body:fs.readFileSync(path.join(CDN,f)),contentType:'application/javascript'}) : r.abort(); });
  await p.route(/fonts\.googleapis\.com/, r=>r.fulfill({body:curl(r.request().url()),contentType:'text/css'}));
  await p.route(/fonts\.gstatic\.com/, r=>r.fulfill({body:curl(r.request().url()),contentType:'font/woff2'}));
  await p.route(/\.mp4(\?|$)/, r=>{ const n=path.basename(new URL(r.request().url()).pathname,'.mp4'); const f=path.join(__dirname,'rec/webm',n+'.webm'); return fs.existsSync(f)? r.fulfill({path:f,contentType:'video/webm'}) : r.abort(); });
  await p.addInitScript(`(${CLOCK.toString().replace('DT_MS', DT)})()`);
  await p.addInitScript(()=>{ try{ sessionStorage.setItem('presstonLang','es'); }catch(e){} });
  await p.goto(url,{waitUntil:'load'}); await p.waitForTimeout(800);
  await p.click('#gateAcceptLabel',{position:{x:2,y:6}}); await p.fill('#gateCode','PSP'); await p.click('#gateSubmit');
  await p.waitForFunction(()=>getComputedStyle(document.getElementById('gate')).display==='none',null,{timeout:10000});
  await p.mouse.move(+W-4, Math.round(+H*0.55));
  await p.waitForTimeout(2500);
  // force-load every background video so seeks work during recording
  await p.evaluate(()=>Promise.all([...document.querySelectorAll('video')].map(v=>{ if(!v.src) v.src=v.dataset.src; v.preload='auto'; v.load(); return new Promise(r=>{ if(v.readyState>=2) r(); v.addEventListener('loadeddata',r,{once:true}); setTimeout(r,8000); }); })));
  console.log('videos:', await p.evaluate(()=>[...document.querySelectorAll('video')].map(v=>v.id+':'+v.readyState+':'+(v.duration||0).toFixed(1)).join(' ')));
  // waypoints: every beat anchor of the staged scenes + slow read through flow scenes
  const plan = await p.evaluate(()=>{
    const vh=innerHeight, y0=scrollY, out=[];
    document.querySelectorAll('main > .scene').forEach(el=>{
      const r=el.getBoundingClientRect(), top=r.top+y0, staged=el.classList.contains('is-staged');
      const beats=parseInt(el.style.getPropertyValue('--beats'),10)||1;
      if (staged){ const end=top+r.height-vh; for(let k=0;k<beats;k++) out.push({id:el.id,kind:'beat',y: el.id==='hero'? top : top+(k+.5)/beats*(end-top)}); }
      else out.push({id:el.id,kind:'flow',from:Math.max(0,top),to:top+r.height-vh});
    });
    return { out, max: document.documentElement.scrollHeight - vh };
  });
  await p.evaluate(()=>window.__rec.manual());
  let frame=0, y=await p.evaluate(()=>scrollY);
  const shot = async()=>{ await p.evaluate(()=>window.__rec.step()); await p.screenshot({path:path.join(outdir,String(frame++).padStart(5,'0')+'.jpg'),type:'jpeg',quality:92}); if(frame%150===0) console.log('frame',frame,'y',Math.round(y)); };
  const ease = t => t<.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;
  const hold = async s => { for(let i=0;i<Math.round(s*fps);i++) await shot(); };
  const move = async (to, secs) => { const from = await p.evaluate(()=>scrollY); const n=Math.max(1,Math.round(secs*fps)); for(let i=1;i<=n;i++){ y=from+(to-from)*ease(i/n); await p.evaluate(v=>window.scrollTo(0,v),y); await shot(); } };
  const dur = d => Math.min(2.2, Math.max(0.9, Math.abs(d)/900));
  await hold(2.5);                                   // hero settles
  for (const w of plan.out){
    if (w.kind==='beat'){ if (w.id==='hero') continue; const cur=await p.evaluate(()=>scrollY); await move(w.y, dur(w.y-cur)); await hold(w.id==='contact'?2.2:1.7); }
    else { const cur=await p.evaluate(()=>scrollY); await move(w.from, dur(w.from-cur)); await hold(0.5);
      const len=w.to-w.from; if (len>0){ const n=Math.round(len/420*fps); const s=w.from; for(let i=1;i<=n;i++){ y=s+len*(i/n); await p.evaluate(v=>window.scrollTo(0,v),y); await shot(); } await hold(0.4);} }
  }
  { const cur=await p.evaluate(()=>scrollY); await move(plan.max, dur(plan.max-cur)); await hold(2.5); }   // footer
  console.log('frames:',frame,'seconds:',(frame/fps).toFixed(1)); console.log('errors:', errs.length?errs.slice(0,5):'none');
  await b.close();
})();
