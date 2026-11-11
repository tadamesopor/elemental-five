/* the game flow: title screen, picking elements, reading and choosing cards */
/* ---------- flow ---------- */
let attract = 0;
function startAttract() {
  clearInterval(attract);
  let i = Math.floor(Math.random() * 5);
  const go = () => { FX.set(EL[i % 5].id, .5); i++; };
  go(); attract = setInterval(go, 4200);
}
function stopAttract() { clearInterval(attract); attract = 0; }

function startScreen() {
  FX.set(null); SND.setAmbient(null); hideNav(); $('#undo').hidden = true; $('.esheet')?.remove();
  S = fresh(null);
  $('#stage').innerHTML = ''; clearHand(); setPrompt(''); setActions([]); paintMe();
  setStatus('');
  document.body.classList.add('titling');
  $('#ov').innerHTML = `
    <div class="title" role="dialog" aria-labelledby="tt">
      <div class="t-inner">
        <img class="t-hand" src="${IMG.hand}" alt="">
        <h1 id="tt">the elemental five</h1>
        <p class="t-rule">speel om te groeien</p>
        <p class="t-sub">${DATA.introShort}</p>
        <button class="playbtn" id="play" type="button">speel <span aria-hidden="true">▶</span></button>
        <div class="t-fan" role="group" aria-label="Kies een element">
          ${EL.map((e, i) => `<button class="t-card" type="button" data-el="${e.id}" style="--i:${i};--c:var(--${e.id});--r:${(i - 2) * 6}deg;--y:${Math.abs(i - 2) * 14}px" aria-label="Begin met ${e.name}"><img src="${img(e.id, 1)}" alt=""><span class="lab">${e.id}</span></button>`).join('')}
        </div>
        <p class="t-hint">of kies meteen een element</p>
        <button class="linkbtn" id="how" type="button">hoe werkt het?</button>
        <div class="t-foot"><img src="${IMG.ig}" alt="InnerGames"><i></i><span>gebaseerd op het Big Five-persoonlijkheidsmodel</span></div>
      </div>
    </div>`;
  startAttract();
  document.querySelectorAll('.t-card').forEach(b => b.onclick = () => startFrom(b.dataset.el, b));
  $('#how').onclick = showHow;
  $('#play').onclick = startPlay;
}
function showHow() {
  const intro = DATA.intro;
  const holder = document.createElement('div');
  holder.className = 'overlay readov'; holder.style.zIndex = 30;
  holder.innerHTML = `<div class="howsheet" role="dialog" aria-labelledby="hw">
    <h2 id="hw">hoe werkt het?</h2>
    <ol>
      <li>Kies een element en voel hoe sterk het in jou leeft.</li>
      <li>Kies uit twee kaarten de kaart die het beste bij je past.</li>
      <li>Kies daarna je eindkaart. Dat is jouw kaart voor dit element.</li>
    </ol>
    <p>Speel één element, of alle vijf. Er is geen goed of fout, en je kunt niet winnen of verliezen.</p>
    <details><summary>over het spel</summary><p>${intro[1]}</p><p>${intro[2]}</p></details>
    <p class="fine">In het echte spel leest een spelleider de kaarten voor, en spelen groepen met grondkaarten op de vloer.</p>
    <button class="btn primary" type="button">begrepen</button></div>`;
  holder.onclick = e => { if (e.target === holder || e.target.classList.contains('btn')) holder.remove(); };
  document.body.appendChild(holder);
  holder.querySelector('.btn').focus();
}
function startPlay() {
  stopAttract();
  $('.title')?.classList.add('out');
  document.body.classList.remove('titling');
  S = fresh('heel'); paintMe();
  setTimeout(() => { if ($('.title.out')) $('#ov').innerHTML = ''; }, 450);
  pickElement();
}
async function startFrom(el, btn) {
  const from = rect(btn.querySelector('img'));
  stopAttract();
  $('.title')?.classList.add('out');
  document.body.classList.remove('titling');
  S = fresh('heel'); paintMe();
  setTimeout(() => { if ($('.title.out')) $('#ov').innerHTML = ''; }, 450);
  openElement(el, from);
}

function begin(mode, keep = {}) {
  $('#ov').innerHTML = '';
  S = fresh(mode); S.picks = { ...keep };
  paintMe();
  pickElement();
}

async function pickElement() {
  FX.set(null); SND.setAmbient(null); hideNav();
  S.cur = null; S.path = []; $('#stage').innerHTML = '';
  const left = EL.filter(e => !S.picks[e.id]);
  const done = Object.keys(S.picks).length;
  setStatus(`element ${done + 1} van 5`);
  setPrompt(done ? 'Kies het volgende element.' : 'Kies een element om mee te beginnen.');
  setActions([]);
  S.busy = true;
  await deal(left.map(e => ({ key: e.id, src: img(e.id, 1), label: `${e.name}, kaart 1` })), (c, b) => openElement(c.key, b));
  S.busy = false;
}

async function openElement(el, fromBtn) {
  S.busy = true;
  S.cur = el; S.level = 1; S.branch = null; S.path = [byId[el].name]; S.read = new Set();
  paintPath();
  const from = fromBtn && fromBtn.getBoundingClientRect ? rect(fromBtn) : (fromBtn || deckRect());
  clearHand(); setPrompt(''); hideNav();
  if (S.vals[el] == null) S.vals[el] = 50;
  FX.set(el, S.vals[el] / 100); SND.setAmbient(el);
  stageCard(el, 1);
  const st = $('#stage'); st.style.visibility = 'hidden';
  await fly(img(el, 1), from, rect(st), 520);
  st.style.visibility = '';
  await flipStage(); markScroll(); showFeel(el);
  S.busy = false; paintNav();
  setActions([
    { label: 'verder', on: () => { setPrompt(''); dealPair(el, [2, 3]); } },
    { label: 'ander element', kind: 'link', on: goBack },
  ]);
}

