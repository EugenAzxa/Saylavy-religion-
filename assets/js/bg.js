/* =========================================================
   Saylavy - animated background
   A slow, reverent field of drifting light behind each hero.
   Particle SHAPE is themed per faith (data-shape), coloured by
   the faith accent (data-accent), so every religion feels its
   own. Plus gentle pointer parallax on the aurora layers.
   Respects prefers-reduced-motion.
   ========================================================= */
(function () {
  "use strict";

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function hexToRgb(h) {
    h = (h || "#e6c483").replace("#", "");
    if (h.length === 3) h = h.split("").map(function (c) { return c + c; }).join("");
    var n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgba(c, a) { return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")"; }
  function rnd(a, b) { return a + Math.random() * (b - a); }

  /* ---- shape drawing (soft, low alpha) ---- */
  function star(ctx, spikes, outer, inner) {
    var rot = -Math.PI / 2, step = Math.PI / spikes;
    ctx.beginPath();
    ctx.moveTo(0, -outer);
    for (var i = 0; i < spikes; i++) {
      ctx.lineTo(Math.cos(rot) * outer, Math.sin(rot) * outer); rot += step;
      ctx.lineTo(Math.cos(rot) * inner, Math.sin(rot) * inner); rot += step;
    }
    ctx.closePath();
  }
  function petal(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.quadraticCurveTo(s * 0.7, -s * 0.2, 0, s);
    ctx.quadraticCurveTo(-s * 0.7, -s * 0.2, 0, -s);
    ctx.closePath();
  }

  function initField(canvas) {
    if (canvas.dataset.bgDone) return;
    canvas.dataset.bgDone = "1";
    var ctx = canvas.getContext("2d");
    var accent = hexToRgb(canvas.getAttribute("data-accent") || "#c99a4a");
    var shape = canvas.getAttribute("data-shape") || "mote";
    var warm = [230, 196, 131], cream = [243, 236, 223];
    var palette = shape === "mote" ? [accent, warm, cream, accent] : [accent, warm, accent, cream];
    var w, h, dpr, parts = [], raf;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var base = shape === "mote" ? 22000 : 34000;
      var count = Math.round(Math.min(shape === "mote" ? 70 : 40, Math.max(20, (w * h) / base)));
      parts = [];
      for (var i = 0; i < count; i++) parts.push(spawn(true));
    }
    function spawn(any) {
      return {
        x: rnd(0, w), y: any ? rnd(0, h) : h + 20,
        r: shape === "mote" ? rnd(0.6, 2.6) : rnd(4, 10),
        c: palette[Math.floor(Math.random() * palette.length)],
        vy: rnd(-0.06, -0.3), vx: rnd(-0.08, 0.08),
        a: rnd(0.12, shape === "mote" ? 0.7 : 0.5),
        tw: rnd(0.004, 0.02), tp: rnd(0, Math.PI * 2),
        rot: rnd(0, Math.PI * 2), vr: rnd(-0.012, 0.012)
      };
    }
    function draw(m) {
      var a = m.a * (0.55 + 0.45 * Math.sin(m.tp));
      if (shape === "mote") {
        var g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 4);
        g.addColorStop(0, rgba(m.c, a)); g.addColorStop(1, rgba(m.c, 0));
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(m.x, m.y, m.r * 4, 0, Math.PI * 2); ctx.fill();
        return;
      }
      ctx.save();
      ctx.translate(m.x, m.y); ctx.rotate(m.rot);
      ctx.fillStyle = rgba(m.c, a * 0.9);
      ctx.shadowColor = rgba(m.c, a); ctx.shadowBlur = m.r * 1.6;
      if (shape === "star8") star(ctx, 8, m.r, m.r * 0.42);
      else if (shape === "star6") star(ctx, 6, m.r, m.r * 0.5);
      else if (shape === "spark") star(ctx, 4, m.r, m.r * 0.32);
      else if (shape === "petal") petal(ctx, m.r);
      else { ctx.beginPath(); ctx.arc(0, 0, m.r * 0.6, 0, Math.PI * 2); }
      ctx.fill();
      ctx.restore();
    }
    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < parts.length; i++) {
        var m = parts[i];
        m.y += m.vy; m.x += m.vx; m.tp += m.tw; m.rot += m.vr;
        if (m.y < -30 || m.x < -30 || m.x > w + 30) parts[i] = spawn(false);
        draw(m);
      }
      raf = window.requestAnimationFrame(frame);
    }
    resize();
    window.addEventListener("resize", resize);
    if (reduce) { for (var i = 0; i < parts.length; i++) draw(parts[i]); }
    else frame();
  }

  function initParallax() {
    if (reduce) return;
    document.querySelectorAll(".hero-cosmos").forEach(function (hero) {
      if (hero.dataset.pxDone) return;
      hero.dataset.pxDone = "1";
      var layers = hero.querySelectorAll(".aurora");
      var emblem = hero.querySelector(".faith-aura");
      var tx = 0, ty = 0, cx = 0, cy = 0, active = false;
      hero.addEventListener("pointermove", function (e) {
        var r = hero.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5);
        ty = ((e.clientY - r.top) / r.height - 0.5);
        if (!active) { active = true; loop(); }
      });
      hero.addEventListener("pointerleave", function () { tx = 0; ty = 0; });
      function loop() {
        cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;
        layers.forEach(function (l, i) {
          var d = (i + 1) * 14;
          l.style.transform = "translate3d(" + (cx * d) + "px," + (cy * d) + "px,0)";
        });
        if (emblem) emblem.style.transform = "translate3d(" + (cx * -22) + "px," + (cy * -22) + "px,0)";
        if (Math.abs(cx - tx) > 0.001 || Math.abs(cy - ty) > 0.001 || tx || ty) window.requestAnimationFrame(loop);
        else active = false;
      }
    });
  }

  function start() {
    document.querySelectorAll("canvas.motes").forEach(initField);
    initParallax();
  }
  window.SaylavyBG = start;
  if (document.readyState !== "loading") start();
  else document.addEventListener("DOMContentLoaded", start);
})();
