const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'users.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Create table if not exists
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT,
      firstName TEXT,
      lastName TEXT
    )
  `);

  // Check existing columns
  db.all("PRAGMA table_info(users)", (err, columns) => {
    if (err) {
      console.error("Error fetching table info:", err);
      return;
    }

    const columnNames = columns.map(col => col.name);

    if (!columnNames.includes('resetCode')) {
      db.run("ALTER TABLE users ADD COLUMN resetCode TEXT", err => {
        if (err) console.error("Error adding resetCode column:", err);
        else console.log("Added resetCode column");
      });
    }

    if (!columnNames.includes('resetCodeExpires')) {
      db.run("ALTER TABLE users ADD COLUMN resetCodeExpires INTEGER", err => {
        if (err) console.error("Error adding resetCodeExpires column:", err);
        else console.log("Added resetCodeExpires column");
      });
    }
  });
});

module.exports = db;
