import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Copy doctor images from conversation brain folder to public folder
const sourceDir = '/home/zainab/.gemini/antigravity/brain/9ec8818f-81fb-46b2-aec3-e0edd674290c';
const publicDir = './public';

try {
  const fatimaSrc = path.join(sourceDir, 'media__1782211258803.jpg');
  const adamSrc = path.join(sourceDir, 'media__1782211272950.jpg');
  
  if (fs.existsSync(fatimaSrc)) {
    fs.copyFileSync(fatimaSrc, path.join(publicDir, 'doctor_fatima.jpg'));
    console.log('Successfully copied doctor_fatima.jpg');
  }
  if (fs.existsSync(adamSrc)) {
    fs.copyFileSync(adamSrc, path.join(publicDir, 'doctor_adam.jpg'));
    console.log('Successfully copied doctor_adam.jpg');
  }
} catch (err) {
  console.error('Error copying doctor images:', err);
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
})
