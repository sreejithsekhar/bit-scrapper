const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("db/scrapper.sqlite");

db.run("DROP TABLE scrapper");

db.close();