async function dealPair(el, ns) {
  S.busy = true; setActions([]);
  S.level = ns[0] >= 4 ? 3 : 2;
  S.pair = ns; S.read = new Set(); S.active = null; paintNav();
  const st = $('#stage'); const from = rect(st);
  const lastN = S.level === 2 ? 1 : S.branch;
  st.innerHTML = '';
  await fly(img(el, lastN), from, deckRect(), 360);
  setPrompt('Welke van deze twee kaarten past het beste bij jouw gevoel? Tik op een kaart om hem te lezen.');
  await deal(ns.map(n => ({ key: String(n), src: img(el, n), label: `${byId[el].cards[n - 1].title}, kaart ${n}` })), (c, b) => readCard(el, Number(c.key), b), { fromBack: true });
  S.busy = false;
  $('#hand .hc')?.focus({ preventScroll: true });
}

async function readCard(el, n, btn) {
  const game = S;
  S.busy = true; S.active = n; $('.swipehint')?.remove();
  setActions([]); setPrompt('');
  [...$('#hand').children].forEach(b => b.classList.toggle('active', b === btn));
  const from = rect(btn);
  $('#table').classList.add('reading');          // the two cards make room for the big card
  stageCard(el, n);
  const st = $('#stage'); st.style.visibility = 'hidden';
  await fly(img(el, n), from, rect(st), 420);
  st.style.visibility = '';
  await flipStage(); markScroll();
  // the first time you read a card: one slow breath before you can choose
  if (!S.read.has(n)) await breathe(byId[el].cards[n - 1].shortPause);
  if (S !== game || S.cur !== el || S.active !== n) return;   // the player restarted during the breath
  S.read.add(n); btn.classList.add('read');
  if (matchMedia('(pointer: coarse)').matches && !readCard.hinted) {
    readCard.hinted = true;
    const hnt = document.createElement('div'); hnt.className = 'swipehint'; hnt.textContent = 'veeg de kaart opzij om te wisselen';
    $('#table').appendChild(hnt); setTimeout(() => hnt.remove(), 5200);
  }
  const other = S.pair.find(x => x !== n);
  const otherBtn = [...$('#hand').children].find(b => b.dataset.key === String(other));
  S.busy = false;
  setActions([
    { label: 'kies deze kaart', on: () => choose(el, n) },
    { label: S.read.has(other) ? 'terug naar de andere' : 'lees de andere kaart', kind: 'second', on: () => readCard(el, other, otherBtn) },
  ]);
}

async function choose(el, n) {
  S.busy = true; setActions([]);
  S.path.push(byId[el].cards[n - 1].title); paintPath();
  if (S.level === 2) {
    S.branch = n;
    toast(`Je kiest ${byId[el].cards[n - 1].title.toLowerCase()}.`);
    await wait(500);
    S.busy = false;
    return dealPair(el, n === 2 ? [4, 5] : [6, 7]);
  }
  S.picks[el] = n;
  clearHand(); setPrompt(''); hideNav();
  const st = $('#stage'); const from = rect(st);
  st.innerHTML = '';
  const tr = rect($('#slot-' + el));   // the chosen card flies to its own slot
  await fly(img(el, n), from, tr, 620);
  paintMe();
  FX.burst(el, tr.left + tr.width / 2, tr.top + tr.height / 2); SND.pick(el);
  $('#slot-' + el).classList.add('pop');
  await wait(500);
  S.busy = false;
  elementDone(el, n);
}

function elementDone(el, n) {
  $('.esheet')?.remove();
  const c = byId[el].cards[n - 1], done = Object.keys(S.picks).length, all = done === 5;
  setStatus(`${done} van 5 elementen`);
  const box = document.createElement('div');
  box.className = 'esheet'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', `Jouw kaart voor ${el}`);
  box.innerHTML = `
    <div class="row"><img src="${img(el, n)}" alt="">
      <div><div class="k">JOUW KAART VOOR ${el.toUpperCase()}</div><h3>${c.title.toLowerCase()}</h3><p>${c.short}</p></div></div>
    <div class="prog">${EL.map(e => `<i class="${S.picks[e.id] ? 'on' : ''}" style="--c:var(--${e.id})"></i>`).join('')}<span>${done} van 5 elementen</span></div>
    <div class="btns">
      <button class="btn primary" type="button" data-a="next">${all ? 'bekijk jouw elemental five' : 'volgend element →'}</button>
      ${all ? '' : '<button class="btn second" type="button" data-a="stop">stop en bekijk mijn kaarten</button>'}
    </div>
    <div class="links">
      <button type="button" data-a="undo">kies opnieuw</button><span class="sep">·</span>
      <a href="${LINKS.koop}" target="_blank" rel="noopener">koop het spel</a><span class="sep">·</span>
      <a href="${LINKS.workshop}" target="_blank" rel="noopener">boek een workshop</a>
    </div>`;
  document.body.appendChild(box);
  box.querySelector('[data-a="next"]').focus({ preventScroll: true });
  box.onclick = e => {
    const a = e.target.closest('[data-a]')?.dataset.a; if (!a || S.busy) return;
    box.remove();
    if (a === 'next') return all ? finish() : pickElement();
    if (a === 'stop') return finish();
    if (a === 'undo') {
      delete S.picks[el]; S.cur = el; paintMe();
      S.path.pop(); paintPath();
      FX.set(el, (S.vals[el] ?? 50) / 100); SND.setAmbient(el);
      return dealPair(el, S.branch === 2 ? [4, 5] : [6, 7]);
    }
  };
}

