(() => {
  const section = document.querySelector('.hs-capabilities');
  if (!section) return;
  const cards = [...section.querySelectorAll('.hs-capability')];
  const video = section.querySelector('video');
  const production = video.closest('.hs-capability');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const hover = matchMedia('(hover: hover) and (pointer: fine)');
  let paused = reduced.matches, visible = false;
  video.muted = true;
  video.defaultMuted = true;
  function sync() {
    if (paused || !visible || document.hidden || !production.classList.contains('is-active')) video.pause();
    else video.play().catch(() => {});
  }
  function activate(card) {
    cards.forEach(item => {
      const active = item === card;
      item.classList.toggle('is-active', active);
      item.querySelector('.hs-capability-select').setAttribute('aria-expanded', String(active));
      item.querySelector('.hs-capability-detail').hidden = !active;
    });
    sync();
  }
  cards.forEach(card => {
    card.addEventListener('pointerenter', () => {
      if (hover.matches && !cards.some(other => other !== card && other.contains(document.activeElement))) activate(card);
    });
    card.querySelector('.hs-capability-select').addEventListener('click', () => activate(card));
    card.querySelector('.hs-capability-select').addEventListener('focus', () => activate(card));
  });
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }, {threshold:.15}).observe(video);
  document.addEventListener('visibilitychange', sync);
  document.addEventListener('hs-motion-change', event => { paused = event.detail.paused; sync(); });
  reduced.addEventListener('change', event => { paused = event.matches; sync(); });
})();
