const puppeteer = require("puppeteer");
const INDICATOR_CONSTANTS = require("./constants");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1000,
      height: 480,
    },
    //slowMo: 250,
  });

  console.log('====INDICATOR_CONSTANTS===', INDICATOR_CONSTANTS);

  const page = await browser.newPage();
  await page.goto(
    "https://www.binance.com/en/trade/BTC_USDT?theme=dark&type=spot"
  );

  await page.click("#onetrust-accept-btn-handler");
  await page.waitForSelector("#Time");
  await page.click("#Time");

  const pageLooper = setInterval(async () => {
    const indicators = await page.$$eval(
      ".chart-title-indicator-container span",
      (nodes) =>
        nodes
        .filter((n => n.innerText !== 'NaN'))
        .reduce((acc, n) => {
          acc[n.getAttribute("key")] = n.innerText;
          return acc;
        }, {})
    );
    console.log("indicators", indicators);
  }, 6000);

  page.on("close", () => {
    clearInterval(pageLooper);
  });

  //await browser.close();
})();

//https://www.binance.com/en/futures/BTCBUSD?utm_source=internal&utm_medium=homepage&utm_campaign=trading_dashboard
//https://www.binance.com/en/trade/BTC_USDT?theme=dark&type=spot
