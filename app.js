let factCloseHandler = null;
let factCanCloseAt = 0;
let factClosedByGesture = false;

const i18n = {
    en: {
        title: 'Solary',
        statusDrag: 'Drag the planets to their correct rings.',
        statusCorrect: 'Great job! You placed {planet}.',
        statusWrong: 'Oops! That ring belongs to {target}.',
        statusWin: 'You did it! Solary is complete!',
        level1CompleteTitle: 'Level 1 Complete',
        level1Fact: 'The planets are arranged by their average distance from the Sun, from Mercury to Neptune.',
        level2Title: 'Level 2 — Match the Moons',
        level2Btn: 'Start Level 2',
        statusMoonDrag: 'Drag each moon to its parent planet.',
        statusMoonCorrect: 'Great job! {moon} belongs to {planet}.',
        statusMoonWrong: 'Oops! {moon} does not belong to {planet}.',
        statusMoonWin: 'You matched all the moons!',
        level2Fact: 'Jupiter has over 100 officially recognized moons, including Io, Europa, Ganymede, and Callisto.',

        langTitle: 'Select Language / Pilih Bahasa',
        introTitle: 'Welcome to Solary',
        introText: 'In this game, you will use your hands to grab planets and put them in the correct order around the Sun.',
        introBtn: 'Start Camera',
        camTitle: 'Camera Needed',
        camText: "Please click 'Allow' when your browser asks for camera access so the game can see your hands.",
        loadingTitle: 'Getting Ready...',
        loadingText: 'Camera is on. Please show your hand to the camera...',
        guideTitle: "You're Ready to Play!",
        guideText1: 'Use your hand like a claw machine.',
        guideText2: '<strong>Pinch</strong> your fingers to grab a planet.<br/><strong>Open</strong> your hand to drop it in a ring.',
        guideAction: 'Show a 👍 (Thumbs Up) to the camera to start playing!',
        btnRestart: 'Play Again',
        btnShare: 'Share Results',
        btnContinue: 'Continue / 👍',
        funFact: 'Fun Fact',
        winStats: 'Time: {time} | Accuracy: {acc}%',
        shareText: 'I completed the Solar System in Solary! 🪐\n⏱️ Time: {time}\n🎯 Accuracy: {acc}%\nPlay with your hands at: https://solary.litegral.com',
        shareSuccess: 'Copied!',
        mobileWarnTitle: 'Bigger Screen Recommended',
        mobileWarnText: 'For the best <i>Augmented Reality</i> experience, please use a device with a larger screen.',
        mobileWarnBtn: 'Continue Anyway',
        planetNames: {
            Mercury: 'Mercury', Venus: 'Venus', Earth: 'Earth', Mars: 'Mars',
            Jupiter: 'Jupiter', Saturn: 'Saturn', Uranus: 'Uranus', Neptune: 'Neptune'
        }
    },
    id: {
        title: 'Solary',
        statusDrag: 'Tarik planet ke cincin yang tepat.',
        statusCorrect: 'Bagus! Kamu menempatkan {planet}.',
        statusWrong: 'Ups! Cincin itu milik {target}.',
        statusWin: 'Berhasil! Solary sudah lengkap!',
        level1CompleteTitle: 'Level 1 Selesai',
        level1Fact: 'Planet disusun berdasarkan jarak rata-ratanya dari Matahari, dari Merkurius hingga Neptunus.',
        level2Title: 'Level 2 — Cocokkan Bulan',
        level2Btn: 'Mulai Level 2',
        statusMoonDrag: 'Tarik setiap bulan ke planet induknya.',
        statusMoonCorrect: 'Bagus! {moon} adalah bulan milik {planet}.',
        statusMoonWrong: 'Ups! {moon} bukan milik {planet}.',
        statusMoonWin: 'Kamu berhasil mencocokkan semua bulan!',
        level2Fact: 'Jupiter memiliki lebih dari 100 bulan yang diakui secara resmi, termasuk Io, Europa, Ganymede, dan Callisto.',

        langTitle: 'Select Language / Pilih Bahasa',
        introTitle: 'Selamat Datang di Solary',
        introText: 'Di permainan ini, kamu akan menggunakan tanganmu untuk mengambil planet dan menyusunnya mengelilingi Matahari.',
        introBtn: 'Nyalakan Kamera',
        camTitle: 'Butuh Kamera',
        camText: "Mohon klik 'Izinkan' saat browser meminta akses kamera agar permainan bisa melihat tanganmu.",
        loadingTitle: 'Bersiap-siap...',
        loadingText: 'Kamera kamu sudah terdeteksi. Silakan tunjukkan tanganmu ke kamera...',
        guideTitle: 'Kamu Siap Bermain!',
        guideText1: 'Gunakan tanganmu seperti mesin capit.',
        guideText2: '<strong>Jepit</strong> jarimu untuk mengambil planet.<br/><strong>Buka</strong> tanganmu untuk meletakkannya di cincin.',
        guideAction: 'Tunjukkan 👍 (Jempol) ke kamera untuk mulai bermain!',
        btnRestart: 'Main Lagi',
        btnShare: 'Bagikan Hasil',
        btnContinue: 'Lanjut / 👍',
        funFact: 'Fakta Menarik',
        winStats: 'Waktu: {time} | Akurasi: {acc}%',
        shareText: 'Saya berhasil menyusun Tata Surya di Solary! 🪐\n⏱️ Waktu: {time}\n🎯 Akurasi: {acc}%\nMainkan dengan tanganmu di: https://solary.litegral.com',
        shareSuccess: 'Disalin!',
        mobileWarnTitle: 'Disarankan Layar Lebih Besar',
        mobileWarnText: 'Untuk pengalaman <i>Augmented Reality</i> terbaik, silakan gunakan perangkat dengan layar yang lebih besar.',
        mobileWarnBtn: 'Tetap Lanjutkan',
        planetNames: {
            Mercury: 'Merkurius', Venus: 'Venus', Earth: 'Bumi', Mars: 'Mars',
            Jupiter: 'Yupiter', Saturn: 'Saturnus', Uranus: 'Uranus', Neptune: 'Neptunus'
        }
    }
};

