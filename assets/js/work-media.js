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
