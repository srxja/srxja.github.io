/* nav.js — the ☰ dropdown. Click to open, click outside / Esc to close. */
(function () {
  const btn = document.querySelector('.menu-btn');
  const menu = document.querySelector('.menu');
  if (!btn || !menu) return;
  const set = open => { menu.classList.toggle('open', open); btn.setAttribute('aria-expanded', String(open)); };
  btn.addEventListener('click', e => { e.stopPropagation(); set(!menu.classList.contains('open')); });
  document.addEventListener('click', e => { if (!menu.contains(e.target)) set(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
})();
