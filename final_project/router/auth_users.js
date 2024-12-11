const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []; // Array to store registered users

// Function to validate username (replace with your validation logic)
const isValid = (username) => {
  // we can implement username length checks, character restrictions, etc.
  // Example: return username.length >= 6 && username.match(/^[a-zA-Z0-9]+$/);
  return true; // Replace with your actual validation logic
};

// Function to authenticate user (replace with your authentication logic)
const authenticatedUser = (username, password) => {
  // we can implement logic to check user credentials against a database or other source
  // Example: return users.find(user => user.username === username && user.password === password);
  const foundUser = users.find(user => user.username === username && user.password === password);
  return foundUser !== undefined;
};

// Login route for registered users
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Validate username
  if (!username || !isValid(username)) {
    return res.status(400).json({ message: "Invalid username" });
  }

  // Authenticate user
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate JWT token on successful login
  const token = jwt.sign({ username }, 'your_secret_key', { expiresIn: '30m' });
  return res.status(200).json({ message: "Login successful", token });
});

// Route for adding a book review (requires authentication)
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;

  // Check for authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }

  const token = authHeader.split(' ')[1];

  // Verify JWT token
  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    
    return res.status(201).json({ message: "Review added successfully" });
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users; // Exported for potential registration logic