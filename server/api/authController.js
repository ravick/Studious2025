require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('../config/db');
const nodemailer = require('nodemailer');

// Example email validation function
function isValidEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

// Move transporter to the top, reuse it:
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,      // e.g. "smtp.mailtrap.io"
  port: parseInt(process.env.SMTP_PORT), // e.g. 587
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,    // your SMTP username
    pass: process.env.SMTP_PASS     // your SMTP password
  }
});

// Register new user
exports.register = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
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
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
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

// Send reset code to email
exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    if (!user) return res.status(400).json({ error: 'This is not a registered email.' });

    // Generate code and expiry (10 min)
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000;

    db.run(
      'UPDATE users SET resetCode = ?, resetCodeExpires = ? WHERE email = ?',
      [code, expires, email],
      (err) => {
        if (err) return res.status(500).json({ error: 'Server error' });

        const mailOptions = {
          from: process.env.SMTP_FROM || 'Studious <no-reply@studious.com>',
          to: email,
          subject: 'Your Studious Password Reset Code',
          text: `Your password reset code is: ${code}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Email send error:', error); // Log the actual error
            return res.status(500).json({ error: 'Failed to send email' });
          }
          res.json({ message: 'Reset code sent' });
        });
      }
    );
  });
};

// Verify reset code
exports.verifyResetCode = (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: 'Email and code are required' });
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  db.get(
    'SELECT resetCode, resetCodeExpires FROM users WHERE email = ?',
    [email],
    (err, user) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      if (!user || !user.resetCode || !user.resetCodeExpires) {
        return res.status(400).json({ error: 'Invalid or expired code.' });
      }
      if (user.resetCode !== code || Date.now() > user.resetCodeExpires) {
        return res.status(400).json({ error: 'Invalid or expired code.' });
      }
      res.json({ message: 'Code verified' });
    }
  );
};

// Reset password
exports.resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  db.get(
    'SELECT resetCode, resetCodeExpires FROM users WHERE email = ?',
    [email],
    async (err, user) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      if (!user || !user.resetCode || !user.resetCodeExpires) {
        return res.status(400).json({ error: 'Invalid or expired code.' });
      }
      if (user.resetCode !== code || Date.now() > user.resetCodeExpires) {
        return res.status(400).json({ error: 'Invalid or expired code.' });
      }

      const hash = await bcrypt.hash(newPassword, 10);
      db.run(
        'UPDATE users SET password = ?, resetCode = NULL, resetCodeExpires = NULL WHERE email = ?',
        [hash, email],
        (err) => {
          if (err) return res.status(500).json({ error: 'Server error' });
          res.json({ message: 'Password reset successful' });
        }
      );
    }
  );
};

/* SQL to add columns:
ALTER TABLE users ADD COLUMN resetCode TEXT;
ALTER TABLE users ADD COLUMN resetCodeExpires INTEGER;
*/
