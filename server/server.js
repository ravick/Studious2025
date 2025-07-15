const express = require('express');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const homeRoutes = require('./routes/homeRoutes');

const app = express();
const port = 3000;

app.use(express.json());

// Serve static files from the 'client' directory
const clientPath = path.join(__dirname, '..', 'client');
console.log('Serving static files from client directory rooted at:', clientPath);
app.use(express.static(clientPath));

app.use(session({
  secret: "session_secret", //process.env.SESSION_SECRET || (() => { throw new Error('SESSION_SECRET environment variable is not set'); })(),
  resave: false,
  saveUninitialized: false
}));

app.use('/auth', authRoutes);
app.use('/home', homeRoutes);

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));