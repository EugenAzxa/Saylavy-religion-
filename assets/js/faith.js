/* =========================================================
   Saylavy - Faith page renderer + Ask/Listen engine
   Renders a faith page from FAITHS[data-faith]. Powers:
   - the faith guide chat (ask + listen) in the hero
   - the "People of this faith" cards, each opening a modal with
     a biography, a spoken voice, and a chat you can speak with
   Pure front end, browser Speech APIs. Works on GitHub Pages.
   ========================================================= */
(function () {
  "use strict";

  const root = document.getElementById("faith-root");
  if (!root || !window.FAITHS) return;

  const key = root.getAttribute("data-faith");
  const f = window.FAITHS[key];
  if (!f) { root.innerHTML = "<p style='padding:3rem'>Faith not found.</p>"; return; }

  document.body.classList.add("faith-page", f.theme);
  document.title = "Saylavy for " + f.name + " communities";

  const el = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const ICON = {
    play: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4l12 8-12 8z"/></svg>`,
    stop: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>`,
    sound: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 8a5 5 0 0 1 0 8"/></svg>`,
    mic: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M6 11a6 6 0 0 0 12 0"/><path d="M12 17v4"/></svg>`,
    send: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l16-8-6 16-3-6z"/></svg>`,
    back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 6l-6 6 6 6"/></svg>`,
    arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`,
    qr: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3M21 14v.01M17 21h4M21 17v4M14 21v.01"/></svg>`
  };

  /* =====================================================
     Speech engine (voice preference aware)
     ===================================================== */
  const synth = window.speechSynthesis || null;
  let voices = [];
  function loadVoices() { if (synth) voices = synth.getVoices(); }
  if (synth) { loadVoices(); synth.onvoiceschanged = loadVoices; }

  const FEM = /Samantha|Karen|Moira|Serena|Victoria|Tessa|Fiona|Susan|Zira|Allison|Ava|female|woman/i;
  const MAL = /Daniel|Alex|Fred|Oliver|Thomas|Arthur|George|David|Aaron|Rishi|male|\bman\b/i;

  function pickVoice(pref) {
    if (!voices.length) return null;
    const en = voices.filter(v => /^en([-_]|$)/i.test(v.lang));
    let pool = en.length ? en : voices;
    if (pref && pref.g === "f") { const s = pool.filter(v => FEM.test(v.name)); if (s.length) pool = s; }
    else if (pref && pref.g === "m") { const s = pool.filter(v => MAL.test(v.name)); if (s.length) pool = s; }
    const idx = pref && pref.idx != null ? pref.idx % pool.length : 0;
    return pool[idx] || pool[0];
  }

  let activeBtn = null;
  function speak(text, btn, pref) {
    if (!synth) return;
    synth.cancel();
    if (activeBtn) { activeBtn.classList.remove("speaking"); setBtnLabel(activeBtn, false); activeBtn = null; }
    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice(pref); if (v) u.voice = v;
    u.rate = pref && pref.rate ? pref.rate : 0.94;
    u.pitch = pref && pref.pitch ? pref.pitch : 1.0;
    if (btn) {
      activeBtn = btn; btn.classList.add("speaking"); setBtnLabel(btn, true);
      u.onend = u.onerror = () => { btn.classList.remove("speaking"); setBtnLabel(btn, false); if (activeBtn === btn) activeBtn = null; };
    }
    synth.speak(u);
  }
  function setBtnLabel(btn, speaking) {
    const lbl = btn.querySelector(".lbl"); const ic = btn.querySelector(".ic");
    if (lbl) lbl.textContent = speaking ? "Stop" : (btn.dataset.label || "Listen");
    if (ic) ic.innerHTML = speaking ? ICON.stop : (btn.dataset.icon === "sound" ? ICON.sound : ICON.play);
  }

  function setupMic(mic, input, onAsk) {
    if (!mic) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { mic.title = "Voice input needs Chrome or Edge"; mic.addEventListener("click", () => input.focus()); return; }
    const rec = new SR(); rec.lang = "en-US"; rec.interimResults = false; rec.maxAlternatives = 1;
    let listening = false;
    mic.addEventListener("click", () => { if (listening) { rec.stop(); return; } try { synth && synth.cancel(); rec.start(); } catch (e) {} });
    rec.onstart = () => { listening = true; mic.classList.add("listening"); input.placeholder = "Listening..."; };
    rec.onend = () => { listening = false; mic.classList.remove("listening"); input.placeholder = "Ask a question..."; };
    rec.onerror = () => { listening = false; mic.classList.remove("listening"); input.placeholder = "Ask a question..."; };
    rec.onresult = (ev) => { const said = ev.results[0][0].transcript; input.value = said; onAsk(said); };
  }

  /* =====================================================
     Reusable chat scaffold + wiring
     ===================================================== */
  function askScaffold(opts) {
    return `
      <div class="ask ask-dark"${opts.id ? ` id="${opts.id}"` : ""}>
        <div class="ask-head">
          <div class="av">${opts.av}</div>
          <div class="meta"><strong>${esc(opts.name)}</strong><small>${esc(opts.role)}</small></div>
        </div>
        <div class="ask-log" aria-live="polite"></div>
        <div class="ask-suggest">${opts.chips}</div>
        <form class="ask-input ask-form" autocomplete="off">
          <button type="button" class="icon-btn mic mic-btn" title="Ask out loud" aria-label="Ask out loud">${ICON.mic}</button>
          <input class="ask-text" type="text" placeholder="Ask a question..." aria-label="Type your question">
          <button type="submit" class="icon-btn send" title="Send" aria-label="Send">${ICON.send}</button>
        </form>
        <p class="ask-foot">${esc(opts.foot)}</p>
      </div>`;
  }
  const chipsHtml = (list) => list.map(s => `<button class="chip" data-q="${esc(s)}">${esc(s)}</button>`).join("");

  function wireChat(container, cfg) {
    const log = container.querySelector(".ask-log");
    const form = container.querySelector(".ask-form");
    const input = container.querySelector(".ask-text");
    const mic = container.querySelector(".mic-btn");
    const suggestWrap = container.querySelector(".ask-suggest");

    function addMsg(text, who, speakIt) {
      const m = el(`<div class="msg ${who}"></div>`);
      m.appendChild(document.createTextNode(text));
      if (who === "bot") {
        const again = el(`<span class="speak-again">${ICON.sound} Hear it again</span>`);
        again.addEventListener("click", () => speak(text, null, cfg.voice));
        m.appendChild(document.createElement("br"));
        m.appendChild(again);
      }
      log.appendChild(m); log.scrollTop = log.scrollHeight;
      if (who === "bot" && speakIt) speak(text, null, cfg.voice);
      return m;
    }
    function typing() {
      const t = el(`<div class="msg bot"><span class="typing"><i></i><i></i><i></i></span></div>`);
      log.appendChild(t); log.scrollTop = log.scrollHeight; return t;
    }
    function answerFor(q) {
      const s = " " + q.toLowerCase().replace(/[^a-z0-9'\s]/g, " ") + " ";
      let best = null, score = 0;
      cfg.qa.forEach(item => {
        let sc = 0;
        item.keys.forEach(k => { if (s.indexOf(k.toLowerCase()) !== -1) sc += k.length; });
        if (sc > score) { score = sc; best = item; }
      });
      return best ? best.a : cfg.fallback;
    }
    let greeted = false;
    function ensureGreeting() { if (greeted) return; greeted = true; addMsg(cfg.greeting, "bot", false); }
    function ask(q) {
      q = (q || "").trim(); if (!q) return;
      ensureGreeting();
      addMsg(q, "me", false); input.value = "";
      const t = typing(); const ans = answerFor(q);
      window.setTimeout(() => { t.remove(); addMsg(ans, "bot", true); }, 620);
    }
    form.addEventListener("submit", (e) => { e.preventDefault(); ask(input.value); });
    suggestWrap.addEventListener("click", (e) => { const c = e.target.closest(".chip"); if (c) ask(c.dataset.q); });
    input.addEventListener("focus", ensureGreeting, { once: true });
    setupMic(mic, input, ask);
    return { ensureGreeting, ask };
  }

  /* =====================================================
     Render the page
     ===================================================== */
  const learnCards = f.learn.map(c => `
    <article class="learn-card reveal">
      <div class="kind">${c.icon}<span>${esc(c.kind)}</span></div>
      <h3>${esc(c.title)}</h3>
      ${c.original ? `<div class="original">${esc(c.original)}</div>` : ""}
      <p>${esc(c.body)}</p>
      <button class="listen-btn" data-label="Listen" data-icon="play" data-say="${esc((c.original ? c.original + ". " : "") + c.body)}">
        <span class="ic">${ICON.play}</span><span class="lbl">Listen</span>
      </button>
    </article>`).join("");

  const people = f.people || [];
  const peopleCards = people.map((p, i) => `
    <article class="person reveal" data-idx="${i}" role="button" tabindex="0" aria-label="${esc(p.name)}">
      ${p.img ? `<span class="mono has-img"><img src="${esc(p.img)}" alt="" loading="lazy"></span>` : `<span class="mono">${esc(p.mono)}</span>`}
      <h3>${esc(p.name)}</h3>
      <span class="ptag">${esc(p.tag)}</span>
      <p>${esc(p.note)}</p>
      <span class="person-cta">${p.persona === "about" ? "Learn about them" : "Speak with them"} ${ICON.arrow}</span>
    </article>`).join("");

  root.innerHTML = `
    <section class="faith-hero hero-cosmos">
      ${f.video ? `<video class="faith-video" src="${esc(f.video)}" muted autoplay playsinline preload="auto" aria-hidden="true"></video><span class="cine-shade" aria-hidden="true"></span>` : ""}
      <div class="faith-aura" aria-hidden="true">
        <span class="halo-lg"></span>
      </div>
      <div class="wrap" style="position:relative;z-index:3">
        <a class="back-link" href="index.html">${ICON.back} All faiths</a>
        <div class="faith-hero-grid">
          <div class="reveal">
            <div class="faith-emblem">${f.symbol}</div>
            <p class="eyebrow faith-kicker">${esc(f.hero.kicker)}</p>
            <h1>${esc(f.hero.title)}</h1>
            <p class="lead">${esc(f.hero.lead)}</p>
            <span class="approve-pill">${ICON.check} ${esc(f.approve)}</span>
            <div class="hero-actions">
              <a class="btn btn-gold btn-lg" href="#ask">Ask a question</a>
              <a class="btn btn-ghost" href="#people">Meet the people</a>
            </div>
          </div>
          <div class="reveal" style="transition-delay:.08s">
            ${askScaffold({
              id: "ask", av: f.symbol, name: f.guide.name, role: f.guide.role,
              chips: chipsHtml(f.suggest),
              foot: "A gentle demo voice. On a real page, you hear your community's own teachers."
            })}
          </div>
        </div>
      </div>
    </section>

    <section class="section faith-explore" id="explore">
      <span class="faith-watermark" aria-hidden="true">${f.symbol}</span>
      <div class="wrap" style="position:relative;z-index:1">
        <div class="sec-head center">
          <p class="eyebrow center-line">Scan, listen, interact, learn</p>
          <h2>What you can explore</h2>
          <p class="lead">A glimpse of the page. Every card is heard in a real voice, and shaped together with ${esc(f.place)}.</p>
        </div>
        <div class="learn-grid">${learnCards}</div>
        <p class="voice-note" id="voiceNote"></p>
      </div>
    </section>

    <section class="section faith-people" id="people">
      <div class="wrap">
        <div class="sec-head center">
          <p class="eyebrow center-line">Voices of this faith</p>
          <h2>People you can speak with</h2>
          <p class="lead">Tap anyone to read their story, hear their voice, and ask them a question.${f.peopleNote ? " " + esc(f.peopleNote) : ""}</p>
        </div>
        <div class="people-grid">${peopleCards}</div>
      </div>
    </section>

    <section class="section faith-close">
      <span class="faith-watermark soft" aria-hidden="true">${f.symbol}</span>
      <div class="wrap center" style="position:relative;z-index:1">
        <div class="close-emblem">${f.symbol}</div>
        <p class="eyebrow center-line">A living example</p>
        <h2>Made with ${esc(f.place)}, in your own voice</h2>
        <p class="lead">The stories, the prayers, the voices, and the answers here are all shaped together with your teachers. This page is a demonstration of what we can build together.</p>
        <div class="close-qr">
          <div class="scan-card" style="max-width:280px">
            <div class="scan-inner">
              <div class="scan-head"><span class="dot"></span><span>This page, as a QR code</span></div>
              <div class="qr-box"><div data-qr="" data-size="140"></div></div>
              <p class="qr-caption">Scan to open this ${esc(f.name)} example</p>
            </div>
          </div>
        </div>
        <a class="btn btn-ghost" href="index.html">${ICON.back} Explore the other faiths</a>
      </div>
    </section>
  `;

  if (window.SaylavyQR) window.SaylavyQR();
  if (window.SaylavyCine) window.SaylavyCine(root.querySelector(".faith-video"));

  /* ---------- learn card listen buttons ---------- */
  root.querySelectorAll(".listen-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("speaking")) { synth && synth.cancel(); btn.classList.remove("speaking"); setBtnLabel(btn, false); activeBtn = null; return; }
      speak(btn.dataset.say, btn, { g: "f", rate: 0.95 });
    });
  });
  if (!synth) { const n = document.getElementById("voiceNote"); if (n) n.textContent = "Tip: open in Chrome, Safari, or Edge to hear the voices."; }

  /* ---------- guide chat ---------- */
  const guideChat = wireChat(document.getElementById("ask"), {
    qa: f.qa, fallback: f.fallback, greeting: f.greeting, voice: { g: "f", rate: 0.95 }
  });
  const io = new IntersectionObserver((ents) => {
    ents.forEach(en => { if (en.isIntersecting) { guideChat.ensureGreeting(); io.disconnect(); } });
  }, { threshold: 0.4 });
  io.observe(document.getElementById("ask"));

  /* =====================================================
     Person modal: biography + voice + chat
     ===================================================== */
  const modal = el(`
    <div class="person-modal" id="personModal" hidden>
      <div class="pm-backdrop" data-close></div>
      <div class="pm-card" role="dialog" aria-modal="true" aria-label="Person">
        <span class="pm-glow"></span>
        <button class="pm-close" data-close aria-label="Close">${ICON.close}</button>
        <div class="pm-body">
          <div class="pm-left">
            <span class="pm-mono"></span>
            <h2 class="pm-name"></h2>
            <span class="pm-tag"></span>
            <p class="pm-bio"></p>
            <blockquote class="pm-quote"></blockquote>
            <button class="listen-btn pm-listen" data-label="Listen to their story" data-icon="play">
              <span class="ic">${ICON.play}</span><span class="lbl">Listen to their story</span>
            </button>
          </div>
          <div class="pm-right"></div>
        </div>
      </div>
    </div>`);
  document.body.appendChild(modal);

  function closeModal() {
    synth && synth.cancel();
    modal.hidden = true; document.body.style.overflow = "";
    modal.querySelector(".pm-right").innerHTML = "";
  }
  modal.querySelectorAll("[data-close]").forEach(b => b.addEventListener("click", closeModal));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) closeModal(); });

  function openPerson(p, i) {
    synth && synth.cancel();
    const about = p.persona === "about";
    const voice = Object.assign({ idx: i }, p.voice || {});
    const media = modal.querySelector(".pm-mono");
    media.classList.toggle("has-img", !!(p.video || p.img));
    if (p.video) media.innerHTML = `<video src="${esc(p.video)}" muted autoplay playsinline loop></video>`;
    else if (p.img) media.innerHTML = `<img src="${esc(p.img)}" alt="${esc(p.name)}">`;
    else media.textContent = p.mono;
    modal.querySelector(".pm-name").textContent = p.name;
    modal.querySelector(".pm-tag").textContent = p.tag;
    modal.querySelector(".pm-bio").textContent = p.bio;
    modal.querySelector(".pm-quote").textContent = p.quote;

    const listen = modal.querySelector(".pm-listen");
    listen.dataset.say = p.bio + " " + p.quote;
    setBtnLabel(listen, false);
    listen.onclick = () => {
      if (listen.classList.contains("speaking")) { synth && synth.cancel(); listen.classList.remove("speaking"); setBtnLabel(listen, false); activeBtn = null; return; }
      speak(listen.dataset.say, listen, voice);
    };

    const right = modal.querySelector(".pm-right");
    right.innerHTML = askScaffold({
      av: `<span>${esc(p.mono)}</span>`,
      name: p.name,
      role: about ? "Ask about their life" : "In their own voice",
      chips: chipsHtml(p.suggest),
      foot: about ? "A gentle demo voice, sharing what is known of their life."
                  : "A gentle demo voice, in the spirit of their own words."
    });
    const chat = wireChat(right.querySelector(".ask"), {
      qa: p.qa, fallback: p.fallback, greeting: p.greeting, voice: voice
    });

    modal.hidden = false; document.body.style.overflow = "hidden";
    chat.ensureGreeting();
  }

  root.querySelectorAll(".person").forEach(card => {
    const open = () => openPerson(people[+card.dataset.idx], +card.dataset.idx);
    card.addEventListener("click", open);
    card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  });

  if (window.SaylavyReveal) window.SaylavyReveal();
})();
