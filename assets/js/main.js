/* =========================================================
   Saylavy - shared site behaviour
   Header scroll state, mobile nav, reveal-on-scroll, and the
   circular "circle of eight" faith selector on the dashboard.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- header shadow on scroll ---------- */
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- mobile nav ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
    links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => links.classList.remove("open")));
  }

  /* ---------- reveal on scroll ---------- */
  function reveal() {
    const items = document.querySelectorAll(".reveal:not(.in)");
    if (!("IntersectionObserver" in window)) { items.forEach(i => i.classList.add("in")); return; }
    const io = new IntersectionObserver((ents, obs) => {
      ents.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); obs.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    items.forEach(i => io.observe(i));
  }
  window.SaylavyReveal = reveal;
  reveal();

  /* ---------- build the circle of eight ---------- */
  const circle = document.getElementById("circle");
  if (circle && window.FAITHS && window.FAITH_ORDER) {
    const order = window.FAITH_ORDER;
    const n = order.length;
    const R = 39; // percent radius, relative to wrap centre
    const lines = document.getElementById("circleLines");
    let lineSvg = "";
    const nodesHtml = order.map((slug, i) => {
      const f = window.FAITHS[slug];
      // start at top (-90deg), go clockwise
      const angle = (-90 + (360 / n) * i) * Math.PI / 180;
      const x = Math.cos(angle) * R;
      const y = Math.sin(angle) * R;
      // constellation line from centre (50,50) to the node, in the 0..100 viewBox
      lineSvg += `<line x1="50" y1="50" x2="${(50 + x).toFixed(2)}" y2="${(50 + y).toFixed(2)}" style="animation-delay:${(i * -3)}s"/>`;
      const fd = (5.5 + (i % 4) * 0.7).toFixed(1); // varied float duration
      const dl = (i * 0.4).toFixed(1);             // staggered start
      return `<span class="node-pos" style="--x:calc(${x.toFixed(3)} * 1cqw); --y:calc(${y.toFixed(3)} * 1cqw)">
                <a class="faith-node ${f.theme}" href="${slug}.html"
                   style="--fd:${fd}s; --dl:${dl}s" aria-label="${f.name}">
                  <span class="halo"></span>
                  <span class="sym">${f.symbol}</span>
                  <span class="label">${f.name}</span>
                </a>
              </span>`;
    }).join("");
    circle.innerHTML = nodesHtml;
    if (lines) lines.innerHTML = lineSvg;
  }

  /* ---------- contact form (mailto handoff, no backend) ---------- */
  document.querySelectorAll("form[data-mailto]").forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const to = form.getAttribute("data-mailto");
      const val = (form.querySelector("input[type=email], input[name=email]") || {}).value || "";
      const place = (form.querySelector("input[name=place]") || {}).value || "";
      const subject = encodeURIComponent("Saylavy - free faith page request");
      const body = encodeURIComponent(
        "Hello Saylavy,\n\nWe would like a free interactive faith page and QR code for our community.\n\n" +
        "Community / place: " + place + "\nContact email: " + val + "\n\nThank you."
      );
      window.location.href = "mailto:" + to + "?subject=" + subject + "&body=" + body;
      const note = form.parentElement.querySelector(".cta-note");
      if (note) note.textContent = "Opening your email app... if nothing happens, write to " + to;
    });
  });
})();
