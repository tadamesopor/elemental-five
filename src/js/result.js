/* the result: your cards, an elementen-mix image to save, replay */
/* ---------- result image: your cards + your elementen-mix ---------- */
async function renderMix() {
  const ids = EL.map(e => e.id).filter(id => S.picks[id]);
  const W = 1200, H = 720, cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const c = cv.getContext('2d');
  const font = (sz, wt = 400) => `${wt} ${sz}px "Gill Sans", "Gill Sans MT", Cabin, Calibri, "Segoe UI", sans-serif`;
  // background like the table
  let g = c.createRadialGradient(W / 2, H * .5, 40, W / 2, H * .55, W * .75);
  g.addColorStop(0, '#F57A35'); g.addColorStop(.45, '#D9481A'); g.addColorStop(1, '#6E1A05');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  c.save(); c.translate(W / 2, H * .52); c.globalAlpha = .05; c.fillStyle = '#fff';
  for (let i = 0; i < 24; i++) { c.rotate(Math.PI / 12); c.beginPath(); c.moveTo(0, 0); c.lineTo(900, -70); c.lineTo(900, 70); c.closePath(); c.fill(); }
  c.restore();
  c.strokeStyle = 'rgba(255,255,255,.12)'; c.lineWidth = 2;
  [150, 270, 400].forEach(rr => { c.beginPath(); c.arc(W / 2, H * .52, rr, 0, 6.29); c.stroke(); });
  // titles
  c.fillStyle = '#fff'; c.textBaseline = 'alphabetic';
  c.font = font(46); c.fillText(ids.length === 5 ? 'mijn elemental five' : ids.length === 1 ? 'mijn elemental kaart' : 'mijn elemental kaarten', 56, 82);
  c.font = font(20); c.globalAlpha = .9; c.fillText('speel om te groeien · innergames.nl', 58, 114); c.globalAlpha = 1;
  // cards + flames
  const n = ids.length, cw = n > 1 ? 160 : 220, ch = cw * 721 / 520, gap = n > 1 ? 52 : 0;
  const total = n * cw + (n - 1) * gap, x0 = (W - total) / 2, cy = 150;
  const load = src => new Promise(res => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = src; });
  for (let i = 0; i < n; i++) {
    const id = ids[i], im = await load(img(id, S.picks[id]));
    const x = x0 + i * (cw + gap), rot = n > 1 ? (i - (n - 1) / 2) * .035 : 0;
    const col = getComputedStyle(document.documentElement).getPropertyValue('--' + id).trim() || '#fff';
    c.save(); c.translate(x + cw / 2, cy + ch / 2); c.rotate(rot);
    c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 24; c.shadowOffsetY = 10;
    c.beginPath(); c.roundRect(-cw / 2, -ch / 2, cw, ch, 16); c.fillStyle = '#fff'; c.fill();
    c.shadowColor = 'transparent';
    const bd = cw * .06; c.beginPath(); c.roundRect(-cw / 2 + bd, -ch / 2 + bd, cw - bd * 2, ch - bd * 2, 8); c.clip();
    if (im) c.drawImage(im, -cw / 2 + bd, -ch / 2 + bd, cw - bd * 2, ch - bd * 2);
    c.restore();
    // flame: height follows the slider
    const v = (S.vals[id] ?? 50) / 100, fx = x + cw / 2, base = H - 74, fh = 46 + 120 * v, fw = 30 + 16 * v;
    let fg = c.createLinearGradient(0, base, 0, base - fh);
    fg.addColorStop(0, col); fg.addColorStop(.55, col); fg.addColorStop(1, 'rgba(255,248,225,.98)');
    c.save(); c.shadowColor = col; c.shadowBlur = 26;
    c.beginPath(); c.moveTo(fx, base);
    c.bezierCurveTo(fx + fw, base - fh * .25, fx + fw * .55, base - fh * .62, fx, base - fh);
    c.bezierCurveTo(fx - fw * .55, base - fh * .62, fx - fw, base - fh * .25, fx, base);
    c.fillStyle = fg; c.fill(); c.restore();
    // labels
    c.textAlign = 'center'; c.fillStyle = '#fff';
    c.font = font(20, 600); c.fillText(byId[id].cards[S.picks[id] - 1].title.toLowerCase(), fx, H - 42);
    c.font = font(15); c.globalAlpha = .85; c.fillText(id, fx, H - 20); c.globalAlpha = 1;
    c.textAlign = 'left';
  }
  c.font = font(14); c.globalAlpha = .75; c.textAlign = 'right'; c.fillText('the elemental five', W - 40, 82); c.textAlign = 'left'; c.globalAlpha = 1;
  return cv.toDataURL('image/png');
}

