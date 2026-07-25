/* =========================================================
   Saylavy - "A Day of Kindness" top-down mini game

   A small, gentle world a child walks around, helping
   ordinary community members with wholesome tasks and
   learning a real value each time. Pure canvas + DOM,
   no libraries, works on phone and desktop.

   Art: Kenney "Tiny Town" + "Roguelike Characters" (CC0).
   Voice: reuses window.SaylavyVoice when present.

   Public API:  window.SaylavyGame.mount(hostEl, faithKey)
   ========================================================= */
(function () {
  "use strict";

  var SRC = 16, CSTEP = 17, DRAW = 48;      // source tile / char step / on-screen tile
  var TILES_URL = "assets/game/tiles.png";
  var CHARS_URL = "assets/game/chars.png";

  // verified tile indices in tiles.png (12 columns, no margin)
  var T = {
    grass: [0, 1, 2],
    sand: { tl: 12, t: 13, tr: 14, l: 24, c: 25, r: 26, bl: 36, b: 37, br: 38 },
    roofGrey: [48, 49, 50], roofGrey2: [60, 61, 62],
    roofRed: [54, 55, 56], roofRed2: [66, 67, 68],
    wall: [84, 85, 86],
    tree: 4, treeAlt: 3, bush: 5, barrel: 106, bucket: 107, chest: 131, pan: 127
  };

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- shared image loader ---------- */
  var _imgs = null;
  function loadImages() {
    if (_imgs) return _imgs;
    _imgs = new Promise(function (resolve, reject) {
      var out = {}, need = 2, failed = false;
      function one(key, url) {
        var im = new Image();
        im.onload = function () { out[key] = im; if (--need === 0 && !failed) resolve(out); };
        im.onerror = function () { failed = true; reject(new Error("image " + url)); };
        im.src = url;
      }
      one("tiles", TILES_URL); one("chars", CHARS_URL);
    });
    return _imgs;
  }

  /* ---------- tiny speech helper (reuses site voice) ---------- */
  function makeSpeaker() {
    var muted = false, cur = null;
    function stop() {
      try { if (window.SaylavyVoice) window.SaylavyVoice.stop(); } catch (e) {}
      try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) {}
      cur = null;
    }
    function say(text, pref, name) {
      if (muted || !text) return;
      stop();
      pref = pref || {};
      if (window.SaylavyVoice && window.SaylavyVoice.enabled && window.SaylavyVoice.enabled()) {
        try { if (window.SaylavyVoice.say(text, pref, name || null, {})) return; } catch (e) {}
      }
      if (window.speechSynthesis) {
        var u = new SpeechSynthesisUtterance(text);
        u.rate = pref.rate || 0.96; u.pitch = pref.g === "m" ? 0.9 : 1.05;
        cur = u; try { window.speechSynthesis.speak(u); } catch (e) {}
      }
    }
    return { say: say, stop: stop, mute: function (m) { muted = m; if (m) stop(); }, isMuted: function () { return muted; } };
  }

  /* ---------- DOM helpers ---------- */
  function el(tag, cls, html) { var n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* =====================================================
     Game
     ===================================================== */
  function Game(host, data, imgs) {
    this.host = host; this.data = data; this.imgs = imgs;
    this.cols = data.grid.cols; this.rows = data.grid.rows;
    this.W = this.cols * DRAW; this.H = this.rows * DRAW;
    this.speaker = makeSpeaker();
    this.keys = {}; this.target = null;
    this.done = {};          // station id -> true
    this.raf = null; this.running = false; this.t0 = 0;
    this.build();
    this.layout();
    this.reset();
  }

  Game.prototype.build = function () {
    var d = this.data, self = this;
    this.host.innerHTML = "";
    this.host.style.setProperty("--sg-accent", d.accent || "#1f9d57");
    var stage = el("div", "sg-stage");
    var cv = el("canvas", "sg-canvas");
    cv.width = this.W; cv.height = this.H;
    cv.setAttribute("role", "img");
    cv.setAttribute("aria-label", d.title + " - a walk-around game");
    this.canvas = cv; this.ctx = cv.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    stage.appendChild(cv);

    // HUD
    var hud = el("div", "sg-hud");
    var quest = el("div", "sg-quest");
    quest.appendChild(el("span", "sg-quest-title", esc(d.quest)));
    var pips = el("div", "sg-pips");
    d.stations.forEach(function (s) { var p = el("span", "sg-pip"); p.dataset.id = s.id; p.title = s.label; pips.appendChild(p); });
    quest.appendChild(pips); this.pips = pips;
    hud.appendChild(quest);

    var mute = el("button", "sg-mute", iconSound());
    mute.setAttribute("aria-label", "Mute voices");
    mute.addEventListener("click", function () {
      var m = !self.speaker.isMuted(); self.speaker.mute(m);
      mute.classList.toggle("off", m); mute.innerHTML = m ? iconMute() : iconSound();
    });
    hud.appendChild(mute);
    stage.appendChild(hud);

    // prompt (contextual "help" button)
    var prompt = el("button", "sg-prompt", "");
    prompt.style.display = "none";
    prompt.addEventListener("click", function () { self.interact(); });
    stage.appendChild(prompt); this.prompt = prompt;

    // teaching toast
    var toast = el("div", "sg-toast"); toast.style.display = "none";
    stage.appendChild(toast); this.toast = toast;

    // controls: d-pad + action
    var ctrl = el("div", "sg-controls");
    var pad = el("div", "sg-dpad");
    ["up", "left", "down", "right"].forEach(function (dir) {
      var b = el("button", "sg-d sg-d-" + dir, arrow(dir));
      b.setAttribute("aria-label", "Move " + dir);
      var set = function (v) { return function (e) { e.preventDefault(); self.keys[dir] = v; self.target = null; }; };
      b.addEventListener("pointerdown", set(true));
      b.addEventListener("pointerup", set(false));
      b.addEventListener("pointerleave", set(false));
      b.addEventListener("pointercancel", set(false));
      pad.appendChild(b);
    });
    ctrl.appendChild(pad);
    var act = el("button", "sg-action", "Help");
    act.setAttribute("aria-label", "Help / interact");
    act.addEventListener("click", function () { self.interact(); });
    ctrl.appendChild(act); this.actionBtn = act;
    stage.appendChild(ctrl);

    // task + finish layers
    var layer = el("div", "sg-layer"); layer.style.display = "none";
    stage.appendChild(layer); this.layer = layer;

    // start cover
    var cover = el("div", "sg-cover");
    cover.innerHTML =
      '<div class="sg-cover-in">' +
      '<p class="sg-eyebrow">Play &amp; learn</p>' +
      '<h3>' + esc(d.title) + '</h3>' +
      '<p class="sg-tag">' + esc(d.tagline) + '</p>' +
      '<button class="sg-play">Start</button>' +
      '<p class="sg-hint">Arrow keys or drag the pad to walk. Walk up to a glowing helper and press <b>Help</b>.</p>' +
      '</div>';
    stage.appendChild(cover); this.cover = cover;
    cover.querySelector(".sg-play").addEventListener("click", function () { self.start(); });

    this.stage = stage;
    this.host.appendChild(stage);

    // keyboard
    this._onKey = function (e) {
      var m = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", w: "up", s: "down", a: "left", d: "right", W: "up", S: "down", A: "left", D: "right" };
      if (e.type === "keydown" && (e.key === " " || e.key === "Enter" || e.key === "e" || e.key === "E")) { e.preventDefault(); self.interact(); return; }
      var dir = m[e.key]; if (!dir) return;
      if (!self.running) return;
      e.preventDefault(); self.keys[dir] = (e.type === "keydown"); self.target = null;
    };
    // only capture keys while the game is focused/hovered
    this._keyActive = false;
    stage.addEventListener("pointerenter", function () { self._keyActive = true; });
    stage.addEventListener("pointerleave", function () { self._keyActive = false; self.keys = {}; });
    stage.tabIndex = 0;
    stage.addEventListener("focusin", function () { self._keyActive = true; });
    stage.addEventListener("focusout", function () { self._keyActive = false; self.keys = {}; });
    document.addEventListener("keydown", function (e) { if (self._keyActive) self._onKey(e); });
    document.addEventListener("keyup", function (e) { if (self._keyActive) self._onKey(e); });

    // tap to walk
    cv.addEventListener("pointerdown", function (e) {
      if (!self.running) return;
      var r = cv.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width * self.W;
      var y = (e.clientY - r.top) / r.height * self.H;
      self.target = { x: x, y: y };
    });
  };

  Game.prototype.layout = function () {
    // build collision + static sprite list from data
    var d = this.data, self = this;
    this.blocked = {};
    function block(x, y) { self.blocked[x + "," + y] = true; }
    this.sprites = [];   // {img, sx,sy, x,y(px top-left), w,h, baseY, kind}

    // ground detail scatter (deterministic)
    this.groundSeed = [];
    for (var gy = 0; gy < this.rows; gy++) for (var gx = 0; gx < this.cols; gx++) {
      var h = (gx * 7 + gy * 13) % 11; this.groundSeed.push(h === 0 ? 1 : (h === 5 ? 2 : 0));
    }

    // buildings (roof row + wall row), block their footprint
    (d.buildings || []).forEach(function (b) {
      var roof = b.roof === "red" ? T.roofRed : T.roofGrey;
      for (var i = 0; i < 3; i++) {
        self.pushTile(roof[i], b.x + i, b.y);
        self.pushTile(T.wall[i], b.x + i, b.y + 1);
        block(b.x + i, b.y); block(b.x + i, b.y + 1);
      }
    });

    // props
    (d.props || []).forEach(function (p) {
      var idx = p.k === "tree" ? T.tree : p.k === "bush" ? T.bush : p.k === "chest" ? T.chest :
        p.k === "barrel" ? T.barrel : p.k === "bucket" ? T.bucket : T.pan;
      self.pushTile(idx, p.x, p.y, p.k === "tree" ? -DRAW * 0.5 : 0);
      if (p.k !== "bush") block(p.x, p.y);
    });

    // station props (custom-drawn oven/mat, or tile), block the cell
    (d.stations || []).forEach(function (s) {
      block(s.x, s.y);
    });

    // helpers + guests are drawn as characters (in draw loop), block helper cell
    (d.stations || []).forEach(function (s) { if (s.helper) block(s.helper.x, s.helper.y); });
  };

  Game.prototype.pushTile = function (index, cx, cy, yoff) {
    this.sprites.push({
      img: this.imgs.tiles, sx: (index % 12) * SRC, sy: ((index / 12) | 0) * SRC, sw: SRC, sh: SRC,
      x: cx * DRAW, y: cy * DRAW + (yoff || 0), w: DRAW, h: DRAW, baseY: cy * DRAW + DRAW
    });
  };

  Game.prototype.reset = function () {
    var p = this.data.player;
    this.px = p.x * DRAW + DRAW / 2;
    this.py = p.y * DRAW + DRAW * 0.7;
    this.face = 1; this.walkT = 0; this.moving = false;
    this.done = {};
    this.target = null; this.keys = {};
    this.served = {};
    if (this.pips) Array.prototype.forEach.call(this.pips.children, function (c) { c.classList.remove("on"); });
    this.render(0);
  };

  Game.prototype.start = function () {
    if (this.cover) this.cover.classList.add("hide");
    this.running = true; this._keyActive = true;
    try { this.stage.focus({ preventScroll: true }); } catch (e) {}
    var self = this;
    if (!this.raf) {
      var loop = function (t) { self.update(t); self.render(t); self.raf = requestAnimationFrame(loop); };
      this.raf = requestAnimationFrame(loop);
    }
  };

  Game.prototype.stop = function () {
    this.running = false;
    if (this.raf) { cancelAnimationFrame(this.raf); this.raf = null; }
    this.speaker.stop();
  };

  /* ---------- update ---------- */
  Game.prototype.update = function (t) {
    if (!this.t0) this.t0 = t;
    if (!this.running) return;
    var dt = 1;                       // frame-based, good enough for a cozy game
    var sp = 3.0 * (DRAW / 48);
    var vx = 0, vy = 0;
    if (this.keys.left) vx -= 1; if (this.keys.right) vx += 1;
    if (this.keys.up) vy -= 1; if (this.keys.down) vy += 1;

    if (!vx && !vy && this.target) {   // tap-to-walk
      var dx = this.target.x - this.px, dy = this.target.y - this.py;
      var dist = Math.hypot(dx, dy);
      if (dist < 4) { this.target = null; } else { vx = dx / dist; vy = dy / dist; }
    }

    var len = Math.hypot(vx, vy);
    this.moving = len > 0.01;
    if (this.moving) {
      vx = vx / len * sp; vy = vy / len * sp;
      if (vx < 0) this.face = -1; else if (vx > 0) this.face = 1;
      // per-axis collision (point at feet)
      var nx = this.px + vx;
      if (!this.solidAt(nx, this.py)) this.px = nx; else this.target = null;
      var ny = this.py + vy;
      if (!this.solidAt(this.px, ny)) this.py = ny; else this.target = null;
      // bounds
      this.px = Math.max(DRAW * 0.4, Math.min(this.W - DRAW * 0.4, this.px));
      this.py = Math.max(DRAW * 0.6, Math.min(this.H - DRAW * 0.3, this.py));
      this.walkT += 0.25;
    } else { this.walkT = 0; }

    this.updatePrompt();
  };

  Game.prototype.solidAt = function (px, py) {
    var cx = (px / DRAW) | 0, cy = (py / DRAW) | 0;
    if (cx < 0 || cy < 0 || cx >= this.cols || cy >= this.rows) return true;
    return !!this.blocked[cx + "," + cy];
  };

  Game.prototype.nearestStation = function () {
    var best = null, bd = 1e9, self = this;
    (this.data.stations || []).forEach(function (s) {
      if (self.done[s.id]) return;
      var scx = s.x * DRAW + DRAW / 2, scy = s.y * DRAW + DRAW / 2;
      var dd = Math.hypot(self.px - scx, self.py - scy);
      if (dd < bd) { bd = dd; best = s; }
    });
    if (best && bd < DRAW * 1.5) return best;
    return null;
  };

  Game.prototype.updatePrompt = function () {
    var s = this.nearestStation();
    if (!s) { this.prompt.style.display = "none"; this._near = null; return; }
    this._near = s;
    var locked = this.isLocked(s);
    this.prompt.textContent = locked ? "Finish the bread and milk first" : s.label;
    this.prompt.classList.toggle("locked", locked);
    // position prompt above the station on screen
    var r = this.canvas.getBoundingClientRect();
    var sx = (s.x * DRAW + DRAW / 2) / this.W * r.width;
    var sy = (s.y * DRAW) / this.H * r.height;
    this.prompt.style.left = sx + "px";
    this.prompt.style.top = Math.max(6, sy - 6) + "px";
    this.prompt.style.display = "block";
  };

  Game.prototype.isLocked = function (s) {
    var self = this;
    return (s.needs || []).some(function (id) { return !self.done[id]; });
  };

  Game.prototype.interact = function () {
    var s = this._near || this.nearestStation();
    if (!s || this.layer.style.display === "block") return;
    if (this.isLocked(s)) { this.speaker.say("Let us finish the bread and milk first.", { g: "m" }); return; }
    this.openTask(s);
  };

  /* ---------- tasks ---------- */
  Game.prototype.openTask = function (s) {
    var self = this;
    if (this._cleanup) { try { this._cleanup(); } catch (e) {} this._cleanup = null; }
    this.running && this.speaker.say(s.helper ? s.helper.line : s.label, { g: s.id === "milk" ? "f" : "m", rate: 0.96 }, s.helper && s.helper.name);
    var L = this.layer; L.innerHTML = ""; L.style.display = "block";
    var card = el("div", "sg-task");
    var head = el("div", "sg-task-head",
      (s.helper ? '<span class="sg-task-who">' + esc(s.helper.name) + "</span>" : "") +
      "<h4>" + esc(s.label) + "</h4>");
    card.appendChild(head);
    var body = el("div", "sg-task-body");
    card.appendChild(body);
    var close = el("button", "sg-task-x", "×"); close.setAttribute("aria-label", "Close");
    close.addEventListener("click", function () { self.closeTask(); });
    card.appendChild(close);
    L.appendChild(card);

    if (s.task === "knead") this.taskKnead(body, s);
    else if (s.task === "pour") this.taskPour(body, s);
    else if (s.task === "serve") this.taskServe(body, s);
    else this.finishTask(s);
  };

  Game.prototype.closeTask = function () {
    if (this._cleanup) { try { this._cleanup(); } catch (e) {} this._cleanup = null; }
    this.layer.style.display = "none"; this.layer.innerHTML = "";
  };

  Game.prototype.finishTask = function (s) {
    this.closeTask();
    this.done[s.id] = true;
    var pip = this.pips.querySelector('[data-id="' + s.id + '"]'); if (pip) pip.classList.add("on");
    this.showToast(s.teach);
    this.speaker.say(s.teach, { g: "f", rate: 0.95 });
    var self = this;
    var all = (this.data.stations || []).every(function (x) { return self.done[x.id]; });
    if (all) setTimeout(function () { self.finish(); }, 1400);
  };

  Game.prototype.taskKnead = function (body, s) {
    var self = this, need = 8, n = 0;
    body.appendChild(el("p", "sg-task-tip", "Tap the dough to knead and shape the bread."));
    var wrap = el("div", "sg-knead");
    var dough = el("button", "sg-dough", "");
    var ring = el("div", "sg-ring"); ring.style.setProperty("--p", "0");
    wrap.appendChild(ring); ring.appendChild(dough);
    body.appendChild(wrap);
    var count = el("p", "sg-count", "0 / " + need);
    body.appendChild(count);
    dough.addEventListener("click", function () {
      if (n >= need) return;
      n++; count.textContent = n + " / " + need;
      ring.style.setProperty("--p", (n / need * 100).toFixed(0));
      dough.classList.remove("squish"); void dough.offsetWidth; dough.classList.add("squish");
      if (n >= need) {
        dough.classList.add("bread");
        count.textContent = "Fresh bread, ready!";
        setTimeout(function () { self.finishTask(s); }, 700);
      }
    });
  };

  Game.prototype.taskPour = function (body, s) {
    var self = this, level = 0, holding = false, spilled = false, raf = null;
    body.appendChild(el("p", "sg-task-tip", "Press and hold to pour. Fill the milk into the green band - not too much!"));
    var glass = el("div", "sg-glass");
    var milk = el("div", "sg-milk");
    var band = el("div", "sg-band");
    glass.appendChild(band); glass.appendChild(milk);
    body.appendChild(glass);
    var btn = el("button", "sg-pour", "Hold to pour");
    body.appendChild(btn);
    var lo = 68, hi = 90;
    function tick() {
      if (holding && !spilled) {
        level += 0.9; if (level > 100) { level = 100; spilled = true; fail("Oh, it overflowed! Let's try again."); }
        milk.style.height = level + "%";
        milk.classList.toggle("good", level >= lo && level <= hi);
      }
      raf = requestAnimationFrame(tick);
    }
    function done() {
      if (spilled) return;
      holding = false;
      if (level >= lo && level <= hi) { cancelAnimationFrame(raf); setTimeout(function () { self.finishTask(s); }, 450); }
      else if (level < lo) { /* keep going */ }
    }
    function fail(msg) {
      cancelAnimationFrame(raf); btn.disabled = true;
      var m = el("p", "sg-count", msg); body.appendChild(m);
      setTimeout(function () { spilled = false; level = 0; milk.style.height = "0%"; milk.classList.remove("good"); btn.disabled = false; m.remove(); tick(); }, 1100);
    }
    btn.addEventListener("pointerdown", function (e) { e.preventDefault(); holding = true; });
    btn.addEventListener("pointerup", function (e) { e.preventDefault(); done(); });
    btn.addEventListener("pointerleave", function () { if (holding) done(); });
    band.style.bottom = lo + "%"; band.style.height = (hi - lo) + "%";
    self._cleanup = function () { holding = false; cancelAnimationFrame(raf); };
    tick();
  };

  Game.prototype.taskServe = function (body, s) {
    var self = this;
    body.appendChild(el("p", "sg-task-tip", "Give a plate to each neighbour. Everyone eats together."));
    var grid = el("div", "sg-serve");
    var guests = (this.data.guests || []).slice(0);
    // ensure at least 4 guests
    var served = 0, total = guests.length;
    guests.forEach(function (g, i) {
      var card = el("button", "sg-guest", "");
      var cv = document.createElement("canvas"); cv.width = 32; cv.height = 32; cv.className = "sg-guest-av";
      var cx = cv.getContext("2d"); cx.imageSmoothingEnabled = false;
      cx.drawImage(self.imgs.chars, g.sprite[0] * CSTEP, g.sprite[1] * CSTEP, SRC, SRC, 0, 0, 32, 32);
      card.appendChild(cv);
      card.appendChild(el("span", "sg-plate", ""));
      card.addEventListener("click", function () {
        if (card.classList.contains("served")) return;
        card.classList.add("served"); served++;
        if (served >= total) {
          var msg = el("p", "sg-count", "Everyone is served. Bismillah!");
          body.appendChild(msg);
          setTimeout(function () { self.finishTask(s); }, 800);
        }
      });
      grid.appendChild(card);
    });
    body.appendChild(grid);
  };

  /* ---------- finish ---------- */
  Game.prototype.finish = function () {
    var self = this, f = this.data.finish || {};
    this.dusk = true;
    var L = this.layer; L.innerHTML = ""; L.style.display = "block";
    var card = el("div", "sg-finish");
    card.innerHTML =
      '<div class="sg-crescent" aria-hidden="true"></div>' +
      '<h3>' + esc(f.title || "Well done") + "</h3>" +
      '<p class="sg-finish-text">' + esc(f.text || "") + "</p>" +
      (f.teach ? '<p class="sg-finish-teach">' + esc(f.teach) + "</p>" : "") +
      '<div class="sg-finish-row">' +
      '<button class="sg-btn sg-again">Play again</button>' +
      '<button class="sg-btn sg-ghost sg-meet">Meet the people</button>' +
      "</div>";
    L.appendChild(card);
    this.speaker.say((f.title ? f.title + ". " : "") + (f.teach || f.text || ""), { g: "m", rate: 0.95 });
    card.querySelector(".sg-again").addEventListener("click", function () { self.dusk = false; self.closeTask(); self.reset(); self.start(); });
    card.querySelector(".sg-meet").addEventListener("click", function () {
      var target = document.getElementById("people") || document.querySelector(".people, #ask");
      self.closeTask();
      if (target && target.scrollIntoView) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  Game.prototype.showToast = function (text) {
    var toast = this.toast; toast.textContent = text; toast.style.display = "block";
    toast.classList.remove("in"); void toast.offsetWidth; toast.classList.add("in");
    clearTimeout(this._toastT);
    this._toastT = setTimeout(function () { toast.style.display = "none"; }, 4200);
  };

  /* ---------- render ---------- */
  Game.prototype.render = function (t) {
    var ctx = this.ctx, d = this.data;
    ctx.clearRect(0, 0, this.W, this.H);

    // ground
    for (var y = 0; y < this.rows; y++) for (var x = 0; x < this.cols; x++) {
      var g = this.groundSeed[y * this.cols + x] || 0;
      this.blit(this.imgs.tiles, T.grass[g], x * DRAW, y * DRAW);
    }
    // sand plaza (9-slice)
    var p = d.plaza;
    if (p) {
      for (var sy = 0; sy < p.h; sy++) for (var sx = 0; sx < p.w; sx++) {
        var idx = T.sand.c;
        var ex = sx === 0 ? "l" : sx === p.w - 1 ? "r" : "";
        var ey = sy === 0 ? "t" : sy === p.h - 1 ? "b" : "";
        if (ey === "t" && ex === "l") idx = T.sand.tl; else if (ey === "t" && ex === "r") idx = T.sand.tr;
        else if (ey === "b" && ex === "l") idx = T.sand.bl; else if (ey === "b" && ex === "r") idx = T.sand.br;
        else if (ey === "t") idx = T.sand.t; else if (ey === "b") idx = T.sand.b;
        else if (ex === "l") idx = T.sand.l; else if (ex === "r") idx = T.sand.r;
        this.blit(this.imgs.tiles, idx, (p.x + sx) * DRAW, (p.y + sy) * DRAW);
      }
    }

    // lanterns (behind sprites)
    this.drawLanterns(t);

    // build draw list (static sprites + custom stations + characters), sort by baseY
    var list = this.sprites.slice(0);
    var self = this;
    // custom station props
    (d.stations || []).forEach(function (s) {
      list.push({ custom: s.prop, cx: s.x, cy: s.y, baseY: s.y * DRAW + DRAW, station: s });
    });
    // helpers + guests
    (d.stations || []).forEach(function (s) { if (s.helper) list.push({ charSprite: s.helper.sprite, cx: s.helper.x, cy: s.helper.y, baseY: s.helper.y * DRAW + DRAW, bob: true }); });
    (d.guests || []).forEach(function (g) { list.push({ charSprite: g.sprite, cx: g.x, cy: g.y, baseY: g.y * DRAW + DRAW, seated: true }); });
    // player
    list.push({ player: true, baseY: this.py + DRAW * 0.3 });

    list.sort(function (a, b) { return a.baseY - b.baseY; });
    list.forEach(function (o) {
      if (o.img) { ctx.drawImage(o.img, o.sx, o.sy, o.sw, o.sh, o.x, o.y, o.w, o.h); }
      else if (o.custom) self.drawStationProp(o);
      else if (o.charSprite) self.drawChar(o.charSprite, o.cx * DRAW + DRAW / 2, o.cy * DRAW + DRAW * 0.7, { bob: o.bob, seated: o.seated, t: t });
      else if (o.player) self.drawPlayer(t);
    });

    // station highlight rings for active/unlocked
    (d.stations || []).forEach(function (s) {
      if (self.done[s.id]) return;
      var locked = self.isLocked(s);
      self.drawRing(s.x * DRAW + DRAW / 2, s.y * DRAW + DRAW * 0.92, locked, t);
    });

    // dusk overlay after finish
    if (this.dusk) { ctx.fillStyle = "rgba(20,18,45,0.34)"; ctx.fillRect(0, 0, this.W, this.H); }
    // gentle vignette
    this.vignette();
  };

  Game.prototype.blit = function (img, index, dx, dy) {
    this.ctx.drawImage(img, (index % 12) * SRC, ((index / 12) | 0) * SRC, SRC, SRC, dx, dy, DRAW, DRAW);
  };

  Game.prototype.drawChar = function (sprite, cx, footY, opt) {
    opt = opt || {};
    var ctx = this.ctx, size = DRAW * 0.92;
    var bob = 0;
    if (opt.bob && !reduceMotion) bob = Math.sin((opt.t || 0) / 380) * 1.5;
    var dx = cx - size / 2, dy = footY - size + bob + (opt.seated ? size * 0.18 : 0);
    // shadow
    ctx.save(); ctx.globalAlpha = 0.22; ctx.fillStyle = "#000";
    ctx.beginPath(); ctx.ellipse(cx, footY - 2, size * 0.28, size * 0.12, 0, 0, 7); ctx.fill(); ctx.restore();
    if (opt.seated) { ctx.save(); ctx.beginPath(); ctx.rect(dx, dy, size, size * 0.82); ctx.clip(); }
    ctx.drawImage(this.imgs.chars, sprite[0] * CSTEP, sprite[1] * CSTEP, SRC, SRC, dx, dy, size, size);
    if (opt.seated) ctx.restore();
  };

  Game.prototype.drawPlayer = function (t) {
    var ctx = this.ctx, size = DRAW * 0.96, sp = this.data.player.sprite;
    var bob = this.moving && !reduceMotion ? Math.abs(Math.sin(this.walkT)) * 3 : 0;
    var cx = this.px, footY = this.py + DRAW * 0.28;
    var dx = cx - size / 2, dy = footY - size - bob;
    ctx.save(); ctx.globalAlpha = 0.25; ctx.fillStyle = "#000";
    ctx.beginPath(); ctx.ellipse(cx, footY - 2, size * 0.3, size * 0.13, 0, 0, 7); ctx.fill(); ctx.restore();
    ctx.save();
    if (this.face < 0) { ctx.translate(cx * 2, 0); ctx.scale(-1, 1); }
    var ddx = this.face < 0 ? -(dx + size) : dx;
    ctx.drawImage(this.imgs.chars, sp[0] * CSTEP, sp[1] * CSTEP, SRC, SRC, ddx, dy, size, size);
    ctx.restore();
  };

  Game.prototype.drawStationProp = function (o) {
    var ctx = this.ctx, x = o.cx * DRAW, y = o.cy * DRAW;
    if (o.custom === "oven") {
      // tandoor-style oven with warm glow
      ctx.save();
      ctx.fillStyle = "#6b4a33"; roundRect(ctx, x + 8, y + 14, DRAW - 16, DRAW - 18, 6); ctx.fill();
      ctx.fillStyle = "#8a5a3c"; roundRect(ctx, x + 11, y + 12, DRAW - 22, 14, 5); ctx.fill();
      var gy = y + DRAW - 16;
      var grd = ctx.createRadialGradient(x + DRAW / 2, gy, 2, x + DRAW / 2, gy, 16);
      grd.addColorStop(0, "#ffd27a"); grd.addColorStop(0.5, "#ff8a3c"); grd.addColorStop(1, "rgba(255,120,40,0)");
      ctx.fillStyle = grd; ctx.beginPath(); ctx.ellipse(x + DRAW / 2, gy, 13, 9, 0, 0, 7); ctx.fill();
      ctx.restore();
    } else if (o.custom === "mat") {
      // woven meal mat with plates
      ctx.save();
      ctx.fillStyle = "#c98a4b"; roundRect(ctx, x + 2, y + 8, DRAW - 4, DRAW - 12, 8); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.35)"; ctx.lineWidth = 1;
      for (var i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(x + 2, y + 8 + i * (DRAW - 12) / 4); ctx.lineTo(x + DRAW - 2, y + 8 + i * (DRAW - 12) / 4); ctx.stroke(); }
      ctx.fillStyle = "#fff6e6";
      [[14, 18], [34, 18], [14, 34], [34, 34]].forEach(function (pp) { ctx.beginPath(); ctx.arc(x + pp[0], y + pp[1], 5, 0, 7); ctx.fill(); });
      ctx.restore();
    } else {
      var idx = o.custom === "barrel" ? T.barrel : o.custom === "bucket" ? T.bucket : T.pan;
      this.blit(this.imgs.tiles, idx, x, y);
    }
  };

  Game.prototype.drawRing = function (cx, cy, locked, t) {
    if (this._near && !locked) { /* still show */ }
    var ctx = this.ctx;
    var pulse = reduceMotion ? 0.6 : (0.5 + 0.5 * Math.sin(t / 420));
    ctx.save();
    ctx.globalAlpha = 0.35 + pulse * 0.4;
    ctx.strokeStyle = locked ? "rgba(255,255,255,0.5)" : (this.data.accent || "#1f9d57");
    ctx.lineWidth = 3;
    ctx.setLineDash(locked ? [4, 5] : []);
    ctx.beginPath(); ctx.ellipse(cx, cy, DRAW * 0.42, DRAW * 0.2, 0, 0, 7); ctx.stroke();
    ctx.restore();
    if (!locked) {
      ctx.save(); ctx.globalAlpha = 0.5 + pulse * 0.5; ctx.fillStyle = this.data.accent || "#1f9d57";
      var ay = cy - DRAW * 0.85 - pulse * 3;
      ctx.beginPath(); ctx.moveTo(cx, ay + 8); ctx.lineTo(cx - 5, ay); ctx.lineTo(cx + 5, ay); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
  };

  Game.prototype.drawLanterns = function (t) {
    var ctx = this.ctx, self = this;
    (this.data.lanterns || []).forEach(function (ln) {
      var x1 = ln.from[0] * DRAW + DRAW / 2, y1 = ln.from[1] * DRAW + 4;
      var x2 = ln.to[0] * DRAW + DRAW / 2, y2 = ln.to[1] * DRAW + 4;
      ctx.save();
      ctx.strokeStyle = "rgba(40,30,20,0.55)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x1, y1);
      var mx = (x1 + x2) / 2, my = Math.max(y1, y2) + 26;
      ctx.quadraticCurveTo(mx, my, x2, y2); ctx.stroke();
      var n = 7;
      for (var i = 1; i < n; i++) {
        var u = i / n;
        var bx = (1 - u) * (1 - u) * x1 + 2 * (1 - u) * u * mx + u * u * x2;
        var by = (1 - u) * (1 - u) * y1 + 2 * (1 - u) * u * my + u * u * y2;
        var sway = reduceMotion ? 0 : Math.sin(t / 500 + i) * 1.5;
        ctx.fillStyle = i % 2 ? "#ffcf6b" : "#ff9d4d";
        ctx.beginPath(); ctx.arc(bx + sway, by + 6, 4.5, 0, 7); ctx.fill();
        ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.arc(bx + sway, by + 6, 8, 0, 7); ctx.fillStyle = "rgba(255,190,90,0.25)"; ctx.fill(); ctx.globalAlpha = 1;
      }
      ctx.restore();
    });
  };

  Game.prototype.vignette = function () {
    var ctx = this.ctx;
    var g = ctx.createRadialGradient(this.W / 2, this.H / 2, this.H * 0.35, this.W / 2, this.H / 2, this.H * 0.85);
    g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(20,15,10,0.28)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, this.W, this.H);
  };

  /* ---------- little inline icons ---------- */
  function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function arrow(dir) {
    var d = { up: "M12 7l5 7H7z", down: "M12 17l-5-7h10z", left: "M7 12l7-5v10z", right: "M17 12l-7 5V7z" }[dir];
    return '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="' + d + '" fill="currentColor"/></svg>';
  }
  function iconSound() { return '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8a5 5 0 010 8" fill="none" stroke="currentColor" stroke-width="2"/></svg>'; }
  function iconMute() { return '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="2"/></svg>'; }

  /* =====================================================
     Public mount
     ===================================================== */
  var current = null;
  window.SaylavyGame = {
    has: function (key) { return !!(window.SAYLAVY_GAME && window.SAYLAVY_GAME[key]); },
    mount: function (host, key) {
      var data = window.SAYLAVY_GAME && window.SAYLAVY_GAME[key];
      if (!host || !data) return null;
      host.innerHTML = '<div class="sg-loading">Loading the game...</div>';
      return loadImages().then(function (imgs) {
        if (current && current.stop) current.stop();
        current = new Game(host, data, imgs);
        return current;
      }).catch(function (e) {
        host.innerHTML = '<p class="sg-loading">The game could not load its art. ' + esc(e.message) + "</p>";
      });
    }
  };
})();
