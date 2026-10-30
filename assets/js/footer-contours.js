(() => {
  const footer = document.querySelector('.hs-chrome-footer');
  const surface = document.querySelector('.hs-page-content') || document.body;
  if (!footer) return;
  let scheduled = false;
  function align() {
    scheduled = false;
    const source = surface.getBoundingClientRect();
    const target = footer.getBoundingClientRect();
    const style = getComputedStyle(surface);
    // Fixed textures share a viewport origin; scrolling textures share the source origin.
    footer.style.backgroundAttachment = style.backgroundAttachment;
    footer.style.backgroundPosition = style.backgroundAttachment === 'fixed'
      ? style.backgroundPosition
      : `${source.left - target.left}px ${source.top - target.top}px`;
    footer.style.backgroundSize = style.backgroundSize;
  }
  function schedule() {
    if (!scheduled) { scheduled = true; requestAnimationFrame(align); }
  }
  const observer = new ResizeObserver(schedule);
  observer.observe(document.body);
  observer.observe(surface);
  observer.observe(footer);
  window.addEventListener('resize', schedule);
  window.addEventListener('load', schedule, {once:true});
  if (document.fonts) document.fonts.ready.then(schedule);
  schedule();
})();
