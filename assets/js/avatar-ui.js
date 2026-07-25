/* =========================================================
   Saylavy - "Meet your teacher" orchestration

   Wires the two avatar views (living portrait / 3D) to a small
   chat: ask a question, get a teacher-approved answer from the
   faith's own Q&A, spoken aloud while the avatar's head and mouth
   move. Handles the A/B toggle and graceful fallback if 3D fails.

   API:  SaylavyAvatarUI.init(faithKey)
   ========================================================= */
(function () {
  "use strict";

  function el(t, c, h) { var n = document.createElement(t); if (c) n.className = c; if (h != null) n.innerHTML = h; return n; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function answerFor(f, text) {
    var t = (" " + (text || "").toLowerCase() + " ");
    var best = null, score = 0;
    (f.qa || []).forEach(function (item) {
      var s = 0;
      (item.keys || []).forEach(function (k) { if (t.indexOf(k.toLowerCase()) >= 0) s += k.length; });
      if (s > score) { score = s; best = item; }
    });
    return best ? best.a : (f.fallback || "That is a beautiful question. Let us explore it together with your teacher.");
  }

  function speak(text, data, getEngine) {
    var eng = getEngine();
    var hooks = {
      onstart: function () { eng && eng.startTalk && eng.startTalk(); },
      onword: function () { eng && eng.tick && eng.tick(); },
      onend: function () { eng && eng.stopTalk && eng.stopTalk(); }
    };
    var pref = { g: data.g === "m" ? "m" : "f", rate: 0.96, name: data.name };
    if (window.SaylavyVoice && window.SaylavyVoice.enabled && window.SaylavyVoice.enabled()) {
      if (window.SaylavyVoice.say(text, pref, data.name, hooks)) return;
    }
    if (window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(text);
        u.rate = 0.96; u.pitch = data.g === "m" ? 0.9 : 1.06;
        u.onstart = hooks.onstart; u.onboundary = hooks.onword; u.onend = hooks.onend;
        window.speechSynthesis.speak(u);
        return;
      } catch (e) {}
    }
    // last resort: fake the timing so the avatar still animates
    hooks.onstart();
    var beats = Math.min(60, Math.ceil(text.length / 4));
    var i = 0, iv = setInterval(function () { hooks.onword(); if (++i >= beats) { clearInterval(iv); hooks.onend(); } }, 90);
  }

  window.SaylavyAvatarUI = {
    init: function (key) {
      var data = window.SAYLAVY_AVATAR && window.SAYLAVY_AVATAR[key];
      var f = window.FAITHS && window.FAITHS[key];
      var stage = document.getElementById("av-stage");
      var chat = document.getElementById("av-chat");
      if (!data || !f || !stage || !chat || stage.dataset.on) return;
      stage.dataset.on = "1";

      var engine = null, view = "portrait", threeReq = false;
      function getEngine() { return engine; }

      /* ---- chat ---- */
      chat.innerHTML =
        '<div class="av-log" id="av-log"></div>' +
        '<div class="av-suggest">' + (f.suggest || []).map(function (q) { return '<button class="av-chip">' + esc(q) + "</button>"; }).join("") + "</div>" +
        '<form class="av-form"><input class="av-text" type="text" placeholder="Ask ' + esc(data.name) + ' a question..." aria-label="Ask a question"><button class="av-send" type="submit" aria-label="Send">Ask</button></form>';
      var log = chat.querySelector(".av-log");
      var form = chat.querySelector(".av-form");
      var input = chat.querySelector(".av-text");

      function addMsg(text, who, speakIt) {
        var m = el("div", "av-msg av-" + who, esc(text));
        log.appendChild(m); log.scrollTop = log.scrollHeight;
        if (speakIt) speak(text, data, getEngine);
      }
      var greeted = false;
      function greet() { if (greeted) return; greeted = true; addMsg(f.greeting || ("Assalamu alaikum. I am " + data.name + "."), "bot", true); }
      function ask(q) {
        if (!q) return;
        addMsg(q, "me", false);
        var a = answerFor(f, q);
        setTimeout(function () { addMsg(a, "bot", true); }, 380);
      }
      form.addEventListener("submit", function (e) { e.preventDefault(); var v = input.value.trim(); if (v) { ask(v); input.value = ""; } });
      chat.querySelector(".av-suggest").addEventListener("click", function (e) { var c = e.target.closest(".av-chip"); if (c) ask(c.textContent); });

      /* ---- views ---- */
      function mountPortrait() {
        if (engine && engine.destroy) engine.destroy();
        engine = window.SaylavyPortrait.mount(stage, data);
      }
      function mountThree() {
        stage.innerHTML = '<div class="av-loading">Waking the 3D teacher...</div>';
        if (!window.SaylavyAvatar3D) { fail("The 3D engine is still loading. Try again in a moment, or use the living portrait."); return; }
        window.SaylavyAvatar3D.mount(stage, data).then(function (api) {
          if (view !== "3d") { api.destroy && api.destroy(); return; }
          if (engine && engine.destroy) engine.destroy();
          engine = api;
        }).catch(function (err) { fail("This device could not load the 3D avatar. Showing the living portrait instead."); });
      }
      function fail(msg) {
        var note = el("div", "av-fail", esc(msg));
        setTab("portrait"); view = "portrait"; mountPortrait();
        stage.appendChild(note); setTimeout(function () { note.remove(); }, 4200);
      }

      var tabs = document.querySelectorAll(".av-tab");
      function setTab(v) { tabs.forEach(function (b) { b.classList.toggle("is-on", b.dataset.view === v); }); }
      tabs.forEach(function (b) {
        b.addEventListener("click", function () {
          var v = b.dataset.view; if (v === view) return;
          view = v; setTab(v);
          if (window.SaylavyVoice) window.SaylavyVoice.stop && window.SaylavyVoice.stop();
          if (v === "portrait") mountPortrait(); else mountThree();
        });
      });

      mountPortrait();

      /* greet when the section is seen */
      var io = new IntersectionObserver(function (ents) {
        ents.forEach(function (en) { if (en.isIntersecting) { greet(); io.disconnect(); } });
      }, { threshold: 0.4 });
      io.observe(stage);
    }
  };
})();
