/* start the game */
$('#brandImg').src = IMG.back;
$('#restart').onclick = () => startScreen();
$('#back').onclick = goBack;
$('#sound').onclick = () => { const on = SND.toggle(); $('#sound').setAttribute('aria-pressed', on); };
(() => { // swipe between the two cards
  const st = $('#stage'); let x0 = null;
  st.addEventListener('pointerdown', e => { if (S.busy || S.level < 2 || !S.active || e.target.closest('button, input')) return; x0 = e.clientX; st.classList.add('drag'); });
  st.addEventListener('pointermove', e => { if (x0 == null) return; const dx = e.clientX - x0; st.style.transform = `translateX(${dx * .45}px) rotate(${dx * .025}deg)`; });
  const end = e => {
    if (x0 == null) return;
    const dx = e.clientX - x0; x0 = null; st.classList.remove('drag'); st.style.transform = '';
    if (Math.abs(dx) > 60 && !S.busy) {
      const other = S.pair.find(n => n !== S.active);
      const btn = [...$('#hand').children].find(b => b.dataset.key === String(other));
      if (btn) readCard(S.cur, other, btn);
    }
  };
  st.addEventListener('pointerup', end);
  st.addEventListener('pointercancel', () => { x0 = null; st.classList.remove('drag'); st.style.transform = ''; });
})();
addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelectorAll('.readov').forEach(o => o.remove()); });
$('#minis').onclick = e => { const b = e.target.closest('[data-el]'); if (b && S.picks[b.dataset.el]) showRead(b.dataset.el); };
S = fresh(null);
startScreen();
