require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const secretKey = process.env.SECRET_KEY; // Load the secret key from .env

// Load users from the file
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
      // Generate a JWT token
      const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
      return res.json({ token });
    } else {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
  });
  
  // Start the server
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
