const express = require("express");
const ipScrapper = require("../scrapeIp.");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const scrapedData = await ipScrapper();
  console.log(scrapedData);
  // Send the response
  res.status(200).send(scrapedData);
});

module.exports = router;
