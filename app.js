import { state, getT, setLanguage } from './js/state.js';
import { cacheDom, dom } from './js/dom.js';
import { initAudioUI, playErrorSFX, playSuccessSFX, startSpaceBGM, toggleBGM } from './js/audio.js';
import {
  configureUIActions,
  handleFactCardGestureClose,
  renderCameraError,
  showLevelComplete,
  showPlanetFact,
  triggerWinState,
  updateFactButtonText,
  updateStats,
  updateUIText
} from './js/ui.js';
import { createGameWorld } from './js/game-world.js';
import { createHandTracking, detectGesture } from './js/hand-tracking.js';

let gameWorld;
let handTracking;

function track(event, payload = {}) {
  if (window.umami) window.umami.track(event, payload);
}

function applyLanguage(langCode) {
  setLanguage(langCode);
  updateUIText();
  updateFactButtonText();
}

function chooseLanguage(langCode) {
  track('Language Selected', { language: langCode });
  applyLanguage(langCode);
  state.obState = 'intro';
  updateUIText();
}

function continueFromMobile() {
  track('Mobile Warning Dismissed');
  state.obState = localStorage.getItem('userLang') ? 'intro' : 'langSelect';
  updateUIText();
}

async function startScanner() {
  if (state.webcamStarted && state.trackingStarted) return;

  track('Start Camera');
  state.obState = 'requestCam';
  updateUIText();

  try {
    await handTracking.initWebcam();
    state.obState = 'loading';
    updateUIText();
    state.webcamStarted = true;
  } catch {
    renderCameraError();
    return;
  }

  if (!state.trackingStarted) {
    gameWorld.ensureHandMeshes();
    handTracking.initHandTracking();
    state.trackingStarted = true;
  }
}

function returnPlanetToSpawn(planet) {
  gsap.to(planet.mesh.position, { x: planet.spawnX, y: planet.spawnY, z: 0, duration: 0.8, ease: 'back.out(1.2)' });
}

function returnMoonToSpawn(moon) {
  gsap.to(moon.mesh.position, { x: moon.spawnX, y: moon.spawnY, z: 8, duration: 0.8, ease: 'back.out(1.2)' });
  gsap.to(moon.label.position, { x: moon.spawnX, y: moon.spawnY + 5.5, z: 10, duration: 0.8, ease: 'back.out(1.2)' });
}

function handleOnboarding(currentGesture) {
  if (!state.onboardingComplete && currentGesture === 'ThumbsUp') {
    track('Game Started');
    state.onboardingComplete = true;
    state.gameStartTime = Date.now();
    dom.obTitle.innerText = '🚀';
    dom.obContent.innerHTML = '';
    gsap.to(dom.onboardingLayer, {
      opacity: 0,
      scale: 0.8,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        dom.onboardingLayer.style.display = 'none';
      }
    });

    startSpaceBGM();
    dom.stats.style.display = 'inline-block';
    updateStats(getT().statusDrag, '');
    gsap.fromTo(dom.stats, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.4 });
  }

  return !state.onboardingComplete;
}

