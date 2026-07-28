/* =========================================================
   Saylavy - shared site behaviour
   Header state, mobile nav, reveal-on-scroll, hero video loop,
   and the liquid-glass faith cards on the dashboard.
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
    // slow, cinematic playback (override per video with data-rate)
    const rate = parseFloat(v.getAttribute("data-rate") || "0.6");
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
    let started = false;
    const onLoaded = () => {
      if (started) return; started = true;
      setOp(0); fadingOut = false; v.playbackRate = rate; v.play().catch(() => {}); fadeTo(1, 500);
    };
    const dropVideo = () => {
      const s = v.nextElementSibling;
      if (s && s.classList && s.classList.contains("cine-shade")) s.remove();
      v.remove();
    };
    v.addEventListener("error", dropVideo);
    if (v.error) { dropVideo(); return; }
    v.addEventListener("loadeddata", onLoaded);
    v.addEventListener("timeupdate", () => {
      if (v.duration && v.duration - v.currentTime <= 0.55 && !fadingOut) { fadingOut = true; fadeTo(0, 500); }
    });
    v.addEventListener("ended", () => {
      setOp(0);
      window.setTimeout(() => { v.currentTime = 0; v.playbackRate = rate; v.play().catch(() => {}); fadingOut = false; fadeTo(1, 500); }, 100);
    });
    if (v.readyState >= 2) onLoaded();
  }
  window.SaylavyCine = cineVideo;
  cineVideo(document.getElementById("heroVideo"));

  /* ---------- personalised demo link (index.html?for=Community) ---------- */
  (function () {
    const who = (new URLSearchParams(location.search).get("for") || "").replace(/[<>]/g, "").trim().slice(0, 80);
    if (!who) return;
    const host = document.querySelector(".cine-inner .eyebrow");
    if (!host) return;
    const p = document.createElement("p");
    p.className = "prepared-for";
    const s = document.createElement("span");
    s.textContent = "Prepared for";
    p.appendChild(s);
    p.appendChild(document.createTextNode(" " + who));
    host.parentNode.insertBefore(p, host);
    document.title = "Saylavy for " + who;
  })();

  /* ---------- The twelve faiths: liquid-glass cards ---------- */
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
      const sc = f.script;
      return `<a class="gcard liquid-glass ${f.theme}" href="${slug}.html" aria-label="Enter ${f.name}">
                <span class="sym">${f.symbol}</span>
                ${sc ? `<span class="gnative" lang="${sc.lang}" dir="${sc.dir}">${sc.text}</span>` : ""}
                <strong>${f.name}</strong>
                <small>${TAG[slug] || ""}</small>
                <span class="go">Enter
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </span>
              </a>`;
    }).join("");
  }

  /* ---------- GTA communities: areas, faith spread, optional names ---------- */
  const gta = document.getElementById("gta");
  if (gta && window.COMMUNITIES) {
    const C = window.COMMUNITIES;
    const LABEL = {
      protestant: "Protestant churches", catholic: "Catholic parishes",
      orthodox: "Orthodox churches", muslim: "Masjids and Islamic centres",
      hindu: "Mandirs", sikh: "Gurdwaras", jewish: "Synagogues", buddhist: "Temples"
    };
    const order = (window.FAITH_ORDER || Object.keys(C.counts));
    const stats = order.filter(k => C.counts[k]).map(k => {
      const f = (window.FAITHS || {})[k] || {};
      return `<a class="gstat ${f.theme || ""}" href="${k}.html">
                <span class="gsym">${f.symbol || ""}</span>
                <strong>${C.counts[k]}</strong>
                <small>${LABEL[k] || k}</small>
              </a>`;
    }).join("");
    const areas = C.areas.map(a => `<span class="gchip">${a[0]}</span>`).join("");
    const names = C.showNames
      ? `<div class="gnames">${C.places.map(p => `<span>${p.place}</span>`).join("")}</div>`
      : "";
    gta.innerHTML =
      `<div class="gstats">${stats}</div>
       <p class="gsub">${C.total} communities identified across ${C.areas.length} areas</p>
       <div class="gchips">${areas}</div>${names}`;
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
