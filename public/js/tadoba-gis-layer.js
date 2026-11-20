/**
 * TADOBA-ANDHARI 3D DUAL-LAYER MILITARY GIS ENGINE
 * NASA SRTM 30m Elevation Grid + 1024x1024 True-Color Optical Satellite Ortho
 * Tactical LiDAR Wireframe Overlay + 8 Holographic Vertical Altitude Beacons
 */
(function () {
  'use strict';

  let renderer = null;
  let scene = null;
  let camera = null;
  let gisGroup = null;
  let terrainMesh = null;
  let lidarMesh = null;
  let beaconGroup = null;
  let pulseRings = [];
  let beaconNodes = [];
  let animId = null;
  let isActive = false;
  let isInitialized = false;

  const baseRotX = 0.55;
  const baseRotY = -0.4;
  let targetTiltX = 0;
  let targetTiltY = 0;

  let canvas = null;
  let hudCallout = null;
  let activeHoverIndex = -1;

  async function initGIS() {
    if (isInitialized) return;
    canvas = document.getElementById('cv-gis');
    if (!canvas || typeof THREE === 'undefined') return;

    try {
      const resp = await fetch('/tatr_full_dossier.json');
      const data = await resp.json();

      // Create Tactical Beacon HUD Callout element if not present
      hudCallout = document.getElementById('gis-beacon-callout');
      if (!hudCallout) {
        hudCallout = document.createElement('div');
        hudCallout.id = 'gis-beacon-callout';
        hudCallout.className = 'gis-beacon-callout mono';
        hudCallout.setAttribute('aria-hidden', 'true');
        document.body.appendChild(hudCallout);
      }

      // Three.js Renderer setup
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      if ('outputColorSpace' in renderer && THREE.SRGBColorSpace) {
        renderer.outputColorSpace = THREE.SRGBColorSpace;
      }
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;

      // Scene & Perspective Camera
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.5, 1000);
      updateCameraLayout();

      // Lighting: Directional Sun + Cyan Tactical Rim + Ambient
      const ambLight = new THREE.AmbientLight(0xffffff, 1.4);
      scene.add(ambLight);

      const dirLight = new THREE.DirectionalLight(0xfffaed, 2.4);
      dirLight.position.set(24, 45, 20);
      scene.add(dirLight);

      const rimLight = new THREE.DirectionalLight(0x00f0ff, 0.7);
      rimLight.position.set(-25, 20, -20);
      scene.add(rimLight);

      // Master GIS Group
      gisGroup = new THREE.Group();
      gisGroup.rotation.x = baseRotX;
      gisGroup.rotation.y = baseRotY;
      scene.add(gisGroup);

      // LAYER 1: The Physical 3D Satellite Terrain Slab
      const geom = new THREE.PlaneGeometry(36, 36, 79, 79);
      geom.rotateX(-Math.PI / 2);

      const pos = geom.attributes.position;
      const N = 80;
      for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
          const idx = i * N + j;
          const elev = data.elevation_grid[i][j];
          // Soft bevel on edges to create floating tactical tabletop
          const u = i / (N - 1);
          const v = j / (N - 1);
          const edge = Math.min(u, 1 - u, v, 1 - v) / 0.08;
          const edgeFactor = Math.min(1.0, Math.max(0.0, edge));
          pos.setY(
            idx,
            (elev - 200.0) * 0.08 * edgeFactor - (1.0 - edgeFactor) * 2.5
          );
        }
      }
      geom.computeVertexNormals();

      const texLoader = new THREE.TextureLoader();
      const satTex = texLoader.load('/media/tadoba_satellite_ortho.png', () => {
        if (renderer && isActive) renderer.render(scene, camera);
      });
      if (THREE.SRGBColorSpace) satTex.colorSpace = THREE.SRGBColorSpace;

      const terrainMat = new THREE.MeshStandardMaterial({
        map: satTex,
        roughness: 0.8,
        metalness: 0.15,
        side: THREE.DoubleSide
      });
      terrainMesh = new THREE.Mesh(geom, terrainMat);
      gisGroup.add(terrainMesh);

      // LAYER 2: Tactical LiDAR Wireframe Overlay
      const lidarGeom = geom.clone();
      lidarGeom.translate(0, 0.04, 0);
      const lidarMat = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        wireframe: true,
        transparent: true,
        opacity: 0.18
      });
      lidarMesh = new THREE.Mesh(lidarGeom, lidarMat);
      gisGroup.add(lidarMesh);

      // LAYER 3: 8 Holographic Vertical Altitude Beacons
      beaconGroup = new THREE.Group();
      gisGroup.add(beaconGroup);

      data.landmarks.forEach((lm, lIdx) => {
        // Color mapping: #f59e0b for peaks, #00f0ff for waterbodies, #10b981 for gates
        let hexColor = 0x10b981; // gates default
        let cssColor = '#10b981';
        if (lm.type.includes('RIDGE') || lm.type.includes('OVERLOOK') || lm.id === 'chimur' || lm.id === 'navegaon' || lm.id === 'kolsa') {
          hexColor = 0xf59e0b;
          cssColor = '#f59e0b';
        } else if (lm.type.includes('WATER') || lm.type.includes('VALLEY') || lm.id === 'tadoba_lake' || lm.id === 'telia_dam' || lm.id === 'erai_river') {
          hexColor = 0x00f0ff;
          cssColor = '#00f0ff';
        }

        // Vertical line from (lm.x, lm.y, lm.z) to (lm.x, lm.y + 3.5, lm.z)
        const linePoints = [
          new THREE.Vector3(lm.x, lm.y, lm.z),
          new THREE.Vector3(lm.x, lm.y + 3.5, lm.z)
        ];
        const lineGeom = new THREE.BufferGeometry().setFromPoints(linePoints);
        const lineMat = new THREE.LineBasicMaterial({
          color: hexColor,
          transparent: true,
          opacity: 0.88
        });
        const beaconLine = new THREE.Line(lineGeom, lineMat);
        beaconGroup.add(beaconLine);

        // Beacon sphere at top (THREE.SphereGeometry(0.12))
        const sphereGeom = new THREE.SphereGeometry(0.13, 16, 16);
        const sphereMat = new THREE.MeshBasicMaterial({ color: hexColor });
        const sphereMesh = new THREE.Mesh(sphereGeom, sphereMat);
        sphereMesh.position.set(lm.x, lm.y + 3.5, lm.z);
        beaconGroup.add(sphereMesh);

        // Ground pulse ring at base (THREE.RingGeometry(0.2, 0.4))
        const ringGeom = new THREE.RingGeometry(0.2, 0.4, 32);
        ringGeom.rotateX(-Math.PI / 2);
        const ringMat = new THREE.MeshBasicMaterial({
          color: hexColor,
          transparent: true,
          opacity: 0.7,
          side: THREE.DoubleSide
        });
        const ringMesh = new THREE.Mesh(ringGeom, ringMat);
        ringMesh.position.set(lm.x, lm.y + 0.05, lm.z);
        beaconGroup.add(ringMesh);

        pulseRings.push({
          mesh: ringMesh,
          color: hexColor,
          tOffset: (lIdx * Math.PI) / 4
        });

        beaconNodes.push({
          data: lm,
          worldPos: new THREE.Vector3(lm.x, lm.y + 3.5, lm.z),
          colorHex: hexColor,
          colorCss: cssColor,
          sphere: sphereMesh
        });
      });

      // Window resize & pointer parallax events
      window.addEventListener('resize', onResize);
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerdown', onPointerDown);

      isInitialized = true;
      if (isActive) {
        startLoop();
      }
    } catch (err) {
      console.error('Tadoba GIS Init Error:', err);
    }
  }

  function updateCameraLayout() {
    if (!camera) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    if (w > 1024) {
      // Desktop: Terrain shifted slightly right to give ample breathing room for HUD copy on the left
      camera.position.set(-1.5, 23, 40);
      camera.lookAt(1.5, 0, 0);
    } else {
      // Mobile / Tablet: Centered
      camera.position.set(0, 26, 46);
      camera.lookAt(0, 0, 0);
    }
  }

  function onResize() {
    if (!renderer || !camera) return;
    updateCameraLayout();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function onPointerMove(e) {
    if (!isActive) return;
    const normX = (e.clientX / window.innerWidth) * 2 - 1;
    const normY = (e.clientY / window.innerHeight) * 2 - 1;
    targetTiltY = normX * 0.24;
    targetTiltX = normY * 0.18;

    // Check hover near 8 holographic altitude beacons
    checkBeaconHover(e.clientX, e.clientY);
  }

  function checkBeaconHover(clientX, clientY) {
    if (!isActive || !camera || !gisGroup || !hudCallout || beaconNodes.length === 0) return;

    let closestIdx = -1;
    let closestDist = 42; // detection radius in pixels

    const tempV = new THREE.Vector3();
    const w = window.innerWidth;
    const h = window.innerHeight;

    for (let i = 0; i < beaconNodes.length; i++) {
      const node = beaconNodes[i];
      tempV.copy(node.worldPos);
      tempV.applyMatrix4(gisGroup.matrixWorld);
      tempV.project(camera);

      // Check if in front of camera
      if (tempV.z > 1.0) continue;

      const screenX = ((tempV.x + 1) * w) / 2;
      const screenY = ((-tempV.y + 1) * h) / 2;

      const dist = Math.hypot(screenX - clientX, screenY - clientY);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
        node.screenX = screenX;
        node.screenY = screenY;
      }
    }

    if (closestIdx >= 0) {
      if (activeHoverIndex !== closestIdx) {
        activeHoverIndex = closestIdx;
        showBeaconCallout(beaconNodes[closestIdx]);
      }
    } else {
      if (activeHoverIndex !== -1) {
        activeHoverIndex = -1;
        hideBeaconCallout();
      }
    }
  }

  function showBeaconCallout(node) {
    if (!hudCallout) return;
    const lm = node.data;
    hudCallout.innerHTML = `
      <div class="gis-callout-header" style="color: ${node.colorCss}">
        <span class="gis-callout-dot" style="background: ${node.colorCss}; box-shadow: 0 0 10px ${node.colorCss}"></span>
        <span>${lm.name}</span>
        <span class="gis-callout-alt">${lm.alt}m AMSL</span>
      </div>
      <div class="gis-callout-tag">${lm.tag || 'TELEMETRY NODE'}</div>
      <div class="gis-callout-coords mono">LAT: ${lm.lat}°N | LNG: ${lm.lng}°E</div>
    `;

    const pad = 16;
    let left = node.screenX + pad;
    let top = node.screenY - 30;

    if (left + 260 > window.innerWidth) {
      left = node.screenX - 270;
    }
    if (top < 70) top = 70;

    hudCallout.style.left = `${left}px`;
    hudCallout.style.top = `${top}px`;
    hudCallout.classList.add('visible');
  }

  function hideBeaconCallout() {
    if (hudCallout) {
      hudCallout.classList.remove('visible');
    }
  }

  function onPointerDown(e) {
    if (!isActive) return;
    if (activeHoverIndex >= 0 && typeof window.soundManager !== 'undefined') {
      try {
        window.soundManager.playTone(620, 0.22, 'sine', 0.1);
      } catch (_) {}
    }
  }

  function startLoop() {
    if (animId) return;
    function render(t) {
      animId = requestAnimationFrame(render);
      if (!renderer || !scene || !camera || !gisGroup) return;

      // Smooth mouse-parallax tilt on mousemove
      gisGroup.rotation.y += (baseRotY + targetTiltY - gisGroup.rotation.y) * 0.055;
      gisGroup.rotation.x += (baseRotX + targetTiltX - gisGroup.rotation.x) * 0.055;
      gisGroup.updateMatrixWorld();

      // Pulse ground rings
      const time = t * 0.003;
      for (let i = 0; i < pulseRings.length; i++) {
        const p = pulseRings[i];
        const s = 1.0 + 0.35 * Math.sin(time + p.tOffset);
        p.mesh.scale.set(s, s, s);
        p.mesh.material.opacity = 0.35 + 0.35 * Math.sin(time + p.tOffset);
      }

      renderer.render(scene, camera);
    }
    animId = requestAnimationFrame(render);
  }

  function stopLoop() {
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
  }

  function activate() {
    isActive = true;
    if (canvas) {
      canvas.classList.add('active');
    }
    const cv = document.getElementById('cv');
    if (cv) {
      cv.style.transition = 'opacity 0.6s ease';
      cv.style.opacity = '0';
    }
    if (!isInitialized) {
      initGIS();
    } else {
      startLoop();
    }
  }

  function deactivate() {
    isActive = false;
    hideBeaconCallout();
    activeHoverIndex = -1;
    if (canvas) {
      canvas.classList.remove('active');
    }
    const cv = document.getElementById('cv');
    if (cv) {
      cv.style.opacity = '1';
    }
    setTimeout(() => {
      if (!isActive) stopLoop();
    }, 700);
  }

  window.TadobaGIS = {
    init: initGIS,
    activate: activate,
    deactivate: deactivate
  };

  // Auto-init when ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGIS);
  } else {
    initGIS();
  }

  // MutationObserver on #s3 to activate/deactivate automatically on scene transitions
  const obs = new MutationObserver(() => {
    const s3 = document.getElementById('s3');
    if (s3) {
      if (s3.classList.contains('shown')) {
        activate();
      } else {
        deactivate();
      }
    }
  });

  const checkTimer = setInterval(() => {
    const s3 = document.getElementById('s3');
    if (s3) {
      obs.observe(s3, { attributes: true, attributeFilter: ['class'] });
      if (s3.classList.contains('shown')) activate();
      clearInterval(checkTimer);
    }
  }, 100);

})();
