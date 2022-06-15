const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("db/scrapper.sqlite");

db.run(
  "CREATE TABLE scrapper (time TEXT, price TEXT, vol_btc TEXT, vol_usdt TEXT)"
);

db.close();
