import { moonDefs, planetDefs } from './data.js';

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
    moons: []
  };

  function createTextSprite(text, options = {}) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const fontSize = options.fontSize || 42;
    const paddingX = options.paddingX || 28;
    const paddingY = options.paddingY || 18;

    ctx.font = `600 ${fontSize}px Inter, Arial, sans-serif`;
    const textWidth = ctx.measureText(text).width;
    canvas.width = Math.ceil(textWidth + paddingX * 2);
    canvas.height = fontSize + paddingY * 2;

    ctx.font = `600 ${fontSize}px Inter, Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = options.background || 'rgba(10, 10, 10, 0.78)';
    ctx.strokeStyle = options.border || 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 3;

    const radius = 18;
    const x = 2;
    const y = 2;
    const w = canvas.width - 4;
    const h = canvas.height - 4;

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
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 1);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
    const sprite = new THREE.Sprite(material);
    const scale = options.scale || 0.12;
    sprite.scale.set(canvas.width * scale, canvas.height * scale, 1);
    return sprite;
  }

  function handleResize() {
    world.camera.aspect = window.innerWidth / window.innerHeight;
    world.camera.updateProjectionMatrix();
    world.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function createLevel1Planets() {
    world.planets.length = 0;
    world.orbits.length = 0;

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

      const side = index % 2 === 0 ? -1 : 1;
      const row = Math.floor(index / 2);
      const spawnX = side * 140;
      const spawnY = 60 - row * 40;
      mesh.position.set(spawnX, spawnY, 0);
      world.scene.add(mesh);

      world.planets.push({ mesh, def, placed: false, angle: 0, spawnX, spawnY });
    });
  }

  function createLevel2Moons() {
    world.moons.forEach(moon => {
      world.scene.remove(moon.mesh);
      if (moon.label) world.scene.remove(moon.label);
    });
    world.moons.length = 0;

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

      const label = createTextSprite(def.name, { fontSize: 36, scale: 0.095 });
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

  function animateEntities(grabbedPlanet, grabbedMoon) {
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
  }

  function render() {
    world.renderer.render(world.scene, world.camera);
  }

  function init() {
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

    createLevel1Planets();
    window.addEventListener('resize', handleResize);
  }

  return {
    world,
    init,
    ensureHandMeshes,
    createLevel2Moons,
    updateHandMeshes,
    animateEntities,
    render
  };
}
