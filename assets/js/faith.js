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

  const FEM = /Samantha|Karen|Moira|Serena|Victoria|Tessa|Fiona|Susan|Zira|Allison|Ava|Aria|Jenny|Michelle|Emma|Libby|Sonia|Natasha|Clara|female|woman/i;
  const MAL = /Daniel|Alex|Fred|Oliver|Thomas|Arthur|George|David|Aaron|Rishi|Guy|Christopher|Eric|Andrew|Brian|Ryan|William|Liam|male|\bman\b/i;

  // prefer neural/premium voices over the robotic defaults
  function voiceRank(v) {
    const n = v.name || "";
    if (/Natural|Neural/i.test(n)) return 0;   // Edge neural voices
    if (/Online/i.test(n)) return 1;
    if (/Google/i.test(n)) return 2;           // Chrome network voices
    if (/Premium|Enhanced/i.test(n)) return 3; // upgraded macOS voices
    if (FEM.test(n) || MAL.test(n)) return 4;  // known decent locals
    return 5;
  }
  function pickVoice(pref) {
    if (!voices.length) return null;
    let pool = voices.filter(v => /^en([-_]|$)/i.test(v.lang));
    if (!pool.length) pool = voices.slice();
    if (pref && pref.g === "f") { const s = pool.filter(v => FEM.test(v.name)); if (s.length) pool = s; }
    else if (pref && pref.g === "m") { const s = pool.filter(v => MAL.test(v.name)); if (s.length) pool = s; }
    pool = pool.slice().sort((a, b) => voiceRank(a) - voiceRank(b));
    const best = voiceRank(pool[0]);
    const top = pool.filter(v => voiceRank(v) <= best + 1);
    const idx = pref && pref.idx != null ? pref.idx % top.length : 0;
    return top[idx] || pool[0];
  }

  let activeBtn = null, activeTalk = null, talkTimer = null, groupToken = null;
  function clearTalk() {
    if (talkTimer) { window.clearTimeout(talkTimer); talkTimer = null; }
    if (activeTalk) {
      activeTalk.classList.remove("talking", "word");
      const host = activeTalk.closest(".pm-card");
      if (host) host.classList.remove("talking-host");
      activeTalk = null;
    }
  }
  function stopSpeech() {
    if (window.SaylavyVoice) window.SaylavyVoice.stop();
    if (synth) synth.cancel();
    if (activeBtn) { activeBtn.classList.remove("speaking"); setBtnLabel(activeBtn, false); activeBtn = null; }
    clearTalk();
  }
  // speak sentence-by-sentence (steadier, less robotic cadence); talkEl gets
  // a living "speaking" presence, pulsing with each spoken word
  function speak(text, btn, pref, talkEl) {
    stopSpeech();
    // real voice first (recorded clip or voice API), browser voice as fallback
    if (pref && pref.lang) {
      // a native-language line: use the browser voice for that language
      browserSpeak(text, btn, pref, talkEl);
      return;
    }
    if (window.SaylavyVoice && window.SaylavyVoice.enabled()) {
      const startUI = () => {
        if (btn) { activeBtn = btn; btn.classList.add("speaking"); setBtnLabel(btn, true); }
        if (talkEl) {
          activeTalk = talkEl; talkEl.classList.add("talking");
          const h = talkEl.closest(".pm-card"); if (h) h.classList.add("talking-host");
        }
      };
      const endUI = () => {
        if (btn && activeBtn === btn) { btn.classList.remove("speaking"); setBtnLabel(btn, false); activeBtn = null; }
        clearTalk();
      };
      const handled = window.SaylavyVoice.say(text, pref, (pref && pref.name) || null, {
        onstart: startUI,
        onword: () => {
          if (!activeTalk) return;
          activeTalk.classList.add("word");
          if (talkTimer) window.clearTimeout(talkTimer);
          talkTimer = window.setTimeout(() => { if (activeTalk) activeTalk.classList.remove("word"); }, 150);
        },
        onend: endUI,
        onfail: () => { endUI(); browserSpeak(text, btn, pref, talkEl); }
      });
      if (handled) { startUI(); return; }
    }
    browserSpeak(text, btn, pref, talkEl);
  }
  function browserSpeak(text, btn, pref, talkEl) {
    if (!synth) return;
    let v = pickVoice(pref);
    if (pref && pref.lang) {
      const nat = (voices || []).filter(x => x.lang && x.lang.toLowerCase().indexOf(pref.lang) === 0);
      if (nat.length) v = nat[0];
    }
    const baseRate = pref && pref.rate ? pref.rate : 0.94;
    const pitch = pref && pref.pitch ? pref.pitch : 1.0;
    const parts = String(text).match(/[^.!?]+[.!?]*\s*/g) || [String(text)];
    const my = {}; groupToken = my;
    if (btn) { activeBtn = btn; btn.classList.add("speaking"); setBtnLabel(btn, true); }
    if (talkEl) {
      activeTalk = talkEl; talkEl.classList.add("talking");
      const host = talkEl.closest(".pm-card");
      if (host) host.classList.add("talking-host");
    }
    let done = 0;
    parts.forEach((part, i) => {
      const t = part.trim();
      if (!t) { done++; return; }
      const u = new SpeechSynthesisUtterance(t);
      if (v) { u.voice = v; if (v.lang) u.lang = v.lang; }
      u.rate = Math.max(0.7, baseRate + (i % 2 ? 0.02 : -0.02));
      u.pitch = pitch;
      u.onboundary = () => {
        if (!activeTalk || groupToken !== my) return;
        activeTalk.classList.add("word");
        if (talkTimer) window.clearTimeout(talkTimer);
        talkTimer = window.setTimeout(() => { if (activeTalk) activeTalk.classList.remove("word"); }, 150);
      };
      u.onend = u.onerror = () => {
        done++;
        if (done >= parts.length && groupToken === my) {
          if (btn && activeBtn === btn) { btn.classList.remove("speaking"); setBtnLabel(btn, false); activeBtn = null; }
          clearTalk();
        }
      };
      synth.speak(u);
    });
  }
  function setBtnLabel(btn, speaking) {
    const lbl = btn.querySelector(".lbl"); const ic = btn.querySelector(".ic");
    if (lbl) lbl.textContent = speaking ? "Stop" : (btn.dataset.label || "Listen");
    if (ic) ic.innerHTML = speaking ? ICON.stop : (btn.dataset.icon === "sound" ? ICON.sound : ICON.play);
  }

  function setupMic(mic, input, onAsk) {
    if (!mic) return null;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { mic.title = "Voice input needs Chrome or Edge"; mic.addEventListener("click", () => input.focus()); return null; }
    const rec = new SR(); rec.lang = "en-US"; rec.interimResults = false; rec.maxAlternatives = 1;
    let listening = false;
    mic.addEventListener("click", () => { if (listening) { rec.stop(); return; } try { stopSpeech(); rec.start(); } catch (e) {} });
    rec.onstart = () => { listening = true; mic.classList.add("listening"); input.placeholder = "Listening..."; };
    rec.onend = () => { listening = false; mic.classList.remove("listening"); input.placeholder = "Ask a question..."; };
    rec.onerror = () => { listening = false; mic.classList.remove("listening"); input.placeholder = "Ask a question..."; };
    rec.onresult = (ev) => { const said = ev.results[0][0].transcript; input.value = said; onAsk(said); };
    return { abort: () => { try { rec.abort(); } catch (e) {} listening = false; mic.classList.remove("listening"); } };
  }

  /* =====================================================
     Reusable chat scaffold + wiring
     ===================================================== */
  function askScaffold(opts) {
    return `
      <div class="ask ask-dark${opts.portrait ? " has-portrait" : ""}"${opts.id ? ` id="${opts.id}"` : ""}>
        ${opts.portrait ? `<div class="ask-portrait"><img src="${opts.portrait}" alt="${esc(opts.name)}" loading="lazy" onerror="this.parentNode.remove()"><span class="ask-portrait-badge">${esc(opts.name)} <small>${esc(opts.role)}</small></span></div>` : ""}
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

  /* Keyword matching: both the question and the keys go through the same
     normalizer (quotes and hyphens dropped), then each key must land on a
     word boundary, allowing a short inflection so plurals still match. */
  const _keyRe = new Map();
  function normText(str) {
    return " " + String(str).toLowerCase()
      .replace(/[\u2018\u2019\u02bc]/g, "'")
      .replace(/'/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ").trim() + " ";
  }
  function keyScore(hay, key) {
    const kn = normText(key).trim();
    if (!kn) return 0;
    let re = _keyRe.get(kn);
    if (!re) {
      const esc2 = kn.split("").map(function (c) { return "\\^$*+?.()|[]{}".indexOf(c) >= 0 ? "\\" + c : c; }).join("");
      re = new RegExp("(?:^| )" + esc2 + "[a-z]{0,3}(?= |$)");
      _keyRe.set(kn, re);
    }
    return re.test(hay) ? kn.length : 0;
  }

  function wireChat(container, cfg) {
    const log = container.querySelector(".ask-log");
    const form = container.querySelector(".ask-form");
    const input = container.querySelector(".ask-text");
    const mic = container.querySelector(".mic-btn");
    const suggestWrap = container.querySelector(".ask-suggest");
    const talkEl = cfg.talk || container.querySelector(".ask-portrait") || container.querySelector(".ask-head .av");

    function addMsg(text, who, speakIt) {
      const m = el(`<div class="msg ${who}"></div>`);
      m.appendChild(document.createTextNode(text));
      if (who === "bot") {
        const again = el(`<span class="speak-again">${ICON.sound} Hear it again</span>`);
        again.addEventListener("click", () => speak(text, null, cfg.voice, talkEl));
        m.appendChild(document.createElement("br"));
        m.appendChild(again);
      }
      log.appendChild(m); log.scrollTop = log.scrollHeight;
      if (who === "bot" && speakIt) speak(text, null, cfg.voice, talkEl);
      return m;
    }
    function typing() {
      const t = el(`<div class="msg bot"><span class="typing"><i></i><i></i><i></i></span></div>`);
      log.appendChild(t); log.scrollTop = log.scrollHeight; return t;
    }
    function answerFor(q) {
      const hay = normText(q);
      let best = null, score = 0;
      cfg.qa.forEach(item => {
        let sc = 0;
        item.keys.forEach(k => { sc += keyScore(hay, k); });
        if (sc > score) { score = sc; best = item; }
      });
      return best ? best.a : cfg.fallback;
    }
    let greeted = false, pending = null, dead = false;
    function ensureGreeting() { if (greeted || dead) return; greeted = true; addMsg(cfg.greeting, "bot", false); }
    function ask(q) {
      q = (q || "").trim(); if (!q) return;
      ensureGreeting();
      addMsg(q, "me", false); input.value = "";
      const t = typing(); const ans = answerFor(q);
      if (pending) window.clearTimeout(pending);
      pending = window.setTimeout(() => { pending = null; if (dead) return; t.remove(); addMsg(ans, "bot", true); }, 620);
    }
    form.addEventListener("submit", (e) => { e.preventDefault(); ask(input.value); });
    suggestWrap.addEventListener("click", (e) => { const c = e.target.closest(".chip"); if (c) ask(c.dataset.q); });
    input.addEventListener("focus", ensureGreeting, { once: true });
    const micCtl = setupMic(mic, input, ask);
    function cancelPending() { if (pending) { window.clearTimeout(pending); pending = null; } }
    function destroy() {
      dead = true;
      if (pending) { window.clearTimeout(pending); pending = null; }
      if (micCtl && micCtl.abort) micCtl.abort();
    }
    return { ensureGreeting, ask, destroy, cancelPending };
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

  const learn = (window.FAITH_LEARN || {})[key] || null;
  // BBC disables embedding, so cards open the video on YouTube in a new tab.
  const vidCards = learn ? learn.videos.map(v => `
    <a class="yt-lite" target="_blank" rel="noopener"
       href="${v.id ? `https://www.youtube.com/watch?v=${v.id}` : `https://www.youtube.com/playlist?list=${v.list}`}"
       aria-label="Watch on YouTube: ${esc(v.title)}">
      ${v.id ? `<img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="" loading="lazy">` : ""}
      <span class="yt-play"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5l11 7-11 7z"/></svg></span>
      <span class="yt-title">${esc(v.title)}</span>
    </a>`).join("") : "";

  // Personalised demo: muslim.html?for=IPC%20Jame%20Masjid greets that community
  const _q = new URLSearchParams(location.search);
  const forWhom = (_q.get("for") || "").replace(/[<>]/g, "").trim().slice(0, 80);
  if (forWhom) document.title = "Saylavy for " + forWhom;

  const lang = (window.FAITH_LANG || {})[key] || null;
  const phraseCards = lang ? lang.phrases.map(ph => `
    <div class="pcard reveal">
      <p class="pscript" lang="${lang.langCode}" dir="${lang.dir}">${esc(ph.script)}</p>
      <p class="ptranslit">${esc(ph.translit)}</p>
      <p class="pmeaning">${esc(ph.meaning)}</p>
      <button class="listen-btn pcard-listen" data-label="Say it" data-icon="play"
              data-say="${esc(ph.translit)}" data-native="${esc(ph.script)}" data-lang="${esc(lang.langCode)}">
        <span class="ic">${ICON.play}</span><span class="lbl">Say it</span>
      </button>
    </div>`).join("") : "";

  const MOSQUES = { blue: "mosque-blue", zayed: "mosque-zayed", pink: "mosque-pink", badshahi: "mosque-badshahi" };
  const _scene = MOSQUES[_q.get("scene")] || "mosque-zayed";
  const SCENE = { muslim: "assets/img/scenes/" + _scene + ".jpg" };
  const pray = (window.FAITH_PRAY || {})[key] || null;
  const prayerTimes = (key === "muslim" && window.SaylavyPrayer) ? window.SaylavyPrayer : null;

  const stepCards = pray ? pray.steps.map((st, i) => `
    <li class="pstep reveal">
      <span class="pnum">${i + 1}</span>
      <div>
        <h3>${esc(st.n)} <small>${esc(st.en)}</small></h3>
        <p>${esc(st.text)}</p>
        ${st.say ? `<p class="psay"><span lang="${key === "muslim" ? "ar" : key === "jewish" ? "he" : key === "sikh" ? "pa" : key === "hindu" ? "hi" : "en"}" dir="${(key === "muslim" || key === "jewish") ? "rtl" : "ltr"}">${esc(st.say)}</span>${st.translit ? `<em>${esc(st.translit)}</em>` : ""}</p>` : ""}
      </div>
    </li>`).join("") : "";

  const TAGS = {
    protestant: "Bible, verses, the gospel", catholic: "Prayers, saints, sacraments",
    orthodox: "Icons, saints, the liturgy", muslim: "Qur'an, Arabic, the Pillars",
    hindu: "Stories, shlokas, festivals", sikh: "Gurbani, the Gurus, seva",
    jewish: "Torah, Hebrew, the holidays", buddhist: "The Buddha, mindfulness"
  };
  const firstQ = (f.people && f.people[0] && f.people[0].suggest && f.people[0].suggest[0]) || "What is this about?";

  const icons = (window.FAITH_ICONS || {})[key] || [];
  const iconCards = icons.map((ic, i) => `
    <figure class="icard reveal" data-i="${i}">
      <div class="icard-img"><img src="${esc(ic.img)}" alt="${esc(ic.name)}" loading="lazy"></div>
      <figcaption>
        <h3>${esc(ic.title)}</h3>
        <p class="icard-name">${esc(ic.name)}</p>
        <p>${esc(ic.text)}</p>
        <button class="listen-btn icard-listen" data-label="Listen" data-icon="play" data-say="${esc(ic.title + ". " + ic.text)}">
          <span class="ic">${ICON.play}</span><span class="lbl">Listen</span>
        </button>
      </figcaption>
    </figure>`).join("");

  const people = f.people || [];
  const peopleCards = people.map((p, i) => `
    <article class="person reveal" data-idx="${i}" role="button" tabindex="0" aria-label="${esc(p.name)}">
      ${p.img ? `<span class="mono has-img"><img src="${esc(p.img)}" alt="" loading="lazy"></span>` : `<span class="mono">${esc(p.mono)}</span>`}
      <h3>${esc(p.name)}</h3>
      <span class="ptag">${esc(p.tag)}</span>
      <p>${esc(p.note)}</p>
      <span class="person-cta">${p.persona === "about" ? "Learn about them" : "Speak with them"} ${ICON.arrow}</span>
    </article>`).join("");

  // compact figure bubble for the interactive hub around Sofia
  const figureBubble = (i) => {
    const p = people[i];
    if (!p) return "";
    const face = p.img
      ? `<img src="${esc(p.img)}" alt="" loading="lazy">`
      : `<span class="av-figure-mono">${esc(p.mono)}</span>`;
    return `<button class="av-figure" data-idx="${i}" aria-label="Speak with ${esc(p.name)}">
      <span class="av-figure-face">${face}</span>
      <span class="av-figure-name">${esc(p.name)}</span>
      <span class="av-figure-cta">${p.persona === "about" ? "Learn about them" : "Tap to speak"}</span>
    </button>`;
  };

  /* ---- "Step inside" : a real, walkable 3D tour matched to this faith ----
     Each is a public, embeddable tour (Matterport, or Kuula for the Golden
     Temple). The iframe only loads when the visitor presses Walk inside. */
  const SACRED_PLACES = {
    protestant: { type: "mp", id: "TxLiWPPzK8M", name: "City Church", where: "a Protestant sanctuary",
      blurb: "A modern Protestant sanctuary - light, plain and gathered around the pulpit. Step in and see how the whole room turns every seat toward the Word." },
    catholic: { type: "mp", id: "otsdVSahHpE", name: "Notre Dame Cathedral Basilica", where: "",
      blurb: "A soaring cathedral basilica of stone, stained glass and vaulted arches. Walk up the nave the way pilgrims do, then tilt your view up into the light." },
    orthodox: { type: "mp", id: "adTHiV3ooj9", name: "the Romanian Orthodox Cathedral", where: "",
      blurb: "Gold, icons and painted saints on every surface. In Orthodox tradition the whole church is a window to heaven - turn slowly and let your eyes travel the walls." },
    muslim: { type: "mp", id: "ZR9AoktT9Js", name: "the Et'hem Bey Mosque", where: "Tirana, Albania",
      blurb: "Begun in 1791, its dome and walls carry rare frescoes of trees, waterfalls and bridges. Step under the painted ceiling and turn to take it all in." },
    hindu: { type: "mp", id: "uFrLtE9GJk2", name: "the Maneshwar Temple", where: "",
      blurb: "A living Hindu temple, carved and coloured around its sacred centre. Walk toward the inner shrine the way worshippers approach for darshan." },
    sikh: { type: "kuula", id: "7YXjW", name: "the Golden Temple", where: "Harmandir Sahib, Amritsar",
      blurb: "Harmandir Sahib, the holiest gurdwara, sits on a lake of nectar and welcomes every person of every faith. Look around the golden sanctuary at the heart of the water." },
    jewish: { type: "mp", id: "rMB3isgojbo", name: "the Synagogue de Carpentras", where: "France, 1367",
      blurb: "The oldest working synagogue in France. Climb from the entry stair to the prayer hall and see centuries of Jewish life kept alive in one room." },
    buddhist: { type: "mp", id: "GtNs161eqvk", name: "the Shitthaung Temple", where: "Mrauk U, Myanmar",
      blurb: "The Temple of Victory, built in 1535, is a stone maze of passages lined with thousands of carved figures. Follow the corridors the way pilgrims have for centuries." }
  };
  /* The guide keeps one face and voice, but takes a name from each tradition. */
  const GUIDE_NAMES = {
    protestant: "Sofia", catholic: "Sofia", orthodox: "Sofia",
    muslim: "Noor", jewish: "Noa", hindu: "Diya", sikh: "Simran", buddhist: "Kiran"
  };
  const guideName = GUIDE_NAMES[key] || "Sofia";

  const place = SACRED_PLACES[key];
  const placeEmbed = !place ? "" : place.type === "kuula"
    ? `https://kuula.co/share/${place.id}?logo=-1&info=0&fs=1&vr=1&sd=1&thumbs=1&margin=0&inst=0&keys=0&autorotate=0.22`
    : `https://my.matterport.com/show/?m=${place.id}&play=1&qs=1&title=0&brand=0`;
  const placeFull = !place ? "" : place.type === "kuula"
    ? `https://kuula.co/share/${place.id}`
    : `https://my.matterport.com/show/?m=${place.id}`;
  const placeProvider = place && place.type === "kuula" ? "Kuula" : "Matterport";
  const visitSection = !place ? "" : `
    <section class="section visit-sec" id="visit">
      <div class="wrap">
        <div class="sec-head center">
          <p class="eyebrow center-line">Walk inside</p>
          <h2>Step inside ${esc(place.name)}</h2>
          <p class="lead">${esc(place.blurb)}</p>
        </div>
        <div class="visit-stage">
          <div class="visit-frame" data-embed="${esc(placeEmbed)}"></div>
          <button class="visit-play" type="button" aria-label="Walk inside ${esc(place.name)}">
            <span class="visit-play-ic" aria-hidden="true"><svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>
            <span class="visit-play-t">Walk inside</span>
            <span class="visit-play-s">${esc(place.name)}${place.where ? " - " + esc(place.where) : ""}</span>
          </button>
        </div>
        <div class="visit-cap">
          <p class="visit-name">${esc(place.name)}${place.where ? `<span> - ${esc(place.where)}</span>` : ""}</p>
          <a class="visit-full" href="${esc(placeFull)}" target="_blank" rel="noopener">Open full screen</a>
        </div>
        <p class="visit-note">Real 3D tour via ${placeProvider}. In your own edition we would feature your community's own space.</p>
      </div>
    </section>`;

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
            ${forWhom ? `<p class="prepared-for"><span>Prepared for</span> ${esc(forWhom)}</p>` : ""}
            ${f.script ? `<p class="native" lang="${f.script.lang}" dir="${f.script.dir}" title="${esc(f.script.meaning)}">${esc(f.script.text)}<span>${esc(f.script.translit ? f.script.translit + " - " + f.script.meaning : f.script.meaning)}</span></p>` : ""}
            <p class="eyebrow faith-kicker">${esc(f.hero.kicker)}</p>
            <h1>${esc(f.hero.title)}</h1>
            <p class="lead">${esc(f.hero.lead)}</p>
            <span class="approve-pill">${ICON.check} ${esc(f.approve)}</span>
            <div class="hero-actions">
              <a class="btn btn-gold btn-lg" href="#ask">Ask a question</a>
              ${lang ? `<a class="btn btn-ghost" href="#language">Learn the language</a>` : ""}
              <a class="btn btn-ghost" href="#people">Meet the people</a>
            </div>
          </div>
          <div class="reveal" style="transition-delay:.08s">
            ${askScaffold({
              id: "ask", av: f.symbol, name: f.guide.name, role: f.guide.role, portrait: f.guide.avatar,
              chips: chipsHtml(f.suggest),
              foot: "A gentle demo voice. On a real page, you hear your community's own teachers."
            })}
          </div>
        </div>
      </div>
    </section>

    <section class="section phone-sec faith-phone" id="mobile" aria-label="On a phone">
      <div class="wrap">
        <div class="phone-grid">
          <div class="phone-copy reveal">
            <p class="eyebrow">In every pocket</p>
            <h2>It lives on their phone</h2>
            <p class="lead">A child scans the QR code once and this whole ${esc(f.name)} page opens on their phone. No app to install, nothing to buy. It works the same on any phone or tablet.</p>
            <ul class="phone-list">
              <li><span class="pdot"></span> Scan the code, and it opens in a second</li>
              <li><span class="pdot"></span> Tap to listen in real voices</li>
              <li><span class="pdot"></span> Ask a question out loud and hear the answer</li>
              <li><span class="pdot"></span> Read in your own language, right to left too</li>
            </ul>
          </div>
          <div class="phone reveal" aria-hidden="true">
            <div class="phone-glow"></div>
            <div class="phone-frame">
              <span class="phone-notch"></span>
              <div class="phone-screen">
                <div class="ps-top"><span>9:41</span><span class="ps-batt"></span></div>
                <div class="ps-hero">
                  <span class="ps-emblem">${f.symbol}</span>
                  ${f.script ? `<p class="ps-native" lang="${f.script.lang}" dir="${f.script.dir}">${esc(f.script.text)}</p>` : ""}
                  <h3>${esc(f.name)}</h3>
                  <p class="ps-sub">${esc(TAGS[key] || "")}</p>
                </div>
                <div class="ps-chat">
                  <span class="ps-bubble ps-them">${esc(f.greeting.split(". ").slice(-1)[0])}</span>
                  <span class="ps-bubble ps-me">${esc(firstQ)}</span>
                  <span class="ps-bubble ps-them ps-typing"><i></i><i></i><i></i></span>
                </div>
                <div class="ps-bar"><span>Ask a question...</span><span class="ps-send"></span></div>
              </div>
            </div>
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

    ${learn && learn.videos && learn.videos.length ? `
    <section class="section faith-watch" id="watch">
      <div class="wrap">
        <div class="sec-head center">
          <p class="eyebrow center-line">Watch</p>
          <h2>Stories to watch together</h2>
          <p class="lead">Films chosen with your teachers, playing right on the page.</p>
        </div>
        <div class="watch-grid${learn.videos.length === 1 ? " one" : ""}">${vidCards}</div>
      </div>
    </section>` : ""}

    ${learn ? `
    <section class="section faith-time" id="time">
      <div class="wrap">
        <div class="sec-head center">
          <p class="eyebrow center-line">A journey in time</p>
          <h2>How the story unfolded</h2>
          <p class="lead">Tap through the story, listen to each step, then try the little quiz.</p>
        </div>
        <div class="tl">
          <button class="tl-nav tl-prev" aria-label="Previous step">${ICON.back}</button>
          <div class="tl-card">
            <span class="tl-era"></span>
            <h3 class="tl-title"></h3>
            <p class="tl-text"></p>
            <button class="listen-btn tl-listen" data-label="Listen" data-icon="play"><span class="ic">${ICON.play}</span><span class="lbl">Listen</span></button>
          </div>
          <button class="tl-nav tl-next" aria-label="Next step">${ICON.arrow}</button>
        </div>
        <div class="tl-dots" role="group" aria-label="Story steps"></div>
        <div class="qz">
          <p class="qz-prog"></p>
          <h3 class="qz-q"></h3>
          <div class="qz-opts"></div>
          <p class="qz-msg" aria-live="polite"></p>
        </div>
      </div>
    </section>` : ""}

    ${prayerTimes ? `
    <section class="section faith-times" id="times">
      <div class="wrap">
        <div class="sec-head center">
          <p class="eyebrow center-line">Salah</p>
          <h2>Prayer times today</h2>
          <p class="lead">Calculated for your community's city. Your masjid replaces these with its own published timetable before the page goes live.</p>
        </div>
        <div class="pt-wrap">
          <div class="pt-next liquid-glass">
            <p class="pt-label">Next prayer</p>
            <p class="pt-name" id="ptName">-</p>
            <p class="pt-count" id="ptCount">--:--:--</p>
            <p class="pt-city">
              <select id="ptCity" aria-label="City">
                <option value="toronto">Toronto</option>
                <option value="mississauga">Mississauga</option>
                <option value="brampton">Brampton</option>
                <option value="scarborough">Scarborough</option>
                <option value="markham">Markham</option>
              </select>
            </p>
          </div>
          <ul class="pt-list" id="ptList"></ul>
        </div>
      </div>
    </section>` : ""}

    ${pray ? `
    <section class="section faith-pray" id="pray">
      <div class="wrap">
        <div class="sec-head center">
          <p class="eyebrow center-line">Step by step</p>
          <h2>${esc(pray.title)}</h2>
          <p class="lead">${esc(pray.intro)}</p>
        </div>
        <div class="pray-before">
          <p class="pb-title">Before you begin</p>
          <ul>${pray.before.map(b => `<li>${esc(b)}</li>`).join("")}</ul>
        </div>
        <ol class="pray-steps">${stepCards}</ol>
        <p class="pray-note">${esc(pray.note)}</p>
      </div>
    </section>` : ""}

    ${lang ? `
    <section class="section faith-lang" id="language">
      <div class="wrap">
        <div class="sec-head center">
          <p class="eyebrow center-line">The living language</p>
          <h2>Words in ${esc(lang.lang)}</h2>
          <p class="lead">${esc(lang.note)}</p>
        </div>
        <div class="letters">
          <p class="letters-title">${esc(lang.letters.title)}</p>
          <div class="letters-row" lang="${esc(lang.langCode)}" dir="${esc(lang.letters.dir)}">
            ${lang.letters.items.map(x => `<span>${esc(x)}</span>`).join("")}
          </div>
          <p class="letters-cap">${esc(lang.letters.caption)}</p>
        </div>
        <div class="phrase-grid">${phraseCards}</div>
      </div>
    </section>` : ""}

    ${icons.length ? `
    <section class="section faith-icons" id="icons">
      <div class="wrap">
        <div class="sec-head center">
          <p class="eyebrow center-line">Sacred signs</p>
          <h2>Icons and treasures to know</h2>
          <p class="lead">The images and objects at the heart of this tradition, and what each one means.</p>
        </div>
        <div class="icon-grid">${iconCards}</div>
      </div>
    </section>` : ""}

    <!-- famous figures now live in the interactive hub around Sofia (id="teacher") -->

    <section class="section av-sec" id="teacher">
      <div class="wrap">
        <div class="sec-head center">
          <p class="eyebrow center-line">Meet your guide, and the voices of ${esc(f.name)}</p>
          <h2>Speak with ${esc(guideName)}</h2>
          <p class="lead">${esc(guideName)} is your friendly guide. With her are famous voices of ${esc(f.name)} - tap anyone to hear their story and ask them a question.</p>
        </div>
        <div class="av-hub">
          <div class="av-figures av-figures-left">${figureBubble(0)}${figureBubble(1)}</div>
          <div class="did-frame" id="did-agent-frame"><div class="av-loading">Waking your guide...</div></div>
          <div class="av-figures av-figures-right">${figureBubble(2)}${figureBubble(3)}</div>
        </div>
      </div>
    </section>

    ${visitSection}

    ${(window.SAYLAVY_GAME && window.SAYLAVY_GAME[key]) ? `
    <section class="section game-sec" id="game">
      <div class="wrap">
        <div class="sec-head center">
          <p class="eyebrow center-line">Play and learn</p>
          <h2>A little world to explore</h2>
          <p class="lead game-intro">Children walk around a friendly ${esc(f.name)} community and help their neighbours with kind, everyday tasks, learning a real value each time.</p>
        </div>
        <div id="game-host" class="game-host"></div>
      </div>
    </section>` : ""}

    ${SCENE[key] ? `
    <section class="section faith-scene" id="scene">
      <div class="wrap">
        <div class="sec-head center">
          <p class="eyebrow center-line">See it in place</p>
          <h2>One code on the wall</h2>
          <p class="lead">A printed QR code in ${esc(f.place)}. Anyone scans it, and this whole page opens on their phone.</p>
        </div>
        <div class="scene-grid">
          <div class="scene-why reveal">
            <h3>Why it helps your community</h3>
            <ul class="why-list">
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg><span>Children keep learning between classes, at home, any day of the week.</span></li>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg><span>Working parents can see and share what their children are learning.</span></li>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg><span>New and second-generation families connect in their own language.</span></li>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg><span>One code, on the wall, in the bulletin, or on a take-home card.</span></li>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg><span>Your teachers approve every word before it goes live.</span></li>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg><span>Nothing to install, works on any phone, and stays private.</span></li>
            </ul>
          </div>
          <div class="scene reveal">
            <div class="scene-photo" style="background-image:url('${SCENE[key]}')" role="img" aria-label="Inside ${esc(f.name)} place of worship"></div>
            <div class="poster">
              <p class="poster-kicker" lang="ar" dir="rtl">${esc((f.script && f.script.text) || "")}</p>
              <h3 class="poster-title">${esc(forWhom || f.name)}</h3>
              <div class="poster-qr"><div data-qr="" data-size="150"></div></div>
              <p class="poster-scan">Scan to learn</p>
              <p class="poster-by">Powered by <strong>Saylavy.com</strong></p>
            </div>
          </div>
        </div>
      </div>
    </section>` : ""}

    <section class="section faith-close">
      <span class="faith-watermark soft" aria-hidden="true">${f.symbol}</span>
      <div class="wrap center" style="position:relative;z-index:1">
        <div class="close-emblem">${f.symbol}</div>
        <p class="eyebrow center-line">A living example</p>
        <h2>Made with ${forWhom ? esc(forWhom) : esc(f.place)}, in your own voice</h2>
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

  /* ---------- Sofia (D-ID) is a self-contained embed; the script in each
     faith HTML shell injects her into #did-agent-frame. No init needed. ---------- */

  /* ---------- play & learn mini game (lazy mount) ---------- */
  const gameHost = document.getElementById("game-host");
  if (gameHost && window.SaylavyGame && window.SaylavyGame.has(key)) {
    const gio = new IntersectionObserver((ents) => {
      ents.forEach(en => { if (en.isIntersecting) { window.SaylavyGame.mount(gameHost, key); gio.disconnect(); } });
    }, { rootMargin: "250px" });
    gio.observe(gameHost);
  }

  /* ---------- learn card listen buttons ---------- */
  // say the phrase in its own language when the browser has that voice
  root.querySelectorAll(".pcard-listen").forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("speaking")) { stopSpeech(); return; }
      const native = btn.dataset.native, code = btn.dataset.lang;
      const has = (voices || []).some(v => v.lang && v.lang.toLowerCase().indexOf(code) === 0);
      speak(has ? native : btn.dataset.say, btn,
            { g: "f", rate: 0.85, lang: has ? code : null }, btn.closest(".pcard"));
    });
  });

  root.querySelectorAll(".icard-listen").forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("speaking")) { stopSpeech(); return; }
      speak(btn.dataset.say, btn, { g: "f", rate: 0.95 }, btn.closest(".icard"));
    });
  });

  root.querySelectorAll(".learn-card .listen-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("speaking")) { stopSpeech(); return; }
      speak(btn.dataset.say, btn, { g: "f", rate: 0.95 }, btn.closest(".learn-card"));
    });
  });
  if (!synth) { const n = document.getElementById("voiceNote"); if (n) n.textContent = "Tip: open in Chrome, Safari, or Edge to hear the voices."; }

  /* ---------- guide chat ---------- */
  const guideChat = wireChat(document.getElementById("ask"), {
    qa: f.qa, fallback: f.fallback, greeting: f.greeting,
    voice: { g: f.guide.g === "m" ? "m" : "f", rate: 0.95, name: f.guide.name }
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
            <span class="pm-live" aria-hidden="true"><i></i><i></i><i></i>Speaking</span>
            <p class="pm-bio"></p>
            <p class="pm-quote-label">In the spirit of their teaching</p>
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

  let modalChat = null, lastOpener = null;
  function closeModal() {
    stopSpeech();
    if (modalChat && modalChat.destroy) modalChat.destroy();
    modalChat = null;
    modal.hidden = true; document.body.style.overflow = "";
    modal.querySelector(".pm-right").innerHTML = "";
    const m = modal.querySelector(".pm-mono");
    if (m) { m.innerHTML = ""; m.classList.remove("has-img"); }
    modal.querySelector(".pm-card").classList.remove("talking-host");
    if (lastOpener) { try { lastOpener.focus(); } catch (e) {} lastOpener = null; }
  }
  modal.querySelectorAll("[data-close]").forEach(b => b.addEventListener("click", closeModal));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) closeModal(); });

  function openPerson(p, i, opener) {
    stopSpeech();
    if (modalChat && modalChat.destroy) modalChat.destroy();
    if (guideChat && guideChat.cancelPending) guideChat.cancelPending();
    lastOpener = opener || null;
    modal.querySelector(".pm-card").setAttribute("aria-label", p.name);
    const about = p.persona === "about";
    const voice = Object.assign({ idx: i, name: p.name }, p.voice || {});
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
    listen.classList.remove("speaking");
    setBtnLabel(listen, false);
    listen.onclick = () => {
      if (listen.classList.contains("speaking")) { stopSpeech(); return; }
      speak(listen.dataset.say, listen, voice, media);
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
    const chat = modalChat = wireChat(right.querySelector(".ask"), {
      qa: p.qa, fallback: p.fallback, greeting: p.greeting, voice: voice, talk: media
    });

    modal.hidden = false; document.body.style.overflow = "hidden";
    modal.querySelector(".pm-close").focus();
    chat.ensureGreeting();
  }

  root.querySelectorAll(".person, .av-figure").forEach(card => {
    const open = () => openPerson(people[+card.dataset.idx], +card.dataset.idx, card);
    card.addEventListener("click", open);
    if (card.tagName !== "BUTTON") {
      card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    }
  });

  /* "Step inside" - load the heavy 3D tour only when the visitor asks for it */
  const visitPlay = root.querySelector(".visit-play");
  if (visitPlay) {
    visitPlay.addEventListener("click", () => {
      const stage = root.querySelector(".visit-stage");
      const frame = root.querySelector(".visit-frame");
      const src = frame.getAttribute("data-embed");
      frame.innerHTML = `<iframe src="${src}" title="${esc(place.name)} - 3D tour" loading="lazy" allowfullscreen allow="xr-spatial-tracking; gyroscope; accelerometer; fullscreen; autoplay"></iframe>`;
      stage.classList.add("is-live");
    });
  }

  /* =====================================================
     Watch + journey in time + quiz (children's learning)
     ===================================================== */
  if (learn) {
    // journey in time
    const H = learn.history;
    let ti = 0;
    const eraEl = root.querySelector(".tl-era"), ttEl = root.querySelector(".tl-title"), txEl = root.querySelector(".tl-text");
    const dots = root.querySelector(".tl-dots");
    const listenBtn = root.querySelector(".tl-listen");
    dots.innerHTML = H.map((h, i) => `<button data-i="${i}" aria-label="Step ${i + 1}"></button>`).join("");
    function showStep(i) {
      ti = (i + H.length) % H.length;
      const h = H[ti];
      eraEl.textContent = h.era; ttEl.textContent = h.title; txEl.textContent = h.text;
      dots.querySelectorAll("button").forEach((d, j) => d.classList.toggle("active", j === ti));
      listenBtn.dataset.say = h.era + ". " + h.title + ". " + h.text;
      stopSpeech();
      setBtnLabel(listenBtn, false);
    }
    root.querySelector(".tl-prev").addEventListener("click", () => showStep(ti - 1));
    root.querySelector(".tl-next").addEventListener("click", () => showStep(ti + 1));
    dots.addEventListener("click", (e) => { const d = e.target.closest("button[data-i]"); if (d) showStep(+d.dataset.i); });
    listenBtn.addEventListener("click", () => {
      if (listenBtn.classList.contains("speaking")) { stopSpeech(); return; }
      speak(listenBtn.dataset.say, listenBtn, { g: "f", rate: 0.95 }, root.querySelector(".tl-card"));
    });
    showStep(0);

    // little quiz
    const Q = learn.quiz;
    let qi = 0, score = 0, missed = false;
    const qProg = root.querySelector(".qz-prog"), qQ = root.querySelector(".qz-q");
    const qOpts = root.querySelector(".qz-opts"), qMsg = root.querySelector(".qz-msg");
    // rotate option order per question so the answer is never always first
    function ordered(i) {
      const n = Q[i].options.length, shift = (i * 2 + 1) % n;
      return Q[i].options.map((o, j) => ({ text: o, correct: j === Q[i].correct }))
        .map((_, j, arr) => arr[(j + shift) % n]);
    }
    function showQ() {
      qProg.textContent = "Question " + (qi + 1) + " of " + Q.length;
      qQ.textContent = Q[qi].q; qMsg.textContent = ""; missed = false;
      qOpts.innerHTML = ordered(qi).map(o =>
        `<button class="qz-opt" data-correct="${o.correct ? "1" : "0"}">${esc(o.text)}</button>`).join("");
    }
    function endQ() {
      qProg.textContent = "All done";
      qQ.textContent = "You got " + score + " out of " + Q.length + "!";
      qMsg.textContent = score === Q.length ? "Wonderful. You really listened." : "Every try is a step in learning. Play again?";
      qOpts.innerHTML = `<button class="qz-opt qz-restart">Play again</button>`;
    }
    qOpts.addEventListener("click", (e) => {
      const r = e.target.closest(".qz-restart");
      if (r) { qi = 0; score = 0; missed = false; showQ(); return; }
      const b = e.target.closest(".qz-opt");
      if (!b || b.disabled) return;
      if (b.dataset.correct === "1") {
        b.classList.add("good"); if (!missed) score++;
        qMsg.textContent = "That is right! Well done.";
        qOpts.querySelectorAll(".qz-opt").forEach(x => { x.disabled = true; });
        window.setTimeout(() => { qi++; if (qi < Q.length) showQ(); else endQ(); }, 1000);
      } else {
        b.classList.add("bad"); b.disabled = true; missed = true;
        qMsg.textContent = "Not quite. Try another one.";
      }
    });
    showQ();
  }

  /* ---------- prayer times: live list and countdown ---------- */
  if (prayerTimes) {
    const sel = document.getElementById("ptCity");
    const list = document.getElementById("ptList");
    const nameEl = document.getElementById("ptName");
    const countEl = document.getElementById("ptCount");
    const ROWS = [["fajr", "Fajr"], ["sunrise", "Sunrise"], ["dhuhr", "Dhuhr"], ["asr", "Asr"], ["maghrib", "Maghrib"], ["isha", "Isha"]];
    let place = prayerTimes.places[(sel && sel.value) || "toronto"];
    function paint() {
      const t = prayerTimes.times(new Date(), place);
      const nx = prayerTimes.next(place);
      list.innerHTML = ROWS.map(([k, label]) => `
        <li class="${nx.name === label ? "is-next" : ""}">
          <span>${label}</span><strong>${prayerTimes.format(t[k])}</strong>
        </li>`).join("");
      nameEl.textContent = nx.name + (nx.tomorrow ? " (tomorrow)" : "");
    }
    function tick() {
      const nx = prayerTimes.next(place);
      let s = Math.max(0, nx.seconds);
      const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
      countEl.textContent = String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0") + ":" + String(sec).padStart(2, "0");
      if (s <= 0) paint();
    }
    if (sel) sel.addEventListener("change", () => { place = prayerTimes.places[sel.value]; paint(); tick(); });
    paint(); tick();
    window.setInterval(tick, 1000);
    window.setInterval(paint, 60000);
  }

  if (window.SaylavyReveal) window.SaylavyReveal();
})();
