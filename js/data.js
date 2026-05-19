export const CAM_PADDING = 100;

export const i18n = {
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

export const planetDefs = [
  { name: 'Mercury', texture: 'textures/2k_mercury.jpg', radius: 2.2, dist: 16, speed: 0.0415, spin: 0.00034 },
  { name: 'Venus', texture: 'textures/2k_venus_surface.jpg', radius: 3.3, dist: 24, speed: 0.0162, spin: -0.00008 },
  { name: 'Earth', texture: 'textures/2k_earth_daymap.jpg', radius: 3.6, dist: 33, speed: 0.01, spin: 0.02 },
  { name: 'Mars', texture: 'textures/2k_mars.jpg', radius: 2.7, dist: 41, speed: 0.0053, spin: 0.0195 },
  { name: 'Jupiter', texture: 'textures/2k_jupiter.jpg', radius: 7.8, dist: 55, speed: 0.00084, spin: 0.0484 },
  { name: 'Saturn', texture: 'textures/2k_saturn.jpg', radius: 6.7, dist: 72, speed: 0.00034, spin: 0.0448 },
  { name: 'Uranus', texture: 'textures/2k_uranus.jpg', radius: 4.9, dist: 87, speed: 0.00012, spin: -0.0279 },
  { name: 'Neptune', texture: 'textures/2k_neptune.jpg', radius: 4.6, dist: 100, speed: 0.00006, spin: 0.0298 }
];

export const moonDefs = [
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

export const planetFacts = {
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

export const iconMuted = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
export const iconPlaying = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
