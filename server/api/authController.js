const bcrypt = require('bcrypt');
const db = require('../config/db');

// Register new user
exports.register = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Hash the password
    const hash = await bcrypt.hash(password, 10);

    // Insert user into database
    db.run(
      'INSERT INTO users (email, password, firstName, lastName) VALUES (?, ?, ?, ?)',
      [email, hash, firstName, lastName],
      function (err) {
        if (err) {
          // Likely unique constraint on email failed
          return res.status(400).json({ error: 'User with this email already exists' });
        }
        res.status(201).json({ message: 'User registered successfully' });
      }
    );
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Login existing user
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      console.error('DB error on login:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Save user ID in session
    req.session.userId = user.id;

    // Send back user info (email, firstName, lastName) for frontend storage
    res.json({
      message: 'Logged in successfully',
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    });
  });
};

// Logout user
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
};
