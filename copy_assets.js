const fs = require('fs');

const sources = {
  wasila: '/home/zainab/.gemini/antigravity/brain/51c97ae7-cb10-493b-9c78-fd6188ffa601/media__1784551520790.jpg',
  hadiza: '/home/zainab/.gemini/antigravity/brain/51c97ae7-cb10-493b-9c78-fd6188ffa601/media__1784551557869.jpg',
  asmau: '/home/zainab/.gemini/antigravity/brain/51c97ae7-cb10-493b-9c78-fd6188ffa601/media__1784551541609.png',
  saima: '/home/zainab/.gemini/antigravity/brain/51c97ae7-cb10-493b-9c78-fd6188ffa601/media__1784551578306.jpg'
};

fs.copyFileSync(sources.wasila, 'src/assets/doctor_wasila.jpg');
fs.copyFileSync(sources.hadiza, 'src/assets/doctor_hadiza.jpg');
fs.copyFileSync(sources.asmau, 'src/assets/doctor_asmau.png');
fs.copyFileSync(sources.saima, 'src/assets/doctor_saima.jpg');

console.log('Copied all doctor images to src/assets successfully!');

