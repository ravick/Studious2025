const bcrypt = require('bcrypt');
const db = require('../config/db');

exports.register = async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], function (err) {
    if (err) return res.status(400).json({ error: 'User already exists' });
    res.status(201).json({ message: 'User registered' });
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err || !user) return res.status(400).json({ error: 'Invalid username' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid password' });

    req.session.userId = user.id;
    res.json({ message: 'Logged in successfully' });
  });
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out' });
};
