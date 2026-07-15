/* =========================================================
   Saylavy - shared site behaviour
   Header state, mobile nav, reveal-on-scroll, and the ocean
   fleet (eight faiths as boats) on the dashboard.
   ========================================================= */
(function () {
  "use strict";

  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
  }

  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
    links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => links.classList.remove("open")));
  }

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

  /* ---------- Ocean fleet: eight faiths as boats ---------- */
  const fleet = document.getElementById("fleet");
  if (fleet && window.FAITHS && window.FAITH_ORDER) {
    // scattered like a harbour; back rows smaller (sea recedes)
    const POS = [
      { l: 13, t: 50, s: 0.86 }, { l: 32, t: 62, s: 1.0 }, { l: 50, t: 49, s: 0.82 }, { l: 68, t: 60, s: 0.98 },
      { l: 87, t: 51, s: 0.85 }, { l: 24, t: 80, s: 1.16 }, { l: 52, t: 78, s: 1.12 }, { l: 80, t: 81, s: 1.1 }
    ];
    fleet.innerHTML = window.FAITH_ORDER.map((slug, i) => {
      const f = window.FAITHS[slug];
      const p = POS[i] || { l: 50, t: 65, s: 1 };
      const dur = (4 + (i % 4) * 0.6).toFixed(1);
      return `<a class="boat ${f.theme}" href="${slug}.html" aria-label="Enter ${f.name}"
                 style="left:${p.l}%;top:${p.t}%;--s:${p.s};--d:${dur}s;z-index:${Math.round(p.t)}">
                <span class="boat-art" style="animation-delay:${(i * 0.35).toFixed(2)}s">
                  <svg class="boat-svg" viewBox="0 0 120 120" aria-hidden="true">
                    <line class="mast" x1="60" y1="24" x2="60" y2="80"/>
                    <path class="sail" d="M57 26 L57 76 L23 76 Z"/>
                    <path class="sail sail2" d="M63 34 L63 76 L95 76 Z"/>
                    <path class="hull" d="M15 80 Q60 106 105 80 L96 97 Q60 111 24 97 Z"/>
                  </svg>
                  <span class="boat-sym">${f.symbol}</span>
                </span>
                <span class="boat-name">${f.name}</span>
              </a>`;
    }).join("");
  }

  /* ---------- contact form (mailto handoff, no backend) ---------- */
  document.querySelectorAll("form[data-mailto]").forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const to = form.getAttribute("data-mailto");
      const val = (form.querySelector("input[type=email], input[name=email]") || {}).value || "";
      const place = (form.querySelector("input[name=place]") || {}).value || "";
      const subject = encodeURIComponent("Saylavy - faith page collaboration");
      const body = encodeURIComponent(
        "Hello Saylavy,\n\nWe would like an interactive faith page and QR code for our community.\n\n" +
        "Community / place: " + place + "\nContact email: " + val + "\n\nThank you."
      );
      window.location.href = "mailto:" + to + "?subject=" + subject + "&body=" + body;
      const note = form.parentElement.querySelector(".cta-note");
      if (note) note.textContent = "Opening your email app... if nothing happens, write to " + to;
    });
  });
})();
