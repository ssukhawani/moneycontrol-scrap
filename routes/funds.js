const express = require("express");
const multiPageScraper = require("../scrapFunds");
const moment = require("moment-timezone");

const router = express.Router();

// Set the desired time zone (Asia/Kolkata for IST)
moment.tz.setDefault("Asia/Kolkata");

router.get("/", async (req, res, next) => {
  const { urls } = req.query;
  // Get the list of URL names as a comma-separated string
  if (!urls) {
    res.status(400).send("Please provide a URL name");
    return;
  }

  let urlList = urls.split(",");

  let ans = [];

  // Sequentially scrape data from each URL
  for (const url of urlList) {
    const scrapedData = await multiPageScraper(url);
    const currentTime = moment().format("LLLL");
    ans.push({ ...scrapedData, time: currentTime });
  }

  console.log(ans);
  // Construct the response HTML with CSS styles for the table
  const responseHTML = `
        <html>
          <head>
            <style>
              table {
                width: 80%;
                border-collapse: collapse;
                margin: 20px auto;
              }
              th, td {
                border: 1px solid #dddddd;
                text-align: left;
                padding: 8px;
              }
              th {
                background-color: #f2f2f2;
              }
              tr:nth-child(even) {
                background-color: #f2f2f2;
              }
            </style>
          </head>
          <body>
            <table>
              <tr>
                <th>Fund Name</th>
                <th>Value</th>
                <th>Timestamp</th>
              </tr>
              ${ans
                .map(
                  ({ url, value, time }) => `
              <tr>
                <td>${url}</td>
                <td>${value}</td>
                <td>${time}</td>
              </tr>
            `
                )
                .join("")}
            </table>
          </body>
        </html>
      `;

  // Send the response
  res.status(200).send(responseHTML);

  //   // 3. Return the array of funds to the client
  //   res.status(200).json({
  //     statusCode: 200,
  //     message: "Funds correctly retrieved",
  //     data,
  //   });
});

module.exports = router;