const planetDefs = [
    { name: 'Mercury', texture: 'textures/2k_mercury.jpg', radius: 2.2, dist: 16, speed: 0.0415, spin: 0.00034 },
    { name: 'Venus', texture: 'textures/2k_venus_surface.jpg', radius: 3.3, dist: 24, speed: 0.0162, spin: -0.00008 },
    { name: 'Earth', texture: 'textures/2k_earth_daymap.jpg', radius: 3.6, dist: 33, speed: 0.0100, spin: 0.0200 },
    { name: 'Mars', texture: 'textures/2k_mars.jpg', radius: 2.7, dist: 41, speed: 0.0053, spin: 0.0195 },
    { name: 'Jupiter', texture: 'textures/2k_jupiter.jpg', radius: 7.8, dist: 55, speed: 0.00084, spin: 0.0484 },
    { name: 'Saturn', texture: 'textures/2k_saturn.jpg', radius: 6.7, dist: 72, speed: 0.00034, spin: 0.0448 },
    { name: 'Uranus', texture: 'textures/2k_uranus.jpg', radius: 4.9, dist: 87, speed: 0.00012, spin: -0.0279 },
    { name: 'Neptune', texture: 'textures/2k_neptune.jpg', radius: 4.6, dist: 100, speed: 0.00006, spin: 0.0298 }
];

const moonDefs = [
    { name: 'Moon', parent: 'Earth' },
    { name: 'Phobos', parent: 'Mars' },
    { name: 'Deimos', parent: 'Mars' },
    { name: 'Io', parent: 'Jupiter' },
    { name: 'Europa', parent: 'Jupiter' },
    { name: 'Ganymede', parent: 'Jupiter' },
    { name: 'Callisto', parent: 'Jupiter' },
    { name: 'Titan', parent: 'Saturn' },
    { name: 'Enceladus', parent: 'Saturn' },
    { name: 'Titania', parent: 'Uranus' },
    { name: 'Oberon', parent: 'Uranus' },
    { name: 'Triton', parent: 'Neptune' }
];

const planetFacts = {
    Mercury: {
        image: 'illustrations/mercury-card.png',
        en: 'Mercury is the closest planet to the Sun, but it is not the hottest planet. Venus is hotter because of its thick atmosphere.',
        id: 'Merkurius adalah planet terdekat dari Matahari, tetapi bukan yang terpanas. Venus justru lebih panas karena atmosfernya sangat tebal.'
    },
    Venus: {
        image: 'illustrations/venus-card.png',
        en: 'A day on Venus is longer than a year on Venus. It spins very slowly and in the opposite direction of most planets.',
        id: 'Satu hari di Venus lebih lama daripada satu tahun di Venus. Venus berputar sangat lambat dan arahnya berlawanan dengan kebanyakan planet.'
    },
    Earth: {
        image: 'illustrations/earth-card.png',
        en: 'Earth is the only known planet that supports life, thanks to liquid water, a protective atmosphere, and the right temperature range.',
        id: 'Bumi adalah satu-satunya planet yang diketahui mendukung kehidupan, berkat air cair, atmosfer pelindung, dan suhu yang sesuai.'
    },
    Mars: {
        image: 'illustrations/mars-card.png',
        en: 'Mars is home to Olympus Mons, the largest volcano in the solar system. It is about three times taller than Mount Everest.',
        id: 'Mars memiliki Olympus Mons, gunung berapi terbesar di tata surya. Tingginya sekitar tiga kali Gunung Everest.'
    },
    Jupiter: {
        image: 'illustrations/jupiter-card.png',
        en: 'Jupiter is the largest planet in the solar system. More than 1,300 Earths could fit inside it by volume.',
        id: 'Jupiter adalah planet terbesar di tata surya. Secara volume, lebih dari 1.300 Bumi bisa muat di dalamnya.'
    },
    Saturn: {
        image: 'illustrations/saturn-card.png',
        en: 'Saturn is famous for its beautiful rings, which are made mostly of ice and rock particles.',
        id: 'Saturnus terkenal dengan cincinnya yang indah, yang sebagian besar tersusun dari partikel es dan batu.'
    },
    Uranus: {
        image: 'illustrations/uranus-card.png',
        en: 'Uranus rotates on its side, making it look like a planet that rolls around the Sun.',
        id: 'Uranus berotasi miring ke samping, sehingga tampak seperti planet yang menggelinding mengelilingi Matahari.'
    },
    Neptune: {
        image: 'illustrations/neptune-card.png',
        en: 'Neptune has some of the fastest winds in the solar system, reaching over 2,000 kilometers per hour.',
        id: 'Neptunus memiliki salah satu angin tercepat di tata surya, yang bisa mencapai lebih dari 2.000 kilometer per jam.'
    }
};

let currentLang = localStorage.getItem('userLang') || 'en';
let savedLang = localStorage.getItem('userLang');
let isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth <= 768;
let obState = isMobile ? 'mobileWarning' : (savedLang ? 'intro' : 'langSelect');
let isFirstRender = true;