function handleMoonInteraction(currentGesture, handWorldPos) {
  const { moons, planets, world } = gameWorld.world;
  const t = getT();

  if (currentGesture === 'Pinch') {
    if (!state.grabbedMoon) {
      let nearest = null;
      let minDist = 42;
      for (const moon of moons) {
        if (moon.placed) continue;
        const dist = moon.mesh.position.distanceTo(handWorldPos);
        if (dist < minDist) {
          minDist = dist;
          nearest = moon;
        }
      }
      if (nearest) state.grabbedMoon = nearest;
    }
  } else if (currentGesture === 'Open' && state.grabbedMoon) {
    let closestPlanet = null;
    let closestDist = Infinity;

    for (const planet of planets) {
      if (!planet.placed) continue;
      const dist = state.grabbedMoon.mesh.position.distanceTo(planet.mesh.position);
      const grabRadius = Math.max(12, planet.def.radius + 9);
      if (dist < grabRadius && dist < closestDist) {
        closestDist = dist;
        closestPlanet = planet;
      }
    }

    if (closestPlanet) {
      state.totalDrops++;
      const moonName = state.grabbedMoon.def.name;
      const planetName = t.planetNames[closestPlanet.def.name];

      if (state.grabbedMoon.def.parent === closestPlanet.def.name) {
        playSuccessSFX();
        state.grabbedMoon.placed = true;
        state.grabbedMoon.parentPlanet = closestPlanet;
        state.grabbedMoon.orbitRadius = closestPlanet.def.radius + 5 + Math.random() * 3;
        state.grabbedMoon.angle = Math.atan2(
          state.grabbedMoon.mesh.position.y - closestPlanet.mesh.position.y,
          state.grabbedMoon.mesh.position.x - closestPlanet.mesh.position.x
        );

        updateStats(t.statusMoonCorrect.replace('{moon}', moonName).replace('{planet}', planetName), 'success-text');
        gsap.fromTo(state.grabbedMoon.mesh.scale, { x: 1.6, y: 1.6, z: 1.6 }, { x: 1, y: 1, z: 1, duration: 0.45, ease: 'back.out(2)' });

        if (moons.every(moon => moon.placed)) {
          track('Level 2 Completed');
          setTimeout(() => triggerWinState(world.scene, world.camera), 600);
        }
      } else {
        state.mistakeCount++;
        playErrorSFX();
        updateStats(t.statusMoonWrong.replace('{moon}', moonName).replace('{planet}', planetName), 'error-text');
        const wrongMoon = state.grabbedMoon;
        gsap.to(wrongMoon.mesh.position, {
          x: '+=3',
          duration: 0.05,
          yoyo: true,
          repeat: 5,
          onComplete: () => returnMoonToSpawn(wrongMoon)
        });
      }
    } else {
      updateStats(t.statusMoonDrag, '');
      returnMoonToSpawn(state.grabbedMoon);
    }

    state.grabbedMoon = null;
  }

  if (state.grabbedMoon) {
    gsap.killTweensOf(state.grabbedMoon.mesh.position);
    gsap.killTweensOf(state.grabbedMoon.label.position);
    state.grabbedMoon.mesh.position.lerp(handWorldPos, 0.4);
    state.grabbedMoon.mesh.position.z = 14;
    state.grabbedMoon.label.position.lerp(new THREE.Vector3(handWorldPos.x, handWorldPos.y + 6, 16), 0.4);
  }
}

function handlePlanetInteraction(currentGesture, handWorldPos) {
  const { planets, orbits } = gameWorld.world;
  const t = getT();

  if (currentGesture === 'Pinch') {
    if (!state.grabbedPlanet) {
      let nearest = null;
      let minDist = 50;
      for (const planet of planets) {
        if (planet.placed) continue;
        const dist = planet.mesh.position.distanceTo(handWorldPos);
        if (dist < minDist) {
          minDist = dist;
          nearest = planet;
        }
      }
      if (nearest) state.grabbedPlanet = nearest;
    }
  } else if (currentGesture === 'Open' && state.grabbedPlanet) {
    const distToCenter = state.grabbedPlanet.mesh.position.length();
    let closestOrbit = null;
    let minOrbitDist = 8;

    for (const orbit of orbits) {
      const distanceToOrbit = Math.abs(distToCenter - orbit.userData.dist);
      if (distanceToOrbit < minOrbitDist) {
        minOrbitDist = distanceToOrbit;
        closestOrbit = orbit;
      }
    }

    if (closestOrbit) {
      state.totalDrops++;
      const targetName = t.planetNames[closestOrbit.userData.targetPlanet];
      const planetName = t.planetNames[state.grabbedPlanet.def.name];

      if (closestOrbit.userData.targetPlanet === state.grabbedPlanet.def.name) {
        playSuccessSFX();
        state.grabbedPlanet.placed = true;
        state.grabbedPlanet.angle = Math.atan2(state.grabbedPlanet.mesh.position.y, state.grabbedPlanet.mesh.position.x);
        gsap.to(state.grabbedPlanet.mesh.position, { z: 0, duration: 0.5, ease: 'power2.out' });
        gsap.fromTo(closestOrbit.material, { opacity: 1 }, { opacity: 0.3, duration: 1.2, ease: 'power2.out' });
        closestOrbit.material.color.setHex(0xffffff);
        updateStats(t.statusCorrect.replace('{planet}', planetName), 'success-text');

        const placedPlanet = state.grabbedPlanet;
        state.grabbedPlanet = null;
        showPlanetFact(placedPlanet.def.name, () => {
          if (planets.every(planet => planet.placed)) {
            track('Level 1 Completed');
            setTimeout(() => showLevelComplete(1), 350);
          } else {
            updateStats(t.statusDrag, '');
          }
        });
        return;
      }

      state.mistakeCount++;
      playErrorSFX();
      updateStats(t.statusWrong.replace('{target}', targetName).replace('{planet}', planetName), 'error-text');
      const wrongPlanet = state.grabbedPlanet;
      const originalColor = closestOrbit.material.color.getHex();
      closestOrbit.material.color.setHex(0xff4444);
      gsap.fromTo(closestOrbit.material, { opacity: 0.8 }, {
        opacity: 0.3,
        duration: 0.15,
        yoyo: true,
        repeat: 3,
        onComplete: () => closestOrbit.material.color.setHex(originalColor)
      });
      gsap.to(wrongPlanet.mesh.position, {
        x: '+=3',
        duration: 0.05,
        yoyo: true,
        repeat: 5,
        onComplete: () => returnPlanetToSpawn(wrongPlanet)
      });
    } else {
      returnPlanetToSpawn(state.grabbedPlanet);
      updateStats(t.statusDrag, '');
    }

    state.grabbedPlanet = null;
  }

  if (state.grabbedPlanet) {
    gsap.killTweensOf(state.grabbedPlanet.mesh.position);
    state.grabbedPlanet.mesh.position.lerp(handWorldPos, 0.4);
  }
}

