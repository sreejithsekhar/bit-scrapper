const puppeteer = require("puppeteer");
const scrapper = require("./db/scrapper");

const INDICATOR_CONSTANTS = require("./constants");
const INTERVAL = 6000;
//const INTERVAL = 60000;

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1000,
      height: 480,
    },
    slowMo: 250,
  });

  console.log("====INDICATOR_CONSTANTS===", INDICATOR_CONSTANTS);

  const page = await browser.newPage();
  await page.goto(
    "https://www.binance.com/en/trade/BTC_USDT?theme=dark&type=spot"
  );

  await page.click("#onetrust-accept-btn-handler");
  await page.waitForSelector("#Time");
  await page.click("#Time");

  const db = scrapper.openDatabase();

  const pageLooper = setInterval(async () => {
    const indicators = await page.$$eval(
      ".chart-title-indicator-container span",
      (nodes) =>
        nodes
          .filter((n) => n.innerText !== "NaN")
          .reduce((acc, n) => {
            acc[n.getAttribute("key")] = n.innerText;
            return acc;
          }, {})
    );
    console.log("indicators", indicators);
    scrapper.saveIndicators(db, indicators);
  }, INTERVAL);

  page.on("close", () => {
    scrapper.viewIndicators(db);
    clearInterval(pageLooper);
    scrapper.closeDatabase(db);
  });
})();

//https://www.binance.com/en/futures/BTCBUSD?utm_source=internal&utm_medium=homepage&utm_campaign=trading_dashboard
//https://www.binance.com/en/trade/BTC_USDT?theme=dark&type=spot
