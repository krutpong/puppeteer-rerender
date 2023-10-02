# ใช้ฐานข้อมูลของ Puppeteer และ Node.js
FROM ghcr.io/puppeteer/puppeteer:21.3.6

# ตั้งแต่งไดเร็คทอรีที่คุณจะทำงานในนั้น
WORKDIR /app

# คัดลอกไฟล์ package.json และ package-lock.json ไปยัง image
COPY package*.json ./

# ติดตั้ง dependencies ของแอปพลิเคชัน
RUN npm install

# คัดลอกโค้ดและไฟล์อื่น ๆ ไปยัง image
COPY . .

# เริ่มแอปพลิเคชัน
CMD ["node", "app.js"]
