/* =========================================================
   Saylavy - shared site behaviour
   Header scroll state, mobile nav, reveal-on-scroll, and the
   scroll-driven journey through the eight faiths on the dashboard.
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

  /* ---------- Journey: scroll through the eight faiths ---------- */
  const BLURB = {
    protestant: "Bible stories, memory verses, and the good news, in real voices.",
    catholic: "Prayers, the saints, the sacraments, and the Catechism.",
    orthodox: "The holy icons, the saints, the feasts, and the Divine Liturgy.",
    muslim: "Qur'an recitation, the Arabic letters, and the Five Pillars.",
    hindu: "The great stories, the shlokas, and the festivals of light.",
    sikh: "Gurbani and Kirtan, the Ten Gurus, and the gift of seva.",
    jewish: "Torah stories, the Hebrew letters, and the joy of the holidays.",
    buddhist: "The Buddha's life, gentle mindfulness, and loving kindness."
  };
  const journey = document.getElementById("journey");
  const track = document.getElementById("journeyTrack");
  if (journey && track && window.FAITHS && window.FAITH_ORDER) {
    const order = window.FAITH_ORDER;
    const n = order.length;
    journey.style.setProperty("--n", n);

    track.innerHTML = order.map((slug, i) => {
      const f = window.FAITHS[slug];
      const num = String(i + 1).padStart(2, "0");
      return `<article class="jpanel ${f.theme}" data-i="${i}">
                <span class="jpanel-bg"></span>
                <span class="jpanel-sym" aria-hidden="true">${f.symbol}</span>
                <div class="jpanel-inner">
                  <div class="jpanel-emblem">${f.symbol}</div>
                  <span class="jnum">${num} / ${String(n).padStart(2, "0")}</span>
                  <h2>${f.name}</h2>
                  <p class="jblurb">${BLURB[slug] || ""}</p>
                  <a class="btn btn-gold btn-lg" href="${slug}.html">Enter ${f.name}</a>
                </div>
              </article>`;
    }).join("");

    const prog = document.getElementById("journeyProgress");
    if (prog) {
      prog.innerHTML = order.map((s, i) => `<button type="button" data-i="${i}" aria-label="Go to ${window.FAITHS[s].name}"></button>`).join("");
    }
    const countEl = document.getElementById("journeyCount");
    const sticky = journey.querySelector(".journey-sticky");
    const panels = Array.prototype.slice.call(track.children);
    const dots = prog ? Array.prototype.slice.call(prog.children) : [];
    const accents = order.map(s => window.FAITHS[s].accent);

    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isPinned = () => window.innerWidth > 820 && !reduce;

    let maxX = 0, ticking = false, active = -1;
    function measure() { maxX = Math.max(0, track.scrollWidth - window.innerWidth); }

    function render() {
      ticking = false;
      if (!isPinned()) { track.style.transform = ""; return; }
      const total = journey.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -journey.getBoundingClientRect().top / total)) : 0;
      track.style.transform = "translate3d(" + (-p * maxX) + "px,0,0)";

      const vw = window.innerWidth, cx = vw / 2;
      let cur = Math.round(p * (n - 1));
      panels.forEach((panel, i) => {
        const center = (i + 0.5) * vw - p * maxX;
        const dist = Math.abs(center - cx) / vw;             // 0 centred .. 1+ away
        const focus = Math.max(0, 1 - dist * 1.5);
        panel.style.setProperty("--focus", focus.toFixed(3));
        const sym = panel.querySelector(".jpanel-sym");
        if (sym) sym.style.transform = "translateX(" + ((center - cx) * -0.12) + "px)";
      });
      if (cur !== active) {
        active = cur;
        dots.forEach((d, i) => d.classList.toggle("active", i === cur));
        if (sticky) sticky.style.setProperty("--accent", accents[cur]);
        if (countEl) countEl.textContent = String(cur + 1).padStart(2, "0") + " / " + String(n).padStart(2, "0") + "  " + window.FAITHS[order[cur]].name;
      }
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(render); } }

    measure(); render();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => { measure(); render(); }, { passive: true });

    dots.forEach((d) => d.addEventListener("click", () => {
      const i = +d.dataset.i;
      if (isPinned()) {
        const total = journey.offsetHeight - window.innerHeight;
        const targetTop = journey.offsetTop + (i / (n - 1)) * total;
        window.scrollTo({ top: targetTop, behavior: "smooth" });
      } else {
        panels[i].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }));
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
