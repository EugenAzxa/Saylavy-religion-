/* =========================================================
   Saylavy - HeyGen LiveAvatar live avatar engine

   Streams a photoreal, lip-synced LiveAvatar into the stage and
   speaks our teacher-approved answers (FULL mode -> repeat(text)).
   The API key is never here; a short-lived session token comes from
   your own token endpoint (serverless/). Loaded as an ES module.

   window.SaylavyHeyGen.mount(host, { avatarId, mode, tokenEndpoint })
     -> Promise<{ speak(text), stop(), destroy() }>
   ========================================================= */
import { LiveAvatarSession, SessionEvent } from "https://esm.sh/@heygen/liveavatar-web-sdk@0.0.18";

window.SaylavyHeyGen = {
  async mount(host, opts) {
    opts = opts || {};
    host.innerHTML = "";
    const status = document.createElement("div");
    status.className = "av3d-status";
    host.appendChild(status);
    const setStatus = (t) => { if (status.parentNode) status.textContent = t; };

    if (!opts.tokenEndpoint) throw new Error("no token endpoint configured");

    // 1) session token from our own endpoint (holds the API key)
    setStatus("Getting a secure session...");
    let token;
    try {
      const res = await fetch(opts.tokenEndpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode: opts.mode || "FULL", avatar_id: opts.avatarId }),
      });
      const data = await res.json();
      token = data && data.token;
      if (!token) throw new Error((data && data.raw && JSON.stringify(data.raw)) || "endpoint returned no token");
    } catch (e) { setStatus("Session token failed: " + (e.message || e)); throw e; }

    // 2) video element to receive the stream
    const video = document.createElement("video");
    video.autoplay = true; video.playsInline = true;
    video.style.cssText = "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;background:#0d1512;";
    host.appendChild(video);

    // 3) start the LiveAvatar session
    setStatus("Waking al-Khwarizmi...");
    const session = new LiveAvatarSession(token, { voiceChat: false });

    try {
      session.on(SessionEvent.SESSION_STREAM_READY, () => {
        try { session.attach(video); } catch (e) {}
        video.play().catch(() => {});
        if (status.parentNode) status.remove();
      });
    } catch (e) { /* event name guard */ }

    try {
      await session.start();
      try { session.attach(video); } catch (e) {}
    } catch (e) {
      const msg = (e && (e.message || e.toString())) || "could not start";
      setStatus("Live avatar could not start: " + msg);
      try { await session.stop(); } catch (_) {}
      throw new Error(msg);
    }

    return {
      // our chat calls this with the teacher-approved answer; LiveAvatar speaks + lip-syncs it
      async speak(text) { if (!text) return; try { await session.repeat(text); } catch (e) {} },
      startTalk() {}, stopTalk() {}, tick() {},
      async stop() { try { await session.interrupt(); } catch (e) {} },
      async destroy() { try { await session.stop(); } catch (e) {} host.innerHTML = ""; },
    };
  },
};
