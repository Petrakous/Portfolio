import * as THREE from "three";
import { GLTFLoader } from "./loaders/GLTFLoader.js";

const mount = document.querySelector("[data-avatar-webgl]");

if (mount && !mount.dataset.initialized) {
  mount.dataset.initialized = "true";
  const stage = mount.closest(".avatar-stage");
  const status = mount.querySelector("[data-avatar-status]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const compact = window.matchMedia("(max-width: 760px)").matches;

  try {
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !compact, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 1.35 : 1.8));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute("aria-hidden", "true");
    mount.prepend(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(31, 1, 0.05, 100);
    camera.position.set(0, 1.08, reducedMotion ? 3.8 : 10.5);

    const key = new THREE.DirectionalLight(0xfff4e8, 2.5);
    key.position.set(-2.5, 4, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xff2020, 5.2);
    rim.position.set(3, 2.2, -2);
    scene.add(rim);
    scene.add(new THREE.HemisphereLight(0xe8e3dc, 0x260000, 1.35));

    const root = new THREE.Group();
    scene.add(root);

    let model = null;
    let pointCloud = null;
    let pointState = null;
    let currentMode = "neutral";
    let currentView = "overview";
    let pointerX = 0;
    let pointerY = 0;
    let introStart = performance.now();
    let visible = true;
    let disposed = false;
    const bones = new Map();
    const baseRotations = new Map();
    const clock = new THREE.Clock();
    const scratch = new THREE.Vector3();
    const inverseRoot = new THREE.Matrix4();
    const targetQuaternion = new THREE.Quaternion();
    const deltaQuaternion = new THREE.Quaternion();

    const gaussianTexture = (() => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 64;
      const context = canvas.getContext("2d");
      const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 31);
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.22, "rgba(255,255,255,.94)");
      gradient.addColorStop(0.58, "rgba(255,255,255,.34)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(canvas);
    })();

    function resize() {
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    function makeSplatProxy(skinnedMesh) {
      const source = skinnedMesh.geometry.getAttribute("position");
      if (!source) return;
      const count = Math.min(compact ? 4800 : 9200, Math.max(source.count * 2, 3200));
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const indices = new Uint32Array(count);
      const offsets = new Float32Array(count * 3);

      for (let index = 0; index < count; index += 1) {
        const sourceIndex = (index * 47) % source.count;
        indices[index] = sourceIndex;
        const duplicate = Math.floor(index / source.count);
        const jitter = duplicate ? 0.008 : 0;
        offsets[index * 3] = Math.sin(index * 12.9898) * jitter;
        offsets[index * 3 + 1] = Math.cos(index * 4.1414) * jitter;
        offsets[index * 3 + 2] = Math.sin(index * 7.318) * jitter;
        const redMix = (index % 11) < 4;
        colors[index * 3] = redMix ? 1 : 0.9;
        colors[index * 3 + 1] = redMix ? 0.08 : 0.86;
        colors[index * 3 + 2] = redMix ? 0.06 : 0.8;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      const material = new THREE.PointsMaterial({
        size: compact ? 0.038 : 0.032,
        map: gaussianTexture,
        alphaMap: gaussianTexture,
        transparent: true,
        opacity: 0.92,
        alphaTest: 0.025,
        depthWrite: false,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      });
      pointCloud = new THREE.Points(geometry, material);
      pointCloud.frustumCulled = false;
      root.add(pointCloud);
      pointState = { source, skinnedMesh, positions, indices, offsets, attribute: geometry.getAttribute("position") };
    }

    function updateSplatProxy() {
      if (!pointState || !pointCloud) return;
      const { source, skinnedMesh, positions, indices, offsets, attribute } = pointState;
      root.updateMatrixWorld(true);
      skinnedMesh.updateMatrixWorld(true);
      inverseRoot.copy(root.matrixWorld).invert();

      for (let index = 0; index < indices.length; index += 1) {
        const sourceIndex = indices[index];
        scratch.fromBufferAttribute(source, sourceIndex);
        if (skinnedMesh.isSkinnedMesh) skinnedMesh.applyBoneTransform(sourceIndex, scratch);
        scratch.applyMatrix4(skinnedMesh.matrixWorld).applyMatrix4(inverseRoot);
        positions[index * 3] = scratch.x + offsets[index * 3];
        positions[index * 3 + 1] = scratch.y + offsets[index * 3 + 1];
        positions[index * 3 + 2] = scratch.z + offsets[index * 3 + 2];
      }
      attribute.needsUpdate = true;
      pointCloud.material.size = currentView === "lab" ? (compact ? 0.025 : 0.021) : (compact ? 0.038 : 0.032);
      pointCloud.material.opacity = currentView === "lab" ? 0.78 : 0.92;
    }

    function rememberBone(name) {
      const bone = model?.getObjectByName(name);
      if (!bone) return;
      bones.set(name, bone);
      baseRotations.set(name, bone.quaternion.clone());
    }

    function poseBone(name, x = 0, y = 0, z = 0, speed = 0.09) {
      const bone = bones.get(name);
      const base = baseRotations.get(name);
      if (!bone || !base) return;
      deltaQuaternion.setFromEuler(new THREE.Euler(x, y, z, "XYZ"));
      targetQuaternion.copy(base).multiply(deltaQuaternion);
      bone.quaternion.slerp(targetQuaternion, speed);
    }

    function updatePose(time) {
      const breathe = Math.sin(time * 0.0017) * 0.028;
      const presentingRight = currentMode === "projects";
      const presentingLeft = currentMode === "research";
      poseBone("Skeleton_arm_joint_R", presentingRight ? -1.12 : 0, presentingRight ? -0.12 : 0, 0, 0.075);
      poseBone("Skeleton_arm_joint_R__2_", presentingRight ? -0.48 : 0, 0, presentingRight ? 0.16 : 0, 0.08);
      poseBone("Skeleton_arm_joint_L__4_", presentingLeft ? 1.12 : 0, presentingLeft ? 0.12 : 0, 0, 0.075);
      poseBone("Skeleton_arm_joint_L__3_", presentingLeft ? 0.48 : 0, 0, presentingLeft ? -0.16 : 0, 0.08);
      poseBone("Skeleton_neck_joint_1", currentMode === "knowledge" ? pointerY * 0.16 : breathe, currentMode === "knowledge" ? pointerX * 0.28 : pointerX * 0.05, 0, 0.06);
      poseBone("Skeleton_torso_joint_2", currentMode === "about" ? -0.06 : breathe * 0.4, pointerX * 0.025, 0, 0.04);
    }

    const loader = new GLTFLoader();
    loader.load(
      "/avatar/models/CesiumMan.glb",
      (gltf) => {
        model = gltf.scene;
        const bounds = new THREE.Box3().setFromObject(model);
        const size = bounds.getSize(new THREE.Vector3());
        const center = bounds.getCenter(new THREE.Vector3());
        const scale = 2.75 / Math.max(size.y, 0.01);
        model.scale.setScalar(scale);
        model.position.set(-center.x * scale, -bounds.min.y * scale - 1.35, -center.z * scale);
        root.add(model);

        let sourceMesh = null;
        model.traverse((object) => {
          if (!object.isMesh) return;
          if (object.isSkinnedMesh && !sourceMesh) sourceMesh = object;
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => {
            material.transparent = true;
            material.opacity = 0.16;
            material.depthWrite = false;
            material.roughness = 0.72;
            material.metalness = 0.05;
          });
        });

        [
          "Skeleton_arm_joint_R",
          "Skeleton_arm_joint_R__2_",
          "Skeleton_arm_joint_L__4_",
          "Skeleton_arm_joint_L__3_",
          "Skeleton_neck_joint_1",
          "Skeleton_torso_joint_2",
        ].forEach(rememberBone);

        if (sourceMesh?.isSkinnedMesh) makeSplatProxy(sourceMesh);
        stage?.classList.add("is-webgl-ready");
        if (status) status.textContent = "3D SPLAT PROXY · READY";
        introStart = performance.now();
      },
      (event) => {
        if (!status || !event.total) return;
        status.textContent = `LOADING 3D AVATAR · ${Math.round((event.loaded / event.total) * 100)}%`;
      },
      () => {
        stage?.classList.add("avatar-load-failed");
        if (status) status.textContent = "3D UNAVAILABLE · ACCESSIBLE FALLBACK ACTIVE";
      },
    );

    function animate(time) {
      if (disposed) return;
      requestAnimationFrame(animate);
      if (!visible) return;
      const delta = Math.min(clock.getDelta(), 0.05);
      void delta;

      if (model) {
        updatePose(time);
        scene.updateMatrixWorld(true);
        updateSplatProxy();
        const intro = reducedMotion ? 1 : Math.min((time - introStart) / 3200, 1);
        const eased = 1 - Math.pow(1 - intro, 4);
        camera.position.z = THREE.MathUtils.lerp(10.5, compact ? 4.15 : 3.65, eased);
        camera.position.y = THREE.MathUtils.lerp(1.35, 1.08, eased);
        root.rotation.y = (1 - eased) * (-Math.PI * 2.1) + Math.sin(time * 0.00018) * 0.13;
        root.rotation.x = pointerY * 0.025;
        root.position.x = pointerX * 0.05;
      }

      camera.lookAt(0, 0.08, 0);
      renderer.render(scene, camera);
    }

    window.addEventListener("avatar-mode", (event) => { currentMode = event.detail || "neutral"; });
    window.addEventListener("avatar-view", (event) => { currentView = event.detail || "overview"; });
    stage?.addEventListener("pointermove", (event) => {
      const rect = stage.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    });
    document.addEventListener("visibilitychange", () => { visible = !document.hidden; });
    renderer.domElement.addEventListener("webglcontextlost", () => {
      stage?.classList.remove("is-webgl-ready");
      stage?.classList.add("avatar-load-failed");
    });

    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();
    requestAnimationFrame(animate);

    window.addEventListener("pagehide", () => {
      disposed = true;
      observer.disconnect();
      renderer.dispose();
      gaussianTexture.dispose();
    }, { once: true });
  } catch {
    stage?.classList.add("avatar-load-failed");
    if (status) status.textContent = "WEBGL UNAVAILABLE · ACCESSIBLE FALLBACK ACTIVE";
  }
}