let scene, camera, renderer, sun, starField;
let handsInstance, handLandmarks = null, lastVideoTime = -1;
let offscreenCanvas = null, offscreenCtx = null;
const CAM_PADDING = 100;
let handMeshes = [];

let planets = [];
let orbits = [];
let moons = [];
let textureLoader = null;

let currentLevel = 1;
let grabbedPlanet = null;
let grabbedMoon = null;
let onboardingComplete = false;
let trackingInitialized = false;
let levelTransitioning = false;
let interactionLocked = false;
let activeFactPlanet = null;

let gameStartTime = 0;
let mistakeCount = 0;
let totalDrops = 0;

let audioCtx;
let masterGainNode;
let bgmPlaying = false;
let bgmManuallyMuted = false;

const iconMuted = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
const iconPlaying = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;

function track(event, payload = {}) {
    if (window.umami) window.umami.track(event, payload);
}

function getT() {
    return i18n[currentLang];
}

function setLanguage(langCode) {
    currentLang = langCode;
    localStorage.setItem('userLang', langCode);
    document.getElementById('lang-en').className = langCode === 'en' ? 'active' : '';
    document.getElementById('lang-id').className = langCode === 'id' ? 'active' : '';
    updateUIText();
    updateFactButtonText();
}

function chooseLanguage(langCode) {
    track('Language Selected', { language: langCode });
    setLanguage(langCode);
    obState = 'intro';
    updateUIText();
}

function continueFromMobile() {
    track('Mobile Warning Dismissed');
    obState = savedLang ? 'intro' : 'langSelect';
    updateUIText();
}

function updateUIText() {
    const t = getT();
    document.getElementById('ui-title').innerText = t.title;
    const obTitle = document.getElementById('ob-title');
    const obContent = document.getElementById('ob-content');
    const obActions = document.getElementById('ob-actions');

    const renderContent = () => {
        obActions.innerHTML = '';

        if (obState === 'mobileWarning') {
            obTitle.innerText = t.mobileWarnTitle;
            obContent.innerHTML = `<p>${t.mobileWarnText}</p>`;
            obActions.innerHTML = `<button class="ob-btn" onclick="continueFromMobile()">${t.mobileWarnBtn}</button>`;
        } else if (obState === 'langSelect') {
            obTitle.innerText = t.langTitle;
            obContent.innerHTML = '';
            obActions.innerHTML = `
        <button class="ob-btn" onclick="chooseLanguage('en')">English</button>
        <button class="ob-btn" onclick="chooseLanguage('id')">Bahasa Indonesia</button>
      `;
        } else if (obState === 'intro') {
            obTitle.innerText = t.introTitle;
            obContent.innerHTML = `<p>${t.introText}</p>`;
            obActions.innerHTML = `<button class="ob-btn" onclick="startScanner()">${t.introBtn}</button>`;
        } else if (obState === 'requestCam') {
            obTitle.innerText = t.camTitle;
            obContent.innerHTML = `<p>${t.camText}</p>`;
        } else if (obState === 'loading') {
            obTitle.innerText = t.loadingTitle;
            obContent.innerHTML = `<p>${t.loadingText}</p>`;
        } else if (obState === 'guide') {
            obTitle.innerText = t.guideTitle;
            obContent.innerHTML = `
        <p>${t.guideText1}</p>
        <p>${t.guideText2}</p>
        <br />
        <p><strong>${t.guideAction}</strong></p>
      `;
        }
    };

    if (isFirstRender) {
        isFirstRender = false;
        renderContent();
        gsap.set([obTitle, obContent, obActions], { opacity: 1 });
    } else {
        gsap.killTweensOf([obTitle, obContent, obActions]);
        gsap.to([obTitle, obContent, obActions], {
            opacity: 0,
            duration: 0.15,
            onComplete: () => {
                renderContent();
                gsap.fromTo([obTitle, obContent, obActions], { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.05 });
            }
        });
    }
}

async function startScanner() {
    track('Start Camera');
    obState = 'requestCam';
    updateUIText();
    await initWebcam();
    initHandTracking();
}

