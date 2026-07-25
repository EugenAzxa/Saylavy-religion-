/* =========================================================
   Saylavy - real 3D avatar engine (Three.js + Ready Player Me)

   Loads a 3D avatar, frames the head, and gives it life: it
   breathes, blinks, and glances around, and while the teacher
   speaks it opens its mouth in a natural talking rhythm. You can
   drag to look around it.

   Loaded as an ES module; Three.js comes from the importmap in
   the page. Exposes window.SaylavyAvatar3D.mount(host, opts) which
   resolves to { startTalk, stopTalk, tick, destroy } or rejects so
   the UI can fall back to the living portrait.
   ========================================================= */
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const MOUTH_MORPHS = ["jawOpen", "mouthOpen", "viseme_aa", "viseme_O", "viseme_E"];
const BLINK_MORPHS = ["eyeBlinkLeft", "eyeBlinkRight", "eyesClosed"];

window.SaylavyAvatar3D = {
  mount(host, opts) {
    opts = opts || {};
    return new Promise((resolve, reject) => {
      let disposed = false;
      host.innerHTML = "";

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      const size = () => ({ w: host.clientWidth || 400, h: host.clientHeight || 480 });
      let { w, h } = size();
      renderer.setSize(w, h);
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(26, w / h, 0.1, 100);
      camera.position.set(0, 1.55, 0.72);

      // warm candlelit lighting to match the site
      scene.add(new THREE.HemisphereLight(0xfff2d8, 0x2a2438, 1.1));
      const key = new THREE.DirectionalLight(0xffe6bf, 2.0); key.position.set(1.4, 2.2, 1.6); scene.add(key);
      const rim = new THREE.DirectionalLight(0x9fb4ff, 0.7); rim.position.set(-1.8, 1.4, -1.2); scene.add(rim);
      const fill = new THREE.DirectionalLight(0xffffff, 0.5); fill.position.set(0, 1.2, 2); scene.add(fill);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 1.5, 0);
      controls.enablePan = false;
      controls.enableZoom = false;
      controls.minPolarAngle = Math.PI * 0.34;
      controls.maxPolarAngle = Math.PI * 0.60;
      controls.minAzimuthAngle = -0.6;
      controls.maxAzimuthAngle = 0.6;
      controls.enableDamping = true;
      controls.rotateSpeed = 0.5;
      controls.update();

      let mouthMeshes = [], blinkMeshes = [], head = null;
      let talking = false, mouthTarget = 0, mouth = 0, blinkT = 2 + Math.random() * 3, blink = 0;

      function collectMorph(root, names) {
        const out = [];
        root.traverse((o) => {
          if (o.isMesh && o.morphTargetDictionary && o.morphTargetInfluences) {
            names.forEach((n) => {
              const i = o.morphTargetDictionary[n];
              if (i !== undefined) out.push({ mesh: o, index: i });
            });
          }
        });
        return out;
      }

      const loader = new GLTFLoader();
      const to = setTimeout(() => { if (!disposed && !head) { cleanup(); reject(new Error("avatar load timed out")); } }, 20000);

      loader.load(opts.glb, (gltf) => {
        if (disposed) return;
        clearTimeout(to);
        const model = gltf.scene;
        model.traverse((o) => { if (o.isMesh) { o.frustumCulled = false; } if (o.name && /Head/i.test(o.name)) head = o; });
        // frame the head: RPM avatars are ~1.65m tall, head near y=1.62
        scene.add(model);
        mouthMeshes = collectMorph(model, MOUTH_MORPHS);
        blinkMeshes = collectMorph(model, BLINK_MORPHS);

        const clock = new THREE.Clock();
        function frame() {
          if (disposed) return;
          const dt = Math.min(0.05, clock.getDelta());
          const t = clock.elapsedTime;
          // idle: gentle breathing sway
          model.position.y = Math.sin(t * 1.2) * 0.004;
          model.rotation.y = Math.sin(t * 0.35) * 0.05;
          // blink
          blinkT -= dt;
          if (blinkT <= 0) { blink = 1; blinkT = 2.5 + Math.random() * 3.5; }
          blink += (0 - blink) * Math.min(1, dt * 12);
          setMorphs(blinkMeshes, blink > 0.02 ? Math.min(1, blink * 1.6) : 0);
          // mouth
          if (!talking) mouthTarget += (0 - mouthTarget) * Math.min(1, dt * 8);
          mouth += (mouthTarget - mouth) * Math.min(1, dt * 14);
          setMorphs(mouthMeshes, mouth);
          controls.update();
          renderer.render(scene, camera);
          raf = requestAnimationFrame(frame);
        }
        let raf = requestAnimationFrame(frame);

        function setMorphs(list, v) {
          for (let i = 0; i < list.length; i++) list[i].mesh.morphTargetInfluences[list[i].index] = v;
        }

        function onResize() {
          const s = size(); if (s.w === w && s.h === h) return;
          w = s.w; h = s.h; renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix();
        }
        window.addEventListener("resize", onResize);

        function cleanupFull() {
          disposed = true; cancelAnimationFrame(raf);
          window.removeEventListener("resize", onResize);
          controls.dispose(); renderer.dispose();
          if (renderer.domElement && renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
          scene.traverse((o) => { if (o.isMesh) { o.geometry && o.geometry.dispose(); const m = o.material; if (m) { (Array.isArray(m) ? m : [m]).forEach((x) => x.dispose && x.dispose()); } } });
        }

        resolve({
          startTalk() { talking = true; },
          stopTalk() { talking = false; mouthTarget = 0; },
          tick() { if (talking) mouthTarget = 0.28 + Math.random() * 0.45; },
          destroy() { cleanupFull(); host.innerHTML = ""; }
        });
      }, undefined, (err) => { clearTimeout(to); cleanup(); reject(err || new Error("avatar failed to load")); });

      function cleanup() {
        disposed = true;
        try { controls.dispose(); renderer.dispose(); } catch (e) {}
        if (renderer.domElement && renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    });
  }
};
