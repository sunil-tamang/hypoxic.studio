(() => {
 const page = document.querySelector('.project-showcase');
 if (!page) return;
 const rail = page.querySelector('.project-rail');
 const cards = [...page.querySelectorAll('.project-card')];
 const filters = [...page.querySelectorAll('[data-film-filter]')];
 const controls = page.querySelector('.project-controls');
 const prev = page.querySelector('[data-project-prev]');
 const next = page.querySelector('[data-project-next]');
 const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
 const visible = () => cards.filter(card => !card.hidden);
 function position() {
  const shown = visible();
  const left = rail.getBoundingClientRect().left;
  let index = 0;
  shown.forEach((card, i) => { if (card.getBoundingClientRect().left <= left + 20) index = i; });
  page.querySelector('[data-project-position]').textContent = `${String(shown.length ? index + 1 : 0).padStart(2,'0')} / ${String(shown.length).padStart(2,'0')}`;
  const progress = page.querySelector('progress');
  progress.max = Math.max(shown.length, 1); progress.value = shown.length ? index + 1 : 0;
  prev.disabled = rail.scrollLeft <= 2;
  next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2;
 }
 filters.forEach(button => {
  const category = button.dataset.filmFilter;
  const count = button.querySelector('[data-category-count]');
  if (count) count.textContent = String(cards.filter(card => !category || card.dataset.filmCategory === category).length).padStart(2,'0');
  button.addEventListener('click', () => {
   filters.forEach(other => other.setAttribute('aria-pressed', String(other.dataset.filmFilter === category)));
   page.querySelectorAll('[data-film-category]').forEach(item => { item.hidden = !!category && item.dataset.filmCategory !== category; });
   cards.forEach(card => { const video = card.querySelector('video'); if (video) {video.pause();video.classList.remove('is-playing');} });
   rail.scrollLeft = 0;
   page.querySelector('.film-filter-empty').hidden = visible().length > 0;
   page.querySelector('.film-filter-status').textContent = `${visible().length} projects shown${category ? ' in ' + category : ''}.`;
   controls.hidden = page.dataset.view === 'list' || !visible().length;
   position();
  });
 });
 ['grid','list'].forEach(view => page.querySelector('#' + view + 'Btn').addEventListener('click', () => {
  page.dataset.view = view;
  ['grid','list'].forEach(name => page.querySelector('#' + name + 'Btn').setAttribute('aria-pressed', String(name === view)));
  controls.hidden = view === 'list' || !visible().length;
  cards.forEach(card => { const video = card.querySelector('video'); if(video){video.pause();video.classList.remove('is-playing');} });
  position();
 }));
 function move(direction) {
  const card = visible()[0];
  if(card) rail.scrollBy({left:direction * (card.getBoundingClientRect().width + 16), behavior:reduced.matches ? 'instant' : 'smooth'});
 }
 prev.addEventListener('click', () => move(-1)); next.addEventListener('click', () => move(1));
 rail.addEventListener('keydown', event => {if(event.target === rail && ['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();move(event.key === 'ArrowLeft' ? -1 : 1);}});
 rail.addEventListener('scroll', position, {passive:true});
 window.addEventListener('resize', position);
 cards.forEach(card => {
  const video = card.querySelector('video'); if (!video) return;
  let active = false;
  const play = () => {if(reduced.matches)return;active=true;video.play().then(() => {if(active)video.classList.add('is-playing');else video.pause();}).catch(() => {});};
  const stop = () => {active=false;video.pause();video.classList.remove('is-playing');};
  card.addEventListener('mouseenter',play);card.addEventListener('mouseleave',stop);card.addEventListener('focus',play);card.addEventListener('blur',stop);
 });
 position();
})();
