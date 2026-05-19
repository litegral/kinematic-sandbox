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
    level3Title: 'Level 3 — Place Space Objects',
    level3Btn: 'Start Level 3',
    statusLevel3Drag: 'Drag each object to its home region on the solar system map.',
    statusLevel3Correct: 'Great job! {object} comes from {zone}.',
    statusLevel3Wrong: 'Oops! {object} is not from {zone}.',
    statusLevel3Win: 'You mapped the small bodies of the solar system!',
    level3Fact: 'The asteroid belt contains over 1 million asteroids — but their total mass is less than the Moon.',
    level4Title: 'Level 4 — Sort by Type',
    level4Btn: 'Start Level 4',
    statusLevel4Drag: 'Sort each object into the correct classification bucket.',
    statusLevel4Correct: 'Great job! {object} is a {category}.',
    statusLevel4Wrong: 'Oops! {object} is not a {category}.',
    statusLevel4Win: 'You classified the worlds of the solar system!',
    level4Fact: "Pluto was demoted in 2006 because it hasn't cleared its orbital neighborhood — it shares the Kuiper Belt with thousands of similar objects.",
    level5Title: 'Level 5 — Planet Survival',
    level5Btn: 'Start Level 5',
    level5Badge: 'Final Challenge',
    level5Question: 'What kills you first?',
    level5Hint: 'Answer with ✌️ 👍 🤘 🖖',
    statusLevel5Prompt: '{planet}: what kills you first? Use ✌️ 👍 🤘 🖖 to answer.',
    statusLevel5Correct: 'Correct! {answer}',
    statusLevel5Wrong: 'Not quite. {answer} is not the first danger on {planet}.',
    statusLevel5Win: 'You survived the final space quiz!',
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
    },
    level3Zones: {
      inner: 'the Inner Solar System',
      asteroid: 'the Asteroid Belt',
      outer: 'the Outer Solar System',
      kuiper: 'the Kuiper Belt',
      oort: 'the Oort Cloud'
    },
    level4Categories: {
      terrestrial: 'Terrestrial Planet',
      gas: 'Gas Giant',
      ice: 'Ice Giant',
      dwarf: 'Dwarf Planet'
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
    level3Title: 'Level 3 — Tempatkan Objek Antariksa',
    level3Btn: 'Mulai Level 3',
    statusLevel3Drag: 'Tarik setiap objek ke wilayah asalnya di peta tata surya.',
    statusLevel3Correct: 'Bagus! {object} berasal dari {zone}.',
    statusLevel3Wrong: 'Ups! {object} bukan berasal dari {zone}.',
    statusLevel3Win: 'Kamu berhasil memetakan benda-benda kecil di tata surya!',
    level3Fact: 'Sabuk asteroid berisi lebih dari 1 juta asteroid — tetapi total massanya masih lebih kecil daripada Bulan.',
    level4Title: 'Level 4 — Kelompokkan Jenisnya',
    level4Btn: 'Mulai Level 4',
    statusLevel4Drag: 'Kelompokkan setiap objek ke kategori yang benar.',
    statusLevel4Correct: 'Bagus! {object} adalah {category}.',
    statusLevel4Wrong: 'Ups! {object} bukan {category}.',
    statusLevel4Win: 'Kamu berhasil mengklasifikasikan dunia-dunia di tata surya!',
    level4Fact: 'Pluto diturunkan statusnya pada 2006 karena belum membersihkan lingkungan orbitnya — ia berbagi Sabuk Kuiper dengan ribuan objek serupa.',
    level5Title: 'Level 5 — Bertahan di Planet',
    level5Btn: 'Mulai Level 5',
    level5Badge: 'Tantangan Final',
    level5Question: 'Apa yang membunuhmu lebih dulu?',
    level5Hint: 'Jawab dengan ✌️ 👍 🤘 🖖',
    statusLevel5Prompt: '{planet}: apa yang membunuhmu lebih dulu? Jawab dengan ✌️ 👍 🤘 🖖.',
    statusLevel5Correct: 'Benar! {answer}',
    statusLevel5Wrong: 'Belum tepat. {answer} bukan bahaya pertama di {planet}.',
    statusLevel5Win: 'Kamu menaklukkan kuis akhir tata surya!',
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
    },
    level3Zones: {
      inner: 'Tata Surya Dalam',
      asteroid: 'Sabuk Asteroid',
      outer: 'Tata Surya Luar',
      kuiper: 'Sabuk Kuiper',
      oort: 'Awan Oort'
    },
    level4Categories: {
      terrestrial: 'Planet Kebumian',
      gas: 'Raksasa Gas',
      ice: 'Raksasa Es',
      dwarf: 'Planet Katai'
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

export const level3ZoneDefs = [
  { key: 'inner', label: 'Inner Solar System', inner: 14, outer: 44, centerDist: 29, color: 0x4fc3f7, snapThreshold: 18 },
  { key: 'asteroid', label: 'Asteroid Belt', inner: 46, outer: 64, centerDist: 55, color: 0xffb74d, snapThreshold: 14 },
  { key: 'outer', label: 'Outer Solar System', inner: 66, outer: 102, centerDist: 84, color: 0x81c784, snapThreshold: 20 },
  { key: 'kuiper', label: 'Kuiper Belt', inner: 106, outer: 128, centerDist: 117, color: 0xba68c8, snapThreshold: 16 },
  { key: 'oort', label: 'Oort Cloud', inner: 132, outer: 166, centerDist: 149, color: 0x90a4ae, snapThreshold: 20 }
];

export const level4CategoryDefs = [
  { key: 'terrestrial', label: 'Terrestrial Planets', x: -82, y: 56, width: 84, height: 42, color: 0xffb74d },
  { key: 'gas', label: 'Gas Giants', x: 82, y: 56, width: 84, height: 42, color: 0xff8a65 },
  { key: 'ice', label: 'Ice Giants', x: -82, y: -40, width: 84, height: 42, color: 0x4fc3f7 },
  { key: 'dwarf', label: 'Dwarf Planets', x: 82, y: -40, width: 84, height: 42, color: 0xce93d8 }
];

export const level4ItemDefs = [
  { name: 'Mercury', category: 'terrestrial', color: 0xb0bec5, size: 2.3, speed: 0.004, art: { symbol: '☿', illustration: '', accent: '#b0bec5' } },
  { name: 'Venus', category: 'terrestrial', color: 0xd7b98e, size: 2.7, speed: 0.0038, art: { symbol: '♀', illustration: '', accent: '#d7b98e' } },
  { name: 'Earth', category: 'terrestrial', color: 0x81d4fa, size: 2.8, speed: 0.0038, art: { symbol: '🌍', illustration: '', accent: '#81d4fa' } },
  { name: 'Mars', category: 'terrestrial', color: 0xff8a65, size: 2.5, speed: 0.004, art: { symbol: '♂', illustration: '', accent: '#ff8a65' } },
  { name: 'Jupiter', category: 'gas', color: 0xffcc80, size: 3.6, speed: 0.0032, art: { symbol: '♃', illustration: '', accent: '#ffcc80' } },
  { name: 'Saturn', category: 'gas', color: 0xffe082, size: 3.3, speed: 0.0032, art: { symbol: '🪐', illustration: '', accent: '#ffe082' } },
  { name: 'Uranus', category: 'ice', color: 0x80deea, size: 3.0, speed: 0.0032, art: { symbol: '⛢', illustration: '', accent: '#80deea' } },
  { name: 'Neptune', category: 'ice', color: 0x64b5f6, size: 3.0, speed: 0.0032, art: { symbol: '♆', illustration: '', accent: '#64b5f6' } },
  { name: 'Pluto', category: 'dwarf', color: 0xd7ccc8, size: 2.4, speed: 0.0035, art: { symbol: '❄️', illustration: '', accent: '#d7ccc8' } },
  { name: 'Eris', category: 'dwarf', color: 0xe0e0e0, size: 2.4, speed: 0.0035, art: { symbol: '✦', illustration: '', accent: '#e0e0e0' } },
  { name: 'Ceres', category: 'dwarf', color: 0xcfd8dc, size: 2.4, speed: 0.0035, art: { symbol: '🪨', illustration: '', accent: '#cfd8dc' } },
  { name: 'Makemake', category: 'dwarf', color: 0xffccbc, size: 2.4, speed: 0.0035, art: { symbol: '❄️', illustration: '', accent: '#ffccbc' } }
];

export const level5ScenarioDefs = [
  {
    planet: 'Venus',
    answerGesture: 'ThumbsUp',
    options: {
      en: {
        Peace: 'Freeze in the dark',
        ThumbsUp: 'Pressure crushes you',
        Metal: 'No oxygen at all',
        Vulcan: 'Meteor storm impact'
      },
      id: {
        Peace: 'Membeku dalam gelap',
        ThumbsUp: 'Tekanan menghancurkanmu',
        Metal: 'Tidak ada oksigen sama sekali',
        Vulcan: 'Hantaman badai meteor'
      }
    },
    fact: {
      en: 'Venus has a surface pressure about 92 times stronger than Earth’s — like being nearly 1 kilometer underwater.',
      id: 'Tekanan permukaan Venus sekitar 92 kali lebih kuat daripada Bumi — seperti berada hampir 1 kilometer di bawah air.'
    }
  },
  {
    planet: 'Jupiter',
    answerGesture: 'Metal',
    options: {
      en: {
        Peace: 'Its radiation burns you',
        ThumbsUp: 'You instantly explode from pressure',
        Metal: 'There is no solid ground',
        Vulcan: 'You freeze above the clouds'
      },
      id: {
        Peace: 'Radiasinya membakarmu',
        ThumbsUp: 'Kamu langsung meledak karena tekanan',
        Metal: 'Tidak ada permukaan padat',
        Vulcan: 'Kamu membeku di atas awan'
      }
    },
    fact: {
      en: 'Jupiter is a giant ball of gas and liquid. If you fell in, the pressure and temperature would rise until you were destroyed.',
      id: 'Jupiter adalah bola raksasa gas dan cairan. Jika kamu jatuh ke dalamnya, tekanan dan suhu akan terus naik sampai tubuhmu hancur.'
    }
  },
  {
    planet: 'Mercury',
    answerGesture: 'Peace',
    options: {
      en: {
        Peace: 'Extreme temperature swing',
        ThumbsUp: 'Crushing atmospheric pressure',
        Metal: 'Acid rain from the sky',
        Vulcan: 'Hurricane-force winds'
      },
      id: {
        Peace: 'Perubahan suhu ekstrem',
        ThumbsUp: 'Tekanan atmosfer yang menghancurkan',
        Metal: 'Hujan asam dari langit',
        Vulcan: 'Angin sekuat badai besar'
      }
    },
    fact: {
      en: 'Mercury has almost no atmosphere, so temperatures can swing by about 600°C between blazing day and freezing night.',
      id: 'Merkurius hampir tidak memiliki atmosfer, sehingga suhunya bisa berubah sekitar 600°C antara siang yang membakar dan malam yang membekukan.'
    }
  },
  {
    planet: 'Neptune',
    answerGesture: 'Vulcan',
    options: {
      en: {
        Peace: 'Volcanoes cover the surface',
        ThumbsUp: 'You sink into lava oceans',
        Metal: 'Dust storms strip your skin',
        Vulcan: 'Supersonic winds tear through you'
      },
      id: {
        Peace: 'Gunung api menutupi permukaan',
        ThumbsUp: 'Kamu tenggelam di lautan lava',
        Metal: 'Badai debu mengikis kulitmu',
        Vulcan: 'Angin supersonik merobek tubuhmu'
      }
    },
    fact: {
      en: 'Neptune’s winds can race above 2,100 km/h — faster than the speed of sound on Earth.',
      id: 'Angin di Neptunus bisa melaju di atas 2.100 km/jam — lebih cepat dari kecepatan suara di Bumi.'
    }
  },
  {
    planet: 'Mars',
    answerGesture: 'Metal',
    options: {
      en: {
        Peace: 'Boiling acid seas',
        ThumbsUp: 'Crushing gravity',
        Metal: 'No breathable air',
        Vulcan: 'Instant lightning strike'
      },
      id: {
        Peace: 'Lautan asam mendidih',
        ThumbsUp: 'Gravitasi yang menghancurkan',
        Metal: 'Tidak ada udara yang bisa dihirup',
        Vulcan: 'Sambaran petir seketika'
      }
    },
    fact: {
      en: 'Mars has an atmosphere, but it is over 95% carbon dioxide and far too thin for humans to breathe.',
      id: 'Mars memang punya atmosfer, tetapi lebih dari 95% isinya karbon dioksida dan terlalu tipis untuk dihirup manusia.'
    }
  },
  {
    planet: 'Saturn',
    answerGesture: 'ThumbsUp',
    options: {
      en: {
        Peace: 'The rings slice you apart',
        ThumbsUp: 'You fall into gas with no surface',
        Metal: 'Volcanoes blast you away',
        Vulcan: 'Frozen oxygen burns you'
      },
      id: {
        Peace: 'Cincinnya mengiris tubuhmu',
        ThumbsUp: 'Kamu jatuh ke gas tanpa permukaan',
        Metal: 'Gunung api meledakkanmu',
        Vulcan: 'Oksigen beku membakarmu'
      }
    },
    fact: {
      en: 'Like Jupiter, Saturn has no true solid surface. Its famous rings are made of countless icy particles, not a flat disk you can stand on.',
      id: 'Seperti Jupiter, Saturnus tidak memiliki permukaan padat yang nyata. Cincinnya yang terkenal tersusun dari partikel es tak terhitung, bukan piringan datar yang bisa kamu pijak.'
    }
  },
  {
    planet: 'Uranus',
    answerGesture: 'Vulcan',
    options: {
      en: {
        Peace: 'Liquid magma oceans',
        ThumbsUp: 'Dense forests ignite',
        Metal: 'Sandstorms flay your skin',
        Vulcan: 'Extreme cold freezes you'
      },
      id: {
        Peace: 'Lautan magma cair',
        ThumbsUp: 'Hutan lebat terbakar',
        Metal: 'Badai pasir menguliti kulitmu',
        Vulcan: 'Dingin ekstrem membekukanmu'
      }
    },
    fact: {
      en: 'Uranus is the coldest planetary atmosphere in the solar system, with temperatures dropping below -220°C.',
      id: 'Uranus memiliki atmosfer planet terdingin di tata surya, dengan suhu turun di bawah -220°C.'
    }
  },
  {
    planet: 'Earth',
    answerGesture: 'Peace',
    options: {
      en: {
        Peace: 'Probably nothing immediately',
        ThumbsUp: 'Sulfuric acid clouds',
        Metal: 'A bottomless gas abyss',
        Vulcan: 'Supersonic methane winds'
      },
      id: {
        Peace: 'Mungkin tidak ada yang langsung membunuhmu',
        ThumbsUp: 'Awan asam sulfat',
        Metal: 'Jurang gas tanpa dasar',
        Vulcan: 'Angin metana supersonik'
      }
    },
    fact: {
      en: 'Earth is unusual because its surface pressure, temperature, liquid water, and breathable atmosphere all fall in the narrow range humans can survive.',
      id: 'Bumi istimewa karena tekanan permukaan, suhu, air cair, dan atmosfer yang bisa dihirup berada dalam rentang sempit yang dapat ditoleransi manusia.'
    }
  }
];

export function getLevel5ScenarioOptions(scenario, lang = 'en') {
  return scenario?.options?.[lang] || scenario?.options?.en || scenario?.options || {};
}

export function getLevel5ScenarioFact(scenario, lang = 'en') {
  return scenario?.fact?.[lang] || scenario?.fact?.en || scenario?.fact || '';
}

export const spaceObjectDefs = [
  {
    name: 'Vesta',
    zone: 'asteroid',
    color: 0xb0bec5,
    size: 2.2,
    speed: 0.0035,
    art: { symbol: '🪨', illustration: '', accent: '#b0bec5' }
  },
  {
    name: 'Ceres',
    zone: 'asteroid',
    color: 0xcfd8dc,
    size: 2.5,
    speed: 0.0031,
    art: { symbol: '🪨', illustration: '', accent: '#cfd8dc' }
  },
  {
    name: 'Chiron',
    zone: 'outer',
    color: 0xa5d6a7,
    size: 2.1,
    speed: 0.0027,
    art: { symbol: '🌀', illustration: '', accent: '#a5d6a7' }
  },
  {
    name: "Halley's Comet",
    zone: 'oort',
    color: 0xe1f5fe,
    size: 1.9,
    speed: 0.0026,
    art: { symbol: '☄️', illustration: '', accent: '#e1f5fe' }
  },
  {
    name: 'Hale-Bopp',
    zone: 'oort',
    color: 0xb3e5fc,
    size: 2.1,
    speed: 0.0022,
    art: { symbol: '☄️', illustration: '', accent: '#b3e5fc' }
  },
  {
    name: 'Shoemaker-Levy 9',
    zone: 'kuiper',
    color: 0xd1c4e9,
    size: 1.9,
    speed: 0.0028,
    art: { symbol: '☄️', illustration: '', accent: '#d1c4e9' }
  },
  {
    name: 'Pluto',
    zone: 'kuiper',
    color: 0xefebe9,
    size: 2.3,
    speed: 0.0024,
    art: { symbol: '❄️', illustration: '', accent: '#efebe9' }
  },
  {
    name: 'Haumea',
    zone: 'kuiper',
    color: 0xf8bbd0,
    size: 2.1,
    speed: 0.0025,
    art: { symbol: '❄️', illustration: '', accent: '#f8bbd0' }
  },
  {
    name: 'Makemake',
    zone: 'kuiper',
    color: 0xffccbc,
    size: 2.1,
    speed: 0.0023,
    art: { symbol: '❄️', illustration: '', accent: '#ffccbc' }
  }
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
