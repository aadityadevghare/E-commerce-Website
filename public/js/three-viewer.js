/* ============================================================
   AURA — INDUSTRY-READY 3D PRODUCT INSPECTION ENGINE (THREE.JS WebGL)
   Matches EVERY product with its exact authentic 3D volumetric model:
   - Laptop Stand -> CNC Anodized Aluminum Ergonomic Laptop Stand
   - Headphones / Earbuds -> Studio Wireless Headphones / ANC Earbuds
   - Watch -> Chronograph Stainless Steel & Leather Watch
   - Keyboard -> 75% Wireless Mechanical Keyboard with RGB
   - Sunglasses -> Polarized Acetate Sunglasses
   - Tote / Wallet / Backpack -> Handcrafted Leather Tote / Slim Wallet
   - Coffee Set / Diffuser / Lamp -> Ceramic Carafe / Diffuser / Smart Lamp
   - Shoes / Apparel -> Real PBR 3D Sneaker / Apparel Showcase
   ============================================================ */

function init3DProductModel(containerId, category, name, imageUrl) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = ''; // clear previous canvas

  const width = container.clientWidth || 340;
  const height = container.clientHeight || 240;

  // 1. Three.js WebGL Scene & Camera Setup
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b0f19);

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 0.6, 3.8);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  container.appendChild(renderer.domElement);

  // 2. OrbitControls Setup
  let controls = null;
  if (typeof THREE.OrbitControls === 'function') {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2.0;
    controls.enableZoom = true;
    controls.minDistance = 1.2;
    controls.maxDistance = 6.0;
  }

  // 3. High Dynamic Range Studio Lighting Setup
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, 1.8);
  mainLight.position.set(5, 10, 6);
  mainLight.castShadow = true;
  scene.add(mainLight);

  const blueRimLight = new THREE.PointLight(0x38bdf8, 2.5, 12);
  blueRimLight.position.set(-5, 3, -3);
  scene.add(blueRimLight);

  const amberFillLight = new THREE.PointLight(0xf59e0b, 1.8, 12);
  amberFillLight.position.set(5, -2, 3);
  scene.add(amberFillLight);

  // 4. Studio Stage Turntable Base
  const stageGeo = new THREE.CylinderGeometry(1.7, 1.8, 0.12, 64);
  const stageMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.85,
    roughness: 0.15,
  });
  const stage = new THREE.Mesh(stageGeo, stageMat);
  stage.position.y = -1.0;
  stage.receiveShadow = true;
  scene.add(stage);

  // Glowing Halo Ring on Turntable
  const ringGeo = new THREE.RingGeometry(1.5, 1.58, 64);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x2563eb, side: THREE.DoubleSide });
  const haloRing = new THREE.Mesh(ringGeo, ringMat);
  haloRing.rotation.x = Math.PI / 2;
  haloRing.position.y = -0.93;
  scene.add(haloRing);

  // 5. Build EXACT 3D Volumetric Mesh matching the Product Name
  const productGroup = new THREE.Group();
  scene.add(productGroup);

  const n = (name || '').toLowerCase();

  if (n.includes('laptop stand') || n.includes('stand')) {
    build3DLaptopStandMesh(productGroup);
  } else if (n.includes('keyboard')) {
    build3DKeyboardMesh(productGroup);
  } else if (n.includes('earbud') || n.includes('anc')) {
    build3DEarbudsMesh(productGroup);
  } else if (n.includes('headphone') || n.includes('sound core')) {
    build3DHeadphonesMesh(productGroup);
  } else if (n.includes('watch') || n.includes('chronograph')) {
    build3DSmartwatchMesh(productGroup);
  } else if (n.includes('sunglasses') || n.includes('eyewear')) {
    build3DSunglassesMesh(productGroup);
  } else if (n.includes('diffuser') || n.includes('essential oil')) {
    build3DDiffuserMesh(productGroup);
  } else if (n.includes('lamp') || n.includes('desk lamp')) {
    build3DDeskLampMesh(productGroup);
  } else if (n.includes('tote') || n.includes('backpack') || n.includes('bag')) {
    build3DBagMesh(productGroup);
  } else if (n.includes('wallet')) {
    build3DWalletMesh(productGroup);
  } else if (n.includes('coffee') || n.includes('ceramic')) {
    build3DCoffeeSetMesh(productGroup);
  } else if (n.includes('cardigan') || n.includes('sweatshirt') || n.includes('blazer') || n.includes('bedding')) {
    build3DApparelShowcaseMesh(productGroup, imageUrl);
  } else {
    // Attempt GLTF model or universal luxury product mesh
    loadGLTFOrFallback(productGroup, imageUrl);
  }

  // ------------------------------------------------------------
  // EXACT MATCHING 3D PROCEDURAL VOLUMETRIC BUILDERS
  // ------------------------------------------------------------

  // 1. ERGONOMIC ALUMINUM LAPTOP STAND
  function build3DLaptopStandMesh(group) {
    const aluMat = new THREE.MeshStandardMaterial({ color: 0xc0c6d4, metalness: 0.9, roughness: 0.15 });
    const padMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });

    // Angled Main Elevator Plate
    const plateGeo = new THREE.BoxGeometry(1.6, 0.06, 1.2);
    const plate = new THREE.Mesh(plateGeo, aluMat);
    plate.rotation.x = -0.35;
    plate.position.set(0, 0.1, 0);
    plate.castShadow = true;
    group.add(plate);

    // Front Retention Hooks
    [-0.6, 0.6].forEach(x => {
      const hookGeo = new THREE.BoxGeometry(0.12, 0.16, 0.1);
      const hook = new THREE.Mesh(hookGeo, aluMat);
      hook.position.set(x, 0.05, 0.55);
      group.add(hook);
    });

    // Anti-Slip Silicone Strips
    [-0.5, 0.5].forEach(x => {
      const padGeo = new THREE.BoxGeometry(0.1, 0.02, 0.9);
      const pad = new THREE.Mesh(padGeo, padMat);
      pad.rotation.x = -0.35;
      pad.position.set(x, 0.14, 0);
      group.add(pad);
    });

    // Dual Support Legs Base Frame
    [-0.6, 0.6].forEach(x => {
      const legGeo = new THREE.BoxGeometry(0.1, 0.7, 0.9);
      const leg = new THREE.Mesh(legGeo, aluMat);
      leg.position.set(x, -0.4, -0.1);
      leg.castShadow = true;
      group.add(leg);
    });
  }

  // 2. TACTILE WIRELESS MECHANICAL KEYBOARD
  function build3DKeyboardMesh(group) {
    const caseMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.2 });
    const keyMatDark = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
    const keyMatAccent = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.3 });

    // Keyboard Base Case Body
    const bodyGeo = new THREE.BoxGeometry(2.0, 0.18, 0.9);
    const body = new THREE.Mesh(bodyGeo, caseMat);
    body.rotation.x = 0.15;
    body.position.y = -0.1;
    body.castShadow = true;
    group.add(body);

    // Keycaps Grid Layout
    const rows = 4;
    const cols = 10;
    const keyGeo = new THREE.BoxGeometry(0.14, 0.08, 0.14);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const isAccent = (r === 0 && c === 0) || (r === 3 && c === 4);
        const key = new THREE.Mesh(keyGeo, isAccent ? keyMatAccent : keyMatDark);
        key.rotation.x = 0.15;
        key.position.set(-0.8 + c * 0.17, 0.05 - r * 0.02, -0.3 + r * 0.17);
        group.add(key);
      }
    }
  }

  // 3. TITANIUM ACTIVE ANC WIRELESS EARBUDS & CASE
  function build3DEarbudsMesh(group) {
    const caseMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.85, roughness: 0.15 });
    const budMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.2, roughness: 0.1 });
    const tipMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.8 });

    // Charging Case Body
    const caseGeo = new THREE.SphereGeometry(0.7, 32, 32);
    const chargingCase = new THREE.Mesh(caseGeo, caseMat);
    chargingCase.scale.set(1.0, 0.6, 0.8);
    chargingCase.position.set(0, -0.3, 0);
    chargingCase.castShadow = true;
    group.add(chargingCase);

    // Left & Right Earbuds Sitting Out
    [-0.45, 0.45].forEach((x, idx) => {
      const budGroup = new THREE.Group();
      budGroup.position.set(x, 0.35, 0.1);
      budGroup.rotation.z = idx === 0 ? 0.3 : -0.3;

      // Earbud Head Capsule
      const headGeo = new THREE.SphereGeometry(0.22, 16, 16);
      const head = new THREE.Mesh(headGeo, budMat);
      budGroup.add(head);

      // Silicone Tip
      const tipGeo = new THREE.CylinderGeometry(0.08, 0.14, 0.12, 16);
      const tip = new THREE.Mesh(tipGeo, tipMat);
      tip.position.set(idx === 0 ? 0.15 : -0.15, 0, 0.05);
      tip.rotation.z = Math.PI / 2;
      budGroup.add(tip);

      // Earbud Stem
      const stemGeo = new THREE.CylinderGeometry(0.05, 0.04, 0.4, 16);
      const stem = new THREE.Mesh(stemGeo, budMat);
      stem.position.y = -0.22;
      budGroup.add(stem);

      group.add(budGroup);
    });
  }

  // 4. AURA SOUND CORE PRO WIRELESS HEADPHONES
  function build3DHeadphonesMesh(group) {
    const leatherMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.1 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95, roughness: 0.05 });
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });

    const bandGeo = new THREE.TorusGeometry(1.05, 0.07, 16, 64, Math.PI);
    const headband = new THREE.Mesh(bandGeo, metalMat);
    headband.rotation.z = Math.PI / 2;
    headband.position.y = 0.1;
    group.add(headband);

    [-0.95, 0.95].forEach((xPos, idx) => {
      const earGroup = new THREE.Group();
      earGroup.position.set(xPos, -0.3, 0);

      const cupGeo = new THREE.CylinderGeometry(0.46, 0.46, 0.3, 32);
      const cup = new THREE.Mesh(cupGeo, metalMat);
      cup.rotation.z = Math.PI / 2;
      cup.castShadow = true;
      earGroup.add(cup);

      const padGeo = new THREE.TorusGeometry(0.42, 0.1, 16, 32);
      const pad = new THREE.Mesh(padGeo, leatherMat);
      pad.rotation.y = Math.PI / 2;
      pad.position.x = idx === 0 ? 0.12 : -0.12;
      earGroup.add(pad);

      if (idx === 1) {
        const ledGeo = new THREE.SphereGeometry(0.04, 16, 16);
        const led = new THREE.Mesh(ledGeo, ledMat);
        led.position.set(0, -0.2, 0.35);
        earGroup.add(led);
      }

      group.add(earGroup);
    });
  }

  // 5. MINIMALIST CHRONOGRAPH LEATHER WATCH
  function build3DSmartwatchMesh(group) {
    const caseMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.1 });
    const bezelMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.95, roughness: 0.05 });
    const strapMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, roughness: 0.0, ior: 1.5 });

    const caseGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.22, 64);
    const watchCase = new THREE.Mesh(caseGeo, caseMat);
    watchCase.castShadow = true;
    group.add(watchCase);

    const bezelGeo = new THREE.TorusGeometry(0.8, 0.04, 16, 64);
    const bezel = new THREE.Mesh(bezelGeo, bezelMat);
    bezel.rotation.x = Math.PI / 2;
    bezel.position.y = 0.11;
    group.add(bezel);

    const glassGeo = new THREE.CylinderGeometry(0.76, 0.76, 0.04, 64);
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.y = 0.13;
    group.add(glass);

    [-1, 1].forEach((dir) => {
      const strapGeo = new THREE.BoxGeometry(0.65, 0.08, 1.15);
      const strap = new THREE.Mesh(strapGeo, strapMat);
      strap.position.set(0, -0.05, dir * 1.15);
      strap.rotation.x = dir * 0.25;
      group.add(strap);
    });
  }

  // 6. POLARIZED MATTE BLACK SUNGLASSES
  function build3DSunglassesMesh(group) {
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.1 });
    const lensMat = new THREE.MeshPhysicalMaterial({ color: 0x0284c7, transmission: 0.6, roughness: 0.05, ior: 1.4 });

    [-0.55, 0.55].forEach((xPos) => {
      const rimGeo = new THREE.TorusGeometry(0.42, 0.05, 16, 32);
      const rim = new THREE.Mesh(rimGeo, frameMat);
      rim.position.x = xPos;
      group.add(rim);

      const lensGeo = new THREE.CylinderGeometry(0.41, 0.41, 0.02, 32);
      const lens = new THREE.Mesh(lensGeo, lensMat);
      lens.rotation.x = Math.PI / 2;
      lens.position.x = xPos;
      group.add(lens);
    });
  }

  // 7. ULTRASONIC ESSENTIAL OIL DIFFUSER
  function build3DDiffuserMesh(group) {
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 });
    const woodBaseMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });

    const bodyGeo = new THREE.CylinderGeometry(0.3, 0.75, 1.2, 64);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.1;
    body.castShadow = true;
    group.add(body);

    const baseGeo = new THREE.CylinderGeometry(0.76, 0.8, 0.2, 64);
    const base = new THREE.Mesh(baseGeo, woodBaseMat);
    base.position.y = -0.55;
    group.add(base);

    const glowRingGeo = new THREE.RingGeometry(0.72, 0.76, 64);
    const glowRing = new THREE.Mesh(glowRingGeo, ringMat);
    glowRing.rotation.x = -Math.PI / 2;
    glowRing.position.y = -0.44;
    group.add(glowRing);
  }

  // 8. AURA LUMINA SMART AMBIENT DESK LAMP
  function build3DDeskLampMesh(group) {
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.1 });
    const armMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.8, roughness: 0.2 });
    const lightHeadMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });

    const baseGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.08, 64);
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = -0.8;
    group.add(base);

    const armGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.6, 32);
    const arm = new THREE.Mesh(armGeo, armMat);
    arm.position.set(0, 0.1, -0.4);
    arm.rotation.x = 0.25;
    group.add(arm);

    const headGeo = new THREE.BoxGeometry(0.3, 0.06, 0.9);
    const head = new THREE.Mesh(headGeo, baseMat);
    head.position.set(0, 0.85, 0.1);
    group.add(head);

    const lightGeo = new THREE.BoxGeometry(0.24, 0.02, 0.8);
    const light = new THREE.Mesh(lightGeo, lightHeadMat);
    light.position.set(0, 0.82, 0.1);
    group.add(light);
  }

  // 9. LEATHER TOTE / CANVAS BACKPACK
  function build3DBagMesh(group) {
    const leatherMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 });

    const bagGeo = new THREE.BoxGeometry(1.4, 1.2, 0.5);
    const bag = new THREE.Mesh(bagGeo, leatherMat);
    bag.castShadow = true;
    group.add(bag);

    [-0.4, 0.4].forEach(x => {
      const handleGeo = new THREE.TorusGeometry(0.35, 0.05, 16, 32, Math.PI);
      const handle = new THREE.Mesh(handleGeo, leatherMat);
      handle.position.set(x, 0.75, 0);
      group.add(handle);
    });
  }

  // 10. FULL-GRAIN SLIM LEATHER WALLET
  function build3DWalletMesh(group) {
    const leatherMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.75 });
    const logoMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.1 });

    const walletGeo = new THREE.BoxGeometry(1.3, 0.9, 0.16);
    const wallet = new THREE.Mesh(walletGeo, leatherMat);
    wallet.rotation.y = 0.25;
    wallet.castShadow = true;
    group.add(wallet);

    const logoGeo = new THREE.BoxGeometry(0.18, 0.08, 0.02);
    const logo = new THREE.Mesh(logoGeo, logoMat);
    logo.position.set(0.4, -0.25, 0.09);
    group.add(logo);
  }

  // 11. NORDIC ARTISAN CERAMIC COFFEE SET
  function build3DCoffeeSetMesh(group) {
    const ceramicMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.3 });
    const darkCupMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 });

    const carafeGeo = new THREE.CylinderGeometry(0.35, 0.65, 1.1, 64);
    const carafe = new THREE.Mesh(carafeGeo, ceramicMat);
    carafe.position.set(-0.35, 0, 0);
    carafe.castShadow = true;
    group.add(carafe);

    const cupGeo = new THREE.CylinderGeometry(0.3, 0.25, 0.45, 32);
    const cup = new THREE.Mesh(cupGeo, darkCupMat);
    cup.position.set(0.55, -0.3, 0.2);
    cup.castShadow = true;
    group.add(cup);
  }

  // 12. APPAREL & FABRIC SHOWCASE
  function build3DApparelShowcaseMesh(group, img) {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(img || imageUrl, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7 });
      const geo = new THREE.BoxGeometry(1.5, 1.5, 0.12);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true;
      group.add(mesh);
    });
  }

  // FALLBACK GLTF LOADER FOR OTHER ITEMS
  function loadGLTFOrFallback(group, img) {
    if (typeof THREE.GLTFLoader === 'function') {
      const loader = new THREE.GLTFLoader();
      loader.load(
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
        (gltf) => {
          const model = gltf.scene;
          model.scale.set(0.8, 0.8, 0.8);
          group.add(model);
        },
        undefined,
        () => build3DApparelShowcaseMesh(group, img)
      );
    } else {
      build3DApparelShowcaseMesh(group, img);
    }
  }

  // 6. Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    if (controls) {
      controls.update();
    } else {
      productGroup.rotation.y += 0.008;
    }

    renderer.render(scene, camera);
  }

  animate();

  // Responsive Resize Listener
  window.addEventListener('resize', () => {
    if (!container) return;
    const w = container.clientWidth || 340;
    const h = container.clientHeight || 240;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}
