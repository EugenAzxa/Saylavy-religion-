/* =========================================================
   Saylavy - Faith page renderer + Ask & Listen engine
   Renders a faith page from FAITHS[data-faith] and powers the
   "speak with them" feature using the browser Speech APIs.
   Pure front end. No backend, no keys. Works on GitHub Pages.
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

  /* ---------- tiny helpers ---------- */
  const el = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const esc = (s) => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const ICON = {
    play: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4l12 8-12 8z"/></svg>`,
    stop: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>`,
    sound: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 8a5 5 0 0 1 0 8"/></svg>`,
    mic: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M6 11a6 6 0 0 0 12 0"/><path d="M12 17v4"/></svg>`,
    send: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l16-8-6 16-3-6z"/></svg>`,
    back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 6l-6 6 6 6"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`,
    qr: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3M21 14v.01M17 21h4M21 17v4M14 21v.01"/></svg>`
  };

  /* =====================================================
     Speech: one shared engine for cards and the chat
     ===================================================== */
  const synth = window.speechSynthesis || null;
  let voices = [];
  function loadVoices() { if (synth) voices = synth.getVoices(); }
  if (synth) { loadVoices(); synth.onvoiceschanged = loadVoices; }

  function pickVoice() {
    if (!voices.length) return null;
    // Prefer a warm English voice; the demo voice stands in for a real recorded teacher.
    const en = voices.filter(v => /en(-|_)/i.test(v.lang) || /^en$/i.test(v.lang));
    const pref = en.find(v => /Samantha|Karen|Moira|Serena|Google US English|Female/i.test(v.name));
    return pref || en[0] || voices[0];
  }

  let activeBtn = null;
  function speak(text, btn) {
    if (!synth) return;
    synth.cancel();
    if (activeBtn) { activeBtn.classList.remove("speaking"); setBtnLabel(activeBtn, false); }
    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice(); if (v) u.voice = v;
    u.rate = 0.94; u.pitch = 1.0;
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

  /* =====================================================
     Render: hero + learn cards + ask widget
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

  const chips = f.suggest.map(s => `<button class="chip" data-q="${esc(s)}">${esc(s)}</button>`).join("");

  const peopleCards = (f.people || []).map(p => `
    <article class="person reveal">
      <span class="mono">${esc(p.mono)}</span>
      <h3>${esc(p.name)}</h3>
      <span class="ptag">${esc(p.tag)}</span>
      <p>${esc(p.note)}</p>
    </article>`).join("");

  root.innerHTML = `
    <section class="faith-hero hero-cosmos">
      <canvas class="motes" data-accent="${f.accent}" data-shape="${f.shape || "mote"}" aria-hidden="true"></canvas>
      <span class="aurora a1"></span><span class="aurora a2"></span><span class="aurora a3"></span>
      <span class="grain"></span>
      <div class="faith-aura" aria-hidden="true">
        <span class="halo-lg"></span>
        <span class="spin-wrap"><span class="rr"></span><span class="rr2"></span><span class="rr3"></span><span class="big-sym">${f.symbol}</span></span>
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
              <a class="btn btn-ghost" href="#explore">See the lessons</a>
            </div>
          </div>
          <div class="reveal" style="transition-delay:.08s">
            <div class="ask" id="ask">
              <div class="ask-head">
                <div class="av">${f.symbol}</div>
                <div class="meta"><strong>${esc(f.guide.name)}</strong><small>${esc(f.guide.role)}</small></div>
              </div>
              <div class="ask-log" id="askLog" aria-live="polite"></div>
              <div class="ask-suggest" id="askSuggest">${chips}</div>
              <form class="ask-input" id="askForm" autocomplete="off">
                <button type="button" class="icon-btn mic" id="micBtn" title="Ask out loud" aria-label="Ask out loud">${ICON.mic}</button>
                <input id="askText" type="text" placeholder="Ask a question..." aria-label="Type your question">
                <button type="submit" class="icon-btn send" title="Send" aria-label="Send">${ICON.send}</button>
              </form>
              <p class="ask-foot">A gentle demo voice. On a real page, you hear your community's own teachers.</p>
            </div>
          </div>
        </div>
      </div>
      <span class="fade-b"></span>
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

    <section class="section faith-people">
      <div class="wrap">
        <div class="sec-head center">
          <p class="eyebrow center-line">Voices of this faith</p>
          <h2>People who carried it</h2>
          ${f.peopleNote ? `<p class="people-note">${esc(f.peopleNote)}</p>` : ""}
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
  if (window.SaylavyBG) window.SaylavyBG();

  /* ---------- wire listen buttons ---------- */
  root.querySelectorAll(".listen-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("speaking")) { synth && synth.cancel(); btn.classList.remove("speaking"); setBtnLabel(btn, false); activeBtn = null; return; }
      speak(btn.dataset.say, btn);
    });
  });

  if (!synth) {
    const n = document.getElementById("voiceNote");
    if (n) n.textContent = "Tip: open in Chrome, Safari, or Edge to hear the voices.";
  }

  /* =====================================================
     The chat: ask, match, answer, speak
     ===================================================== */
  const log = document.getElementById("askLog");
  const form = document.getElementById("askForm");
  const input = document.getElementById("askText");
  const micBtn = document.getElementById("micBtn");
  const suggestWrap = document.getElementById("askSuggest");

  function addMsg(text, who, speakIt) {
    const m = el(`<div class="msg ${who}"></div>`);
    m.appendChild(document.createTextNode(text));
    if (who === "bot") {
      const again = el(`<span class="speak-again">${ICON.sound} Hear it again</span>`);
      again.addEventListener("click", () => speak(text, null));
      m.appendChild(document.createElement("br"));
      m.appendChild(again);
    }
    log.appendChild(m);
    log.scrollTop = log.scrollHeight;
    if (who === "bot" && speakIt) speak(text, null);
    return m;
  }

  function typing() {
    const t = el(`<div class="msg bot"><span class="typing"><i></i><i></i><i></i></span></div>`);
    log.appendChild(t); log.scrollTop = log.scrollHeight; return t;
  }

  function answerFor(q) {
    const s = " " + q.toLowerCase().replace(/[^a-z0-9'\s]/g, " ") + " ";
    let best = null, bestScore = 0;
    f.qa.forEach(item => {
      let score = 0;
      item.keys.forEach(k => { if (s.indexOf(k.toLowerCase()) !== -1) score += k.length; });
      if (score > bestScore) { bestScore = score; best = item; }
    });
    return best ? best.a : f.fallback;
  }

  let greeted = false;
  function ensureGreeting() {
    if (greeted) return; greeted = true;
    addMsg(f.greeting, "bot", false);
  }

  function ask(q) {
    q = (q || "").trim(); if (!q) return;
    ensureGreeting();
    addMsg(q, "me", false);
    input.value = "";
    const t = typing();
    const ans = answerFor(q);
    window.setTimeout(() => {
      t.remove();
      addMsg(ans, "bot", true);
    }, 650);
  }

  form.addEventListener("submit", (e) => { e.preventDefault(); ask(input.value); });
  suggestWrap.addEventListener("click", (e) => {
    const c = e.target.closest(".chip"); if (!c) return;
    ask(c.dataset.q);
  });
  // Greet as soon as the sample scrolls into view or is focused.
  input.addEventListener("focus", ensureGreeting, { once: true });
  const io = new IntersectionObserver((ents) => {
    ents.forEach(en => { if (en.isIntersecting) { ensureGreeting(); io.disconnect(); } });
  }, { threshold: 0.4 });
  io.observe(document.getElementById("ask"));

  /* ---------- microphone: speak your question ---------- */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SR) {
    const rec = new SR();
    rec.lang = "en-US"; rec.interimResults = false; rec.maxAlternatives = 1;
    let listening = false;
    micBtn.addEventListener("click", () => {
      if (listening) { rec.stop(); return; }
      try { synth && synth.cancel(); rec.start(); } catch (e) {}
    });
    rec.onstart = () => { listening = true; micBtn.classList.add("listening"); input.placeholder = "Listening..."; };
    rec.onend = () => { listening = false; micBtn.classList.remove("listening"); input.placeholder = "Ask a question..."; };
    rec.onerror = () => { listening = false; micBtn.classList.remove("listening"); input.placeholder = "Ask a question..."; };
    rec.onresult = (ev) => {
      const said = ev.results[0][0].transcript;
      input.value = said; ask(said);
    };
  } else {
    micBtn.title = "Voice input needs Chrome or Edge";
    micBtn.addEventListener("click", () => { input.focus(); });
  }

  /* ---------- reveal on scroll (shared behaviour) ---------- */
  if (window.SaylavyReveal) window.SaylavyReveal();
})();
