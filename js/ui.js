import { dom } from './dom.js';
import { getLevel5ScenarioFact, planetFacts } from './data.js';
import { state, getT } from './state.js';
import { playGachaRevealSFX, playSuccessSFX } from './audio.js';

const actions = {
  onContinueFromMobile: () => {},
  onChooseLanguage: () => {},
  onStartScanner: () => {},
  onStartLevel2: () => {},
  onStartLevel3: () => {},
  onStartLevel4: () => {},
  onStartLevel5: () => {}
};

function track(event, payload = {}) {
  if (window.umami) window.umami.track(event, payload);
}

function clearChildren(element) {
  element.innerHTML = '';
}


function createButton(label, onClick, extraClass = '') {
  const button = document.createElement('button');
  button.className = `ob-btn ${extraClass}`.trim();
  button.textContent = label;
  button.addEventListener('click', onClick);
  return button;
}

function updateLanguageControls() {
  dom.langEn.className = state.currentLang === 'en' ? 'active' : '';
  dom.langId.className = state.currentLang === 'id' ? 'active' : '';
}

function updateDocumentText(t) {
  document.documentElement.lang = state.currentLang;
  document.title = t.pageTitle;
  document.querySelector('meta[name="description"]')?.setAttribute('content', t.metaDescription);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', t.pageTitle);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', t.metaDescription);
  document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', t.pageTitle);
  document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', t.metaDescription);

  dom.uiLogo.alt = t.logoAlt;
  dom.bgmToggle.title = t.musicToggleLabel;
  dom.bgmToggle.setAttribute('aria-label', t.musicToggleLabel);
  dom.langEn.innerText = t.languageEnglishCode;
  dom.langEn.title = t.languageEnglish;
  dom.langEn.setAttribute('aria-label', t.languageEnglish);
  dom.langId.innerText = t.languageIndonesianCode;
  dom.langId.title = t.languageIndonesian;
  dom.langId.setAttribute('aria-label', t.languageIndonesian);
  dom.factImage.alt = t.factImageAlt;
  dom.factKicker.innerText = t.funFact;
  dom.factTitle.innerText = t.planetNames.Earth;
  dom.factContinue.innerText = t.btnContinue;
}

export function configureUIActions(nextActions) {
  Object.assign(actions, nextActions);
}

let _statsFadeTimer = null;

export function updateStats(text, className = '') {
  if (state.currentLevel === 5) {
    dom.stats.style.display = 'none';
    dom.stats.innerText = '';
    dom.stats.className = '';
    return;
  }

  // Cancel any pending fade-out and ensure full visibility
  if (_statsFadeTimer) { clearTimeout(_statsFadeTimer); _statsFadeTimer = null; }
  gsap.killTweensOf(dom.stats, 'opacity');
  dom.stats.style.display = 'inline-block';
  gsap.set(dom.stats, { opacity: 1 });

  if (dom.stats.innerText === text && dom.stats.className === className) {
    scheduleStatsFade(className);
    return;
  }
  dom.stats.innerText = text;
  dom.stats.className = className;
  gsap.fromTo(dom.stats, { scale: 1.08 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });

  if (className === 'error-text') {
    gsap.fromTo(dom.stats, { x: -10 }, { x: 0, duration: 0.4, ease: 'elastic.out(2, 0.2)' });
  }

  scheduleStatsFade(className);
}

function scheduleStatsFade(className) {
  // Feedback messages stay a bit longer than idle hints
  const delay = (className === 'success-text' || className === 'error-text') ? 3500 : 2500;
  _statsFadeTimer = setTimeout(() => {
    gsap.to(dom.stats, { opacity: 0, duration: 0.6, ease: 'power2.in', onComplete: () => {
      dom.stats.style.display = 'none';
    }});
    _statsFadeTimer = null;
  }, delay);
}

export function updateFactButtonText() {
  const t = getT();
  dom.factContinue.innerText = t.btnContinue;
  dom.factKicker.innerText = t.funFact;

  if (!state.activeFactPlanet) return;

  const fact = planetFacts[state.activeFactPlanet];
  dom.factTitle.innerText = t.planetNames[state.activeFactPlanet];
  dom.factText.innerText = fact[state.currentLang];
}

