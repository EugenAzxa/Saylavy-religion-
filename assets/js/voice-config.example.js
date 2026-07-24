/* Copy to voice-config.js (git-ignored) and fill in to enable real voices.
   Load it BEFORE voice.js on the faith pages.

   Safest for a public demo: run a tiny proxy that holds the key server side
   and set provider "proxy". A raw key in this file is visible to visitors,
   so if you use one, make it demo-only with a hard spending cap. */
window.SAYLAVY_VOICE = {
  provider: "elevenlabs",          // "elevenlabs" | "openai" | "proxy" | "browser"
  apiKey: "PUT-YOUR-KEY-HERE",     // omit when using "proxy"
  proxyUrl: "",                    // e.g. https://your-worker.workers.dev/speak
  voices: {
    _female: "ELEVENLABS_VOICE_ID",
    _male: "ELEVENLABS_VOICE_ID",
    "Mother Teresa": "ELEVENLABS_VOICE_ID"   // optional, per person by exact name
  }
};
