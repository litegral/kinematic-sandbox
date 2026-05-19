export const dom = {};

export function cacheDom() {
  dom.uiLayer = document.getElementById('ui-layer');
  dom.uiTitle = document.getElementById('ui-title');
  dom.stats = document.getElementById('stats');
  dom.topControls = document.getElementById('top-controls');
  dom.bgmToggle = document.getElementById('bgm-toggle');
  dom.langEn = document.getElementById('lang-en');
  dom.langId = document.getElementById('lang-id');
  dom.onboardingLayer = document.getElementById('onboarding-layer');
  dom.obTitle = document.getElementById('ob-title');
  dom.obContent = document.getElementById('ob-content');
  dom.obActions = document.getElementById('ob-actions');
  dom.winLayer = document.getElementById('win-layer');
  dom.factLayer = document.getElementById('fact-layer');
  dom.factKicker = document.getElementById('fact-kicker');
  dom.factTitle = document.getElementById('fact-title');
  dom.factText = document.getElementById('fact-text');
  dom.factImage = document.getElementById('fact-image');
  dom.factContinue = document.getElementById('fact-continue');
  dom.webcamVideo = document.getElementById('webcam-video');
  dom.canvasContainer = document.getElementById('canvas-container');
}
