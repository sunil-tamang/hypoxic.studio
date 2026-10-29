(() => {
 const form = document.getElementById('space-booking-form');
 if (!form) return;
 const fields = form.elements;
 const date = new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Kathmandu',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
 const part = type => date.find(item => item.type === type).value;
 fields.date.min = `${part('year')}-${part('month')}-${part('day')}`;
 const duration = () => {
  const hourly = fields.duration.value === 'Hourly';
  document.getElementById('booking-hours-label').hidden = !hourly;
  fields.hours.disabled = !hourly; fields.hours.required = hourly;
 };
 fields.duration.addEventListener('change', duration);duration();
 document.querySelectorAll('[data-book-space]').forEach(link => link.addEventListener('click', () => { fields.space.value = link.dataset.bookSpace; }));
 form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const addons = [...form.querySelectorAll('input[name="addons"]:checked')].map(input => input.value);
  const lines = ['Studio booking enquiry', '', `Name: ${fields.name.value}`, `Email: ${fields.email.value}`, `Space: ${fields.space.value}`, `Duration: ${fields.duration.value}`, `Package: ${fields.namedItem("package").value}`, ...(fields.hours.disabled ? [] : [`Hours: ${fields.hours.value}`]), `Preferred date: ${fields.date.value}`, `Preferred start time (Nepal): ${fields.time.value}`, `Optional services: ${addons.length ? addons.join(', ') : 'None selected'}`, '', fields.message.value, '', 'Please confirm availability, pricing, session hours and equipment.'];
  window.location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent('Studio enquiry — ' + fields.space.value)}&body=${encodeURIComponent(lines.join('\n'))}`;
  document.getElementById('space-booking-status').textContent = 'Your email draft is ready to open. Send it from your email app to request availability. If no app opens, email us directly using the address beside this form.';
 });
})();

// Enhance the studio sections into accessible tabs; all remain visible without JS.
(() => {
 const tabs = [...document.querySelectorAll('[data-studio-tab]')];
 if (!tabs.length) return;
 const panels = tabs.map(tab => document.getElementById(tab.dataset.studioTab));
 tabs[0].parentElement.setAttribute('role', 'tablist');
 function select(index, focus = false) {
  tabs.forEach((tab, i) => {
   tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1;
   panels[i].hidden = i !== index;
  });
  if (focus) tabs[index].focus();
 }
 tabs.forEach((tab, index) => {
  tab.setAttribute('role','tab');tab.setAttribute('aria-controls',panels[index].id);
  panels[index].setAttribute('role','tabpanel');panels[index].setAttribute('aria-labelledby',tab.id);
  tab.addEventListener('click', () => select(index));
  tab.addEventListener('keydown', event => {
   let next;
   if(event.key === 'ArrowRight') next = (index+1)%tabs.length;
   if(event.key === 'ArrowLeft') next = (index+tabs.length-1)%tabs.length;
   if(event.key === 'Home') next=0;
   if(event.key === 'End') next=tabs.length-1;
   if(next !== undefined){event.preventDefault();select(next,true);}
  });
 });
 select(0);
 panels.forEach(panel => panel.querySelectorAll('[data-gallery-src]').forEach(button => button.addEventListener('click', () => {
  const image=panel.querySelector('.rental-feature');image.src=button.dataset.gallerySrc;image.alt=button.dataset.galleryAlt;
  panel.querySelectorAll('[data-gallery-src]').forEach(other => other.setAttribute('aria-pressed',String(other===button)));
 })));
})();
