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
      glb: "https://models.readyplayer.me/638df693d72bffc6fa17943c.glb?morphTargets=ARKit,Oculus%20Visemes&textureAtlas=1024&lod=1"
    }
  };
})();
