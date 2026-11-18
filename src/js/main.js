/* start the game */
$('#brandImg').src = IMG.back;
$('#restart').onclick = () => startScreen();
$('#back').onclick = goBack;
$('#sound').onclick = () => { const on = SND.toggle(); $('#sound').setAttribute('aria-pressed', on); };
addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelectorAll('.readov').forEach(o => o.remove()); });
$('#minis').onclick = e => { const b = e.target.closest('[data-el]'); if (b && S.picks[b.dataset.el]) showRead(b.dataset.el); };
S = fresh(null);
startScreen();
