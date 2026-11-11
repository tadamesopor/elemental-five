/* game state and the card table: stage, hand, the area under the card, navigation */
let S;
function fresh(mode) { return { mode, cur: null, level: 1, branch: null, pair: null, active: null, picks: {}, vals: {}, path: [], read: new Set(), busy: false }; }

/* ---------- helpers ---------- */
function setStatus(t) { $('#status').textContent = t; }
function setPrompt(t) { $('#prompt').textContent = t || ''; }
function setActions(btns) {
  const bar = $('#actbar'); bar.innerHTML = '';
  if (!btns || !btns.length) { clearMoment(); return; }   // leaving a card also clears the slider or breath under it
  const wrap = document.createElement('div'); wrap.className = 'act';
  btns.forEach(b => {
    const el = document.createElement('button');
    el.className = 'btn ' + (b.kind || 'primary'); el.type = 'button'; el.textContent = b.label;
    el.onclick = () => { if (!S.busy) b.on(); };
    wrap.appendChild(el);
  });
  bar.appendChild(wrap);
  wrap.querySelector('button').focus({ preventScroll: true });
}
function toast(t, ms = 1800) {
  const el = $('#toast'); el.textContent = t; el.classList.add('show');
  clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('show'), ms);
}
function paintPath() { if (S.path.length) setStatus(S.path.map(t => t.toLowerCase()).join(' → ')); }
function paintMe() {
  // five slots, one per element: empty until you choose a card, then a small card you can tap to read again
  $('#minis').innerHTML = EL.map(e => {
    const n = S.picks[e.id], css = `--c:var(--${e.id})`;
    if (!n) return `<span class="slot" id="slot-${e.id}" style="${css}" title="${e.id}"></span>`;
    const t = byId[e.id].cards[n - 1].title;
    return `<button type="button" class="slot full" id="slot-${e.id}" data-el="${e.id}" style="${css}" aria-label="${e.name}: jouw kaart ${t}. Lees hem nog eens."><img alt="" src="${img(e.id, n)}"></button>`;
  }).join('');
}
async function fly(src, from, to, dur = 520) {
  if (reduce || !from || !to || !from.width || !to.width) return;
  // keep the real card shape (and a border that scales with it) for every flight
  const AR = 721 / 520;
  const norm = q => { const w = Math.min(q.width, q.height / AR), h = w * AR; return { x: q.left + (q.width - w) / 2, y: q.top + (q.height - h) / 2, w, h }; };
  const A = norm(from), B = norm(to);
  const f = document.createElement('img'); f.className = 'fly'; f.src = src; f.alt = '';
  const frame = q => ({ left: q.x + 'px', top: q.y + 'px', width: q.w + 'px', height: q.h + 'px', borderWidth: Math.max(2, q.w * .055) + 'px', borderRadius: Math.max(4, q.w * .08) + 'px' });
  Object.assign(f.style, frame(A));
  document.body.appendChild(f);
  const rot = (Math.random() * 6 - 3).toFixed(1);
  const anim = f.animate([
    { ...frame(A), transform: 'rotate(0deg)' },
    { ...frame(B), transform: `rotate(${rot}deg)` },
  ], { duration: dur, easing: 'cubic-bezier(.2,.75,.2,1)', fill: 'forwards' });
  await anim.finished; f.remove();
}
// there is no deck on the table: cards come in from, and leave over, the bottom edge of the screen
function deckRect() {
  const w = 120; return { left: innerWidth / 2 - w / 2, top: innerHeight + 30, width: w, height: w * 1.387 };
}

/* ---------- navigation ---------- */
function paintNav() {
  const back = $('#back'), steps = $('#steps');
  if (!S || !S.cur || !S.mode) { back.hidden = true; steps.innerHTML = ''; paintRings(0); return; }
  const lv = S.level;
  paintRings(lv, S.cur);
  back.hidden = lv === 1;                       // on card 1 the 'ander element' link does this
  back.textContent = lv === 2 ? '← terug naar kaart 1' : '← terug';
  const names = ['element', 'richting', 'jouw kaart'];
  steps.innerHTML = names.map((t, i) => `<i class="${i + 1 < lv ? 'done' : i + 1 === lv ? 'now' : ''}" title="${t}"></i>`).join('');
}
function hideNav() { $('#back').hidden = true; $('#steps').innerHTML = ''; paintRings(0); }
// the three rings on the table are the three rings of the floor cards: they light up as you go deeper
function paintRings(lv, el) {
  const r = $('.rings'); r.dataset.lv = lv;
  if (el) r.style.setProperty('--c', `var(--${el})`);
}
async function goBack() {
  if (!S || S.busy || !S.cur) return;
  const el = S.cur;
  if (S.level === 1) {
    S.busy = true; setActions([]);
    const st = $('#stage'), from = rect(st); st.innerHTML = '';
    await fly(img(el, 1), from, deckRect(), 360);
    S.busy = false; return pickElement();
  }
  if (S.level === 2) { clearHand(); setPrompt(''); setActions([]); $('#stage').innerHTML = ''; return openElement(el, deckRect()); }
  S.path.pop(); S.branch = null; paintPath();
  $('#stage').innerHTML = ''; setActions([]);
  return dealPair(el, [2, 3]);
}
function offerUndo(text, ms = 3000) {
  const box = $('#undo'), btn = box.querySelector('button');
  box.querySelector('span').textContent = text;
  box.style.setProperty('--t', ms + 'ms');
  box.hidden = false; void box.offsetWidth;
  return new Promise(res => {
    const done = v => { clearTimeout(t); btn.onclick = null; box.hidden = true; res(v); };
    const t = setTimeout(() => done(false), ms);
    btn.onclick = () => done(true);
  });
}