function updateStats(text, className = '') {
    const stats = document.getElementById('stats');
    if (stats.innerText === text && stats.className === className) return;
    stats.innerText = text;
    stats.className = className;
    gsap.fromTo(stats, { scale: 1.08 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
    if (className === 'error-text') {
        gsap.fromTo(stats, { x: -10 }, { x: 0, duration: 0.4, ease: 'elastic.out(2, 0.2)' });
    }
}

function updateFactButtonText() {
    const btn = document.getElementById('fact-continue');
    const kicker = document.getElementById('fact-kicker');
    if (btn) btn.innerText = getT().btnContinue;
    if (kicker) kicker.innerText = getT().funFact;
    if (activeFactPlanet) {
        const fact = planetFacts[activeFactPlanet];
        document.getElementById('fact-title').innerText = getT().planetNames[activeFactPlanet];
        document.getElementById('fact-text').innerText = fact[currentLang];
    }
}

function showPlanetFact(planetName, onDone) {
    const t = getT();
    const factLayer = document.getElementById('fact-layer');
    const fact = planetFacts[planetName];

    if (!fact) {
        onDone?.();
        return;
    }

    interactionLocked = true;
    activeFactPlanet = planetName;
    factClosedByGesture = false;

    document.getElementById('fact-kicker').innerText = t.funFact;
    document.getElementById('fact-title').innerText = t.planetNames[planetName];
    document.getElementById('fact-text').innerText = fact[currentLang];
    document.getElementById('fact-image').src = fact.image;
    document.getElementById('fact-continue').innerText = t.btnContinue;

    factLayer.style.display = 'flex';
    factLayer.style.opacity = '0';

    const factBox = factLayer.querySelector('.fact-box');
    factBox.classList.remove('revealing');

    requestAnimationFrame(() => {
        factBox.classList.add('revealing');
        playGachaRevealSFX();
    });

    gsap.to(factLayer, {
        opacity: 1,
        duration: 0.3
    });

    gsap.fromTo(
        '.fact-box',
        { y: 30, scale: 0.94 },
        { y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.4)' }
    );

    const continueBtn = document.getElementById('fact-continue');

    const closeFact = () => {
        continueBtn.removeEventListener('click', closeFact);

        factCloseHandler = null;

        gsap.to(factLayer, {
            opacity: 0,
            duration: 0.25,
            onComplete: () => {
                factLayer.style.display = 'none';
                interactionLocked = false;
                activeFactPlanet = null;
                factClosedByGesture = false;
                onDone?.();
            }
        });
    };

    factCloseHandler = closeFact;

    // Prevent instant closing because the user might still be holding thumbs up
    factCanCloseAt = Date.now() + 900;

    continueBtn.addEventListener('click', closeFact);
}

function showLevelComplete(levelNumber) {
    if (levelTransitioning) return;
    levelTransitioning = true;
    interactionLocked = true;
    const t = getT();
    const winLayer = document.getElementById('win-layer');
    const title = levelNumber === 1 ? t.level1CompleteTitle : t.statusMoonWin;
    const fact = levelNumber === 1 ? t.level1Fact : t.level2Fact;
    const buttonLabel = levelNumber === 1 ? t.level2Btn : t.btnRestart;
    const buttonAction = levelNumber === 1 ? 'startLevel2()' : "location.reload()";

    winLayer.style.display = 'flex';
    winLayer.style.opacity = '0';
    winLayer.innerHTML = `
    <div class="win-box">
      <img src="logo.png" alt="Solary Logo" style="height:80px; margin-bottom:20px;" />
      <h1>${title}</h1>
      <p>${fact}</p>
      <button class="ob-btn" onclick="${buttonAction}">${buttonLabel}</button>
    </div>
  `;

    gsap.to(winLayer, { opacity: 1, duration: 0.5 });
    gsap.fromTo('.win-box', { scale: 0.8, y: 30 }, { scale: 1, y: 0, duration: 0.7, ease: 'back.out(1.2)' });
}

function startLevel2() {
    track('Level 2 Started');
    const winLayer = document.getElementById('win-layer');
    currentLevel = 2;
    grabbedPlanet = null;
    grabbedMoon = null;
    interactionLocked = false;
    levelTransitioning = false;

    gsap.to(winLayer, {
        opacity: 0,
        duration: 0.25,
        onComplete: () => {
            winLayer.style.display = 'none';
            winLayer.innerHTML = '';
            createLevel2Moons();
            updateStats(getT().statusMoonDrag, '');
        }
    });
}

function triggerWinState() {
    track('Game Won');
    interactionLocked = true;
    const t = getT();
    const timeTaken = Math.floor((Date.now() - gameStartTime) / 1000);
    const m = Math.floor(timeTaken / 60);
    const s = timeTaken % 60;
    const timeStr = m > 0 ? `${m}m ${s}s` : `${s}s`;
    const acc = totalDrops > 0 ? Math.max(0, Math.round(((totalDrops - mistakeCount) / totalDrops) * 100)) : 100;
    const statsText = t.winStats.replace('{time}', timeStr).replace('{acc}', acc);
    const shareTextRaw = t.shareText.replace('{time}', timeStr).replace('{acc}', acc);

    const winLayer = document.getElementById('win-layer');
    winLayer.style.display = 'flex';
    winLayer.style.opacity = '0';
    winLayer.innerHTML = `
    <div class="win-box">
      <img src="logo.png" alt="Solary Logo" style="height:80px; margin-bottom:20px;" />
      <h1>✨ ${t.statusWin} ✨</h1>
      <p>${statsText}</p>
      <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap;">
        <button class="ob-btn" id="restart-btn">${t.btnRestart}</button>
        <button class="ob-btn" id="share-btn" style="background: rgba(255,255,255,0.08);">${t.btnShare}</button>
      </div>
    </div>
  `;

    document.getElementById('restart-btn').onclick = () => location.reload();
    document.getElementById('share-btn').onclick = function () {
        shareScorecard(timeStr, acc, shareTextRaw, this);
    };

    gsap.to(winLayer, { opacity: 1, duration: 0.7 });
    gsap.fromTo('.win-box', { scale: 0.5, y: 50 }, { scale: 1, y: 0, duration: 1.1, ease: 'elastic.out(1, 0.55)' });
    gsap.to('#ui-layer', { y: -50, opacity: 0, duration: 0.5 });
    gsap.to('#top-controls', { y: -50, opacity: 0, duration: 0.5 });
    gsap.to(camera.position, {
        z: 220, y: -60, x: 0,
        duration: 6, ease: 'power2.inOut',
        onUpdate: () => camera.lookAt(scene.position)
    });
}

async function shareScorecard(timeStr, acc, rawText, btnElem) {
    const t = getT();
    const originalText = btnElem.innerText;
    btnElem.innerText = '...';
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
    await new Promise(resolve => { logoImg.onload = resolve; logoImg.onerror = resolve; });

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
    ctx.fillText(currentLang === 'en' ? 'TIME' : 'WAKTU', 540, 550);
    ctx.font = '600 65px Inter, sans-serif';
    ctx.fillText(timeStr, 540, 620);
    ctx.font = '300 40px Inter, sans-serif';
    ctx.fillText(`${currentLang === 'en' ? 'ACCURACY' : 'AKURASI'}: ${acc}%`, 540, 690);
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
        } catch (_) { }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'solary-scorecard.png';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        track('Share Success', { method: 'Download' });
        restoreBtn(currentLang === 'en' ? 'Downloaded!' : 'Diunduh!');
    }, 'image/png');
}

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

