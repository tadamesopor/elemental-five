/* game state and the card table: seats, deck, stage, hand, navigation */
let S;
function fresh(mode) { return { mode, cur: null, level: 1, branch: null, pair: null, active: null, picks: {}, vals: {}, path: [], read: new Set(), busy: false }; }

/* ---------- seats ---------- */
function layoutSeats() {
  const box = $('#seats'); box.innerHTML = '';
  const small = innerWidth <= 720 || innerHeight <= 560;
  EL.forEach((e, i) => {
    let x, y;
    if (small) { x = 12 + i * 19; y = 17; }
    else { const a = Math.PI * (1.02 + i * 0.24); x = 50 + Math.cos(a) * 40; y = 46 + Math.sin(a) * 33; }
    const s = document.createElement('button');
    s.type = 'button'; s.className = 'seat'; s.id = 'seat-' + e.id;
    s.onclick = () => seatClick(e.id);
    s.style.left = x + '%'; s.style.top = y + '%';
    s.style.setProperty('--c', `var(--${e.id})`);
    s.innerHTML = `<div class="tok" style="background-image:url(${IMG[e.id + '_round']})"></div><div class="name">${e.id}</div><div class="got"></div>`;
    box.appendChild(s);
  });
  paintSeats();
}
function paintSeats() {
  EL.forEach(e => {
    const s = $('#seat-' + e.id); if (!s) return;
    s.classList.toggle('current', !!S && S.cur === e.id);
    s.classList.toggle('done', !!(S && S.picks[e.id]));
    s.classList.toggle('idle', !!(S && S.mode === 'kort' && S.cur && S.cur !== e.id && !S.picks[e.id]));
    s.querySelector('.got').textContent = S && S.picks[e.id] ? byId[e.id].cards[S.picks[e.id] - 1].title.toLowerCase() : '';
    const done = !!(S && S.picks[e.id]), can = !!(S && S.mode) && (done || (S.cur !== e.id && !(S.mode === 'kort' && Object.keys(S.picks).length)));
    s.classList.toggle('can', can);
    s.tabIndex = can ? 0 : -1;
    s.setAttribute('aria-label', done ? `${e.name}: jouw kaart ${byId[e.id].cards[S.picks[e.id] - 1].title}. Lees hem nog eens.` : `Speel ${e.name}`);
  });
}

/* ---------- helpers ---------- */
function setStatus(t) { $('#status').textContent = t; }
function setPrompt(t) { $('#prompt').textContent = t || ''; }
function setActions(btns) {
  const bar = $('#actbar'); bar.innerHTML = '';
  if (!btns || !btns.length) return;
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
  const ids = EL.map(e => e.id).filter(id => S.picks[id]);
  $('#meLab').textContent = `${ids.length} ${ids.length === 1 ? 'kaart' : 'kaarten'}`;
  $('#minis').innerHTML = ids.map(id => `<img alt="${byId[id].cards[S.picks[id] - 1].title}" src="${img(id, S.picks[id])}">`).join('');
}
async function fly(src, from, to, dur = 520) {
  if (reduce || !from || !to || !from.width || !to.width) return;
  // keep the real card shape (and a border that scales with it) for every flight,
  // also when the start or end is a round element token
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
function deckRect() {
  const d = $('#deck'); const r = rect(d);
  if (r && r.width) return r;
  const w = 80; return { left: innerWidth / 2 - w / 2, top: innerHeight * .46 - w * .7, width: w, height: w * 1.39 };
}

/* ---------- navigation ---------- */
function paintNav() {
  const back = $('#back'), steps = $('#steps');
  if (!S || !S.cur || !S.mode) { back.hidden = true; steps.innerHTML = ''; return; }
  const lv = S.level;
  back.hidden = lv === 1;                       // on card 1 the 'ander element' button does this
  back.textContent = lv === 2 ? '← terug naar kaart 1' : '← terug';
  const names = ['element', 'richting', 'jouw kaart'];
  steps.innerHTML = names.map((t, i) => `<i class="${i + 1 < lv ? 'done' : i + 1 === lv ? 'now' : ''}" title="${t}"></i>`).join('');
}
function hideNav() { $('#back').hidden = true; $('#steps').innerHTML = ''; }
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
function seatClick(id) {
  if (!S || !S.mode) return;
  if (S.picks[id]) return showRead(id);          // reading your card is always allowed
  if (S.busy) return;
  if (id === S.cur || (S.mode === 'kort' && Object.keys(S.picks).length)) return;
  const tok = $('#seat-' + id + ' .tok');
  $('.esheet')?.remove();
  clearHand(); setPrompt(''); setActions([]); $('#stage').innerHTML = '';
  openElement(id, rect(tok));
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

/* ---------- deck ---------- */
function paintDeck() {
  const d = $('#deck'); d.innerHTML = '';
  for (let i = 0; i < 4; i++) {
    const c = document.createElement('div'); c.className = 'c';
    c.style.backgroundImage = `url(${IMG.back})`; c.style.transform = `translate(${i * 2}px, ${-i * 2}px)`;
    d.appendChild(c);
  }
}

/* ---------- stage ---------- */
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
        <div class="pause"><svg class="breath" viewBox="0 0 26 26" aria-hidden="true"><circle cx="13" cy="13" r="11"/><circle class="run" cx="13" cy="13" r="11"/></svg><span>${c.shortPause}</span></div>
        <p class="q">${n === 1 ? (c.q || '') : 'Kies jij voor deze kaart?'}</p>
        ${n === 1 ? `<div class="feel"><input type="range" min="0" max="100" step="1" value="${S.vals[el] ?? 50}" aria-label="${c.q}" aria-valuetext=""><div class="ends"><span>${ELX[el].low}</span><span class="hint">← schuif →</span><span>${ELX[el].high}</span></div></div>` : ''}
        <div class="logo">the elemental five</div>
      </div>
    </div>`;
}
async function flipStage() { await wait(80); const b = $('#stage .big'); if (b) { b.classList.add('flipped'); SND.flip(); } await wait(650); }
function bindFeel(el) {
  const inp = $('#stage .feel input'); if (!inp) return;
  const upd = () => {
    const v = Number(inp.value); S.vals[el] = v;
    inp.style.setProperty('--p', v + '%');
    inp.setAttribute('aria-valuetext', v < 34 ? ELX[el].low : v > 66 ? ELX[el].high : 'ertussenin');
    FX.setLevel(v / 100); SND.level(v / 100);
  };
  inp.addEventListener('input', () => { upd(); inp.parentElement.classList.add('used'); }); upd();
}
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
function restartBreath() {
  markScroll();
  const r = $('#stage .breath .run'); if (r) { r.style.animation = 'none'; r.getBoundingClientRect(); r.style.animation = ''; }
}

/* ---------- hand ---------- */
async function deal(cards, onPick, opts = {}) {
  const hand = $('#hand'); hand.innerHTML = '';
  const n = cards.length; hand.dataset.n = n;
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
function clearHand() { $('#hand').innerHTML = ''; }

