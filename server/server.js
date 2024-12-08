const express = require('express');
const cors = require('cors'); // Import cors middleware
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

const secretKey = process.env.SECRET_KEY;

if (!secretKey) {
  console.error('SECRET_KEY is not set in the .env file');
  process.exit(1);
}

// Load users from the users.json file
const loadUsers = () => {
  try {
    const data = fs.readFileSync('users.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading users.json:', err);
    return {};
  }
};

// Login API
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const users = loadUsers();

  if (users[username] && users[username] === password) {
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
