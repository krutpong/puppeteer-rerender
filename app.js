const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 8088;

let browserInstance;  // Reuse browser instance

app.get('/', async (req, res) => {
  const url = req.query.url;

  if (!url) {
    res.status(400).send('URL parameter is required.');
    return;
  }

  try {
    // Ensure a browser instance is available or create a new one
    const browser = browserInstance || await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-cache', '--disk-cache-size=0'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    await page.goto(url, { waitUntil: 'networkidle0' });

    // Get the HTML content of the page
    const htmlContent = await page.content();

    res.set('Content-Type', 'text/html');
    res.send(htmlContent);
  } catch (error) {
    res.status(500).send('An error occurred while fetching the URL.');
  } finally {
    // Close the page after retrieving content
    await page.close();

    // If browser was created specifically for this request, close it
    if (!browserInstance) {
      await browser.close();
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