function renderOnboardingActions() {
  const t = getT();
  clearChildren(dom.obActions);

  if (state.obState === 'mobileWarning') {
    dom.obActions.appendChild(createButton(t.mobileWarnBtn, actions.onContinueFromMobile));
    return;
  }

  if (state.obState === 'langSelect') {
    dom.obActions.appendChild(createButton(t.languageEnglish, () => actions.onChooseLanguage('en')));
    dom.obActions.appendChild(createButton(t.languageIndonesian, () => actions.onChooseLanguage('id')));
    return;
  }

  if (state.obState === 'intro') {
    dom.obActions.appendChild(createButton(t.introBtn, actions.onStartScanner));
  }
}

export function updateUIText() {
  const t = getT();
  updateDocumentText(t);
  updateLanguageControls();
  dom.uiTitle.innerText = t.title;

  const renderContent = () => {
    if (state.obState === 'mobileWarning') {
      dom.obTitle.innerText = t.mobileWarnTitle;
      dom.obContent.innerHTML = `<p>${t.mobileWarnText}</p>`;
    } else if (state.obState === 'langSelect') {
      dom.obTitle.innerText = t.langTitle;
      dom.obContent.innerHTML = '';
    } else if (state.obState === 'intro') {
      dom.obTitle.innerText = t.introTitle;
      dom.obContent.innerHTML = `<p>${t.introText}</p>`;
    } else if (state.obState === 'requestCam') {
      dom.obTitle.innerText = t.camTitle;
      dom.obContent.innerHTML = `<p>${t.camText}</p>`;
    } else if (state.obState === 'loading') {
      dom.obTitle.innerText = t.loadingTitle;
      dom.obContent.innerHTML = `<p>${t.loadingText}</p>`;
    } else if (state.obState === 'guide') {
      dom.obTitle.innerText = t.guideTitle;
      dom.obContent.innerHTML = `
        <p>${t.guideText1}</p>
        <p>${t.guideText2}</p>
        <br />
        <p><strong>${t.guideAction}</strong></p>
      `;
    }

    renderOnboardingActions();
  };

  if (state.isFirstRender) {
    state.isFirstRender = false;
    renderContent();
    gsap.set([dom.obTitle, dom.obContent, dom.obActions], { opacity: 1 });
  } else {
    gsap.killTweensOf([dom.obTitle, dom.obContent, dom.obActions]);
    gsap.to([dom.obTitle, dom.obContent, dom.obActions], {
      opacity: 0,
      duration: 0.15,
      onComplete: () => {
        renderContent();
        gsap.fromTo([dom.obTitle, dom.obContent, dom.obActions], { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.05 });
      }
    });
  }
}

export function renderCameraError() {
  const t = getT();
  dom.obContent.innerHTML = `<p class="error-text">${t.cameraError}</p>`;
  clearChildren(dom.obActions);
  dom.obActions.appendChild(createButton(t.btnRetry, actions.onStartScanner));
}