function initThreeJS() {
    const container = document.getElementById('canvas-container');
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 180;
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    textureLoader = new THREE.TextureLoader();

    scene.add(new THREE.AmbientLight(0x444444));
    const pointLight = new THREE.PointLight(0xffffff, 2.0, 400);
    scene.add(pointLight);

    sun = new THREE.Mesh(
        new THREE.SphereGeometry(12, 32, 32),
        new THREE.MeshBasicMaterial({ map: textureLoader.load('textures/2k_sun.jpg') })
    );
    scene.add(sun);

    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.6, transparent: true, opacity: 0.8, sizeAttenuation: true });
    const starsVertices = [];
    for (let i = 0; i < 3000; i++) {
        starsVertices.push((Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000);
    }
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    createLevel1Planets();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
}

function createLevel1Planets() {
    planets = [];
    orbits = [];

    planetDefs.forEach((def, index) => {
        const orbitGeo = new THREE.RingGeometry(def.dist - 0.2, def.dist + 0.2, 64);
        const orbitMat = new THREE.MeshBasicMaterial({ color: 0x888888, side: THREE.DoubleSide, transparent: true, opacity: 0.3, depthWrite: false });
        const orbit = new THREE.Mesh(orbitGeo, orbitMat);
        orbit.userData = { targetPlanet: def.name, index, dist: def.dist };
        scene.add(orbit);
        orbits.push(orbit);

        const mesh = new THREE.Mesh(
            new THREE.SphereGeometry(def.radius, 32, 32),
            new THREE.MeshPhongMaterial({ map: textureLoader.load(def.texture) })
        );

        const side = index % 2 === 0 ? -1 : 1;
        const row = Math.floor(index / 2);
        const spawnX = side * 140;
        const spawnY = 60 - row * 40;
        mesh.position.set(spawnX, spawnY, 0);
        scene.add(mesh);

        planets.push({ mesh, def, placed: false, angle: 0, spawnX, spawnY, factShown: false });
    });
}

function createLevel2Moons() {
    moons.forEach(moon => {
        scene.remove(moon.mesh);
        if (moon.label) scene.remove(moon.label);
    });
    moons = [];

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

        scene.add(moonMesh);
        scene.add(label);

        moons.push({
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

async function initWebcam() {
    const videoElement = document.getElementById('webcam-video');
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        videoElement.srcObject = stream;
        obState = 'loading';
        updateUIText();
        return await new Promise(resolve => {
            videoElement.onloadedmetadata = () => {
                videoElement.play();
                resolve(videoElement);
            };
        });
    } catch (err) {
        document.getElementById('ob-content').innerHTML = '<p class="error-text">Optical link failed. Please enable camera access in your browser to play.</p>';
        document.getElementById('ob-actions').innerHTML = `<button class="ob-btn" onclick="startScanner()">Retry</button>`;
    }
}

function initHandTracking() {
    const geometry = new THREE.SphereGeometry(1.0, 16, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 });
    for (let i = 0; i < 21; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.visible = false;
        mesh.position.set(0, -1000, 0);
        scene.add(mesh);
        handMeshes.push(mesh);
    }

    handsInstance = new Hands({ locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
    handsInstance.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });
    handsInstance.onResults(results => {
        const videoElement = document.getElementById('webcam-video');
        const vw = videoElement.videoWidth;
        const vh = videoElement.videoHeight;

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            if (vw > 0 && vh > 0 && offscreenCanvas) {
                const wPad = vw + CAM_PADDING * 2;
                const hPad = vh + CAM_PADDING * 2;
                handLandmarks = results.multiHandLandmarks[0].map(lm => ({
                    x: (lm.x * wPad - CAM_PADDING) / vw,
                    y: (lm.y * hPad - CAM_PADDING) / vh,
                    z: lm.z
                }));
            } else {
                handLandmarks = results.multiHandLandmarks[0];
            }
        } else {
            handLandmarks = null;
        }
    });

    processVideoFrame();
}

async function processVideoFrame() {
    const videoElement = document.getElementById('webcam-video');
    if (videoElement.readyState >= 2 && videoElement.currentTime !== lastVideoTime) {
        lastVideoTime = videoElement.currentTime;
        const vw = videoElement.videoWidth;
        const vh = videoElement.videoHeight;

        if (vw > 0 && vh > 0) {
            if (!offscreenCanvas) {
                offscreenCanvas = document.createElement('canvas');
                offscreenCtx = offscreenCanvas.getContext('2d');
            }

            offscreenCanvas.width = vw + CAM_PADDING * 2;
            offscreenCanvas.height = vh + CAM_PADDING * 2;
            offscreenCtx.fillStyle = 'black';
            offscreenCtx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
            offscreenCtx.drawImage(videoElement, CAM_PADDING, CAM_PADDING, vw, vh);
            if (handsInstance) await handsInstance.send({ image: offscreenCanvas });
        } else {
            if (handsInstance) await handsInstance.send({ image: videoElement });
        }
    }
    requestAnimationFrame(processVideoFrame);
}

