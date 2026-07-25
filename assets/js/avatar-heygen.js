/* =========================================================
   Saylavy - HeyGen live avatar engine

   Streams a photoreal, lip-synced HeyGen avatar into the stage
   and speaks our teacher-approved answers. The API key is never
   here; we fetch a short-lived session token from your own token
   endpoint (see serverless/). Loaded as an ES module.

   window.SaylavyHeyGen.mount(host, { avatarId, tokenEndpoint, voiceId })
     -> Promise<{ speak(text), stop(), destroy() }>
   ========================================================= */
import StreamingAvatar, { AvatarQuality, StreamingEvents, TaskType } from "https://esm.sh/@heygen/streaming-avatar@2";

window.SaylavyHeyGen = {
  async mount(host, opts) {
    opts = opts || {};
    host.innerHTML = "";
    const status = document.createElement("div");
    status.className = "av3d-status";
    host.appendChild(status);
    const setStatus = (t) => { status.textContent = t; };

    if (!opts.tokenEndpoint) throw new Error("no token endpoint configured");
    setStatus("Getting a secure session...");
    let token;
    try {
      const res = await fetch(opts.tokenEndpoint, { method: "POST" });
      const data = await res.json();
      token = data && data.token;
    } catch (e) { throw new Error("token endpoint unreachable"); }
    if (!token) throw new Error("token endpoint returned no token");

    const video = document.createElement("video");
    video.autoplay = true; video.playsInline = true;
    video.style.cssText = "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;";
    host.appendChild(video);

    setStatus("Waking al-Khwarizmi...");
    const avatar = new StreamingAvatar({ token });
    let ready = false;

    avatar.on(StreamingEvents.STREAM_READY, (event) => {
      video.srcObject = event.detail;
      video.play().catch(() => {});
      ready = true;
      status.remove();
    });
    avatar.on(StreamingEvents.STREAM_DISCONNECTED, () => { setStatus && host.appendChild(status); status.textContent = "The live session ended."; });

    try {
      await avatar.createStartAvatar({
        quality: AvatarQuality.Medium,
        avatarName: opts.avatarId,
        voice: opts.voiceId ? { voiceId: opts.voiceId } : undefined,
        language: "en",
      });
    } catch (e) {
      const msg = (e && (e.message || e.responseText)) || "could not start";
      setStatus("HeyGen could not start this avatar (" + msg + ").");
      throw new Error(msg);
    }

    return {
      // our chat calls this with the teacher-approved answer; HeyGen speaks + lip-syncs it
      async speak(text) {
        if (!text) return;
        try { await avatar.speak({ text, taskType: TaskType.REPEAT }); } catch (e) {}
      },
      startTalk() {}, stopTalk() {}, tick() {},
      async stop() { try { await avatar.interrupt(); } catch (e) {} },
      async destroy() {
        try { await avatar.stopAvatar(); } catch (e) {}
        host.innerHTML = "";
      },
    };
  },
};