export function showPlanetFact(planetName, onDone) {
  const t = getT();
  const fact = planetFacts[planetName];
  if (!fact) {
    onDone?.();
    return;
  }

  state.interactionLocked = true;
  state.activeFactPlanet = planetName;
  state.factClosedByGesture = false;

  dom.factKicker.innerText = t.funFact;
  dom.factTitle.innerText = t.planetNames[planetName];
  dom.factText.innerText = fact[state.currentLang];
  dom.factImage.src = fact.image;
  dom.factContinue.innerText = t.btnContinue;

  dom.factLayer.style.display = 'flex';
  dom.factLayer.style.opacity = '0';

  const factBox = dom.factLayer.querySelector('.fact-box');
  factBox.classList.remove('revealing');

  requestAnimationFrame(() => {
    factBox.classList.add('revealing');
    playGachaRevealSFX();
  });

  gsap.to(dom.factLayer, { opacity: 1, duration: 0.3 });
  gsap.fromTo('.fact-box', { y: 30, scale: 0.94 }, { y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.4)' });

  const closeFact = () => {
    dom.factContinue.removeEventListener('click', closeFact);
    state.factCloseHandler = null;

    gsap.to(dom.factLayer, {
      opacity: 0,
      duration: 0.25,
      onComplete: () => {
        dom.factLayer.style.display = 'none';
        state.interactionLocked = false;
        state.activeFactPlanet = null;
        state.factClosedByGesture = false;
        onDone?.();
      }
    });
  };

  state.factCloseHandler = closeFact;
  state.factCanCloseAt = Date.now() + 900;
  dom.factContinue.addEventListener('click', closeFact);
}

export function handleFactCardGestureClose(currentGesture) {
  if (!state.activeFactPlanet || !state.factCloseHandler) return false;

  if (currentGesture === 'ThumbsUp' && Date.now() > state.factCanCloseAt && !state.factClosedByGesture) {
    state.factClosedByGesture = true;
    playSuccessSFX();
    state.factCloseHandler();
    return true;
  }

  return false;
}

export function showLevelComplete(levelNumber) {
  if (state.levelTransitioning) return;

  state.levelTransitioning = true;
  state.interactionLocked = true;

  const t = getT();
  const config = {
    1: { title: t.level1CompleteTitle, fact: t.level1Fact, buttonLabel: t.level2Btn, onClick: actions.onStartLevel2 },
    2: { title: t.statusMoonWin, fact: t.level2Fact, buttonLabel: t.level3Btn, onClick: actions.onStartLevel3 },
    3: { title: t.statusLevel3Win, fact: t.level3Fact, buttonLabel: t.level4Btn, onClick: actions.onStartLevel4 },
    4: { title: t.statusLevel4Win, fact: t.level4Fact, instruction: t.level5HowToPlay, buttonLabel: t.level5Btn, onClick: actions.onStartLevel5 },
    5: { title: t.statusLevel5Win, fact: getLevel5ScenarioFact(state.activeLevel5Scenario, state.currentLang) || t.level4Fact, buttonLabel: t.btnRestart, onClick: () => location.reload() }
  }[levelNumber];

  dom.winLayer.style.display = 'flex';
  dom.winLayer.style.opacity = '0';
  dom.winLayer.innerHTML = `
    <div class="win-box">
      <img src="logo.png" alt="${t.logoAlt}" style="height:80px; margin-bottom:20px;" />
      <h1>${config.title}</h1>
      <p>${config.fact}</p>
      ${config.instruction ? `<p class="level-complete-instruction">${config.instruction}</p>` : ''}
      <button class="ob-btn" id="level-complete-btn">${config.buttonLabel}</button>
    </div>
  `;

  dom.winLayer.querySelector('#level-complete-btn').addEventListener('click', config.onClick);

  gsap.to(dom.winLayer, { opacity: 1, duration: 0.5 });
  gsap.fromTo('.win-box', { scale: 0.8, y: 30 }, { scale: 1, y: 0, duration: 0.7, ease: 'back.out(1.2)' });
}

export function showLevel5Guide(onStart) {
  const t = getT();

  dom.winLayer.style.display = 'flex';
  dom.winLayer.style.opacity = '0';
  dom.winLayer.innerHTML = `
    <div class="win-box">
      <img src="logo.png" alt="${t.logoAlt}" style="height:80px; margin-bottom:20px;" />
      <h1>${t.level5Title}</h1>
      <p class="level-complete-instruction">${t.level5HowToPlay}</p>
      <button class="ob-btn" id="level5-guide-start">${t.level5Btn}</button>
    </div>
  `;

  dom.winLayer.querySelector('#level5-guide-start').addEventListener('click', () => {
    gsap.to(dom.winLayer, {
      opacity: 0,
      duration: 0.25,
      onComplete: () => {
        dom.winLayer.style.display = 'none';
        dom.winLayer.innerHTML = '';
        onStart?.();
      }
    });
  });

  gsap.to(dom.winLayer, { opacity: 1, duration: 0.35 });
  gsap.fromTo('.win-box', { scale: 0.92, y: 20 }, { scale: 1, y: 0, duration: 0.45, ease: 'back.out(1.2)' });
}

async function shareScorecard(timeStr, acc, rawText, btnElem) {
  const t = getT();
  const originalText = btnElem.innerText;
  btnElem.innerText = t.btnLoading;
  btnElem.style.pointerEvents = 'none';

  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#0f0f0f';
  ctx.fillRect(0, 0, 1080, 1080);
  for (let i = 0; i < 150; i++) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random()})`;
    ctx.beginPath();
    ctx.arc(Math.random() * 1080, Math.random() * 1080, Math.random() * 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  const logoImg = new Image();
  logoImg.src = 'logo.png';
  await new Promise(resolve => {
    logoImg.onload = resolve;
    logoImg.onerror = resolve;
  });

  ctx.textAlign = 'center';
  if (logoImg.naturalWidth > 0) {
    const logoHeight = 150;
    const logoWidth = (logoImg.naturalWidth / logoImg.naturalHeight) * logoHeight;
    ctx.drawImage(logoImg, 540 - logoWidth / 2, 90, logoWidth, logoHeight);
    ctx.fillStyle = '#fff';
    ctx.font = '300 60px Inter, sans-serif';
    ctx.fillText('SOLARY', 540, 310);
  } else {
    ctx.fillStyle = '#fff';
    ctx.font = '300 100px Inter, sans-serif';
    ctx.fillText('SOLARY', 540, 280);
  }

  ctx.fillStyle = '#ccc';
  ctx.font = '300 40px Inter, sans-serif';
  ctx.fillText(t.statusWin, 540, 380);
  ctx.fillStyle = 'rgba(25,25,25,0.85)';
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 3;

  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(240, 460, 600, 280, 20);
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.fillRect(240, 460, 600, 280);
  }

  ctx.fillStyle = '#fff';
  ctx.font = '300 40px Inter, sans-serif';
  ctx.fillText(t.scorecardTimeLabel, 540, 550);
  ctx.font = '600 65px Inter, sans-serif';
  ctx.fillText(timeStr, 540, 620);
  ctx.font = '300 40px Inter, sans-serif';
  ctx.fillText(`${t.scorecardAccuracyLabel}: ${acc}%`, 540, 690);
  ctx.fillStyle = '#888';
  ctx.font = '400 35px Inter, sans-serif';
  ctx.fillText('solary.litegral.com', 540, 980);

  const restoreBtn = successText => {
    btnElem.innerText = successText || originalText;
    btnElem.style.pointerEvents = 'auto';
  };

  canvas.toBlob(async blob => {
    if (!blob) return restoreBtn();

    const file = new File([blob], 'solary-scorecard.png', { type: 'image/png' });
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ title: 'Solary', text: rawText, files: [file] });
        track('Share Success', { method: 'Web Share API' });
        restoreBtn(t.shareSuccess);
        return;
      }
    } catch (_) {}

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'solary-scorecard.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    track('Share Success', { method: 'Download' });
    restoreBtn(t.btnDownloaded);
  }, 'image/png');
}

export function triggerWinState(scene, camera) {
  track('Game Won');
  state.interactionLocked = true;

  const t = getT();
  const timeTaken = Math.floor((Date.now() - state.gameStartTime) / 1000);
  const m = Math.floor(timeTaken / 60);
  const s = timeTaken % 60;
  const timeStr = m > 0 ? `${m}${t.minuteUnit} ${s}${t.secondUnit}` : `${s}${t.secondUnit}`;
  const acc = state.totalDrops > 0 ? Math.max(0, Math.round(((state.totalDrops - state.mistakeCount) / state.totalDrops) * 100)) : 100;
  const statsText = t.winStats.replace('{time}', timeStr).replace('{acc}', acc);
  const shareTextRaw = t.shareText.replace('{time}', timeStr).replace('{acc}', acc);
  const finalFact = state.currentLevel >= 5
    ? (getLevel5ScenarioFact(state.activeLevel5Scenario, state.currentLang) || t.level4Fact)
    : state.currentLevel >= 4
      ? t.level4Fact
      : t.level3Fact;

  dom.winLayer.style.display = 'flex';
  dom.winLayer.style.opacity = '0';
  dom.winLayer.innerHTML = `
    <div class="win-box">
      <img src="logo.png" alt="${t.logoAlt}" style="height:80px; margin-bottom:20px;" />
      <h1>✨ ${t.statusWin} ✨</h1>
      <p>${statsText}</p>
      <p style="max-width:560px; margin: 0 auto 30px;">${finalFact}</p>
      <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap;">
        <button class="ob-btn" id="restart-btn">${t.btnRestart}</button>
        <button class="ob-btn" id="share-btn" style="background: rgba(255,255,255,0.08);">${t.btnShare}</button>
      </div>
    </div>
  `;

  dom.winLayer.querySelector('#restart-btn').addEventListener('click', () => location.reload());
  dom.winLayer.querySelector('#share-btn').addEventListener('click', function () {
    shareScorecard(timeStr, acc, shareTextRaw, this);
  });

  gsap.to(dom.winLayer, { opacity: 1, duration: 0.7 });
  gsap.fromTo('.win-box', { scale: 0.5, y: 50 }, { scale: 1, y: 0, duration: 1.1, ease: 'elastic.out(1, 0.55)' });
  gsap.to(dom.uiLayer, { y: -50, opacity: 0, duration: 0.5 });
  gsap.to(dom.topControls, { y: -50, opacity: 0, duration: 0.5 });
  gsap.to(camera.position, {
    z: 220,
    y: -60,
    x: 0,
    duration: 6,
    ease: 'power2.inOut',
    onUpdate: () => camera.lookAt(scene.position)
  });
}
