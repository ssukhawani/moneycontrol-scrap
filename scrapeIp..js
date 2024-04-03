const puppeteer = require("puppeteer");

const scrapIp = async () => {
  try {
    const page = await browser.newPage();

    const apiEndpoints = [
      "https://whoer.net/v2/geoip2-city",
      "https://whoer.net/v2/geoip2-isp",
      "https://whoer.net/resolve",
    ];

    const combinedResponse = {};

    for (const endpoint of apiEndpoints) {
      await page.goto(endpoint);
      const response = await page.evaluate(() => {
        return fetch(window.location.href).then((res) => res.json());
      });

      let key;
      if (endpoint.includes("geoip2-city")) {
        key = "geoip-city";
      } else if (endpoint.includes("geoip2-isp")) {
        key = "geoip-isp";
      } else {
        key = "geoip-client-ip";
      }

      combinedResponse[key] = response;
    }
    return combinedResponse;
  } catch (error) {
    console.error(error);
    return {}
  } finally {
    await browser.close();
  }
};

module.exports = scrapIp;
