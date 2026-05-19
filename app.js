import { state, getT, setLanguage } from './js/state.js';
import { level5ScenarioDefs } from './js/data.js';
import { cacheDom, dom } from './js/dom.js';
import { initAudioUI, playErrorSFX, playSuccessSFX, startSpaceBGM, toggleBGM } from './js/audio.js';
import {
  configureUIActions,
  handleFactCardGestureClose,
  renderCameraError,
  renderLevel5HUD,
  setLevel5HUDAnswerState,
  setLevel5HUDVisible,
  showLevelComplete,
  showPlanetFact,
  triggerWinState,
  updateFactButtonText,
  updateStats,
  updateUIText
} from './js/ui.js';
import { createGameWorld } from './js/game-world.js';
import { createHandTracking, detectGesture } from './js/hand-tracking.js';
import { handleLevel1Interaction } from './js/levels/level1.js';
import { handleLevel2Interaction } from './js/levels/level2.js';
import { handleLevel3Interaction } from './js/levels/level3.js';
import { handleLevel4Interaction } from './js/levels/level4.js';
import { handleLevel5Interaction } from './js/levels/level5.js';

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

function returnSpaceObjectToSpawn(object) {
  gsap.to(object.mesh.position, { x: object.spawnX, y: object.spawnY, z: 8, duration: 0.8, ease: 'back.out(1.2)' });
  if (object.artSprite) {
    gsap.to(object.artSprite.position, { x: object.spawnX, y: object.spawnY + 12, z: 7, duration: 0.8, ease: 'back.out(1.2)' });
  }
  gsap.to(object.label.position, { x: object.spawnX, y: object.spawnY + 3.5, z: 10, duration: 0.8, ease: 'back.out(1.2)' });
}

function returnClassificationItemToSpawn(item) {
  gsap.to(item.mesh.position, { x: item.spawnX, y: item.spawnY, z: 8, duration: 0.8, ease: 'back.out(1.2)' });
  if (item.artSprite) {
    gsap.to(item.artSprite.position, { x: item.spawnX, y: item.spawnY + 10, z: 7, duration: 0.8, ease: 'back.out(1.2)' });
  }
  gsap.to(item.label.position, { x: item.spawnX, y: item.spawnY - 4.5, z: 10, duration: 0.8, ease: 'back.out(1.2)' });
}

function setPresentationForLevel(level) {
  if (level === 5) {
    dom.webcamVideo.style.opacity = '0';
    dom.webcamVideo.style.filter = 'none';
  } else {
    dom.webcamVideo.style.opacity = '1';
    dom.webcamVideo.style.filter = 'grayscale(80%) brightness(0.3) contrast(1.3)';
  }
}

function setCameraForLevel(level, animate = true) {
  const camera = gameWorld.world.camera;
  const target = level === 3
    ? { x: 0, y: 0, z: 255 }
    : level === 4
      ? { x: 0, y: 0, z: 235 }
      : level === 5
        ? { x: 0, y: 0, z: 178 }
        : { x: 0, y: 0, z: 180 };

  gsap.killTweensOf(camera.position);

  if (!animate) {
    camera.position.set(target.x, target.y, target.z);
    camera.lookAt(gameWorld.world.scene.position);
    return;
  }

  gsap.to(camera.position, {
    ...target,
    duration: 0.8,
    ease: 'power2.inOut',
    onUpdate: () => camera.lookAt(gameWorld.world.scene.position)
  });
}

function placeAllPlanetsForDebug() {
  if (gameWorld.world.planets.length === 0) gameWorld.createLevel1Planets();

  gameWorld.world.planets.forEach((planet, index) => {
    planet.placed = true;
    planet.angle = (index / gameWorld.world.planets.length) * Math.PI * 2;
    planet.mesh.position.set(
      Math.cos(planet.angle) * planet.def.dist,
      Math.sin(planet.angle) * planet.def.dist,
      0
    );
  });

  gameWorld.world.orbits.forEach(orbit => {
    orbit.material.opacity = 0.3;
    orbit.material.color.setHex(0x888888);
  });
}

