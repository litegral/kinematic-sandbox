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
import { handleLevel1Interaction } from './js/levels/level1.js';
import { handleLevel2Interaction } from './js/levels/level2.js';

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
      triggerWinState,
      track,
      returnMoonToSpawn
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
