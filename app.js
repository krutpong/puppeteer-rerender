const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');

const app = express();
const PORT = 8088;
const MAX_CONCURRENT_BROWSERS = 2;
const VIEWPORT_WIDTH = 1920;
const VIEWPORT_HEIGHT = 1080;

// อ่าน User-Agent จากไฟล์ JSON
const userAgentsData = fs.readFileSync('useragents.json', 'utf8');
const userAgents = JSON.parse(userAgentsData).userAgents;

const browserQueue = [];

function getRandomUserAgent() {
  const randomIndex = Math.floor(Math.random() * userAgents.length);
  return userAgents[randomIndex];
}

async function createBrowserInstance() {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-cache',
      '--disk-cache-size=0',
    ],
  });
  return browser;
}

app.get('/', async (req, res) => {
  const url = req.query.url;

  if (!url || !isValidUrl(url)) {
    return res.status(400).send('Invalid URL format.');
  }

  let browser;
  let page;

  try {
    if (browserQueue.length < MAX_CONCURRENT_BROWSERS) {
      browser = await createBrowserInstance();
      browserQueue.push(browser);
    } else {
      browser = browserQueue.shift();
    }

    page = await browser.newPage();
    await page.setViewport({ width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT });
    await page.setUserAgent(getRandomUserAgent());

    await page.goto(url);

    await page.waitForSelector('body');

    const htmlContent = await page.content();

    const randomUserAgent = getRandomUserAgent();
    res.set({
      'Content-Type': 'text/html',
      'X-Powered-By': randomUserAgent,
    });

    res.send(htmlContent);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching the URL.');
  } finally {
    if (page) {
      await page.close();
    }

    if (browser) {
      await browser.close();
    }
  }
});

function isValidUrl(inputUrl) {
  const urlPattern = /^(http|https):\/\/[^ "]+$/;
  return urlPattern.test(inputUrl);
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