/* ---------- stage: the big card you read ---------- */
function stageCard(el, n) {
  const c = byId[el].cards[n - 1];
  const head = n === 1 ? c.title : `${byId[el].name}: ${c.title.toLowerCase()}`;
  $('#stage').innerHTML = `
    <div class="big">
      <div class="face"><img alt="${byId[el].name}, kaart ${n}: ${c.title}" src="${img(el, n)}"></div>
      <div class="face text${n === 1 ? ' card1' : ''}" role="article" aria-label="${head}">
        <h2>${head}</h2>
        <div class="body"><p class="short">${c.short}</p><div class="full">${c.text.map(t => `<p>${t}</p>`).join('')}</div></div>
        <button class="more-link" type="button" aria-expanded="false">lees de hele kaart</button>
        <p class="pause">${c.shortPause}</p>
        ${n === 1 ? '' : '<p class="q">Kies jij voor deze kaart?</p>'}
        <div class="logo">the elemental five</div>
      </div>
    </div>`;
}
async function flipStage() { await wait(80); const b = $('#stage .big'); if (b) { b.classList.add('flipped'); SND.flip(); } await wait(650); }
// "lees de hele kaart" and the fade at the bottom when the text scrolls
function markScroll() {
  const b = $('#stage .body'); if (!b) return;
  const face = $('#stage .face.text'), link = $('#stage .more-link');
  if (link && !link.onclick) link.onclick = () => {
    const open = face.classList.toggle('open');
    link.textContent = open ? 'korte versie' : 'lees de hele kaart';
    link.setAttribute('aria-expanded', open); b.scrollTop = 0; upd();
  };
  const upd = () => b.classList.toggle('more', b.scrollTop + b.clientHeight < b.scrollHeight - 4);
  b.onscroll = upd; upd();
}

/* ---------- under the card: the slider (card 1) or one slow breath (cards 2 to 7) ---------- */
function clearMoment() {
  const m = $('#moment'); if (!m) return;
  m.innerHTML = '';
  if (clearMoment.stop) { const stop = clearMoment.stop; clearMoment.stop = null; stop(); }   // also ends a running breath
}
// the slider: how strong is this element in you? The whole scene (effects, video, sound) follows it
function showFeel(el) {
  const c = byId[el].cards[0];
  $('#moment').innerHTML = `
    <div class="feel" style="--c:var(--${el})">
      <label for="feelIn">${c.q || ''}</label>
      <input id="feelIn" type="range" min="0" max="100" step="1" value="${S.vals[el] ?? 50}" aria-valuetext="">
      <div class="ends"><span>${ELX[el].low}</span><span class="hint">← schuif →</span><span>${ELX[el].high}</span></div>
    </div>`;
  const inp = $('#feelIn');
  const upd = () => {
    const v = Number(inp.value); S.vals[el] = v;
    inp.style.setProperty('--p', v + '%');
    inp.setAttribute('aria-valuetext', v < 34 ? ELX[el].low : v > 66 ? ELX[el].high : 'ertussenin');
    FX.setLevel(v / 100); SND.level(v / 100);
  };
  inp.addEventListener('input', () => { upd(); inp.closest('.feel').classList.add('used'); }); upd();
}
// one slow breath before the buttons appear. Tap the circle (or press Enter) to skip it.
// With reduced motion there is no waiting: the pause text is on the card itself.
function breathe(text) {
  if (reduce) return Promise.resolve();
  const IN = 3000, OUT = 3000;
  $('#moment').innerHTML = `
    <button class="breathe" type="button" aria-label="Adempauze. ${text} Druk om over te slaan.">
      <span class="orb" aria-hidden="true"></span>
      <span class="txt"><b>adem in</b><span>${text}</span><small>tik om over te slaan</small></span>
    </button>`;
  const box = $('#moment .breathe');
  box.focus({ preventScroll: true });
  return new Promise(res => {
    const t1 = setTimeout(() => { const b = box.querySelector('b'); if (b) b.textContent = 'adem uit'; }, IN);
    const t2 = setTimeout(() => done(), IN + OUT);
    const done = () => { clearTimeout(t1); clearTimeout(t2); clearMoment.stop = null; box.remove(); res(); };
    clearMoment.stop = done;
    box.onclick = done;
  });
}

/* ---------- hand: the cards you choose from, in the middle of the table ---------- */
async function deal(cards, onPick, opts = {}) {
  const hand = $('#hand'), table = $('#table'); hand.innerHTML = '';
  table.classList.remove('reading');
  const n = cards.length; hand.dataset.n = n; table.dataset.n = n;   // the css sizes the cards by how many there are
  cards.forEach((c, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'hc ghosted';
    b.style.backgroundImage = `url(${c.src})`;
    const off = i - (n - 1) / 2;
    b.style.setProperty('--r', (off * (n > 2 ? 7 : 5)) + 'deg');
    b.style.setProperty('--y', (Math.abs(off) * (n > 2 ? 10 : 6)) + 'px');
    b.setAttribute('aria-label', c.label);
    b.dataset.key = c.key;
    b.onclick = () => { if (!S.busy) onPick(c, b); };
    hand.appendChild(b);
  });
  const from = deckRect();
  for (const b of [...hand.children]) {
    const c = cards.find(x => x.key === b.dataset.key);
    SND.deal();
    await fly(opts.fromBack ? IMG.back : c.src, from, rect(b), 380);
    b.classList.remove('ghosted');
  }
}
function clearHand() { $('#hand').innerHTML = ''; $('#table').classList.remove('reading'); }
