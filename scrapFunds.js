const puppeteer = require("puppeteer");

const scrapFunds = async (urlName) => {
  const URL = `https://www.moneycontrol.com/indian-indices/${urlName}.html`;

  console.log("Opening the browser...");
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/usr/bin/chromium-browser",
    args: ["--no-sandbox", "--disable-gpu"],
  });
  const page = await browser.newPage();

  console.log(`Navigating to ${URL}...`);
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForSelector("#sp_val");
  console.log(`Collecting the funds...`);
  const value = await page.$eval("#sp_val", (element) => {
    return element.getAttribute("data-numberanimate-value");
  });

  console.log("Closing the browser...");

  await page.close();
  await browser.close();

  console.log("Job done!");
  console.log(value);
  return { url: urlName, value };
};

module.exports = scrapFunds;
