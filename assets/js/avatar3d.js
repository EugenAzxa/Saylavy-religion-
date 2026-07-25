/* =========================================================
   Saylavy - real 3D avatar engine (Three.js)

   Self-diagnosing: as soon as it mounts it renders a spinning
   marker and a status line, so you can see WebGL is alive, then
   loads the model over it. While the teacher speaks it opens its
   mouth (or nods, if the model has no mouth rig). Drag to look.

   Loaded as an ES module; Three.js comes from the page importmap.
   window.SaylavyAvatar3D.mount(host, opts) -> Promise<api>.
   ========================================================= */
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { KTX2Loader } from "three/addons/loaders/KTX2Loader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";

const CDN = "https://unpkg.com/three@0.160.0/examples/jsm/libs/";
const MOUTH_MORPHS = ["jawOpen", "mouthOpen", "viseme_aa", "viseme_O", "viseme_E", "mouthFunnel"];
const BLINK_MORPHS = ["eyeBlinkLeft", "eyeBlinkRight", "eyesClosed"];

window.SaylavyAvatar3D = {
  mount(host, opts) {
    opts = opts || {};
    return new Promise((resolve, reject) => {
      let disposed = false, raf = null;
      host.innerHTML = "";

      // status line so we can see exactly how far it gets
      const status = document.createElement("div");
      status.className = "av3d-status";
      host.appendChild(status);
      const setStatus = (t) => { if (!disposed) status.textContent = t; };
      setStatus("Starting 3D...");

      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      } catch (e) { setStatus("WebGL is not available on this device."); reject(e); return; }
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      const size = () => ({ w: host.clientWidth || 380, h: host.clientHeight || 470 });
      let { w, h } = size();
      renderer.setSize(w, h);
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(30, w / h, 0.01, 100);
      camera.position.set(0, 0, 1.4);

      scene.add(new THREE.HemisphereLight(0xfff2d8, 0x2a2438, 1.2));
      const key = new THREE.DirectionalLight(0xffe6bf, 2.2); key.position.set(1.4, 2.0, 1.8); scene.add(key);
      const rim = new THREE.DirectionalLight(0x9fb4ff, 0.8); rim.position.set(-1.8, 1.2, -1.2); scene.add(rim);
      const fill = new THREE.DirectionalLight(0xffffff, 0.6); fill.position.set(0, 0.6, 2.2); scene.add(fill);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 0, 0);
      controls.enablePan = false;
      controls.enableZoom = false;
      controls.enableDamping = true;
      controls.rotateSpeed = 0.5;
      controls.update();

      // placeholder marker: proves WebGL + render loop are alive immediately
      let placeholder = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.42, 1),
        new THREE.MeshStandardMaterial({ color: 0xd9a441, roughness: 0.45, metalness: 0.1, flatShading: true })
      );
      scene.add(placeholder);

      let model = null, mouthMeshes = [], blinkMeshes = [];
      let talking = false, mouthTarget = 0, mouth = 0, blink = 0, blinkT = 2 + Math.random() * 3;

      function setMorphs(list, v) { for (let i = 0; i < list.length; i++) list[i].mesh.morphTargetInfluences[list[i].index] = v; }
      const clock = new THREE.Clock();
      function loop() {
        if (disposed) return;
        const dt = Math.min(0.05, clock.getDelta()), t = clock.elapsedTime;
        if (placeholder) { placeholder.rotation.y += dt * 0.9; placeholder.rotation.x += dt * 0.35; }
        if (model) {
          model.position.y = (model.userData.baseY || 0) + Math.sin(t * 1.2) * 0.004;
          model.rotation.y = Math.sin(t * 0.35) * 0.05;
          blinkT -= dt; if (blinkT <= 0) { blink = 1; blinkT = 2.5 + Math.random() * 3.5; }
          blink += (0 - blink) * Math.min(1, dt * 12);
          if (blinkMeshes.length) setMorphs(blinkMeshes, blink > 0.02 ? Math.min(1, blink * 1.6) : 0);
          if (!talking) mouthTarget += (0 - mouthTarget) * Math.min(1, dt * 8);
          mouth += (mouthTarget - mouth) * Math.min(1, dt * 14);
          if (mouthMeshes.length) setMorphs(mouthMeshes, mouth);
          else model.rotation.x = Math.sin(t * 9) * mouth * 0.05;
        }
        controls.update();
        renderer.render(scene, camera);
        raf = requestAnimationFrame(loop);
      }
      raf = requestAnimationFrame(loop);
      setStatus("3D ready. Loading the model...");

      const loader = new GLTFLoader();
      try {
        loader.setKTX2Loader(new KTX2Loader().setTranscoderPath(CDN + "basis/").detectSupport(renderer));
        loader.setMeshoptDecoder(MeshoptDecoder);
        loader.setDRACOLoader(new DRACOLoader().setDecoderPath(CDN + "draco/"));
      } catch (e) { /* decoders optional */ }

      function onResize() {
        const s = size(); if (s.w === w && s.h === h) return;
        w = s.w; h = s.h; renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix();
      }
      window.addEventListener("resize", onResize);

      function destroy() {
        disposed = true; if (raf) cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
        try { controls.dispose(); renderer.dispose(); } catch (e) {}
        scene.traverse((o) => { if (o.isMesh) { o.geometry && o.geometry.dispose(); const m = o.material; if (m) (Array.isArray(m) ? m : [m]).forEach((x) => x.dispose && x.dispose()); } });
        host.innerHTML = "";
      }

      const api = {
        startTalk() { talking = true; },
        stopTalk() { talking = false; mouthTarget = 0; },
        tick() { if (talking) mouthTarget = 0.3 + Math.random() * 0.45; },
        destroy
      };

      loader.load(
        opts.glb,
        (gltf) => {
          if (disposed) return;
          model = gltf.scene;
          model.traverse((o) => { if (o.isMesh) o.frustumCulled = false; });
          scene.add(model);
          if (placeholder) { scene.remove(placeholder); placeholder.geometry.dispose(); placeholder.material.dispose(); placeholder = null; }

          mouthMeshes = [];
          blinkMeshes = [];
          model.traverse((o) => {
            if (o.isMesh && o.morphTargetDictionary && o.morphTargetInfluences) {
              MOUTH_MORPHS.forEach((n) => { const i = o.morphTargetDictionary[n]; if (i !== undefined) mouthMeshes.push({ mesh: o, index: i }); });
              BLINK_MORPHS.forEach((n) => { const i = o.morphTargetDictionary[n]; if (i !== undefined) blinkMeshes.push({ mesh: o, index: i }); });
            }
          });

          // frame the face from the model's real bounds
          const box = new THREE.Box3().setFromObject(model);
          const c = box.getCenter(new THREE.Vector3());
          const sz = box.getSize(new THREE.Vector3());
          model.userData.baseY = model.position.y;
          const focusY = box.max.y - sz.y * 0.18;
          const dist = Math.max(sz.x, sz.y * 0.55) * 1.2 + 0.2;
          controls.target.set(c.x, focusY, c.z);
          camera.position.set(c.x, focusY, c.z + dist);
          camera.near = Math.max(0.01, dist / 40); camera.far = dist * 40; camera.updateProjectionMatrix();
          controls.update();

          setStatus(mouthMeshes.length ? "" : "");
          status.remove();
          resolve(api);
        },
        (xhr) => { if (xhr && xhr.total) setStatus("Loading the model... " + Math.round((xhr.loaded / xhr.total) * 100) + "%"); },
        (err) => {
          const reason = (err && (err.message || err.type)) || "network or format error";
          setStatus("Model could not load: " + reason);
          reject(new Error(reason));
        }
      );
    });
  }
};
