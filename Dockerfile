# สร้าง Docker image โดยใช้ Node.js ล่าสุด
FROM node:14

# ตั้งค่าโฟลเดอร์ที่คอนเทนเนอร์จะทำงานในโฟลเดอร์ /app
WORKDIR /app

# คัดลอกไฟล์ package.json และ package-lock.json เข้าสู่คอนเทนเนอร์
COPY package*.json ./

# ติดตั้ง dependencies โดยใช้ npm
RUN npm install

# คัดลอกโค้ดและไฟล์อื่น ๆ ไปยังคอนเทนเนอร์
COPY . .

# เปิดพอร์ตที่คอนเทนเนอร์จะใช้
EXPOSE 8088

# คำสั่งที่จะรันแอปพลิเคชันของคุณเมื่อคอนเทนเนอร์เริ่มต้น
CMD [ "node", "app.js" ]
