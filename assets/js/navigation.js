(() => {
  "use strict";
  const clock = document.querySelector(".hs-clock");
  const dateFormat = new Intl.DateTimeFormat("en-US", {timeZone: "Asia/Kathmandu", month: "short", day: "numeric"});
  const timeFormat = new Intl.DateTimeFormat("en-US", {timeZone: "Asia/Kathmandu", hour: "numeric", minute: "2-digit"});
  function updateClock() {
    const now = new Date();
    clock.dateTime = now.toISOString();
    clock.textContent = `${dateFormat.format(now)}, ${timeFormat.format(now)}`;
  }
  updateClock();
  window.setInterval(updateClock, 30000);

  const header = document.querySelector(".hs-nav");
  const toggle = document.querySelector(".hs-menu-toggle");
  const menu = document.querySelector(".hs-menu");
  const backdrop = document.querySelector(".hs-backdrop");
  const content = [document.querySelector("main"), document.querySelector(".hs-footer")].filter(Boolean);
  const menuMotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  let open = false;
  let savedOverflow = "";
  let scrollLocked = false;
  let menuAnimations = [];
  let menuRevision = 0;
  function setMenu(next) {
    if (next === open) return;
    // Start from the currently rendered state, including a mid-transition toggle.
    const startHeight = header.getBoundingClientRect().height;
    const startOpacity = menu.hidden ? 0 : Number(getComputedStyle(menu).opacity);
    const startTransform = menu.hidden ? "translateY(-10px)" : getComputedStyle(menu).transform;
    const backdropOpacity = backdrop.hidden ? 0 : Number(getComputedStyle(backdrop).opacity);
    const revision = ++menuRevision;
    menuAnimations.forEach(animation => animation.cancel());
    menuAnimations = [];
    open = next;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    header.classList.toggle("is-open", open);
    menu.hidden = false;
    backdrop.hidden = false;
    menu.inert = !open;
    content.forEach(el => { el.inert = true; });
    if (!scrollLocked) {
      savedOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      scrollLocked = true;
    }
    if (!open) toggle.focus({preventScroll: true});
    const endHeight = open ? header.getBoundingClientRect().height : header.querySelector(".hs-nav-bar").getBoundingClientRect().height;
    function finish() {
      if (revision !== menuRevision) return;
      menu.hidden = !open;
      backdrop.hidden = !open;
      header.style.overflow = "";
      menuAnimations.forEach(animation => animation.cancel());
      menuAnimations = [];
      if (open) {
        // Do not steal focus if the user already moved it during the animation.
        if (document.activeElement === toggle || !header.contains(document.activeElement)) {
          menu.querySelector("a").focus({preventScroll: true});
        }
      } else {
        content.forEach(el => { el.inert = false; });
        document.body.style.overflow = savedOverflow;
        scrollLocked = false;
      }
    }
    if (menuMotionPreference.matches) { finish(); return; }
    header.style.overflow = "hidden";
    const timing = {duration: 520, easing: "cubic-bezier(.22,1,.36,1)", fill: "both"};
    menuAnimations = [
      header.animate([{height: `${startHeight}px`}, {height: `${endHeight}px`}], timing),
      menu.animate([{opacity: startOpacity, transform: startTransform}, {opacity: open ? 1 : 0, transform: open ? "translateY(0)" : "translateY(-10px)"}], timing),
      backdrop.animate([{opacity: backdropOpacity}, {opacity: open ? 1 : 0}], timing)
    ];
    Promise.all(menuAnimations.map(animation => animation.finished)).then(finish).catch(() => {});
  }
  toggle.addEventListener("click", () => setMenu(!open));
  backdrop.addEventListener("click", () => setMenu(false));
  header.querySelectorAll("a").forEach(link => link.addEventListener("click", event => {
    if (link.hasAttribute("data-placeholder")) { event.preventDefault(); return; }
    setMenu(false);
  }));
  document.addEventListener("keydown", event => {
    if (!open) return;
    if (event.key === "Escape") { event.preventDefault(); setMenu(false); }
    if (event.key === "Tab") {
      const focusable = [...header.querySelectorAll("a, button")].filter(el => el.getClientRects().length && getComputedStyle(el).visibility !== "hidden");
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

})();
