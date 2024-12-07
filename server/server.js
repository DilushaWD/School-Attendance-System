// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

// Load the secret key from .env
const secretKey = process.env.SECRET_KEY;

// Ensure secretKey is not undefined
if (!secretKey) {
  console.error('SECRET_KEY is not set in the .env file');
  process.exit(1); // Exit if the secret key is not found
}

// Load users from the users.json file
const loadUsers = () => {
  try {
    const data = fs.readFileSync('users.json', 'utf8');
    return JSON.parse(data); // Parse and return users as an object
  } catch (err) {
    console.error('Error reading users.json:', err);
    return {}; // Return an empty object in case of an error
  }
};

// Login API
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const users = loadUsers();

  // Check if the username exists and password matches
  if (users[username] && users[username] === password) {
    // Generate a JWT token with a 1-hour expiration
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
    return res.json({ token });
  } else {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
