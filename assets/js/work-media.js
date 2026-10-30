(() => {
  "use strict";
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  let paused = preference.matches;
  const cards = Array.from(document.querySelectorAll(".hs-work-video"), video => {
    // Set the property as well as the attribute for muted autoplay across browsers.
    video.muted = true;
    video.defaultMuted = true;
    return { video, visible: false };
  });
  function sync() {
    cards.forEach(card => {
      if (paused || document.hidden || !card.visible) card.video.pause();
      else card.video.play().catch(() => { /* Retain the poster if autoplay is unavailable. */ });
    });
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const card = cards.find(item => item.video === entry.target);
      card.visible = entry.isIntersecting;
    });
    sync();
  }, { threshold: 0.15 });
  cards.forEach(card => observer.observe(card.video));
  document.addEventListener("visibilitychange", sync);
  document.addEventListener("hs-motion-change", event => { paused = event.detail.paused; sync(); });
  preference.addEventListener("change", event => { paused = event.matches; sync(); });
})();

// Share the page's contour origin rather than restarting the tile per image.
(() => {
  const surfaces = [...document.querySelectorAll('.hs-work-photo')];
  if (!surfaces.length) return;
  const source = document.body;
  let frame;
  function alignContours() {
    frame = null;
    const origin = source.getBoundingClientRect();
    const style = getComputedStyle(source);
    surfaces.forEach(surface => {
      const rect = surface.getBoundingClientRect();
      surface.style.setProperty('--work-contour-position', `${origin.left - rect.left}px ${origin.top - rect.top}px`);
      surface.style.setProperty('--work-contour-size', style.backgroundSize);
    });
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(alignContours);
  }
  window.addEventListener('resize', schedule);
  window.addEventListener('load', schedule);
  document.fonts.ready.then(schedule);
  const observer = new ResizeObserver(schedule);
  observer.observe(source);
  const shell = document.querySelector('.hs-shell');
  if (shell) observer.observe(shell);
  surfaces.forEach(surface => observer.observe(surface));
  schedule();
})();
