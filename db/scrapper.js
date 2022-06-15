const sqlite3 = require("sqlite3").verbose();

module.exports = {
  openDatabase,
  saveIndicators,
  viewIndicators,
  closeDatabase,
};

function openDatabase() {
  const db = new sqlite3.Database("db/scrapper.sqlite");
  return db;
}

function saveIndicators(db, indicators) {
  const { t, c, "VOL[0]Series": btc, "VOL[1]Series": usdt } = indicators;
  db.run("INSERT INTO scrapper VALUES ($time, $price, $btc, $usdt)", {
    $time: t,
    $price: c,
    $btc: btc,
    $usdt: usdt,
  });
}

function viewIndicators(db) {
  db.each("SELECT * FROM scrapper", (err, row) => {
    console.log(row);
  });
}

function closeDatabase(db) {
  db.close();
}
