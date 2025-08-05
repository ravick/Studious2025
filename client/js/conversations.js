// server.js or index.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Open the database
const db = new sqlite3.Database('your_database.db');

// API to get all chats
app.get('/api/chats', (req, res) => {
  db.all('SELECT * FROM chats ORDER BY createdAt DESC', (err, rows) => {
    if (err) {
      console.error('Error fetching chats:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// Serve static files (like your HTML)
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
