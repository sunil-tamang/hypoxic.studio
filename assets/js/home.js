(() => {
  "use strict";
  const video = document.querySelector(".hs-banner-video");
  const motionButton = document.querySelector(".hs-motion-toggle");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let paused = reducedMotion.matches;
  function setMotion(next) {
    paused = next;
    document.dispatchEvent(new CustomEvent("hs-motion-change", { detail: { paused } }));
    document.body.classList.toggle("hs-motion-paused", paused);
    motionButton.setAttribute("aria-label", paused ? "Play animations" : "Pause animations");
    motionButton.querySelector("span").textContent = paused ? "▶" : "Ⅱ";
    if (paused) video.pause();
    else video.play().catch(() => { /* A banner playback failure must not pause other videos. */ });
  }
  motionButton.addEventListener("click", () => setMotion(!paused));
  reducedMotion.addEventListener("change", event => setMotion(event.matches));
  setMotion(paused);
})();
