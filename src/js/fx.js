/* atmosphere + bursts on a canvas behind the cards */
var FX = (() => {
  const cv = document.getElementById('fx');
  const ctx = cv.getContext('2d');
  const tintEl = document.getElementById('tint');
  let w = 0, h = 0, dpr = 1, mode = null, level = .5, raf = 0, last = 0, T = 0;
  let parts = [], ripples = [], clouds = [], bolts = [], flash = 0, acc = 0, nextBolt = 2;
  const R = (a, b) => a + Math.random() * (b - a);

  function size() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = innerWidth; h = innerHeight;
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size(); addEventListener('resize', size);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) { last = performance.now(); start(); } });

  function tint(m) {
    if (!m) { tintEl.style.opacity = 0; return; }
    tintEl.style.background = VIDS[m]
      ? `radial-gradient(ellipse 75% 65% at 50% 46%, rgba(${ELX[m].rgb},.10) 0%, rgba(0,0,0,.18) 55%, rgba(0,0,0,.62) 100%)`
      : ELX[m].tint;
    tintEl.style.opacity = 1;
  }
  function initClouds() {
    clouds = [];
    for (let i = 0; i < 8; i++) {
      const depth = R(.4, 1);
      clouds.push({ x: R(-.2, 1.1) * w, y: R(.08, .8) * h, s: R(70, 170) * depth, depth,
        blobs: Array.from({ length: 5 }, () => ({ dx: R(-1.2, 1.2), dy: R(-.35, .35), r: R(.5, 1) })) });
    }
  }
  function set(m, lv) {
    if (m !== mode) {
      mode = m;
      parts = parts.filter(p => p.burst); ripples = ripples.filter(r => r.burst); bolts = []; clouds = [];
      if (m === 'lucht') initClouds();
      if (m === 'aarde') for (let i = 0; i < 90; i++) spawn('aarde', true);
      nextBolt = R(1, 3);
    }
    if (lv != null) level = lv;
    tint(m); start();
    if (typeof VID !== 'undefined') VID.show(m, level);
  }
  function setLevel(v) { level = v; if (typeof VID !== 'undefined') VID.level(v); }
  const lite = () => !!(mode && VIDS[mode]);     // a video does the ambient work, keep only what adds to it

  function spawn(m, anywhere) {
    if (m === 'vuur') {
      parts.push({ k: 'ember', x: R(.12, .88) * w, y: h + 8, vx: R(-14, 14), vy: -R(45, 95) * (.55 + level), life: R(2.6, 5.2), age: 0,
        s: R(.8, 2.4) * (.8 + level * .6), hue: R(16, 44), seed: R(0, 6.28) });
    } else if (m === 'lucht') {
      parts.push({ k: 'streak', x: -220, y: R(.06, .9) * h, len: R(80, 220), sp: R(320, 520) * (.5 + level), bend: R(-26, 26), life: 9, age: 0 });
    } else if (m === 'aarde') {
      const up = level < .5;
      parts.push({ k: 'grain', x: R(0, 1) * w, y: anywhere ? R(.1, 1) * h : (up ? h + 6 : R(-.05, .6) * h), vx: R(-10, 10) * (1.2 - level),
        vy: 0, s: R(.8, 2.3), hue: R(30, 44), l: R(55, 78), life: R(4, 9), age: 0, seed: R(0, 6.28) });
    } else if (m === 'ether') {
      parts.push({ k: 'rain', x: R(-.1, 1.15) * w, y: -30, vx: -140 - 120 * level, vy: R(820, 1000) + 700 * level, len: R(12, 26), life: 2, age: 0 });
    }
  }
  function bolt(x0, y0, x1, y1, segs = 18, jitter = 26) {
    const pts = [[x0, y0]];
    for (let i = 1; i < segs; i++) { const t = i / segs; pts.push([x0 + (x1 - x0) * t + R(-jitter, jitter), y0 + (y1 - y0) * t + R(-jitter * .3, jitter * .3)]); }
    pts.push([x1, y1]); return pts;
  }

  function burst(m, x, y) {
    if (reduce) return;
    const add = o => parts.push(Object.assign({ burst: true, age: 0 }, o));
    if (m === 'vuur') {
      for (let i = 0; i < 54; i++) { const a = R(0, 6.28), sp = R(140, 460); add({ k: 'spark', x, y, px: x, py: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 120, g: 260, drag: 1.6, life: R(.6, 1.3), s: R(1.2, 2.6), hue: R(20, 52) }); }
    } else if (m === 'water') {
      for (let i = 0; i < 38; i++) { const a = R(-2.9, -.25), sp = R(170, 420); add({ k: 'drop', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: 950, drag: .4, life: R(.8, 1.4), s: R(1.8, 3.8) }); }
      for (let i = 0; i < 3; i++) ripples.push({ burst: true, x, y, r: 6 + i * 12, rmax: 90 + i * 40, sp: 120, age: 0 });
    } else if (m === 'aarde') {
      for (let i = 0; i < 36; i++) { const a = R(-3, -.15), sp = R(90, 300); add({ k: 'pebble', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: 760, drag: .6, life: R(.8, 1.5), s: R(2, 4.6), rot: R(0, 6), vr: R(-8, 8), hue: R(26, 42), l: R(38, 70) }); }
    } else if (m === 'lucht') {
      for (let i = 0; i < 16; i++) { const a = R(0, 6.28), sp = R(40, 140); add({ k: 'puff', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, drag: 1.4, life: R(.9, 1.6), r0: R(8, 16), r1: R(34, 70) }); }
      for (let i = 0; i < 12; i++) { const a = R(0, 6.28); add({ k: 'swirl', x, y, a, r: 6, vr: R(90, 200), va: R(2, 5) * (Math.random() < .5 ? -1 : 1), life: R(.6, 1.1) }); }
    } else if (m === 'ether') {
      for (let i = 0; i < 4; i++) { const a = R(0, 6.28), L = R(60, 140); bolts.push({ burst: true, pts: bolt(x, y, x + Math.cos(a) * L, y + Math.sin(a) * L, 8, 12), age: 0, life: .35 }); }
      for (let i = 0; i < 30; i++) { const a = R(0, 6.28), sp = R(120, 380); add({ k: 'zap', x, y, px: x, py: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: 0, drag: 2.2, life: R(.4, .9), s: R(1, 2) }); }
      flash = Math.max(flash, .5);
    }
    start();
  }

  function step(dt) {
    T += dt;
    if (mode && !document.hidden) {
      const L = lite();
      const rate = { vuur: (L ? .5 : 1) * (18 + 120 * level), lucht: L ? 0 : 1 + 15 * level, aarde: L ? 0 : 20 + 26 * (1 - Math.abs(level - .5) * 1.2), ether: (L ? .6 : 1) * (50 + 300 * level) }[mode] || 0;
      acc += rate * dt;
      while (acc > 1) { acc--; spawn(mode); }
      if (mode === 'water' && !L && Math.random() < (.6 + 3.6 * level) * dt) ripples.push({ x: R(.08, .92) * w, y: R(.25, .92) * h, r: 2, rmax: R(60, 160), sp: 34 + 70 * level, age: 0 });
      if (mode === 'lucht') for (const c of clouds) { c.x += (14 + 80 * level) * c.depth * dt; if (c.x - c.s * 2 > w) { c.x = -c.s * 2; c.y = R(.08, .8) * h; } }
      if (mode === 'ether') {
        nextBolt -= dt;
        if (nextBolt <= 0) {
          nextBolt = R(.4, 3.2) / (.25 + level * 1.6);
          const x0 = R(.15, .85) * w, y1 = R(.32, .7) * h;
          bolts.push({ pts: bolt(x0, -10, x0 + R(-120, 120), y1), age: 0, life: .42 });
          if (Math.random() < .6) bolts.push({ pts: bolt(x0 + R(-30, 30), h * R(.12, .25), x0 + R(-200, 200), y1 + R(0, 80), 10, 18), age: 0, life: .3 });
          flash = Math.max(flash, .35 + .45 * level);
          if (typeof SND !== 'undefined') SND.thunder(level);
        }
      }
    }
    for (const p of parts) {
      p.age += dt;
      if (p.k === 'ember') { p.x += (p.vx + Math.sin(T * 2.2 + p.seed) * 22) * dt; p.y += p.vy * dt; }
      else if (p.k === 'streak') { p.x += p.sp * dt; if (p.x > w + 260) p.age = p.life; }
      else if (p.k === 'grain') {
        const target = (level - .5) * 70;                // up when floating, down when grounded
        p.vy += (target - p.vy) * dt * 1.5;
        p.x += (p.vx + Math.sin(T * .8 + p.seed) * 6 * (1.1 - level)) * dt; p.y += p.vy * dt;
        const ground = h - (18 + 110 * level);
        if (level >= .5 && p.y > ground + Math.sin(p.x * .01 + T * .3) * 8) { p.y = ground + Math.sin(p.x * .01 + T * .3) * 8; p.vy = 0; p.vx *= .9; }
        if (p.y < -10 || p.x < -10 || p.x > w + 10) p.age = p.life;
      }
      else if (p.k === 'rain') { p.x += p.vx * dt; p.y += p.vy * dt; if (p.y > h + 30) p.age = p.life; }
      else if (p.k === 'swirl') { p.a += p.va * dt; p.r += p.vr * dt; }
      else {
        if (p.px !== undefined) { p.px = p.x; p.py = p.y; }
        p.vx *= 1 - p.drag * dt; p.vy *= 1 - p.drag * dt; p.vy += (p.g || 0) * dt;
        p.x += p.vx * dt; p.y += p.vy * dt; if (p.vr) p.rot += p.vr * dt;
      }
    }
    parts = parts.filter(p => p.age < p.life && p.y < h + 60);
    if (parts.length > 900) parts.splice(0, parts.length - 900);
    for (const r of ripples) { r.age += dt; r.r += r.sp * dt; }
    ripples = ripples.filter(r => r.r < r.rmax);
    for (const b of bolts) b.age += dt;
    bolts = bolts.filter(b => b.age < b.life);
    flash = Math.max(0, flash - dt * 2.6);
  }

  function flame(x, y, H, W) {
    ctx.beginPath(); ctx.moveTo(x, y);
    ctx.bezierCurveTo(x + W, y - H * .25, x + W * .55, y - H * .62, x, y - H);
    ctx.bezierCurveTo(x - W * .55, y - H * .62, x - W, y - H * .25, x, y);
    ctx.closePath();
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    // ambient layers
    if (mode === 'vuur') {
      const g = ctx.createLinearGradient(0, h, 0, h * .45);
      g.addColorStop(0, `rgba(255,140,40,${.18 + .32 * level})`); g.addColorStop(1, 'rgba(255,140,40,0)');
      ctx.fillStyle = g; ctx.fillRect(0, h * .45, w, h * .55);
    }
    if (mode === 'lucht' && !lite()) {
      for (const c of clouds) for (const b of c.blobs) {
        const x = c.x + b.dx * c.s, y = c.y + b.dy * c.s, r = c.s * b.r;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `rgba(255,255,255,${.16 * c.depth})`); g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.fill();
      }
    }
    if (mode === 'aarde' && level >= .5 && !lite()) {
      const top = h - (18 + 110 * level);
      const g = ctx.createLinearGradient(0, top - 20, 0, h);
      g.addColorStop(0, 'rgba(250,190,70,0)'); g.addColorStop(.35, `rgba(214,150,52,${.25 + .3 * level})`); g.addColorStop(1, `rgba(120,70,20,${.45 + .3 * level})`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, h);
      for (let x = 0; x <= w + 20; x += 20) ctx.lineTo(x, top + Math.sin(x * .01 + T * .3) * 8 + Math.sin(x * .023) * 10);
      ctx.lineTo(w, h); ctx.closePath(); ctx.fill();
    }
    if (mode === 'water' && !lite()) {
      ctx.lineWidth = 1.6;
      for (let i = 0; i < 6; i++) {
        const y0 = h * (.28 + i * .12), amp = 5 + 16 * level, ph = T * (.5 + 2.4 * level) + i * 1.3;
        ctx.strokeStyle = `rgba(225,255,245,${.10 + .08 * level})`; ctx.beginPath();
        for (let x = 0; x <= w; x += 16) { const y = y0 + Math.sin(x * .012 + ph) * amp; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
        ctx.stroke();
      }
    }
    for (const r of ripples) {
      const a = (1 - r.r / r.rmax) * (r.burst ? .7 : .45);
      ctx.strokeStyle = `rgba(230,255,248,${a})`; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(r.x, r.y, r.r, r.r * .42, 0, 0, 6.29); ctx.stroke();
      if (r.r > 14) { ctx.globalAlpha = .6; ctx.beginPath(); ctx.ellipse(r.x, r.y, r.r * .6, r.r * .25, 0, 0, 6.29); ctx.stroke(); ctx.globalAlpha = 1; }
    }
    // particles
    for (const p of parts) {
      const t = p.age / p.life, a = Math.min(1, (1 - t) * 1.6) * Math.min(1, p.age * 6);
      if (p.k === 'ember' || p.k === 'spark' || p.k === 'zap') {
        ctx.globalCompositeOperation = 'lighter';
        const col = p.k === 'zap' ? `rgba(200,220,255,${a})` : `hsla(${p.hue},100%,${60 + 15 * (1 - t)}%,${a})`;
        if (p.px !== undefined) { ctx.strokeStyle = col; ctx.lineWidth = p.s; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(p.x, p.y); ctx.stroke(); }
        ctx.fillStyle = col; ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, 6.29); ctx.fill();
        ctx.fillStyle = p.k === 'zap' ? `rgba(140,170,255,${a * .2})` : `hsla(${p.hue},100%,55%,${a * .12})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.s * 2.6, 0, 6.29); ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      } else if (p.k === 'streak') {
        ctx.strokeStyle = 'rgba(255,255,255,.32)'; ctx.lineWidth = 1.4; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.quadraticCurveTo(p.x + p.len * .5, p.y + p.bend, p.x + p.len, p.y); ctx.stroke();
      } else if (p.k === 'grain') {
        ctx.fillStyle = `hsla(${p.hue},70%,${p.l}%,${.75 * a})`; ctx.fillRect(p.x, p.y, p.s, p.s);
      } else if (p.k === 'rain') {
        ctx.strokeStyle = 'rgba(205,218,255,.34)'; ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + p.vx * .02, p.y + p.len); ctx.stroke();
      } else if (p.k === 'drop') {
        ctx.fillStyle = `rgba(215,252,240,${a})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, 6.29); ctx.fill();
      } else if (p.k === 'pebble') {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = `hsla(${p.hue},55%,${p.l}%,${a})`; ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .8); ctx.restore();
      } else if (p.k === 'puff') {
        const r = p.r0 + (p.r1 - p.r0) * t, g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        g.addColorStop(0, `rgba(255,255,255,${.5 * a})`); g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 6.29); ctx.fill();
      } else if (p.k === 'swirl') {
        ctx.strokeStyle = `rgba(255,255,255,${.6 * a})`; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, p.a, p.a + 1.1); ctx.stroke();
      }
    }
    // lightning
    for (const b of bolts) {
      const a = 1 - b.age / b.life;
      ctx.save(); ctx.strokeStyle = `rgba(235,242,255,${a})`; ctx.shadowColor = '#b9ccff'; ctx.shadowBlur = 18; ctx.lineWidth = b.burst ? 1.6 : 2.6; ctx.lineJoin = 'round';
      ctx.beginPath(); b.pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); ctx.restore();
    }
    if (flash > .01) { ctx.fillStyle = `rgba(225,232,255,${flash * .32})`; ctx.fillRect(0, 0, w, h); }
  }

  function loop(t) {
    const dt = Math.min(.05, (t - last) / 1000); last = t;
    step(dt); draw();
    if (mode || parts.length || ripples.length || bolts.length || flash > .01) raf = requestAnimationFrame(loop);
    else { raf = 0; ctx.clearRect(0, 0, w, h); }
  }
  function start() { if (!raf && !reduce) { last = performance.now(); raf = requestAnimationFrame(loop); } }

  return { set, setLevel, burst, flame };
})();

