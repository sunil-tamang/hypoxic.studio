(() => {
 const form = document.getElementById('hc-form');
 if (!form) return;
 document.querySelectorAll('.hc-social [data-placeholder]').forEach(link => link.addEventListener('click', event => event.preventDefault()));
 form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const body = `Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`;
  window.location.href = `mailto:hello@hypoxic.com?subject=${encodeURIComponent(data.get('subject'))}&body=${encodeURIComponent(body)}`;
  document.getElementById('hc-status').textContent = 'Please review and send the draft in your email app. If it does not open, email hello@hypoxic.com directly.';
 });
})();
