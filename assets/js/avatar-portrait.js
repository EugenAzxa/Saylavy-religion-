/* =========================================================
   Saylavy - living portrait engine

   Brings a single photoreal portrait to life: it tilts in real 3D
   toward the pointer (or device tilt), breathes gently, and while
   the teacher speaks his head moves naturally and a warm light
   plays over him. No pixel warping, so it never looks uncanny.

   API:  SaylavyPortrait.mount(host, opts) -> { startTalk, stopTalk, tick, destroy }
   ========================================================= */
(function () {
  "use strict";

  function el(t, c, h) { var n = document.createElement(t); if (c) n.className = c; if (h != null) n.innerHTML = h; return n; }

  window.SaylavyPortrait = {
    mount: function (host, opts) {
      opts = opts || {};
      host.innerHTML = "";
      var wrap = el("div", "avp");
      wrap.innerHTML =
        '<div class="avp-tilt">' +
          '<div class="avp-bob">' +
            '<img class="avp-img" alt="' + (opts.name || "teacher") + '" src="' + (opts.image || "") + '">' +
            '<span class="avp-glow" aria-hidden="true"></span>' +
            '<span class="avp-sheen" aria-hidden="true"></span>' +
          '</div>' +
        '</div>' +
        '<span class="avp-ring" aria-hidden="true"></span>';
      host.appendChild(wrap);

      var img = wrap.querySelector(".avp-img");
      var tilt = wrap.querySelector(".avp-tilt");
      if (opts.imageFallback) { img.onerror = function () { img.onerror = null; img.src = opts.imageFallback; }; }

      var rx = 0, ry = 0, tx = 0, ty = 0, raf = null, dead = false;
      function loop() {
        if (dead) return;
        rx += (tx - rx) * 0.08; ry += (ty - ry) * 0.08;
        tilt.style.transform = "rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg)";
        raf = requestAnimationFrame(loop);
      }
      function onMove(e) {
        var r = host.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width * 2 - 1;
        var py = (e.clientY - r.top) / r.height * 2 - 1;
        ty = Math.max(-1, Math.min(1, px)) * 9;
        tx = -Math.max(-1, Math.min(1, py)) * 7;
      }
      function onLeave() { tx = 0; ty = 0; }
      function onTilt(e) {
        if (e.gamma == null || e.beta == null) return;
        ty = Math.max(-9, Math.min(9, e.gamma / 4));
        tx = Math.max(-7, Math.min(7, (e.beta - 45) / 6));
      }
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerleave", onLeave);
      window.addEventListener("deviceorientation", onTilt);
      loop();

      return {
        startTalk: function () { wrap.classList.add("talking"); },
        stopTalk: function () { wrap.classList.remove("talking", "beat"); },
        tick: function () { wrap.classList.remove("beat"); void wrap.offsetWidth; wrap.classList.add("beat"); },
        destroy: function () {
          dead = true; if (raf) cancelAnimationFrame(raf);
          host.removeEventListener("pointermove", onMove);
          host.removeEventListener("pointerleave", onLeave);
          window.removeEventListener("deviceorientation", onTilt);
          host.innerHTML = "";
        }
      };
    }
  };
})();
