/* ================= element videos behind the table ================= */
var VIDS = window.__VIDS__ || Object.fromEntries(ELS.map(e => [e, `assets/vid/${e}.mp4`]));
var VID = (() => {
  const box = document.getElementById('vids'), vids = {};
  // base brightness + look per clip, so each one sits close to its card
  const LOOK = {
    vuur:  [.66, 'saturate(1.15) blur(1.5px)'],
    lucht: [1.0, 'saturate(.85) contrast(.82) blur(1.2px)'],
    aarde: [.70, 'saturate(1.05) blur(1px)'],
    water: [.64, 'hue-rotate(-45deg) saturate(.85) blur(1.5px)'],
    ether: [.95, 'contrast(1.1) blur(.8px)'],
  };
  for (const id of Object.keys(VIDS)) {
    const v = document.createElement('video');
    v.muted = true; v.loop = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.setAttribute('muted', '');
    v.preload = 'auto'; v.src = VIDS[id]; v.dataset.el = id;
    box.appendChild(v); vids[id] = v;
  }
  let cur = null;
  function look(id, lv) { const [b, rest] = LOOK[id] || [.7, '']; return `brightness(${(b + (lv - .5) * .35).toFixed(2)}) ${rest}`; }
  function show(id, lv = .5) {
    for (const [k, v] of Object.entries(vids)) {
      if (k === id) { v.classList.add('on'); if (!reduce) v.play().catch(() => {}); }
      else if (v.classList.contains('on')) { v.classList.remove('on'); setTimeout(() => { if (!v.classList.contains('on')) v.pause(); }, 1500); }
    }
    cur = id && vids[id] ? id : null;
    document.body.classList.toggle('vidon', !!cur);
    level(lv);
  }
  function level(lv) {
    const v = vids[cur]; if (!v) return;
    if (!reduce) v.playbackRate = .55 + lv * .9;      // slider: slow and dark ... fast and bright
    v.style.filter = look(cur, lv);
  }
  document.addEventListener('visibilitychange', () => { const v = vids[cur]; if (!v || reduce) return; document.hidden ? v.pause() : v.play().catch(() => {}); });
  return { show, level, has: id => !!vids[id] };
})();