async function finish() {
  FX.set(null); SND.setAmbient(null); hideNav();
  S.cur = null; clearHand(); setPrompt(''); setActions([]); $('#stage').innerHTML = '';
  const nDone = Object.keys(S.picks).length, all = nDone === 5;
  setStatus(all ? 'jouw elemental five' : 'jouw kaarten');
  const ids = EL.map(e => e.id).filter(id => S.picks[id]);
  const png = await renderMix();
  $('#ov').innerHTML = `
    <div class="overlay"><div class="panel result" role="dialog" aria-labelledby="t2">
      <h1 id="t2">${all ? 'jouw elemental five' : nDone === 1 ? 'jouw kaart' : 'jouw kaarten'}</h1>
      <p>${all ? 'Dit zijn de vijf kaarten die nu het beste bij jou passen.' : `Je speelde ${nDone} van de 5 elementen.`} De vlam laat zien hoe sterk je het element voelde.</p>
      <img class="mix" src="${png}" alt="Jouw kaarten: ${ids.map(id => byId[id].cards[S.picks[id] - 1].title.toLowerCase()).join(', ')}">
      <div class="chips">${ids.map(id => `<span class="chipgrp" style="--c:var(--${id})"><button class="chip" type="button" data-id="${id}">lees ${byId[id].cards[S.picks[id] - 1].title.toLowerCase()}</button><button class="redo" type="button" data-redo="${id}" title="speel ${id} opnieuw" aria-label="speel ${id} opnieuw">↻</button></span>`).join('')}</div>
      <p class="fine" style="text-align:center;margin-top:6px">Tik op ↻ om een element opnieuw te spelen.</p>
      <div class="reflect">
        <b>Even stilstaan</b>
        <ol>
          <li>Welke kaart herken je het meest in jezelf?</li>
          <li>Welke kaart geeft je energie, en welke kost je energie?</li>
          <li>Waar zie je dit terug in je werk, je team of je klas?</li>
        </ol>
      </div>
      <p class="fine">Er is geen goed of fout. Je keuze kan morgen anders zijn, en dat is precies waar het spel over gaat.</p>
      <div class="cta">
        <a class="btn primary" href="${LINKS.workshop}" target="_blank" rel="noopener">boek een workshop</a>
        <a class="btn second" href="${LINKS.koop}" target="_blank" rel="noopener">koop het spel</a>
        <a class="btn second" href="${png}" download="mijn-elemental-five.png">bewaar je kaarten</a>
        ${all ? '' : '<button class="btn dark" id="more" type="button">speel verder</button>'}
        <button class="btn dark" id="again" type="button">opnieuw spelen</button>
      </div>
    </div></div>`;
  document.querySelectorAll('.chip').forEach(b => b.onclick = () => showRead(b.dataset.id));
  document.querySelectorAll('.redo').forEach(b => b.onclick = () => replayElement(b.dataset.redo));
  $('#again').onclick = startScreen;
  if (!all) $('#more').onclick = () => { $('#ov').innerHTML = ''; pickElement(); };
  $('#again').focus();
}

function replayElement(id) {
  $('#ov').innerHTML = '';
  delete S.picks[id]; paintMe();
  openElement(id, deckRect());
}

function showRead(id) {
  const c = byId[id].cards[S.picks[id] - 1];
  const holder = document.createElement('div');
  holder.className = 'overlay readov'; holder.style.zIndex = 30;
  holder.innerHTML = `<div class="readcard" role="dialog" aria-label="${c.title}">
    <h2>${byId[id].name}: ${c.title.toLowerCase()}</h2><p>${c.short}</p>
    <details><summary>lees de hele kaart</summary><div class="full">${c.text.map(t => `<p>${t}</p>`).join('')}</div></details>
    <button class="btn primary" type="button">sluiten</button></div>`;
  holder.onclick = e => { if (e.target === holder || e.target.tagName === 'BUTTON') holder.remove(); };
  document.body.appendChild(holder);
  holder.querySelector('button').focus();
}