function getDistance(a, b) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
}

function detectGesture(landmarks) {
    if (!landmarks) return 'None';
    const wrist = landmarks[0];
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const pinchDist = getDistance(thumbTip, indexTip);
    const indexFolded = getDistance(landmarks[8], wrist) < getDistance(landmarks[5], wrist);
    const middleFolded = getDistance(landmarks[12], wrist) < getDistance(landmarks[9], wrist);
    const thumbOut = getDistance(thumbTip, landmarks[5]) > 0.1;
    if (indexFolded && middleFolded && thumbOut) return 'ThumbsUp';
    if (pinchDist < 0.08) return 'Pinch';
    if (pinchDist > 0.12) return 'Open';
    return 'Hold';
}

function returnPlanetToSpawn(planet) {
    gsap.to(planet.mesh.position, { x: planet.spawnX, y: planet.spawnY, z: 0, duration: 0.8, ease: 'back.out(1.2)' });
}

function returnMoonToSpawn(moon) {
    gsap.to(moon.mesh.position, { x: moon.spawnX, y: moon.spawnY, z: 8, duration: 0.8, ease: 'back.out(1.2)' });
    gsap.to(moon.label.position, { x: moon.spawnX, y: moon.spawnY + 5.5, z: 10, duration: 0.8, ease: 'back.out(1.2)' });
}

function handleMoonInteraction(currentGesture, handWorldPos) {
    const t = getT();
    if (currentGesture === 'Pinch') {
        if (!grabbedMoon) {
            let nearest = null;
            let minDist = 42.0;
            for (const moon of moons) {
                if (moon.placed) continue;
                const dist = moon.mesh.position.distanceTo(handWorldPos);
                if (dist < minDist) {
                    minDist = dist;
                    nearest = moon;
                }
            }
            if (nearest) grabbedMoon = nearest;
        }
    } else if (currentGesture === 'Open') {
        if (grabbedMoon) {
            let closestPlanet = null;
            let closestDist = Infinity;
            for (const p of planets) {
                if (!p.placed) continue;
                const dist = grabbedMoon.mesh.position.distanceTo(p.mesh.position);
                const grabRadius = Math.max(12, p.def.radius + 9);
                if (dist < grabRadius && dist < closestDist) {
                    closestDist = dist;
                    closestPlanet = p;
                }
            }

            if (closestPlanet) {
                totalDrops++;
                const moonName = grabbedMoon.def.name;
                const planetName = t.planetNames[closestPlanet.def.name];
                if (grabbedMoon.def.parent === closestPlanet.def.name) {
                    playSuccessSFX();
                    grabbedMoon.placed = true;
                    grabbedMoon.parentPlanet = closestPlanet;
                    grabbedMoon.orbitRadius = closestPlanet.def.radius + 5 + Math.random() * 3;
                    grabbedMoon.angle = Math.atan2(grabbedMoon.mesh.position.y - closestPlanet.mesh.position.y, grabbedMoon.mesh.position.x - closestPlanet.mesh.position.x);
                    updateStats(t.statusMoonCorrect.replace('{moon}', moonName).replace('{planet}', planetName), 'success-text');
                    gsap.fromTo(grabbedMoon.mesh.scale, { x: 1.6, y: 1.6, z: 1.6 }, { x: 1, y: 1, z: 1, duration: 0.45, ease: 'back.out(2)' });
                    if (moons.every(m => m.placed)) {
                        track('Level 2 Completed');
                        setTimeout(() => triggerWinState(), 600);
                    }
                } else {
                    mistakeCount++;
                    playErrorSFX();
                    updateStats(t.statusMoonWrong.replace('{moon}', moonName).replace('{planet}', planetName), 'error-text');
                    const wrongMoon = grabbedMoon;
                    gsap.to(wrongMoon.mesh.position, {
                        x: '+=3', duration: 0.05, yoyo: true, repeat: 5,
                        onComplete: () => returnMoonToSpawn(wrongMoon)
                    });
                }
            } else {
                updateStats(t.statusMoonDrag, '');
                returnMoonToSpawn(grabbedMoon);
            }
            grabbedMoon = null;
        }
    }

    if (grabbedMoon) {
        gsap.killTweensOf(grabbedMoon.mesh.position);
        gsap.killTweensOf(grabbedMoon.label.position);
        grabbedMoon.mesh.position.lerp(handWorldPos, 0.4);
        grabbedMoon.mesh.position.z = 14;
        grabbedMoon.label.position.lerp(new THREE.Vector3(handWorldPos.x, handWorldPos.y + 6, 16), 0.4);
    }
}

function handleFactCardGestureClose() {
    if (!activeFactPlanet || !factCloseHandler || !handLandmarks) return false;

    const currentGesture = detectGesture(handLandmarks);

    if (
        currentGesture === 'ThumbsUp' &&
        Date.now() > factCanCloseAt &&
        !factClosedByGesture
    ) {
        factClosedByGesture = true;
        playSuccessSFX();
        factCloseHandler();
        return true;
    }

    return false;
}

