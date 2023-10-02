const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 3000;

app.use(express.json());

app.post('/fetch-website', async (req, res) => {
  const { url } = req.body;

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);

    const data = await page.evaluate(() => {
      const title = document.title;
      const content = document.querySelector('body').textContent;

      return { title, content };
    });

    await browser.close();

    // ส่งข้อมูลโดยไม่ใส่แท็ก HTML
    res.send(data.content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลจากเว็บไซต์' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