function startLevel2() {
  track('Level 2 Started');
  state.currentLevel = 2;
  state.grabbedPlanet = null;
  state.grabbedMoon = null;
  state.interactionLocked = false;
  state.levelTransitioning = false;

  gsap.to(dom.winLayer, {
    opacity: 0,
    duration: 0.25,
    onComplete: () => {
      dom.winLayer.style.display = 'none';
      dom.winLayer.innerHTML = '';
      gameWorld.createLevel2Moons();
      updateStats(getT().statusMoonDrag, '');
    }
  });
}

function handleInteraction() {
  const handWorldPos = gameWorld.updateHandMeshes(state.handLandmarks, dom.webcamVideo);
  if (!handWorldPos) return;

  const currentGesture = detectGesture(state.handLandmarks);

  if (state.interactionLocked) {
    handleFactCardGestureClose(currentGesture);
    return;
  }

  if (!state.trackingInitialized) {
    state.trackingInitialized = true;
    state.obState = 'guide';
    updateUIText();
  }

  if (handleOnboarding(currentGesture)) return;

  if (state.currentLevel === 2) {
    handleMoonInteraction(currentGesture, handWorldPos);
    return;
  }

  handlePlanetInteraction(currentGesture, handWorldPos);
}

function animate() {
  requestAnimationFrame(animate);
  handleInteraction();
  gameWorld.animateEntities(state.grabbedPlanet, state.grabbedMoon);
  gameWorld.render();
}

function bootstrap() {
  cacheDom();
  initAudioUI();

  gameWorld = createGameWorld(dom.canvasContainer);
  handTracking = createHandTracking(dom.webcamVideo, landmarks => {
    state.handLandmarks = landmarks;
  });

  configureUIActions({
    onContinueFromMobile: continueFromMobile,
    onChooseLanguage: chooseLanguage,
    onStartScanner: startScanner,
    onStartLevel2: startLevel2
  });

  dom.bgmToggle.addEventListener('click', toggleBGM);
  dom.langEn.addEventListener('click', () => applyLanguage('en'));
  dom.langId.addEventListener('click', () => applyLanguage('id'));

  if (state.savedLang) applyLanguage(state.savedLang);
  else updateUIText();

  gameWorld.init();
  animate();

  gsap.from('#ui-header', { y: -30, opacity: 0, duration: 1, ease: 'power3.out' });
  gsap.from('#top-controls', { y: -30, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.2 });
  gsap.from('#onboarding-layer', { scale: 0.9, opacity: 0, duration: 1, ease: 'back.out(1.2)', delay: 0.4 });
}

window.addEventListener('DOMContentLoaded', bootstrap);
