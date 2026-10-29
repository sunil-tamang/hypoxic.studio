(() => {
  const section = document.querySelector('.hs-contact-story');
  if (!section) return;
  const frames = [...section.querySelectorAll('[data-frame]')];
  const scrub = section.querySelector('input[type="range"]');
  const detail = section.querySelector('.hs-contact-detail');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (!frames.length || !scrub || !detail) return;
  scrub.max = frames.length - 1;
  function select(index, reveal = true) {
    frames.forEach((frame, i) => frame.setAttribute('aria-pressed', String(i === index)));
    const story = frames[index].dataset;
    scrub.value = index;
    scrub.setAttribute('aria-valuetext', story.label);
    section.style.setProperty('--contact-position', `${[12.5, 50, 87.5][index]}%`);
    detail.querySelector('span').textContent = `${String(index + 1).padStart(2, '0')} / ${story.label.toUpperCase()}`;
    detail.querySelector('h3').textContent = story.title;
    detail.querySelector('p').textContent = story.description;
    if (reveal && !reduced.matches) {
      detail.getAnimations().forEach(animation => animation.cancel());
      detail.animate([{opacity:.25},{opacity:1}], {duration:280,easing:'ease-out'});
    }

  }
  frames.forEach((frame, index) => {
    frame.addEventListener('click', () => select(index));
    frame.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % frames.length;
      if (event.key === 'ArrowLeft') next = (index + frames.length - 1) % frames.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = frames.length - 1;
      if (next === undefined) return;
      event.preventDefault(); select(next); frames[next].focus({preventScroll:true});
    });
  });
  scrub.addEventListener('input', () => select(Number(scrub.value)));
  select(Number(scrub.value), false);
})();
