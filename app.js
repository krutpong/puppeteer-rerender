const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const port = 8088;

app.get("/html", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: true, // ให้เป็น true เพื่อใช้โหมด headless
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // เพิ่มอาร์กิวเมนต์นี้เพื่อป้องกันปัญหาในการใช้งาน Docker
      ignoreHTTPSErrors: true, // อัพเกรด Puppeteer ที่มีการอ้างอิงไปยังแหล่ง HTTPS
    });

    const page = await browser.newPage();
    await page.setCacheEnabled(false); // ปิดการใช้งานแคชบนหน้า Puppeteer
    await page.setDefaultNavigationTimeout(0); // ไม่มี timeout ในการโหลดหน้าเว็บ

    const url = req.query.url;
    if (!url) {
      throw new Error("Missing 'url' parameter");
    }

    await page.goto(url);
    const content = await page.content();

    await browser.close();

    res.send(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
