/* =========================================================
   Saylavy - real voice layer
   Speaks with real, human-sounding voices when a provider is
   configured, and falls back to the browser voice otherwise.

   Three sources, in order of preference:
   1. A recorded audio file for that exact line (best, and free):
      put MP3s in assets/audio/ and map them in voice-clips.js
   2. A cloud voice API (ElevenLabs or OpenAI) via a key
   3. The browser's built-in speech (always available)

   SECURITY NOTE: a key placed here is visible to anyone who opens
   the page, so use a demo-only key with a hard spending cap, or
   better, put a tiny proxy in front of it and set PROXY_URL.
   Nothing is sent anywhere unless you configure a provider.
   ========================================================= */
(function () {
  "use strict";

  var CFG = window.SAYLAVY_VOICE || {};   // set in voice-config.js (git-ignored)

  var PROVIDER = CFG.provider || "browser";  // "elevenlabs" | "openai" | "proxy" | "browser"
  var API_KEY  = CFG.apiKey || "";
  var PROXY_URL = CFG.proxyUrl || "";
  var DEFAULT_VOICES = CFG.voices || {};     // { "Mother Teresa": "voiceId", _female: "id", _male: "id" }
  var MODEL = CFG.model || (PROVIDER === "openai" ? "gpt-4o-mini-tts" : "eleven_turbo_v2_5");

  var cache = new Map();   // text -> object URL, so a repeated line costs nothing
  var current = null;      // currently playing Audio

  function keyFor(text, voiceId) { return (voiceId || "-") + "::" + text; }

  function stop() {
    if (current) { try { current.pause(); } catch (e) {} current = null; }
  }

  function pickVoiceId(pref, name) {
    if (name && DEFAULT_VOICES[name]) return DEFAULT_VOICES[name];
    if (pref && pref.g === "m" && DEFAULT_VOICES._male) return DEFAULT_VOICES._male;
    if (DEFAULT_VOICES._female) return DEFAULT_VOICES._female;
    return CFG.voiceId || "";
  }

  async function fetchAudio(text, voiceId) {
    if (PROVIDER === "proxy") {
      var r = await fetch(PROXY_URL, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text, voice: voiceId })
      });
      if (!r.ok) throw new Error("proxy " + r.status);
      return await r.blob();
    }
    if (PROVIDER === "elevenlabs") {
      var er = await fetch("https://api.elevenlabs.io/v1/text-to-speech/" + encodeURIComponent(voiceId), {
        method: "POST",
        headers: { "xi-api-key": API_KEY, "Content-Type": "application/json", "Accept": "audio/mpeg" },
        body: JSON.stringify({
          text: text, model_id: MODEL,
          voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.25, use_speaker_boost: true }
        })
      });
      if (!er.ok) throw new Error("elevenlabs " + er.status);
      return await er.blob();
    }
    if (PROVIDER === "openai") {
      var or_ = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: { "Authorization": "Bearer " + API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ model: MODEL, voice: voiceId || "alloy", input: text, format: "mp3" })
      });
      if (!or_.ok) throw new Error("openai " + or_.status);
      return await or_.blob();
    }
    throw new Error("no provider");
  }

  // Public API used by faith.js.
  // say(text, pref, name, handlers) -> true if a real voice will handle it.
  // handlers: { onstart, onword, onend }
  function say(text, pref, name, handlers) {
    handlers = handlers || {};
    var clip = (window.VOICE_CLIPS || {})[name && name + "::" + text] || (window.VOICE_CLIPS || {})[text];
    var voiceId = pickVoiceId(pref, name);
    var usable = clip || (PROVIDER === "proxy" && PROXY_URL) ||
                 ((PROVIDER === "elevenlabs" || PROVIDER === "openai") && API_KEY && voiceId);
    if (!usable) return false;

    stop();
    var ck = keyFor(text, voiceId);

    var play = function (src) {
      var a = new Audio(src);
      current = a;
      a.playbackRate = (pref && pref.rate) ? Math.max(0.75, Math.min(1.15, pref.rate + 0.06)) : 1;
      // a soft pulse in place of real word boundaries
      var pulse = window.setInterval(function () { if (handlers.onword) handlers.onword(); }, 260);
      var finish = function () { window.clearInterval(pulse); if (current === a) current = null; if (handlers.onend) handlers.onend(); };
      a.onended = finish;
      a.onerror = function () { window.clearInterval(pulse); if (handlers.onend) handlers.onend(true); };
      a.play().then(function () { if (handlers.onstart) handlers.onstart(); })
              .catch(function () { finish(); });
    };

    if (clip) { play(clip); return true; }
    if (cache.has(ck)) { play(cache.get(ck)); return true; }

    fetchAudio(text, voiceId).then(function (blob) {
      var url = URL.createObjectURL(blob);
      cache.set(ck, url);
      play(url);
    }).catch(function (err) {
      // fall back to the browser voice on any failure
      if (window.console) console.warn("Saylavy voice fallback:", err && err.message);
      if (handlers.onfail) handlers.onfail();
    });
    return true;
  }

  window.SaylavyVoice = {
    say: say,
    stop: stop,
    enabled: function () {
      return !!(window.VOICE_CLIPS ||
        (PROVIDER === "proxy" && PROXY_URL) ||
        ((PROVIDER === "elevenlabs" || PROVIDER === "openai") && API_KEY));
    },
    provider: PROVIDER
  };
})();