function handleInteraction() {
    const t = getT();

    if (!handLandmarks) {
        handMeshes.forEach(m => m.visible = false);
        return;
    }

    if (interactionLocked) {
        handleFactCardGestureClose();
        return;
    }

    if (!trackingInitialized) {
        trackingInitialized = true;
        obState = 'guide';
        updateUIText();
    }

    const currentGesture = detectGesture(handLandmarks);

    if (!onboardingComplete) {
        if (currentGesture === 'ThumbsUp') {
            track('Game Started');
            onboardingComplete = true;
            gameStartTime = Date.now();
            document.getElementById('ob-title').innerText = '🚀';
            document.getElementById('ob-content').innerHTML = '';
            const obLayer = document.getElementById('onboarding-layer');
            gsap.to(obLayer, {
                opacity: 0, scale: 0.8, duration: 0.4, ease: 'power2.in',
                onComplete: () => { obLayer.style.display = 'none'; }
            });
            startSpaceBGM();
            const stats = document.getElementById('stats');
            stats.style.display = 'inline-block';
            updateStats(t.statusDrag, '');
            gsap.fromTo(stats, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.4 });
        }
        return;
    }

    const distance = camera.position.z;
    const vFov = camera.fov * Math.PI / 180;
    const planeHeightAtZ0 = 2 * Math.tan(vFov / 2) * distance;
    const planeWidthAtZ0 = planeHeightAtZ0 * camera.aspect;

    const videoElement = document.getElementById('webcam-video');
    const vAspect = (videoElement.videoWidth || 1) / (videoElement.videoHeight || 1);
    const wAspect = window.innerWidth / window.innerHeight;

    for (let i = 0; i < 21; i++) {
        const m = handMeshes[i];
        m.visible = true;
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
        if (m.position.y === -1000) m.position.copy(targetPos);
        else m.position.lerp(targetPos, 0.2);
    }

    const handWorldPos = handMeshes[8].position;

    if (currentLevel === 2) {
        handleMoonInteraction(currentGesture, handWorldPos);
        return;
    }

    if (currentGesture === 'Pinch') {
        if (!grabbedPlanet) {
            let nearest = null;
            let minDist = 50.0;
            for (const p of planets) {
                if (p.placed) continue;
                const dist = p.mesh.position.distanceTo(handWorldPos);
                if (dist < minDist) {
                    minDist = dist;
                    nearest = p;
                }
            }
            if (nearest) grabbedPlanet = nearest;
        }
    } else if (currentGesture === 'Open') {
        if (grabbedPlanet) {
            const distToCenter = grabbedPlanet.mesh.position.length();
            let closestOrbit = null;
            let minOrbitDist = 8.0;
            for (const o of orbits) {
                const d = Math.abs(distToCenter - o.userData.dist);
                if (d < minOrbitDist) {
                    minOrbitDist = d;
                    closestOrbit = o;
                }
            }

            if (closestOrbit) {
                totalDrops++;
                const targetName = t.planetNames[closestOrbit.userData.targetPlanet];
                const planetName = t.planetNames[grabbedPlanet.def.name];

                if (closestOrbit.userData.targetPlanet === grabbedPlanet.def.name) {
                    playSuccessSFX();
                    grabbedPlanet.placed = true;
                    grabbedPlanet.angle = Math.atan2(grabbedPlanet.mesh.position.y, grabbedPlanet.mesh.position.x);
                    gsap.to(grabbedPlanet.mesh.position, { z: 0, duration: 0.5, ease: 'power2.out' });
                    gsap.fromTo(closestOrbit.material, { opacity: 1 }, { opacity: 0.3, duration: 1.2, ease: 'power2.out' });
                    closestOrbit.material.color.setHex(0xffffff);
                    updateStats(t.statusCorrect.replace('{planet}', planetName), 'success-text');

                    const placedPlanet = grabbedPlanet;
                    grabbedPlanet = null;
                    showPlanetFact(placedPlanet.def.name, () => {
                        if (planets.every(p => p.placed)) {
                            track('Level 1 Completed');
                            setTimeout(() => showLevelComplete(1), 350);
                        } else {
                            updateStats(t.statusDrag, '');
                        }
                    });
                    return;
                } else {
                    mistakeCount++;
                    playErrorSFX();
                    updateStats(t.statusWrong.replace('{target}', targetName).replace('{planet}', planetName), 'error-text');
                    const wrongPlanet = grabbedPlanet;
                    const originalColor = closestOrbit.material.color.getHex();
                    closestOrbit.material.color.setHex(0xff4444);
                    gsap.fromTo(closestOrbit.material, {
                        opacity: 0.8
                    }, {
                        opacity: 0.3,
                        duration: 0.15,
                        yoyo: true,
                        repeat: 3,
                        onComplete: () => closestOrbit.material.color.setHex(originalColor)
                    });
                    gsap.to(wrongPlanet.mesh.position, {
                        x: '+=3', duration: 0.05, yoyo: true, repeat: 5,
                        onComplete: () => returnPlanetToSpawn(wrongPlanet)
                    });
                }
            } else {
                returnPlanetToSpawn(grabbedPlanet);
                updateStats(t.statusDrag, '');
            }
            grabbedPlanet = null;
        }
    }

    if (grabbedPlanet) {
        gsap.killTweensOf(grabbedPlanet.mesh.position);
        grabbedPlanet.mesh.position.lerp(handWorldPos, 0.4);
    }
}

