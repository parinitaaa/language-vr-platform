import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// Setting configs: background color, floor color, NPC color, ambient label
const SETTINGS = {
  'coffee-shop': {
    bg: 0x2c1a0e,
    floor: 0x5c3a1e,
    npc: 0xe8c07d,
    fog: 0x2c1a0e,
    title: '☕ Coffee Shop'
  },
  airport: {
    bg: 0x0d1b2a,
    floor: 0x1a3a5c,
    npc: 0x4a90d9,
    fog: 0x0d1b2a,
    title: '✈️ Airport'
  },
  market: {
    bg: 0x1a2e1a,
    floor: 0x2d5a27,
    npc: 0xe07b39,
    fog: 0x1a2e1a,
    title: '🛒 Market'
  }
};

export default function VRSceneRenderer({ setting = 'coffee-shop', onReady }) {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const animIdRef = useRef(null);
  const [vrSupported, setVrSupported] = useState(false);
  const [vrActive, setVrActive] = useState(false);

  useEffect(() => {
    const cfg = SETTINGS[setting] || SETTINGS['coffee-shop'];
    const mount = mountRef.current;
    if (!mount) return;

    // ── Scene ──────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(cfg.bg);
    scene.fog = new THREE.Fog(cfg.fog, 8, 25);

    // ── Camera ─────────────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 1.6, 3);

    // ── Renderer ───────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.xr.enabled = true;
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ── Lights ─────────────────────────────────────────────────────────────
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // ── Floor ──────────────────────────────────────────────────────────────
    const floorGeo = new THREE.PlaneGeometry(20, 20);
    const floorMat = new THREE.MeshLambertMaterial({ color: cfg.floor });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // ── Ceiling ────────────────────────────────────────────────────────────
    const ceilingGeo = new THREE.PlaneGeometry(20, 20);
    const ceilingMat = new THREE.MeshLambertMaterial({ color: cfg.bg });
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 4;
    scene.add(ceiling);

    // ── Walls ──────────────────────────────────────────────────────────────
    const wallMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(cfg.bg).lerp(new THREE.Color(0xffffff), 0.1) });
    [[-10, 0], [10, 0]].forEach(([x]) => {
      const w = new THREE.Mesh(new THREE.PlaneGeometry(20, 4), wallMat);
      w.position.set(x, 2, 0);
      w.rotation.y = x < 0 ? Math.PI / 2 : -Math.PI / 2;
      scene.add(w);
    });
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(20, 4), wallMat);
    backWall.position.set(0, 2, -10);
    scene.add(backWall);

    // ── NPC body ───────────────────────────────────────────────────────────
    const npcGroup = new THREE.Group();

    // torso
    const torso = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.7, 0.3),
      new THREE.MeshLambertMaterial({ color: cfg.npc })
    );
    torso.position.y = 1.15;
    torso.castShadow = true;
    npcGroup.add(torso);

    // head
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 16, 16),
      new THREE.MeshLambertMaterial({ color: 0xf5c5a3 })
    );
    head.position.y = 1.7;
    head.castShadow = true;
    npcGroup.add(head);

    // eyes
    [-0.07, 0.07].forEach(x => {
      const eye = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0x222222 })
      );
      eye.position.set(x, 1.73, 0.21);
      npcGroup.add(eye);
    });

    // legs
    [-0.12, 0.12].forEach(x => {
      const leg = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.55, 0.18),
        new THREE.MeshLambertMaterial({ color: 0x334455 })
      );
      leg.position.set(x, 0.52, 0);
      leg.castShadow = true;
      npcGroup.add(leg);
    });

    npcGroup.position.set(0, 0, -1.5);
    scene.add(npcGroup);

    // ── Setting-specific props ─────────────────────────────────────────────
    if (setting === 'coffee-shop') {
      // counter
      const counter = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.9, 0.5),
        new THREE.MeshLambertMaterial({ color: 0x7b4f2e })
      );
      counter.position.set(0, 0.45, -1.0);
      counter.castShadow = true;
      scene.add(counter);
      // cups
      [[-0.4, 0], [0.4, 0]].forEach(([x, z]) => {
        const cup = new THREE.Mesh(
          new THREE.CylinderGeometry(0.06, 0.05, 0.12, 12),
          new THREE.MeshLambertMaterial({ color: 0xffffff })
        );
        cup.position.set(x, 0.96, z - 0.95);
        scene.add(cup);
      });
    }

    if (setting === 'airport') {
      // check-in desk
      const desk = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 1.0, 0.6),
        new THREE.MeshLambertMaterial({ color: 0x2a4a6a })
      );
      desk.position.set(0, 0.5, -1.0);
      desk.castShadow = true;
      scene.add(desk);
      // monitor
      const monitor = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.4, 0.05),
        new THREE.MeshLambertMaterial({ color: 0x111111 })
      );
      monitor.position.set(0.3, 1.25, -1.0);
      scene.add(monitor);
    }

    if (setting === 'market') {
      // stalls
      [[-1.2, -1], [1.2, -1]].forEach(([x, z]) => {
        const stall = new THREE.Mesh(
          new THREE.BoxGeometry(0.8, 0.7, 0.8),
          new THREE.MeshLambertMaterial({ color: 0x8b6914 })
        );
        stall.position.set(x, 0.35, z);
        scene.add(stall);
        // produce pile
        const pile = new THREE.Mesh(
          new THREE.SphereGeometry(0.18, 8, 8),
          new THREE.MeshLambertMaterial({ color: 0xff6b35 })
        );
        pile.position.set(x, 0.78, z);
        scene.add(pile);
      });
    }

    // ── Particle dust ──────────────────────────────────────────────────────
    const particleCount = 80;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = Math.random() * 3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.04, transparent: true, opacity: 0.4 }));
    scene.add(particles);

    // ── Mouse look ─────────────────────────────────────────────────────────
    let yaw = 0, pitch = 0, pointerLocked = false;
    const onMouseMove = (e) => {
      if (!pointerLocked) return;
      yaw -= e.movementX * 0.002;
      pitch -= e.movementY * 0.002;
      pitch = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, pitch));
    };
    const onClick = () => { mount.requestPointerLock?.(); };
    const onLockChange = () => { pointerLocked = document.pointerLockElement === mount; };
    mount.addEventListener('click', onClick);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('pointerlockchange', onLockChange);

    // ── Resize ─────────────────────────────────────────────────────────────
    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // ── Check WebXR ────────────────────────────────────────────────────────
    if (navigator.xr) {
      navigator.xr.isSessionSupported('immersive-vr').then(supported => setVrSupported(supported));
    }

    // ── Animation loop ─────────────────────────────────────────────────────
    let t = 0;
    renderer.setAnimationLoop(() => {
      t += 0.01;
      // NPC idle bob
      npcGroup.position.y = Math.sin(t * 1.5) * 0.015;
      // Particles drift
      const pos = pGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] += 0.003;
        if (pos[i * 3 + 1] > 3) pos[i * 3 + 1] = 0;
      }
      pGeo.attributes.position.needsUpdate = true;

      // Camera look
      camera.rotation.order = 'YXZ';
      camera.rotation.y = yaw;
      camera.rotation.x = pitch;

      renderer.render(scene, camera);
    });

    if (onReady) onReady();

    // ── Cleanup ────────────────────────────────────────────────────────────
    return () => {
      renderer.setAnimationLoop(null);
      window.removeEventListener('resize', onResize);
      mount.removeEventListener('click', onClick);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('pointerlockchange', onLockChange);
      if (document.pointerLockElement === mount) document.exitPointerLock();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [setting]);

  // ── WebXR enter VR ─────────────────────────────────────────────────────
  const enterVR = async () => {
    if (!rendererRef.current || !navigator.xr) return;
    try {
      const session = await navigator.xr.requestSession('immersive-vr', {
        requiredFeatures: ['local-floor']
      });
      rendererRef.current.xr.setSession(session);
      setVrActive(true);
      session.addEventListener('end', () => setVrActive(false));
    } catch (err) {
      console.warn('VR session failed:', err);
    }
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mountRef} className="w-full h-full" />

      {/* Setting label */}
      <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm text-white text-sm font-semibold px-3 py-1.5 rounded-full pointer-events-none">
        {SETTINGS[setting]?.title || setting}
      </div>

      {/* Mouse-look hint */}
      <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full pointer-events-none">
        Click scene to look around
      </div>

      {/* VR button */}
      {vrSupported && !vrActive && (
        <button
          onClick={enterVR}
          className="absolute bottom-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl shadow-lg transition-colors flex items-center gap-2 text-sm z-10"
        >
          🥽 Enter VR
        </button>
      )}
      {!vrSupported && (
        <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-sm text-gray-300 text-xs px-3 py-1.5 rounded-full pointer-events-none">
          3D Mode (no headset needed)
        </div>
      )}
    </div>
  );
}
