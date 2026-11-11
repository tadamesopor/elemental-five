/* ================= sound (real clips + small generated card sounds) ================= */
var SFX = window.__SFX__ || Object.fromEntries([...ELS, 'music', 'click', 'hover'].map(k => [k, `assets/snd/${k}.mp3`]));
var SND = (() => {
  let ac = null, on = true, started = false, master, musicG, nbuf, amb = null, music = null;
  const bufs = {};
  const BASE = { vuur: .85, water: 1.15, lucht: 1.0, aarde: .5, ether: .9 };
  const R = (a, b) => a + Math.random() * (b - a);
  function init() {
    if (ac) return;
    ac = new (window.AudioContext || window.webkitAudioContext)();
    master = ac.createGain(); master.gain.value = .9; master.connect(ac.destination);
    musicG = ac.createGain(); musicG.gain.value = 0; musicG.connect(master);
    nbuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
    const d = nbuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    Object.entries(SFX).forEach(([k, uri]) => {
      const done = buf => { bufs[k] = buf; if (k === 'music') startMusic(); if (amb && amb.el === k && !amb.src) ambient(k); };
      bytes(uri).then(ab => new Promise((ok, no) => ac.decodeAudioData(ab, ok, no))).then(done).catch(() => {});
    });
  }
  // embedded file (data: uri) or a normal file path
  function bytes(uri) {
    if (!uri.startsWith('data:')) return fetch(uri).then(r => r.arrayBuffer());
    const bin = atob(uri.slice(uri.indexOf(',') + 1)), u8 = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    return Promise.resolve(u8.buffer);
  }
  const noise = () => { const s = ac.createBufferSource(); s.buffer = nbuf; s.loop = true; s.loopStart = Math.random(); return s; };
  function filt(type, f, q = 1) { const b = ac.createBiquadFilter(); b.type = type; b.frequency.value = f; b.Q.value = q; return b; }
  function gain(v) { const g = ac.createGain(); g.gain.value = v; return g; }
  function play(name, vol = 1) {
    if (!on || !ac || !bufs[name]) return;
    const s = ac.createBufferSource(), g = gain(vol); s.buffer = bufs[name]; s.connect(g).connect(master); s.start();
  }
  function hit({ f = 2000, q = .8, dur = .09, peak = .2, type = 'bandpass', sweep = null, at = 0 }) {
    if (!on || !ac) return;
    const t = ac.currentTime + at, s = noise(), b = filt(type, f, q), g = gain(0);
    if (sweep) b.frequency.exponentialRampToValueAtTime(sweep, t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + .008); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    s.connect(b).connect(g).connect(master); s.start(t); s.stop(t + dur + .05);
  }
  function tone(f, at, dur, peak, type = 'sine', to = null) {
    if (!on || !ac) return;
    const t = ac.currentTime + at, o = ac.createOscillator(), g = gain(0);
    o.type = type; o.frequency.setValueAtTime(f, t); if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur * .6);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g).connect(master); o.start(t); o.stop(t + dur + .05);
  }
  const flip = () => hit({ f: 1600, q: .7, dur: .11, peak: .22, sweep: 3200 });
  const deal = () => hit({ f: 3200, q: .9, dur: .14, peak: .1, sweep: 900 });
  const click = () => play('click', .8);
  let lastHover = 0;
  const hover = () => { const n = performance.now(); if (n - lastHover < 70) return; lastHover = n; play('hover', .5); };
  function pick() { if (!on) return; [523, 659, 784, 1047].forEach((f, i) => tone(f, i * .07, .9, .05)); }
  function thunder(lv) {
    if (!on || !ac) return;
    const d = R(.15, .9) * (1.2 - lv);
    hit({ f: 140, q: .6, dur: 2.2, peak: .12 + .2 * lv, type: 'lowpass', at: d });
  }

  /* background music: louder on title and result, ducked under an element */
  function startMusic() {
    if (!on || !ac || music || !bufs.music) return;
    const s = ac.createBufferSource(); s.buffer = bufs.music; s.loop = true; s.connect(musicG); s.start();
    music = s; duck();
  }
  function duck() { if (ac) musicG.gain.setTargetAtTime(on ? (want ? .16 : .5) : 0, ac.currentTime, .8); }

  /* element ambience: the clip loops, the slider opens a filter and raises volume */
  function stopAmb() {
    if (!amb) return;
    const a = amb; amb = null;
    try { a.out.gain.setTargetAtTime(0, ac.currentTime, .35); } catch (e) {}
    setTimeout(() => { try { a.src && a.src.stop(); } catch (e) {} }, 1600);
  }
  function ambient(el) {
    stopAmb();
    if (!on || !el || !ac) return;
    const out = gain(0), lp = filt('lowpass', 4000, .5);
    lp.connect(out).connect(master);
    const a = { el, out, lp, src: null, lv: (typeof S !== 'undefined' && S && S.vals && S.vals[el] != null ? S.vals[el] : 50) / 100 };
    if (bufs[el]) {
      const s = ac.createBufferSource(); s.buffer = bufs[el]; s.loop = true;
      s.connect(lp); s.start(0, Math.random() * bufs[el].duration * .8); a.src = s;
    }
    amb = a; level(a.lv, .9);
  }
  function level(v, ramp = .25) {
    if (!amb || !ac) return;
    amb.lv = v; const t = ac.currentTime;
    amb.out.gain.setTargetAtTime((BASE[amb.el] || 1) * (.35 + .85 * v), t, ramp);
    amb.lp.frequency.setTargetAtTime(700 + 15000 * v * v, t, ramp);
    if (amb.src) amb.src.playbackRate.setTargetAtTime(.94 + .12 * v, t, ramp);
  }
  let want = null;
  function setAmbient(el) { want = el; duck(); if (on && started) { try { ambient(el); } catch (e) { console.warn(e); } } }
  /* browsers only allow sound after the first tap or key, so start then */
  function unlock() {
    if (started) return; started = true;
    init(); try { ac.resume(); } catch (e) {}
    if (on) { startMusic(); ambient(want); duck(); }
  }
  function toggle() {
    init(); started = true; on = !on;
    try {
      if (on) { ac.resume(); startMusic(); ambient(want); click(); } else stopAmb();
      duck();
    } catch (e) { console.warn(e); }
    return on;
  }
  return { toggle, unlock, flip, deal, pick, click, hover, tap: click, thunder, setAmbient,
    level: v => { if (on) level(v); }, get on() { return on; } };
})();

/* interface sounds: hover with a mouse, click on every button or card */
(() => {
  const SEL = 'button, [role="button"], a, .t-card, .hc';
  let hovered = null;
  ['pointerdown', 'keydown'].forEach(ev => window.addEventListener(ev, () => SND.unlock(), { capture: true, once: false }));
  document.addEventListener('pointerover', e => {
    if (e.pointerType !== 'mouse') return;
    const t = e.target.closest && e.target.closest(SEL);
    if (t && t !== hovered && !t.disabled) SND.hover();
    hovered = t;
  });
  document.addEventListener('click', e => {
    const t = e.target.closest && e.target.closest(SEL);
    if (t && t.id !== 'sound' && !t.disabled) SND.click();
  }, true);
})();

