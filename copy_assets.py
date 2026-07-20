import shutil

sources = {
    'wasila': '/home/zainab/.gemini/antigravity/brain/51c97ae7-cb10-493b-9c78-fd6188ffa601/media__1784551520790.jpg',
    'hadiza': '/home/zainab/.gemini/antigravity/brain/51c97ae7-cb10-493b-9c78-fd6188ffa601/media__1784551557869.jpg',
    'asmau': '/home/zainab/.gemini/antigravity/brain/51c97ae7-cb10-493b-9c78-fd6188ffa601/media__1784551541609.png',
    'saima': '/home/zainab/.gemini/antigravity/brain/51c97ae7-cb10-493b-9c78-fd6188ffa601/media__1784551578306.jpg'
}

shutil.copyfile(sources['wasila'], 'src/assets/doctor_wasila.jpg')
shutil.copyfile(sources['hadiza'], 'src/assets/doctor_hadiza.jpg')
shutil.copyfile(sources['asmau'], 'src/assets/doctor_asmau.png')
shutil.copyfile(sources['saima'], 'src/assets/doctor_saima.jpg')

shutil.copyfile(sources['wasila'], 'public/doctor_wasila.jpg')
shutil.copyfile(sources['hadiza'], 'public/doctor_hadiza.jpg')
shutil.copyfile(sources['asmau'], 'public/doctor_asmau.png')
shutil.copyfile(sources['saima'], 'public/doctor_saima.jpg')

print("Copied successfully!")
