import * as THREE from "three";
import { GLTFLoader } from "./loaders/GLTFLoader.js";
import { viewerConfig } from "./viewer-config.js";

const mount = document.querySelector("[data-avatar-webgl]");

if (mount && !mount.dataset.initialized) {
  mount.dataset.initialized = "true";
  const stage = mount.closest(".avatar-stage");
  const status = mount.querySelector("[data-avatar-status]");
  const labelElements = Object.fromEntries(
    Object.keys(viewerConfig.labels).map((id) => [id, stage?.querySelector(`.hotspot-${id}`)]),
  );
  const signalPanel = document.querySelector(".signal-card");
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
    let closeCameraZ = compact ? 6.1 : 5.7;
    let farCameraZ = closeCameraZ + 7;
    camera.position.set(0, reducedMotion ? 0.18 : 0.55, reducedMotion ? closeCameraZ : farCameraZ);

    const key = new THREE.DirectionalLight(0xfff4e8, 2.5);
    key.position.set(-2.5, 4, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xff2020, 5.2);
    rim.position.set(3, 2.2, -2);
    scene.add(rim);
    scene.add(new THREE.HemisphereLight(0xe8e3dc, 0x260000, 1.35));

    const root = new THREE.Group();
    scene.add(root);

    const floorDisc = new THREE.Mesh(
      new THREE.CircleGeometry(4.6, 72),
      new THREE.MeshBasicMaterial({ color: 0x090707, transparent: true, opacity: 0.7, depthWrite: false }),
    );
    floorDisc.rotation.x = -Math.PI * 0.5;
    floorDisc.position.y = -1.205;
    scene.add(floorDisc);

    const floorGrid = new THREE.GridHelper(18, 36, 0x7a2020, 0x251515);
    floorGrid.position.y = -1.2;
    floorGrid.material.transparent = true;
    floorGrid.material.opacity = 0.34;
    scene.add(floorGrid);

    let model = null;
    let pointCloud = null;
    let pointState = null;
    let currentMode = "neutral";
    let currentView = "overview";
    let pointerX = 0;
    let pointerY = 0;
    let orbitAzimuth = 0;
    let targetAzimuth = 0;
    let orbitElevation = viewerConfig.orbit.initialElevation;
    let targetElevation = viewerConfig.orbit.initialElevation;
    let orbitDistance = closeCameraZ;
    let targetDistance = closeCameraZ;
    let dragging = false;
    let dragPointerId = null;
    let dragX = 0;
    let dragY = 0;
    let resizeFrame = 0;
    let renderedWidth = 0;
    let renderedHeight = 0;
    let introStart = performance.now();
    let introComplete = false;
    let visible = true;
    let disposed = false;
    const bones = new Map();
    const baseRotations = new Map();
    const clock = new THREE.Clock();
    const scratch = new THREE.Vector3();
    const anchorScratch = new THREE.Vector3();
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
      if (width === renderedWidth && height === renderedHeight) return;
      renderedWidth = width;
      renderedHeight = height;
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
      const presentingScreenRight = currentMode === "work";
      const presentingScreenLeft = currentMode === "research";
      const lookX = THREE.MathUtils.clamp(pointerX, -1, 1);
      const lookY = THREE.MathUtils.clamp(pointerY, -1, 1);
      poseBone("Skeleton_arm_joint_R", presentingScreenLeft ? 0.25 : -0.6, presentingScreenLeft ? -0.08 : 0, 0, 0.075);
      poseBone("Skeleton_arm_joint_R__2_", presentingScreenLeft ? 0.82 : 0.12, 0, presentingScreenLeft ? 0.1 : 0, 0.08);
      poseBone("Skeleton_arm_joint_L__4_", presentingScreenRight ? -0.25 : 0.6, presentingScreenRight ? 0.08 : 0, 0, 0.075);
      poseBone("Skeleton_arm_joint_L__3_", presentingScreenRight ? -0.82 : -0.12, 0, presentingScreenRight ? -0.1 : 0, 0.08);
      poseBone("Skeleton_neck_joint_1", -lookY * 0.07 + breathe * 0.4, lookX * 0.1, -lookX * 0.02, 0.055);
      poseBone("Skeleton_neck_joint_2", -lookY * 0.13, lookX * 0.2, -lookX * 0.035, 0.07);
      poseBone("Skeleton_torso_joint_2", currentMode === "about" ? -0.06 : breathe * 0.4, pointerX * 0.025, 0, 0.04);
    }

    function rectanglesOverlap(first, second, padding) {
      return !(first.right + padding < second.left || first.left > second.right + padding
        || first.bottom + padding < second.top || first.top > second.bottom + padding);
    }

    function updateAnchoredInterface() {
      if (!model || !stage) return;
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      const margin = compact ? 12 : 20;
      const resolved = [];

      Object.entries(viewerConfig.labels).forEach(([id, config]) => {
        const element = labelElements[id];
        const bone = bones.get(config.bone);
        if (!element || !bone) return;
        bone.getWorldPosition(anchorScratch);
        anchorScratch.x += config.worldOffset[0];
        anchorScratch.y += config.worldOffset[1];
        anchorScratch.z += config.worldOffset[2];
        anchorScratch.project(camera);
        const labelWidth = element.offsetWidth || 90;
        const labelHeight = element.offsetHeight || 36;
        const x = THREE.MathUtils.clamp((anchorScratch.x * 0.5 + 0.5) * width + config.offset[0], margin + labelWidth * 0.5, width - margin - labelWidth * 0.5);
        const y = THREE.MathUtils.clamp((-anchorScratch.y * 0.5 + 0.5) * height + config.offset[1], margin + labelHeight * 0.5, height - margin - labelHeight * 0.5);
        resolved.push({ id, element, x, y, width: labelWidth, height: labelHeight, visible: anchorScratch.z > -1 && anchorScratch.z < 1 });
      });

      resolved.sort((first, second) => first.y - second.y);
      for (let index = 0; index < resolved.length; index += 1) {
        const item = resolved[index];
        for (let previousIndex = 0; previousIndex < index; previousIndex += 1) {
          const previous = resolved[previousIndex];
          const itemRect = { left: item.x - item.width / 2, right: item.x + item.width / 2, top: item.y - item.height / 2, bottom: item.y + item.height / 2 };
          const previousRect = { left: previous.x - previous.width / 2, right: previous.x + previous.width / 2, top: previous.y - previous.height / 2, bottom: previous.y + previous.height / 2 };
          if (rectanglesOverlap(itemRect, previousRect, viewerConfig.labelCollisionPadding)) {
            item.y = THREE.MathUtils.clamp(previous.y + previous.height / 2 + item.height / 2 + viewerConfig.labelCollisionPadding, margin + item.height / 2, height - margin - item.height / 2);
          }
        }
        item.element.style.setProperty("--label-x", `${item.x}px`);
        item.element.style.setProperty("--label-y", `${item.y}px`);
        item.element.dataset.anchorVisible = String(item.visible);
      }

      const active = resolved.find((item) => item.element.getAttribute("aria-pressed") === "true");
      if (!compact && active && signalPanel?.classList.contains("is-open")) {
        const panelWidth = signalPanel.offsetWidth;
        const panelHeight = signalPanel.offsetHeight;
        const desiredX = active.x < width / 2
          ? active.x + active.width / 2 + viewerConfig.panelGap
          : active.x - active.width / 2 - panelWidth - viewerConfig.panelGap;
        const panelX = THREE.MathUtils.clamp(desiredX, margin, width - panelWidth - margin);
        const panelY = THREE.MathUtils.clamp(active.y - panelHeight / 2, margin, height - panelHeight - margin);
        signalPanel.style.setProperty("--panel-x", `${panelX}px`);
        signalPanel.style.setProperty("--panel-y", `${panelY}px`);
      }
    }

    const loader = new GLTFLoader();
    loader.load(
      "/avatar/models/CesiumMan.glb",
      (gltf) => {
        model = gltf.scene;
        // Align CesiumMan's authored axis with the viewer's Y-up stage before
        // measuring, centering, and fitting the camera.
        model.rotation.y = Math.PI * 0.5;
        model.updateMatrixWorld(true);
        const bounds = new THREE.Box3().setFromObject(model);
        const size = bounds.getSize(new THREE.Vector3());
        const center = bounds.getCenter(new THREE.Vector3());
        const scale = 2.45 / Math.max(size.y, 0.01);
        model.scale.setScalar(scale);
        model.position.set(-center.x * scale, -bounds.min.y * scale - 1.2, -center.z * scale);
        root.add(model);
        model.updateMatrixWorld(true);
        const fittedBounds = new THREE.Box3().setFromObject(model);
        const fittedSize = fittedBounds.getSize(new THREE.Vector3());
        const verticalFov = THREE.MathUtils.degToRad(camera.fov);
        closeCameraZ = Math.max(5.2, (fittedSize.y * 0.5) / Math.tan(verticalFov * 0.5) * 1.18);
        closeCameraZ = THREE.MathUtils.clamp(closeCameraZ, viewerConfig.orbit.minDistance, viewerConfig.orbit.maxDistance);
        farCameraZ = closeCameraZ + viewerConfig.intro.farPadding;
        orbitDistance = closeCameraZ;
        targetDistance = closeCameraZ;
        if (reducedMotion) camera.position.z = closeCameraZ;

        let sourceMesh = null;
        model.traverse((object) => {
          if (!object.isMesh) return;
          if (object.isSkinnedMesh && !sourceMesh) sourceMesh = object;
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => {
            material.transparent = true;
            material.opacity = 0.92;
            material.depthWrite = true;
            material.roughness = 0.72;
            material.metalness = 0.05;
          });
        });

        [
          "Skeleton_arm_joint_R",
          "Skeleton_arm_joint_R__2_",
          "Skeleton_arm_joint_R__3_",
          "Skeleton_arm_joint_L__4_",
          "Skeleton_arm_joint_L__3_",
          "Skeleton_arm_joint_L__2_",
          "Skeleton_neck_joint_1",
          "Skeleton_neck_joint_2",
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
        const intro = reducedMotion ? 1 : Math.min((time - introStart) / viewerConfig.intro.durationMs, 1);
        if (!introComplete && intro >= 1) {
          introComplete = true;
          stage?.classList.add("is-intro-complete");
        }
        const eased = 1 - Math.pow(1 - intro, 4);
        let radius;
        let cameraAngle;
        let cameraElevation;
        if (intro < 1) {
          radius = THREE.MathUtils.lerp(farCameraZ, closeCameraZ, eased);
          cameraAngle = THREE.MathUtils.lerp(-Math.PI * viewerConfig.intro.orbitTurns, 0, eased);
          cameraElevation = THREE.MathUtils.lerp(0.24, viewerConfig.orbit.initialElevation, eased);
        } else {
          orbitAzimuth = THREE.MathUtils.lerp(orbitAzimuth, targetAzimuth, viewerConfig.orbit.damping);
          orbitElevation = THREE.MathUtils.lerp(orbitElevation, targetElevation, viewerConfig.orbit.damping);
          orbitDistance = THREE.MathUtils.lerp(orbitDistance, targetDistance, viewerConfig.orbit.damping);
          radius = orbitDistance;
          cameraAngle = orbitAzimuth;
          cameraElevation = orbitElevation;
        }
        const horizontalRadius = Math.cos(cameraElevation) * radius;
        camera.position.x = Math.sin(cameraAngle) * horizontalRadius;
        camera.position.z = Math.cos(cameraAngle) * horizontalRadius;
        camera.position.y = viewerConfig.target[1] + Math.sin(cameraElevation) * radius;
        root.rotation.y = -Math.PI * 0.5;
        root.rotation.x = 0;
        root.position.x = 0;
      }

      camera.lookAt(...viewerConfig.target);
      camera.updateMatrixWorld(true);
      scene.updateMatrixWorld(true);
      updateAnchoredInterface();
      renderer.render(scene, camera);
    }

    window.addEventListener("avatar-mode", (event) => { currentMode = event.detail || "neutral"; });
    window.addEventListener("avatar-view", (event) => { currentView = event.detail || "overview"; });
    stage?.addEventListener("pointermove", (event) => {
      const rect = stage.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    });
    renderer.domElement.addEventListener("pointerdown", (event) => {
      if (!introComplete) return;
      dragging = true;
      dragPointerId = event.pointerId;
      dragX = event.clientX;
      dragY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
      stage?.classList.add("is-rotating");
    });
    renderer.domElement.addEventListener("pointermove", (event) => {
      if (!dragging || event.pointerId !== dragPointerId) return;
      const deltaX = event.clientX - dragX;
      const deltaY = event.clientY - dragY;
      targetAzimuth -= deltaX * viewerConfig.orbit.horizontalSpeed;
      targetElevation = THREE.MathUtils.clamp(
        targetElevation + deltaY * viewerConfig.orbit.verticalSpeed,
        viewerConfig.orbit.minElevation,
        viewerConfig.orbit.maxElevation,
      );
      dragX = event.clientX;
      dragY = event.clientY;
    });
    const endDrag = (event) => {
      if (!dragging || event.pointerId !== dragPointerId) return;
      dragging = false;
      dragPointerId = null;
      stage?.classList.remove("is-rotating");
    };
    renderer.domElement.addEventListener("pointerup", endDrag);
    renderer.domElement.addEventListener("pointercancel", endDrag);
    renderer.domElement.addEventListener("wheel", (event) => {
      if (!introComplete) return;
      event.preventDefault();
      targetDistance = THREE.MathUtils.clamp(
        targetDistance + event.deltaY * viewerConfig.orbit.zoomSpeed,
        viewerConfig.orbit.minDistance,
        viewerConfig.orbit.maxDistance,
      );
    }, { passive: false });
    document.addEventListener("visibilitychange", () => { visible = !document.hidden; });
    renderer.domElement.addEventListener("webglcontextlost", () => {
      stage?.classList.remove("is-webgl-ready");
      stage?.classList.add("avatar-load-failed");
    });

    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(resize);
    });
    observer.observe(mount);
    resize();
    requestAnimationFrame(animate);

    window.addEventListener("pagehide", () => {
      disposed = true;
      observer.disconnect();
      cancelAnimationFrame(resizeFrame);
      renderer.dispose();
      gaussianTexture.dispose();
    }, { once: true });
  } catch {
    stage?.classList.add("avatar-load-failed");
    if (status) status.textContent = "WEBGL UNAVAILABLE · ACCESSIBLE FALLBACK ACTIVE";
  }
}