function forceGameplayMode(statusText = getT().statusDrag) {
  state.onboardingComplete = true;
  state.interactionLocked = false;
  state.levelTransitioning = false;
  state.gameStartTime = Date.now();
  dom.onboardingLayer.style.display = 'none';
  dom.onboardingLayer.style.opacity = '0';
  dom.stats.style.display = 'inline-block';
  setLevel5HUDVisible(false);
  updateStats(statusText, '');
  startSpaceBGM();
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

function startLevel2() {
  track('Level 2 Started');
  setLevel5HUDVisible(false);
  state.currentLevel = 2;
  state.grabbedPlanet = null;
  state.grabbedMoon = null;
  state.grabbedSpaceObject = null;
  state.grabbedClassificationItem = null;
  state.activeLevel5Scenario = null;
  state.level5Resolved = false;
  state.level5LastGesture = 'None';
  state.interactionLocked = false;
  state.levelTransitioning = false;

  gsap.to(dom.winLayer, {
    opacity: 0,
    duration: 0.25,
    onComplete: () => {
      dom.winLayer.style.display = 'none';
      dom.winLayer.innerHTML = '';
      gameWorld.createLevel2Moons({ noMoons: getT().level2NoMoons });
      setPresentationForLevel(2);
      setCameraForLevel(2);
      updateStats(getT().statusMoonDrag, '');
    }
  });
}

function startLevel3() {
  track('Level 3 Started');
  setLevel5HUDVisible(false);
  state.currentLevel = 3;
  state.grabbedPlanet = null;
  state.grabbedMoon = null;
  state.grabbedSpaceObject = null;
  state.grabbedClassificationItem = null;
  state.activeLevel5Scenario = null;
  state.level5Resolved = false;
  state.level5LastGesture = 'None';
  state.interactionLocked = false;
  state.levelTransitioning = false;

  gsap.to(dom.winLayer, {
    opacity: 0,
    duration: 0.25,
    onComplete: () => {
      dom.winLayer.style.display = 'none';
      dom.winLayer.innerHTML = '';
      gameWorld.createLevel3Objects();
      setPresentationForLevel(3);
      setCameraForLevel(3);
      updateStats(getT().statusLevel3Drag, '');
    }
  });
}

function getRandomLevel5Scenario() {
  const scenario = level5ScenarioDefs[Math.floor(Math.random() * level5ScenarioDefs.length)];
  return typeof structuredClone === 'function' ? structuredClone(scenario) : JSON.parse(JSON.stringify(scenario));
}

function startLevel4() {
  track('Level 4 Started');
  setLevel5HUDVisible(false);
  state.currentLevel = 4;
  state.grabbedPlanet = null;
  state.grabbedMoon = null;
  state.grabbedSpaceObject = null;
  state.grabbedClassificationItem = null;
  state.activeLevel5Scenario = null;
  state.level5Resolved = false;
  state.level5LastGesture = 'None';
  state.interactionLocked = false;
  state.levelTransitioning = false;

  gsap.to(dom.winLayer, {
    opacity: 0,
    duration: 0.25,
    onComplete: () => {
      dom.winLayer.style.display = 'none';
      dom.winLayer.innerHTML = '';
      gameWorld.createLevel4Classification();
      setPresentationForLevel(4);
      setCameraForLevel(4);
      updateStats(getT().statusLevel4Drag, '');
    }
  });
}

function startLevel5() {
  track('Level 5 Started');
  setLevel5HUDVisible(false);
  state.currentLevel = 5;
  state.grabbedPlanet = null;
  state.grabbedMoon = null;
  state.grabbedSpaceObject = null;
  state.grabbedClassificationItem = null;
  state.interactionLocked = false;
  state.levelTransitioning = false;
  state.level5Resolved = false;
  state.level5LastGesture = 'None';
  state.activeLevel5Scenario = getRandomLevel5Scenario();
  state.level5ReadyAt = Date.now() + 900;

  gsap.to(dom.winLayer, {
    opacity: 0,
    duration: 0.25,
    onComplete: () => {
      dom.winLayer.style.display = 'none';
      dom.winLayer.innerHTML = '';
      gameWorld.createLevel5Question(state.activeLevel5Scenario, {
        kicker: getT().level5Title,
        prompt: getT().level5Question,
        hint: getT().level5Hint,
        lang: state.currentLang
      });
      renderLevel5HUD(state.activeLevel5Scenario);
      setPresentationForLevel(5);
      setCameraForLevel(5);
      updateStats(
        getT().statusLevel5Prompt.replace('{planet}', getT().planetNames[state.activeLevel5Scenario.planet] || state.activeLevel5Scenario.planet),
        ''
      );
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
    handleLevel2Interaction({
      currentGesture,
      handWorldPos,
      moons: gameWorld.world.moons,
      planets: gameWorld.world.planets,
      scene: gameWorld.world.scene,
      camera: gameWorld.world.camera,
      state,
      getT,
      updateStats,
      playSuccessSFX,
      playErrorSFX,
      showLevelComplete,
      track,
      returnMoonToSpawn
    });
    return;
  }

  if (state.currentLevel === 3) {
    handleLevel3Interaction({
      currentGesture,
      handWorldPos,
      spaceObjects: gameWorld.world.spaceObjects,
      zones: gameWorld.world.level3Zones,
      state,
      getT,
      updateStats,
      playSuccessSFX,
      playErrorSFX,
      showLevelComplete,
      track,
      returnSpaceObjectToSpawn
    });
    return;
  }

  if (state.currentLevel === 4) {
    handleLevel4Interaction({
      currentGesture,
      handWorldPos,
      items: gameWorld.world.level4Items,
      buckets: gameWorld.world.level4Buckets,
      state,
      getT,
      updateStats,
      playSuccessSFX,
      playErrorSFX,
      showLevelComplete,
      track,
      returnClassificationItemToSpawn
    });
    return;
  }

  if (state.currentLevel === 5) {
    handleLevel5Interaction({
      currentGesture,
      answers: gameWorld.world.level5Answers,
      state,
      getT,
      updateStats,
      playSuccessSFX,
      playErrorSFX,
      triggerWinState,
      setLevel5HUDAnswerState,
      scene: gameWorld.world.scene,
      camera: gameWorld.world.camera,
      track
    });
    return;
  }

  handleLevel1Interaction({
    currentGesture,
    handWorldPos,
    planets: gameWorld.world.planets,
    orbits: gameWorld.world.orbits,
    state,
    getT,
    updateStats,
    playSuccessSFX,
    playErrorSFX,
    showPlanetFact,
    showLevelComplete,
    track,
    returnPlanetToSpawn
  });
}

function animate() {
  requestAnimationFrame(animate);
  handleInteraction();
  gameWorld.animateEntities(state.grabbedPlanet, state.grabbedMoon, state.grabbedSpaceObject, state.grabbedClassificationItem);
  gameWorld.render();
}

function setupDebugConsole() {
  const badge = 'background:linear-gradient(135deg,#7c3aed,#06b6d4);color:#fff;padding:6px 10px;border-radius:999px;font-weight:700;';

  const api = {
    help() {
      console.log('%cSolary Debug Console', badge);
      console.table([
        { command: 'solaryDebug.goToLevel(1)', effect: 'Jump to planet ordering' },
        { command: 'solaryDebug.goToLevel(2)', effect: 'Jump to moon matching' },
        { command: 'solaryDebug.goToLevel(3)', effect: 'Jump to space objects' },
        { command: 'solaryDebug.goToLevel(4)', effect: 'Jump to classification sorting' },
        { command: 'solaryDebug.goToLevel(5)', effect: 'Jump to survival quiz' },
        { command: 'solaryDebug.win()', effect: 'Open final win screen' },
        { command: 'solaryDebug.state()', effect: 'Inspect current game state' }
      ]);
    },
    goToLevel(level) {
      if (!state.webcamStarted || !state.trackingStarted) {
        console.warn('Start the camera first, then use solaryDebug.goToLevel(level).');
        return;
      }

      forceGameplayMode(
        level === 1 ? getT().statusDrag : level === 2 ? getT().statusMoonDrag : level === 3 ? getT().statusLevel3Drag : level === 4 ? getT().statusLevel4Drag : getT().statusLevel5Prompt.replace('{planet}', 'Planet')
      );

      state.grabbedPlanet = null;
      state.grabbedMoon = null;
      state.grabbedSpaceObject = null;
      state.grabbedClassificationItem = null;
      state.level5Resolved = false;
      state.level5LastGesture = 'None';
      dom.winLayer.style.display = 'none';
      dom.winLayer.style.opacity = '0';
      dom.winLayer.innerHTML = '';
      setLevel5HUDVisible(false);

      if (level === 1) {
        state.currentLevel = 1;
        gameWorld.createLevel1Planets();
        setPresentationForLevel(1);
        setCameraForLevel(1);
        console.log('%cWarped to Level 1 🪐', badge);
        return;
      }

      placeAllPlanetsForDebug();

      if (level === 2) {
        state.currentLevel = 2;
        gameWorld.createLevel2Moons({ noMoons: getT().level2NoMoons });
        setPresentationForLevel(2);
        setCameraForLevel(2);
        updateStats(getT().statusMoonDrag, '');
        console.log('%cWarped to Level 2 🌙', badge);
        return;
      }

      if (level === 3) {
        state.currentLevel = 3;
        gameWorld.createLevel3Objects();
        setPresentationForLevel(3);
        setCameraForLevel(3);
        updateStats(getT().statusLevel3Drag, '');
        console.log('%cWarped to Level 3 ☄️', badge);
        return;
      }

      if (level === 4) {
        state.currentLevel = 4;
        gameWorld.createLevel4Classification();
        setPresentationForLevel(4);
        setCameraForLevel(4);
        updateStats(getT().statusLevel4Drag, '');
        console.log('%cWarped to Level 4 🧪', badge);
        return;
      }

      if (level === 5) {
        state.currentLevel = 5;
        state.activeLevel5Scenario = getRandomLevel5Scenario();
        state.level5ReadyAt = Date.now() + 400;
        gameWorld.createLevel5Question(state.activeLevel5Scenario, {
          kicker: getT().level5Title,
          prompt: getT().level5Question,
          hint: getT().level5Hint,
          lang: state.currentLang
        });
        renderLevel5HUD(state.activeLevel5Scenario);
        setPresentationForLevel(5);
        setCameraForLevel(5);
        updateStats(
          getT().statusLevel5Prompt.replace('{planet}', getT().planetNames[state.activeLevel5Scenario.planet] || state.activeLevel5Scenario.planet),
          ''
        );
        console.log('%cWarped to Level 5 ☠️', badge, state.activeLevel5Scenario.planet);
        return;
      }

      console.warn('Unknown level. Use 1, 2, 3, 4, or 5.');
    },
    win() {
      forceGameplayMode(getT().statusLevel4Win);
      triggerWinState(gameWorld.world.scene, gameWorld.world.camera);
    },
    state() {
      console.log({
        currentLevel: state.currentLevel,
        onboardingComplete: state.onboardingComplete,
        webcamStarted: state.webcamStarted,
        trackingStarted: state.trackingStarted,
        planets: gameWorld.world.planets.length,
        moons: gameWorld.world.moons.length,
        spaceObjects: gameWorld.world.spaceObjects.length,
        classificationItems: gameWorld.world.level4Items.length,
        level5Planet: state.activeLevel5Scenario?.planet || null
      });
    }
  };

  window.solaryDebug = api;
  console.log('%cSolary debug ready. Type solaryDebug.help()', badge);
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
    onStartLevel2: startLevel2,
    onStartLevel3: startLevel3,
    onStartLevel4: startLevel4,
    onStartLevel5: startLevel5
  });

  dom.bgmToggle.addEventListener('click', toggleBGM);
  dom.langEn.addEventListener('click', () => applyLanguage('en'));
  dom.langId.addEventListener('click', () => applyLanguage('id'));

  if (state.savedLang) applyLanguage(state.savedLang);
  else updateUIText();

  gameWorld.init();
  setPresentationForLevel(1);
  setupDebugConsole();
  animate();

  gsap.from('#ui-header', { y: -30, opacity: 0, duration: 1, ease: 'power3.out' });
  gsap.from('#top-controls', { y: -30, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.2 });
  gsap.from('#onboarding-layer', { scale: 0.9, opacity: 0, duration: 1, ease: 'back.out(1.2)', delay: 0.4 });
}

window.addEventListener('DOMContentLoaded', bootstrap);
