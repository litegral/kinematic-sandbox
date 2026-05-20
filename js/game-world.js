import { getLevel5ScenarioOptions, level3ZoneDefs, level4CategoryDefs, level4ItemDefs, moonDefs, planetDefs, spaceObjectDefs } from './data.js';

export function createGameWorld(container) {
  const world = {
    scene: null,
    camera: null,
    renderer: null,
    sun: null,
    starField: null,
    textureLoader: null,
    handMeshes: [],
    planets: [],
    orbits: [],
    moons: [],
    level2Guides: [],
    level3Zones: [],
    spaceObjects: [],
    level4Buckets: [],
    level4Items: [],
    level5Planet: null,
    level5QuestionLabels: [],
    level5Answers: [],
    level5Panels: [],
    level5Lights: []
  };

  function createTextSprite(text, options = {}) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const fontSize = options.fontSize || 42;
    const paddingX = options.paddingX || 28;
    const paddingY = options.paddingY || 18;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    ctx.font = `600 ${fontSize}px Inter, Arial, sans-serif`;
    const textWidth = ctx.measureText(text).width;
    const logicalWidth = Math.ceil(textWidth + paddingX * 2);
    const logicalHeight = fontSize + paddingY * 2;

    canvas.width = Math.ceil(logicalWidth * dpr);
    canvas.height = Math.ceil(logicalHeight * dpr);
    canvas.style.width = `${logicalWidth}px`;
    canvas.style.height = `${logicalHeight}px`;

    ctx.scale(dpr, dpr);
    ctx.font = `600 ${fontSize}px Inter, Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = options.background || 'rgba(10, 10, 10, 0.78)';
    ctx.strokeStyle = options.border || 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 3;

    const radius = 18;
    const x = 2;
    const y = 2;
    const w = logicalWidth - 4;
    const h = logicalHeight - 4;

    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = options.color || '#fff';
    ctx.fillText(text, logicalWidth / 2, logicalHeight / 2 + 1);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;

    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
    const sprite = new THREE.Sprite(material);
    const scale = options.scale || 0.12;
    sprite.scale.set(logicalWidth * scale, logicalHeight * scale, 1);
    return sprite;
  }

  function handleResize() {
    world.camera.aspect = window.innerWidth / window.innerHeight;
    world.camera.updateProjectionMatrix();
    world.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function setSpaceBackdropVisible(visible, options = {}) {
    if (world.sun) world.sun.visible = options.sun ?? visible;
    if (world.starField) world.starField.visible = options.stars ?? visible;
  }

  function createSpaceObjectArtSprite(def) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const accent = def.art?.accent || '#ffffff';
    const symbol = def.art?.symbol || '✦';

    const gradient = ctx.createRadialGradient(128, 110, 10, 128, 128, 120);
    gradient.addColorStop(0, 'rgba(255,255,255,0.95)');
    gradient.addColorStop(0.2, accent);
    gradient.addColorStop(0.75, 'rgba(12,16,28,0.9)');
    gradient.addColorStop(1, 'rgba(12,16,28,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(128, 128, 110, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(128, 128, 92, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '900 88px Inter, Arial, sans-serif';
    ctx.fillText(symbol, 128, 112);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, opacity: 0.9 });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(10, 10, 1);

    if (def.art?.illustration && world.textureLoader) {
      world.textureLoader.load(def.art.illustration, loadedTexture => {
        sprite.material.map = loadedTexture;
        sprite.material.opacity = 1;
        sprite.material.needsUpdate = true;
        sprite.scale.set(12, 12, 1);
      });
    }

    return sprite;
  }

  function createTexturedPlanetModel(def) {
    const model = new THREE.Group();
    const radius = def.size;
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 32, 32),
      new THREE.MeshPhongMaterial({
        color: def.color,
        map: world.textureLoader.load(def.texture),
        shininess: 10
      })
    );

    model.add(sphere);
    model.userData.sphere = sphere;

    if (def.hasRing) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(radius * 1.45, radius * 2.25, 64),
        new THREE.MeshBasicMaterial({
          color: 0xf2d694,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.72,
          depthWrite: false
        })
      );
      ring.rotation.x = Math.PI * 0.42;
      ring.rotation.y = Math.PI * 0.08;
      model.add(ring);
      model.userData.ring = ring;
    }

    return model;
  }

  function getLocalizedName(dictionary, key) {
    return dictionary?.[key] || key;
  }

  function clearLevel1Planets() {
    world.planets.forEach(planet => world.scene.remove(planet.mesh));
    world.orbits.forEach(orbit => world.scene.remove(orbit));
    world.planets.length = 0;
    world.orbits.length = 0;
  }

  function clearLevel2Moons() {
    world.moons.forEach(moon => {
      world.scene.remove(moon.mesh);
      if (moon.label) world.scene.remove(moon.label);
    });
    world.moons.length = 0;

    world.level2Guides.forEach(guide => {
      if (guide.ring) world.scene.remove(guide.ring);
      if (guide.label) world.scene.remove(guide.label);
      if (guide.planet) {
        guide.planet.level2GuideRing = null;
        guide.planet.level2GuideLabel = null;
      }
    });
    world.level2Guides.length = 0;
  }

  function clearLevel3Objects() {
    world.level3Zones.forEach(zone => {
      world.scene.remove(zone);
      if (zone.userData?.label) world.scene.remove(zone.userData.label);
    });
    world.level3Zones.length = 0;

    world.spaceObjects.forEach(object => {
      world.scene.remove(object.mesh);
      if (object.label) world.scene.remove(object.label);
      if (object.artSprite) world.scene.remove(object.artSprite);
    });
    world.spaceObjects.length = 0;
  }

  function clearLevel4Classification() {
    world.level4Buckets.forEach(bucket => {
      world.scene.remove(bucket);
      if (bucket.userData?.label) world.scene.remove(bucket.userData.label);
    });
    world.level4Buckets.length = 0;

    world.level4Items.forEach(item => {
      world.scene.remove(item.mesh);
      if (item.label) world.scene.remove(item.label);
      if (item.artSprite) world.scene.remove(item.artSprite);
    });
    world.level4Items.length = 0;
  }

  function clearLevel5Question() {
    if (world.level5Planet) world.scene.remove(world.level5Planet);
    world.level5Planet = null;

    world.level5Panels.forEach(panel => world.scene.remove(panel));
    world.level5Panels.length = 0;

    world.level5Lights.forEach(light => world.scene.remove(light));
    world.level5Lights.length = 0;

    world.level5QuestionLabels.forEach(label => world.scene.remove(label));
    world.level5QuestionLabels.length = 0;

    world.level5Answers.forEach(answer => {
      world.scene.remove(answer.panel);
      if (answer.label) world.scene.remove(answer.label);
      if (answer.gestureBadge) world.scene.remove(answer.gestureBadge);
      if (answer.fillBar) world.scene.remove(answer.fillBar);
    });
    world.level5Answers.length = 0;
  }

  function createLevel1Planets() {
    clearLevel1Planets();
    clearLevel2Moons();
    clearLevel3Objects();
    clearLevel4Classification();
    clearLevel5Question();
    setSpaceBackdropVisible(true);

    planetDefs.forEach((def, index) => {
      const orbitGeo = new THREE.RingGeometry(def.dist - 0.2, def.dist + 0.2, 64);
      const orbitMat = new THREE.MeshBasicMaterial({
        color: 0x888888,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3,
        depthWrite: false
      });
      const orbit = new THREE.Mesh(orbitGeo, orbitMat);
      orbit.userData = { targetPlanet: def.name, index, dist: def.dist };
      world.scene.add(orbit);
      world.orbits.push(orbit);

      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(def.radius, 32, 32),
        new THREE.MeshPhongMaterial({ map: world.textureLoader.load(def.texture) })
      );

      if (def.name === 'Saturn') {
        const satRing = new THREE.Mesh(
          new THREE.RingGeometry(def.radius * 1.45, def.radius * 2.25, 64),
          new THREE.MeshBasicMaterial({
            color: 0xf2d694,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.72,
            depthWrite: false
          })
        );
        satRing.rotation.x = Math.PI * 0.42;
        satRing.rotation.y = Math.PI * 0.08;
        mesh.add(satRing);
      }

      const side = index % 2 === 0 ? -1 : 1;
      const row = Math.floor(index / 2);
      const spawnX = side * 140;
      const spawnY = 60 - row * 40;
      mesh.position.set(spawnX, spawnY, 0);
      world.scene.add(mesh);

      world.planets.push({ mesh, def, placed: false, angle: 0, spawnX, spawnY });
    });
  }

  function createLevel2Moons(uiText = {}) {
    clearLevel2Moons();
    clearLevel3Objects();
    clearLevel4Classification();
    clearLevel5Question();
    setSpaceBackdropVisible(true);

    const moonParentSet = new Set(moonDefs.map(def => def.parent));
    for (const planet of world.planets) {
      if (!planet.placed) continue;

      if (moonParentSet.has(planet.def.name)) {
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(planet.def.radius + 10, planet.def.radius + 12.8, 48),
          new THREE.MeshBasicMaterial({
            color: 0x8bb8ff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.3,
            depthWrite: false
          })
        );
        ring.position.set(planet.mesh.position.x, planet.mesh.position.y, planet.mesh.position.z - 1.5);
        world.scene.add(ring);
        planet.level2GuideRing = ring;
        world.level2Guides.push({ planet, ring });
      } else {
        const label = createTextSprite(uiText.noMoons || uiText.level2NoMoons || '', {
          fontSize: 18,
          scale: 0.082,
          background: 'rgba(15, 23, 42, 0.85)',
          border: 'rgba(255,255,255,0.14)',
          color: '#cbd5e1',
          paddingX: 20,
          paddingY: 12
        });
        label.position.set(planet.mesh.position.x, planet.mesh.position.y + planet.def.radius + 10, 8);
        label.userData.baseScale = label.scale.clone();
        world.scene.add(label);
        planet.level2GuideLabel = label;
        world.level2Guides.push({ planet, label });
      }
    }

    moonDefs.forEach((def, index) => {
      const moonMesh = new THREE.Mesh(
        new THREE.SphereGeometry(1.35, 24, 24),
        new THREE.MeshPhongMaterial({ color: 0xd8d8d8, shininess: 15 })
      );

      const side = index % 2 === 0 ? -1 : 1;
      const row = Math.floor(index / 2);
      const spawnX = side * 142;
      const spawnY = 70 - row * 25;
      moonMesh.position.set(spawnX, spawnY, 8);

      const label = createTextSprite(getLocalizedName(uiText.moonNames, def.name), { fontSize: 36, scale: 0.095 });
      label.position.set(spawnX, spawnY + 5.5, 10);

      world.scene.add(moonMesh);
      world.scene.add(label);

      world.moons.push({
        mesh: moonMesh,
        label,
        def,
        placed: false,
        parentPlanet: null,
        spawnX,
        spawnY,
        angle: Math.random() * Math.PI * 2,
        orbitRadius: 5,
        speed: 0.012 + (index % 4) * 0.003
      });
    });
  }

  function createLevel3Objects(uiText = {}) {
    clearLevel2Moons();
    clearLevel3Objects();
    clearLevel4Classification();
    clearLevel5Question();
    setSpaceBackdropVisible(true);

    level3ZoneDefs.forEach(def => {
      const zone = new THREE.Mesh(
        new THREE.RingGeometry(def.inner, def.outer, 96),
        new THREE.MeshBasicMaterial({
          color: def.color,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.22,
          depthWrite: false
        })
      );
      zone.userData = { ...def };

      const label = createTextSprite(getLocalizedName(uiText.level3Zones, def.key), {
        fontSize: 34,
        scale: 0.095,
        background: 'rgba(8, 12, 22, 0.82)',
        border: 'rgba(255,255,255,0.22)',
        color: '#f5f7ff'
      });
      const labelYOffset = def.key === 'oort' ? -10 : 1;
      label.position.set(0, def.centerDist + labelYOffset, 2);
      zone.userData.label = label;

      world.scene.add(zone);
      world.scene.add(label);
      world.level3Zones.push(zone);
    });

    spaceObjectDefs.forEach((def, index) => {
      const mesh = new THREE.Mesh(
        new THREE.DodecahedronGeometry(def.size, 0),
        new THREE.MeshPhongMaterial({ color: def.color, shininess: 35, flatShading: true })
      );

      const side = index % 2 === 0 ? -1 : 1;
      const row = Math.floor(index / 2);
      const spawnX = side * 184;
      const spawnY = 62 - row * 34;
      mesh.position.set(spawnX, spawnY, 8);

      const artSprite = createSpaceObjectArtSprite(def);
      artSprite.position.set(spawnX, spawnY + 12, 7);

      const label = createTextSprite(getLocalizedName(uiText.spaceObjectNames, def.name), { fontSize: 34, scale: 0.095 });
      label.position.set(spawnX, spawnY + 3.5, 10);

      world.scene.add(mesh);
      world.scene.add(artSprite);
      world.scene.add(label);

      world.spaceObjects.push({
        mesh,
        artSprite,
        label,
        def,
        placed: false,
        zone: null,
        spawnX,
        spawnY,
        angle: Math.random() * Math.PI * 2,
        orbitRadius: 0,
        speed: def.speed
      });
    });
  }

  function createLevel4Classification(uiText = {}) {
    clearLevel1Planets();
    clearLevel2Moons();
    clearLevel3Objects();
    clearLevel4Classification();
    clearLevel5Question();
    setSpaceBackdropVisible(true);

    level4CategoryDefs.forEach(def => {
      const bucket = new THREE.Mesh(
        new THREE.PlaneGeometry(def.width, def.height),
        new THREE.MeshBasicMaterial({ color: def.color, transparent: true, opacity: 0.28, side: THREE.DoubleSide })
      );
      bucket.position.set(def.x, def.y, 0);
      bucket.userData = { ...def, fillCount: 0 };

      const label = createTextSprite(getLocalizedName(uiText.level4BucketLabels, def.key), {
        fontSize: 40,
        scale: 0.11,
        background: 'rgba(8, 12, 22, 0.84)',
        border: 'rgba(255,255,255,0.24)',
        color: '#f5f7ff'
      });
      label.position.set(def.x, def.y + def.height / 2 + 10, 2);
      bucket.userData.label = label;

      world.scene.add(bucket);
      world.scene.add(label);
      world.level4Buckets.push(bucket);
    });

    level4ItemDefs.forEach((def, index) => {
      const mesh = createTexturedPlanetModel(def);

      const side = index % 2 === 0 ? -1 : 1;
      const row = Math.floor(index / 2);
      const spawnX = side * 188;
      const spawnY = 96 - row * 34;
      mesh.position.set(spawnX, spawnY, 8);

      const label = createTextSprite(getLocalizedName(uiText.spaceObjectNames, def.name), { fontSize: 36, scale: 0.1 });
      label.position.set(spawnX, spawnY - def.size - 4, 10);

      world.scene.add(mesh);
      world.scene.add(label);

      world.level4Items.push({
        mesh,
        artSprite: null,
        label,
        def,
        placed: false,
        bucket: null,
        spawnX,
        spawnY,
        speed: def.speed,
        phase: Math.random() * Math.PI * 2
      });
    });
  }

  function createLevel5Question(scenario, uiText = {}) {
    clearLevel1Planets();
    clearLevel2Moons();
    clearLevel3Objects();
    clearLevel4Classification();
    clearLevel5Question();
    setSpaceBackdropVisible(true, { sun: false, stars: true });

    const shell = new THREE.Mesh(
      new THREE.PlaneGeometry(420, 260),
      new THREE.MeshBasicMaterial({ color: 0x04070d, transparent: true, opacity: 0.985, side: THREE.DoubleSide })
    );
    shell.position.set(0, 0, -8);
    world.scene.add(shell);
    world.level5Panels.push(shell);

    const answerDeck = new THREE.Mesh(
      new THREE.PlaneGeometry(362, 176),
      new THREE.MeshBasicMaterial({ color: 0x0b1020, transparent: true, opacity: 0.97, side: THREE.DoubleSide })
    );
    answerDeck.position.set(0, -28, -3);
    world.scene.add(answerDeck);
    world.level5Panels.push(answerDeck);

    const keyLight = new THREE.PointLight(0xffffff, 1.9, 760);
    keyLight.position.set(110, 95, 170);
    const fillLight = new THREE.PointLight(0xf3f6ff, 0.85, 780);
    fillLight.position.set(-120, 50, 150);
    const rimLight = new THREE.PointLight(0xc7d2fe, 0.6, 720);
    rimLight.position.set(0, -30, 125);
    world.scene.add(keyLight);
    world.scene.add(fillLight);
    world.scene.add(rimLight);
    world.level5Lights.push(keyLight, fillLight, rimLight);

    const planetDef = planetDefs.find(def => def.name === scenario.planet);
    const scenarioOptions = getLevel5ScenarioOptions(scenario, uiText.lang || 'en');
    if (planetDef) {
      world.level5Planet = new THREE.Mesh(
        new THREE.SphereGeometry(26, 48, 48),
        new THREE.MeshPhongMaterial({ map: world.textureLoader.load(planetDef.texture), shininess: 10 })
      );
      if (planetDef.name === 'Saturn') {
        const satRing = new THREE.Mesh(
          new THREE.RingGeometry(26 * 1.45, 26 * 2.25, 64),
          new THREE.MeshBasicMaterial({
            color: 0xf2d694,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.72,
            depthWrite: false
          })
        );
        satRing.rotation.x = Math.PI * 0.42;
        satRing.rotation.y = Math.PI * 0.08;
        world.level5Planet.add(satRing);
      }
      world.level5Planet.position.set(0, 24, 4);
      world.scene.add(world.level5Planet);
    }

    const title = createTextSprite(getLocalizedName(uiText.planetNames, scenario.planet), {
      fontSize: 48,
      scale: 0.12,
      background: 'rgba(8, 12, 22, 0.9)',
      border: 'rgba(255,255,255,0.24)',
      color: '#f5f7ff'
    });
    title.position.set(0, 84, 3);
    world.scene.add(title);
    world.level5QuestionLabels.push(title);

    const question = createTextSprite(uiText.level5Question || '', {
      fontSize: 38,
      scale: 0.13,
      background: 'rgba(8, 12, 22, 0.82)',
      border: 'rgba(255,255,255,0.14)',
      color: '#f5f7ff',
      paddingX: 36,
      paddingY: 20
    });
    question.position.set(0, 64, 3);
    world.scene.add(question);
    world.level5QuestionLabels.push(question);

    const gestureMap = [
      { gesture: 'Peace', symbol: '✌️', x: -92, y: -10, color: 0x182337 },
      { gesture: 'ThumbsUp', symbol: '👍', x: 92, y: -10, color: 0x1d213c },
      { gesture: 'Metal', symbol: '🤘', x: -92, y: -58, color: 0x221b39 },
      { gesture: 'Vulcan', symbol: '🖖', x: 92, y: -58, color: 0x15263a }
    ];

    gestureMap.forEach(def => {
      const panel = new THREE.Mesh(
        new THREE.PlaneGeometry(176, 46),
        new THREE.MeshBasicMaterial({ color: def.color, transparent: true, opacity: 0.94, side: THREE.DoubleSide })
      );
      panel.userData.baseScale = { x: 1, y: 1 };
      panel.position.set(def.x, def.y, 0);

      const gestureBadge = createTextSprite(def.symbol, {
        fontSize: 72,
        scale: 0.135,
        background: 'rgba(255,255,255,0.10)',
        border: 'rgba(255,255,255,0.18)',
        color: '#fff',
        paddingX: 28,
        paddingY: 24
      });
      gestureBadge.position.set(def.x - 66, def.y, 2);

      const label = createTextSprite(scenarioOptions[def.gesture], {
        fontSize: 30,
        scale: 0.12,
        background: 'rgba(8, 12, 22, 0.98)',
        border: 'rgba(255,255,255,0.10)',
        color: '#fff',
        paddingX: 30,
        paddingY: 20
      });
      label.position.set(def.x + 12, def.y, 2);

      // Fill bar: same dimensions as panel, slightly in front. Grows left-to-right during hold.
      const fillBar = new THREE.Mesh(
        new THREE.PlaneGeometry(176, 46),
        new THREE.MeshBasicMaterial({ color: 0x4a9eff, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide })
      );
      fillBar.position.set(def.x - 88, def.y, 1); // anchored at left edge initially
      fillBar.scale.x = 0.001;

      world.scene.add(panel);
      world.scene.add(fillBar);
      world.scene.add(gestureBadge);
      world.scene.add(label);
      world.level5Answers.push({ ...def, panel, fillBar, label, gestureBadge, baseY: def.y, baseLabelScale: label.scale.clone(), baseGestureScale: gestureBadge.scale.clone() });
    });
  }

  function ensureHandMeshes() {
    if (world.handMeshes.length > 0) return;

    const geometry = new THREE.SphereGeometry(1.0, 16, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 });

    for (let i = 0; i < 21; i++) {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.visible = false;
      mesh.position.set(0, -1000, 0);
      world.scene.add(mesh);
      world.handMeshes.push(mesh);
    }
  }

  function updateHandMeshes(handLandmarks, videoElement) {
    if (!handLandmarks) {
      world.handMeshes.forEach(mesh => {
        mesh.visible = false;
      });
      return null;
    }

    const distance = world.camera.position.z;
    const vFov = world.camera.fov * Math.PI / 180;
    const planeHeightAtZ0 = 2 * Math.tan(vFov / 2) * distance;
    const planeWidthAtZ0 = planeHeightAtZ0 * world.camera.aspect;
    const vAspect = (videoElement.videoWidth || 1) / (videoElement.videoHeight || 1);
    const wAspect = window.innerWidth / window.innerHeight;

    for (let i = 0; i < 21; i++) {
      const mesh = world.handMeshes[i];
      mesh.visible = true;

      let renderX = handLandmarks[i].x;
      let renderY = handLandmarks[i].y;

      if (wAspect > vAspect) {
        const scaledHeight = window.innerWidth / vAspect;
        const yOffset = (scaledHeight - window.innerHeight) / 2;
        renderY = ((renderY * scaledHeight) - yOffset) / window.innerHeight;
      } else {
        const scaledWidth = window.innerHeight * vAspect;
        const xOffset = (scaledWidth - window.innerWidth) / 2;
        renderX = ((renderX * scaledWidth) - xOffset) / window.innerWidth;
      }

      const mappedX = (0.5 - renderX) * planeWidthAtZ0;
      const mappedY = (0.5 - renderY) * planeHeightAtZ0;
      const targetPos = new THREE.Vector3(mappedX, mappedY, 12);

      if (mesh.position.y === -1000) mesh.position.copy(targetPos);
      else mesh.position.lerp(targetPos, 0.2);
    }

    return world.handMeshes[8].position;
  }

  function animateEntities(grabbedPlanet, grabbedMoon, grabbedSpaceObject, grabbedClassificationItem) {
    if (world.sun) world.sun.rotation.y += 0.0007;
    if (world.starField) {
      world.starField.rotation.y += 0.0002;
      world.starField.rotation.x += 0.0001;
    }

    for (const planet of world.planets) {
      planet.mesh.rotation.y += planet.def.spin;
      if (planet.placed && planet !== grabbedPlanet) {
        planet.angle += planet.def.speed;
        planet.mesh.position.x = Math.cos(planet.angle) * planet.def.dist;
        planet.mesh.position.y = Math.sin(planet.angle) * planet.def.dist;
      } else if (!planet.placed && planet !== grabbedPlanet) {
        planet.mesh.position.y += Math.sin(Date.now() * 0.002 + planet.def.dist) * 0.05;
      }

      if (planet.level2GuideRing) {
        planet.level2GuideRing.position.x = planet.mesh.position.x;
        planet.level2GuideRing.position.y = planet.mesh.position.y;
        planet.level2GuideRing.rotation.z += 0.003;
      }
      if (planet.level2GuideLabel) {
        planet.level2GuideLabel.position.x = planet.mesh.position.x;
        planet.level2GuideLabel.position.y = planet.mesh.position.y + planet.def.radius + 10;
      }
    }

    for (const moon of world.moons) {
      moon.mesh.rotation.y += 0.01;
      if (moon.placed && moon.parentPlanet && moon !== grabbedMoon) {
        moon.angle += moon.speed;
        const parentPos = moon.parentPlanet.mesh.position;
        moon.mesh.position.x = parentPos.x + Math.cos(moon.angle) * moon.orbitRadius;
        moon.mesh.position.y = parentPos.y + Math.sin(moon.angle) * moon.orbitRadius;
        moon.mesh.position.z = parentPos.z + 8;
        moon.label.position.x = moon.mesh.position.x;
        moon.label.position.y = moon.mesh.position.y + 5;
        moon.label.position.z = moon.mesh.position.z + 2;
      } else if (!moon.placed && moon !== grabbedMoon) {
        moon.label.position.x = moon.mesh.position.x;
        moon.label.position.y = moon.mesh.position.y + 5.5;
        moon.label.position.z = moon.mesh.position.z + 2;
      }
    }

    for (const object of world.spaceObjects) {
      object.mesh.rotation.x += 0.004;
      object.mesh.rotation.y += 0.006;
      if (object.placed && object !== grabbedSpaceObject) {
        object.angle += object.speed;
        object.mesh.position.x = Math.cos(object.angle) * object.orbitRadius;
        object.mesh.position.y = Math.sin(object.angle) * object.orbitRadius;
        object.mesh.position.z = 8;
        object.artSprite.position.x = object.mesh.position.x;
        object.artSprite.position.y = object.mesh.position.y + 12;
        object.artSprite.position.z = 7;
        object.label.position.x = object.mesh.position.x;
        object.label.position.y = object.mesh.position.y + 3.5;
        object.label.position.z = 10;
      } else {
        object.artSprite.position.x = object.mesh.position.x;
        object.artSprite.position.y = object.mesh.position.y + 12;
        object.artSprite.position.z = object.mesh.position.z - 1;
        object.label.position.x = object.mesh.position.x;
        object.label.position.y = object.mesh.position.y + 3.5;
        object.label.position.z = object.mesh.position.z + 2;
      }
    }

    for (const item of world.level4Items) {
      item.mesh.rotation.x += 0.004;
      item.mesh.rotation.y += 0.006;
      const labelOffset = item.def.size + 4;
      if (!item.placed && item !== grabbedClassificationItem) {
        item.mesh.position.y += Math.sin(Date.now() * 0.002 + item.phase) * 0.04;
        if (item.artSprite) {
          item.artSprite.position.x = item.mesh.position.x;
          item.artSprite.position.y = item.mesh.position.y + 10;
          item.artSprite.position.z = item.mesh.position.z - 1;
        }
        item.label.position.x = item.mesh.position.x;
        item.label.position.y = item.mesh.position.y - labelOffset;
        item.label.position.z = item.mesh.position.z + 2;
      } else if (item.placed && item !== grabbedClassificationItem) {
        if (item.artSprite) {
          item.artSprite.position.x = item.mesh.position.x;
          item.artSprite.position.y = item.mesh.position.y + 9;
          item.artSprite.position.z = 7;
        }
        item.label.position.x = item.mesh.position.x;
        item.label.position.y = item.mesh.position.y - labelOffset;
        item.label.position.z = 10;
      }
    }

    if (world.level5Planet) world.level5Planet.rotation.y += 0.01;
    for (const answer of world.level5Answers) {
      answer.panel.position.y = answer.baseY + Math.sin(Date.now() * 0.0018 + answer.x * 0.02) * 1.2;
      answer.panel.rotation.z = Math.sin(Date.now() * 0.001 + answer.x * 0.01) * 0.02;
      answer.label.position.y = answer.panel.position.y;
      answer.label.position.x = answer.panel.position.x + 12;
      answer.label.material.opacity = 0.98;
      if (answer.gestureBadge) {
        answer.gestureBadge.position.y = answer.panel.position.y;
        answer.gestureBadge.position.x = answer.panel.position.x - 66;
      }
      if (answer.fillBar) {
        // y and rotation track with the floating panel; x is driven by level5 interaction
        answer.fillBar.position.y = answer.panel.position.y;
        answer.fillBar.rotation.z = answer.panel.rotation.z;
      }
    }
  }

  function render() {
    world.renderer.render(world.scene, world.camera);
  }

  function init(uiText = {}) {
    world.scene = new THREE.Scene();
    world.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    world.camera.position.z = 180;

    world.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    world.renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(world.renderer.domElement);

    world.textureLoader = new THREE.TextureLoader();

    world.scene.add(new THREE.AmbientLight(0x444444));
    world.scene.add(new THREE.PointLight(0xffffff, 2.0, 400));

    world.sun = new THREE.Mesh(
      new THREE.SphereGeometry(12, 32, 32),
      new THREE.MeshBasicMaterial({ map: world.textureLoader.load('textures/2k_sun.jpg') })
    );
    world.scene.add(world.sun);

    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.6,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    });

    const starsVertices = [];
    for (let i = 0; i < 3000; i++) {
      starsVertices.push((Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000);
    }
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    world.starField = new THREE.Points(starsGeometry, starsMaterial);
    world.scene.add(world.starField);

    createLevel1Planets(uiText);
    window.addEventListener('resize', handleResize);
  }

  return {
    world,
    init,
    ensureHandMeshes,
    createLevel1Planets,
    createLevel2Moons,
    createLevel3Objects,
    createLevel4Classification,
    createLevel5Question,
    updateHandMeshes,
    animateEntities,
    render
  };
}
