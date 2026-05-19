import { i18n } from './data.js';

const savedLang = localStorage.getItem('userLang');
const currentLang = savedLang || 'en';
const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth <= 768;

export const state = {
  currentLang,
  savedLang,
  isMobile,
  obState: isMobile ? 'mobileWarning' : (savedLang ? 'intro' : 'langSelect'),
  isFirstRender: true,
  currentLevel: 1,
  grabbedPlanet: null,
  grabbedMoon: null,
  grabbedSpaceObject: null,
  grabbedClassificationItem: null,
  activeLevel5Scenario: null,
  level5ReadyAt: 0,
  level5LastGesture: 'None',
  level5Resolved: false,
  onboardingComplete: false,
  trackingInitialized: false,
  levelTransitioning: false,
  interactionLocked: false,
  activeFactPlanet: null,
  factCloseHandler: null,
  factCanCloseAt: 0,
  factClosedByGesture: false,
  gameStartTime: 0,
  mistakeCount: 0,
  totalDrops: 0,
  handLandmarks: null,
  lastVideoTime: -1,
  webcamStarted: false,
  trackingStarted: false
};

export function getT() {
  return i18n[state.currentLang];
}

export function setLanguage(langCode) {
  state.currentLang = langCode;
  localStorage.setItem('userLang', langCode);
}
