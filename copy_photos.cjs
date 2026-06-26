// Run this script with: node copy_photos.cjs
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'src', 'assets');

const copies = [
  {
    src: '/home/zainab/.gemini/antigravity/brain/95f34aa9-49be-4903-8f14-1359bacd7f26/media__1782483724476.jpg',
    dest: path.join(assetsDir, 'doctor_bamalli.jpg'),
    label: 'Dr. Abubakar Muhammad Bamalli'
  },
  {
    src: '/home/zainab/.gemini/antigravity/brain/95f34aa9-49be-4903-8f14-1359bacd7f26/media__1782483756713.jpg',
    dest: path.join(assetsDir, 'doctor_tijjani.jpg'),
    label: 'Dr. Mato Saddiqa Tijjani'
  }
];

copies.forEach(({ src, dest, label }) => {
  try {
    fs.copyFileSync(src, dest);
    console.log(`✅ Copied ${label} photo → ${dest}`);
  } catch (e) {
    console.error(`❌ Failed to copy ${label}: ${e.message}`);
  }
});

console.log('\nDone! You can now run: npm run dev');
