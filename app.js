const puppeteer = require("puppeteer");
const sqlite3 = require('sqlite3').verbose();
//const db = new sqlite3.Database(':memory:');
const db = new sqlite3.Database('db/scrapper.sqlite');


const INDICATOR_CONSTANTS = require("./constants");
const INTERVAL = 6000;
//const INTERVAL = 180000;

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1000,
      height: 480,
    },
    slowMo: 250,
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
  }, INTERVAL);

  saveIndicators();

  page.on("close", () => {
    clearInterval(pageLooper);
  });

  //await browser.close();
})();

function saveIndicators() {
  db.serialize(() => {
    //db.run("CREATE TABLE scrapper (time TEXT, price TEXT, vol_btc TEXT, vol_usdt TEXT)");

    //const stmt = db.prepare("INSERT INTO scrapper VALUES ('2022/06/15 14:32', '21616.96', '6.973', '150.598K')");
    // for (let i = 0; i < 10; i++) {
    //     stmt.run("Ipsum " + i);
    // }
    //stmt.run();
    //stmt.finalize();

    db.each("SELECT * FROM scrapper", (err, row) => {
        console.log(row);
    });
});

db.close();
}

//https://www.binance.com/en/futures/BTCBUSD?utm_source=internal&utm_medium=homepage&utm_campaign=trading_dashboard
//https://www.binance.com/en/trade/BTC_USDT?theme=dark&type=spot
