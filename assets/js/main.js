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

  /* ---------- cinematic hero video: rAF fade loop ---------- */
  function cineVideo(v) {
    if (!v) return;
    let raf = null, op = 0, fadingOut = false;
    const setOp = (x) => { op = x; v.style.opacity = String(x); };
    const fadeTo = (target, dur) => {
      if (raf !== null) cancelAnimationFrame(raf);
      const start = op, t0 = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - t0) / dur);
        setOp(start + (target - start) * t);
        raf = t < 1 ? requestAnimationFrame(step) : null;
      };
      raf = requestAnimationFrame(step);
    };
    const onLoaded = () => { setOp(0); fadingOut = false; v.play().catch(() => {}); fadeTo(1, 500); };
    v.addEventListener("loadeddata", onLoaded);
    v.addEventListener("timeupdate", () => {
      if (v.duration && v.duration - v.currentTime <= 0.55 && !fadingOut) { fadingOut = true; fadeTo(0, 500); }
    });
    v.addEventListener("ended", () => {
      setOp(0);
      window.setTimeout(() => { v.currentTime = 0; v.play().catch(() => {}); fadingOut = false; fadeTo(1, 500); }, 100);
    });
    if (v.readyState >= 2) onLoaded();
  }
  window.SaylavyCine = cineVideo;
  cineVideo(document.getElementById("heroVideo"));

  /* ---------- Dusk sea: eight silhouette boats, one per faith ----------
     Solid dark silhouettes (no clip-art detail) so the scene reads as art.
     Each sail carries the faith symbol glowing in the faith colour. */
  const fleet = document.getElementById("fleet");
  if (fleet && window.FAITHS && window.FAITH_ORDER) {
    // distinct hull/sail silhouettes, one per faith (140x110 viewBox, solid fill)
    const SIL = {
      protestant: `<path d="M67 16 L67 82 L27 82 Q40 50 67 16 Z"/><path d="M73 26 L73 82 L112 82 Q94 56 73 26 Z"/><rect x="67" y="14" width="4" height="70"/><path d="M14 84 Q70 102 126 84 L116 98 Q70 110 24 98 Z"/>`,
      catholic:   `<path d="M46 20 H96 L91 42 H51 Z"/><path d="M42 47 H100 L94 74 H48 Z"/><rect x="69" y="12" width="4" height="70"/><rect x="102" y="66" width="18" height="18" rx="2"/><path d="M14 84 Q70 102 128 84 L118 98 Q70 110 24 98 Z"/>`,
      orthodox:   `<path d="M40 26 H92 L88 66 H44 Z"/><rect x="64" y="16" width="4" height="66"/><rect x="98" y="66" width="22" height="16" rx="2"/><path d="M100 66 q9 -18 18 0 z"/><path d="M14 84 Q70 102 128 84 L118 98 Q70 110 24 98 Z"/>`,
      muslim:     `<path d="M44 20 Q92 28 100 44 L64 84 Q48 56 44 20 Z"/><path d="M46 18 L76 84 L72 86 Z"/><path d="M10 86 Q66 104 118 92 Q134 88 138 78 Q104 94 44 92 Q22 92 12 84 Z"/>`,
      hindu:      `<path d="M38 62 Q70 40 102 62 L97 70 Q70 52 43 70 Z"/><rect x="42" y="62" width="4" height="24"/><rect x="94" y="62" width="4" height="24"/><path d="M14 84 Q70 104 126 84 L116 100 Q70 112 24 100 Z"/>`,
      sikh:       `<path d="M40 30 H88 L84 70 H44 Z"/><rect x="62" y="18" width="4" height="66"/><rect x="100" y="18" width="3" height="66"/><path d="M103 22 L124 30 L103 38 Z"/><path d="M14 84 Q70 102 126 84 L116 98 Q70 110 24 98 Z"/>`,
      jewish:     `<rect x="44" y="52" width="56" height="32" rx="3"/><path d="M40 52 H104 L88 36 H56 Z"/><path d="M12 84 Q70 104 130 84 L120 100 Q70 112 22 100 Z"/>`,
      buddhist:   `<path d="M58 20 Q90 26 92 82 L40 82 Q42 44 58 20 Z"/><rect x="58" y="14" width="4" height="70"/><path d="M14 84 Q70 100 122 82 L130 66 L122 96 Q70 108 24 96 Z"/>`
    };
    // pos: left/top %, s: scale (near = bigger), e: emblem x/y % within the boat art
    const POS = [
      { l: 12, t: 56, s: .78, e: [48, 42] }, { l: 31, t: 66, s: .95, e: [50, 40] },
      { l: 49, t: 55, s: .74, e: [47, 38] }, { l: 67, t: 64, s: .92, e: [48, 40] },
      { l: 86, t: 57, s: .78, e: [50, 40] }, { l: 22, t: 84, s: 1.14, e: [46, 42] },
      { l: 52, t: 82, s: 1.1,  e: [50, 46] }, { l: 80, t: 85, s: 1.08, e: [47, 42] }
    ];
    fleet.innerHTML = window.FAITH_ORDER.map((slug, i) => {
      const f = window.FAITHS[slug];
      const p = POS[i];
      return `<a class="boat ${f.theme}" href="${slug}.html" aria-label="Enter ${f.name}"
                 style="left:${p.l}%;top:${p.t}%;--s:${p.s};--d:${(6.5 + (i % 4)).toFixed(1)}s;z-index:${Math.round(p.t)}">
                <span class="boat-art" style="animation-delay:${(i * 0.55).toFixed(2)}s">
                  <svg class="boat-svg" viewBox="0 0 140 110" aria-hidden="true"><g class="sil">${SIL[slug]}</g></svg>
                  <span class="boat-sym" style="left:${p.e[0]}%;top:${p.e[1]}%">${f.symbol}</span>
                  <span class="boat-glow" aria-hidden="true"></span>
                </span>
                <span class="boat-name">${f.name}</span>
              </a>`;
    }).join("");

    // a quiet field of stars in the upper sky
    const starsWrap = document.getElementById("seaStars");
    if (starsWrap) {
      let s = "";
      for (let i = 0; i < 46; i++) {
        const x = (Math.random() * 100).toFixed(1), y = (Math.random() * 46).toFixed(1);
        const sz = (Math.random() * 1.6 + 0.8).toFixed(1), o = (Math.random() * 0.5 + 0.3).toFixed(2);
        s += `<i style="left:${x}%;top:${y}%;width:${sz}px;height:${sz}px;opacity:${o}"></i>`;
      }
      starsWrap.innerHTML = s;
    }
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
