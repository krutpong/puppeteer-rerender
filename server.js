const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const port = 8088;

app.get("/html", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: "/usr/bin/chromium-browser",
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    await page.setCacheEnabled(false);
    await page.setDefaultNavigationTimeout(0);

    const url = req.query.url;
    if (!url) {
      throw new Error("Missing 'url' parameter");
    }

    await page.goto(url);
    const content = await page.content();

    await browser.close();

    // Set the response header to support UTF-8
    res.header("Content-Type", "text/html; charset=utf-8");
    res.send(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
