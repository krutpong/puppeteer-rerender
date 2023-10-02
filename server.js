const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const port = 8088;

app.get("/html", async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
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