function animate() {
    requestAnimationFrame(animate);
    handleInteraction();

    if (sun) sun.rotation.y += 0.0007;
    if (starField) {
        starField.rotation.y += 0.0002;
        starField.rotation.x += 0.0001;
    }

    for (const p of planets) {
        p.mesh.rotation.y += p.def.spin;
        if (p.placed && p !== grabbedPlanet) {
            p.angle += p.def.speed;
            p.mesh.position.x = Math.cos(p.angle) * p.def.dist;
            p.mesh.position.y = Math.sin(p.angle) * p.def.dist;
        } else if (!p.placed && p !== grabbedPlanet) {
            p.mesh.position.y += Math.sin(Date.now() * 0.002 + p.def.dist) * 0.05;
        }
    }

    for (const moon of moons) {
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

    renderer.render(scene, camera);
}

function ensureAudioContext() {
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
}

function createTone({ type = 'sine', frequency = 440, duration = 0.2, gain = 0.12, startTime, endFrequency = null }) {
    const ctx = ensureAudioContext();
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, startTime);
    if (endFrequency) osc.frequency.exponentialRampToValueAtTime(endFrequency, startTime + duration);
    amp.gain.setValueAtTime(0.0001, startTime);
    amp.gain.exponentialRampToValueAtTime(gain, startTime + 0.01);
    amp.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    osc.connect(amp);
    amp.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.03);
}

function playErrorSFX() {
    const ctx = ensureAudioContext();
    const now = ctx.currentTime;
    createTone({ type: 'sawtooth', frequency: 320, endFrequency: 150, duration: 0.16, gain: 0.08, startTime: now });
    createTone({ type: 'triangle', frequency: 220, endFrequency: 120, duration: 0.21, gain: 0.06, startTime: now + 0.02 });
}

function playSuccessSFX() {
    const ctx = ensureAudioContext();
    const now = ctx.currentTime;
    createTone({ type: 'sine', frequency: 440, duration: 0.12, gain: 0.05, startTime: now });
    createTone({ type: 'sine', frequency: 660, duration: 0.14, gain: 0.05, startTime: now + 0.07 });
}

function playFactPopupSFX() {
    const ctx = ensureAudioContext();
    const now = ctx.currentTime;
    createTone({ type: 'triangle', frequency: 523.25, duration: 0.12, gain: 0.04, startTime: now });
    createTone({ type: 'triangle', frequency: 783.99, duration: 0.16, gain: 0.04, startTime: now + 0.08 });
}

function toggleBGM() {
    track('Toggle BGM');
    const toggle = document.getElementById('bgm-toggle');
    if (!audioCtx || !masterGainNode) {
        startSpaceBGM();
        return;
    }
    if (bgmPlaying) {
        masterGainNode.gain.cancelScheduledValues(audioCtx.currentTime);
        masterGainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.8);
        bgmPlaying = false;
        bgmManuallyMuted = true;
        toggle.innerHTML = iconMuted;
    } else {
        ensureAudioContext();
        masterGainNode.gain.cancelScheduledValues(audioCtx.currentTime);
        masterGainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 1.4);
        bgmPlaying = true;
        bgmManuallyMuted = false;
        toggle.innerHTML = iconPlaying;
    }
}

function startSpaceBGM() {
    if (audioCtx && masterGainNode) return;
    const ctx = ensureAudioContext();
    masterGainNode = ctx.createGain();
    masterGainNode.gain.setValueAtTime(0, ctx.currentTime);
    masterGainNode.connect(ctx.destination);

    const delay = ctx.createDelay(3.0);
    delay.delayTime.value = 1.5;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.7;
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(masterGainNode);

    const frequencies = [261.63, 392.0, 587.33, 659.25, 783.99];
    frequencies.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        osc.detune.value = (Math.random() - 0.5) * 10;
        const oscGain = ctx.createGain();
        oscGain.gain.value = 0.05;

        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.03 + index * 0.015;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.05;
        lfo.connect(lfoGain);
        lfoGain.connect(oscGain.gain);

        osc.connect(oscGain);
        oscGain.connect(masterGainNode);
        oscGain.connect(delay);
        lfo.start();
        osc.start();
    });

    if (!bgmManuallyMuted) {
        masterGainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 3.5);
        bgmPlaying = true;
        document.getElementById('bgm-toggle').innerHTML = iconPlaying;
    } else {
        document.getElementById('bgm-toggle').innerHTML = iconMuted;
    }
}

window.continueFromMobile = continueFromMobile;
window.chooseLanguage = chooseLanguage;
window.startScanner = startScanner;
window.startLevel2 = startLevel2;
window.toggleBGM = toggleBGM;

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('bgm-toggle').innerHTML = iconMuted;
    document.getElementById('bgm-toggle').onclick = toggleBGM;
    document.getElementById('lang-en').onclick = () => setLanguage('en');
    document.getElementById('lang-id').onclick = () => setLanguage('id');

    if (savedLang) setLanguage(savedLang);
    else updateUIText();

    initThreeJS();

    gsap.from('#ui-header', { y: -30, opacity: 0, duration: 1, ease: 'power3.out' });
    gsap.from('#top-controls', { y: -30, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.2 });
    gsap.from('#onboarding-layer', { scale: 0.9, opacity: 0, duration: 1, ease: 'back.out(1.2)', delay: 0.4 });
});

function playGachaRevealSFX() {
    const ctx = ensureAudioContext();
    const now = ctx.currentTime;

    createTone({
        type: 'sine',
        frequency: 392,
        duration: 0.12,
        gain: 0.05,
        startTime: now
    });

    createTone({
        type: 'sine',
        frequency: 587.33,
        duration: 0.14,
        gain: 0.06,
        startTime: now + 0.08
    });

    createTone({
        type: 'triangle',
        frequency: 783.99,
        duration: 0.2,
        gain: 0.07,
        startTime: now + 0.18
    });

    createTone({
        type: 'sine',
        frequency: 1174.66,
        duration: 0.32,
        gain: 0.045,
        startTime: now + 0.3
    });
}