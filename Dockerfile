# ใช้ Node.js เวอร์ชันล่าสุดเป็นฐาน
FROM node:14

# ติดตั้ง Puppeteer
RUN apt-get update && apt-get install -y chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# สร้างโฟลเดอร์และกำหนดให้เป็นไดเรกทอรีทำงาน
WORKDIR /app

# คัดลอกไฟล์ package.json และ package-lock.json และติดตั้ง dependencies
COPY package*.json ./
RUN npm install

# คัดลอกโค้ดแอปพลิเคชัน
COPY . .

# กำหนดพอร์ตที่แอปพลิเคชันจะใช้ (8088)
EXPOSE 8088

# เริ่มแอปพลิเคชัน
CMD [ "node", "app.js" ]
