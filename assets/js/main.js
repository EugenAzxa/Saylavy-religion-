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

  /* ---------- The eight faiths: clean card grid ---------- */
  const grid = document.getElementById("faithGrid");
  if (grid && window.FAITHS && window.FAITH_ORDER) {
    const TAG = {
      protestant: "Bible, verses, the gospel",
      catholic: "Prayers, saints, sacraments",
      orthodox: "Icons, saints, the liturgy",
      muslim: "Qur'an, Arabic, the Pillars",
      hindu: "Stories, shlokas, festivals",
      sikh: "Gurbani, the Gurus, seva",
      jewish: "Torah, Hebrew, the holidays",
      buddhist: "The Buddha, mindfulness"
    };
    grid.innerHTML = window.FAITH_ORDER.map((slug) => {
      const f = window.FAITHS[slug];
      return `<a class="fcard ${f.theme}" href="${slug}.html" aria-label="Enter ${f.name}">
                <span class="sym">${f.symbol}</span>
                <strong>${f.name}</strong>
                <small>${TAG[slug] || ""}</small>
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
