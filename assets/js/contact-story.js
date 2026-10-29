(() => {
  const section = document.querySelector('.hs-contact-story');
  if (!section) return;
  const frames = [...section.querySelectorAll('[data-frame]')];
  const scrub = section.querySelector('input[type="range"]');
  const detail = section.querySelector('.hs-contact-detail');
  const stories = [
    ['01 / COLLABORATION', 'Start with a shared vision.', 'We work with you to define the story, plan the shoot and assemble the right approach for your project.', 'Collaboration'],
    ['02 / ADVENTURE IN THE FIELD', 'Wherever the story takes us.', 'Expeditions, outdoor pursuits and the people behind them. We shape each shoot around the terrain, the activity and the story.', 'Adventure in the field'],
    ['03 / THE FINAL FILM', 'Bring the experience to life.', 'Editing, colour and sound bring the footage together into a film shaped around your story and audience.', 'The final film']
  ];
  let active = 1;
  function select(index) {
    frames.forEach((frame, i) => frame.setAttribute('aria-pressed', String(i === index)));
    scrub.value = index;
    scrub.setAttribute('aria-valuetext', stories[index][3]);
    section.style.setProperty('--contact-position', `${[12.5,50,87.5][index]}%`);
    if (index === active) return;
    active = index;
    detail.querySelector('span').textContent = stories[index][0];
    detail.querySelector('h3').textContent = stories[index][1];
    detail.querySelector('p').textContent = stories[index][2];
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      detail.getAnimations().forEach(animation => animation.cancel());
      detail.animate([{opacity:.25,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:280,easing:'ease-out'});
    }
  }
  frames.forEach((frame, index) => {
    frame.addEventListener('click', () => select(index));
    frame.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % frames.length;
      if (event.key === 'ArrowLeft') next = (index + frames.length - 1) % frames.length;
      if (next === undefined) return;
      event.preventDefault(); select(next); frames[next].focus();
    });
  });
  scrub.addEventListener('input', () => select(Number(scrub.value)));
  select(1);
})();
