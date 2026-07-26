/* =========================================================
   Saylavy - "Meet your teacher" avatar demo, per-faith config

   Two views of the same teacher, so a community can compare:
   - a living portrait (this exact photoreal image, brought to life)
   - a real 3D avatar (Ready Player Me, loaded in the browser)

   Sensitivity: the avatar is a TEACHER character, never God, a
   prophet, or a sacred figure. Chat answers come from the faith's
   own teacher-approved Q&A in faith-data.js.

   The 3D `glb` loads from the Ready Player Me CDN at runtime. To use
   your own avatar, create one at readyplayer.me and paste its .glb
   URL here (keep the morphTargets query for lip-sync).
   ========================================================= */
(function () {
  "use strict";

  window.SAYLAVY_AVATAR = {
    muslim: {
      name: "Ustadh Yusuf",
      role: "your Qur'an teacher",
      g: "m",
      // Save the scholar photo here; falls back to the guide portrait.
      image: "assets/img/avatars/scholar.jpg",
      imageFallback: "assets/img/avatars/muslim-guide.jpg",
      // TEMPORARY engine-test face (a real scanned head with a working jaw +
      // blink rig) so we can confirm 3D talking works. Replace with the
      // scholar model once generated: "assets/avatars3d/scholar.glb".
      glb: "assets/avatars3d/facecap.glb",

      // HeyGen live photoreal avatar (al-Khwarizmi, built from the scholar photo)
      heygen: {
        avatarId: "6fe8b0d2-336e-47f5-9f99-169be9ef6773",   // LiveAvatar avatar id (UUID)
        mode: "FULL",                                        // FULL -> repeat(text) speaks our answers
        // Your deployed Cloudflare Worker token endpoint (holds the API key).
        tokenEndpoint: "https://saylavy-heygen.eugen-cd1.workers.dev"
      },

      // D-ID live agent (al-Khwarizmi photo avatar). The Frame embed renders
      // the full talking agent into this div; the <script> is in muslim.html.
      didAgent: { targetId: "did-agent-frame" }
    }
  };
})();
