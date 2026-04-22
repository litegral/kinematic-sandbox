const https = require('https');
const fs = require('fs');
const path = require('path');

const urls = [
    'https://www.solarsystemscope.com/textures/download/2k_sun.jpg',
    'https://www.solarsystemscope.com/textures/download/2k_mercury.jpg',
    'https://www.solarsystemscope.com/textures/download/2k_venus_surface.jpg',
    'https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg',
    'https://www.solarsystemscope.com/textures/download/2k_mars.jpg',
    'https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg',
    'https://www.solarsystemscope.com/textures/download/2k_saturn.jpg',
    'https://www.solarsystemscope.com/textures/download/2k_uranus.jpg',
    'https://www.solarsystemscope.com/textures/download/2k_neptune.jpg'
];

const dir = path.join(__dirname, 'textures');
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

let pending = urls.length;

urls.forEach(url => {
    const filename = url.split('/').pop();
    const dest = path.join(dir, filename);
    https.get(url, (res) => {
        if (res.statusCode !== 200) {
            console.error(`Failed to download ${filename}: ${res.statusCode}`);
            pending--;
            return;
        }
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log(`Downloaded ${filename}`);
            pending--;
            if (pending === 0) console.log('All downloads complete.');
        });
    }).on('error', (err) => {
        console.error(`Error downloading ${filename}: ${err.message}`);
        pending--;
    });
});
