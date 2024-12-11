const express = require('express');
let books = require("./booksdb.js");  // Assuming booksdb.js provides book data
let isValid = require("./auth_users.js").isValid;  // Assuming isValid validates username
let users = require("./auth_users.js").users;  // Assuming users array stores registered users

const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Validate username
  if (!username || !isValid(username)) {
    return res.status(400).json({ message: "Invalid username" });
  }

  // Check for existing username (assuming users array stores usernames)
  if (users.find(user => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Add user to users array (replace with actual user storage logic)
  users.push({ username, password }); // Example - update with proper user object

  return res.status(201).json({ message: "Registration successful" });
});

// Get the list of all books
public_users.get('/', function (req, res) {
  return res.status(200).json(books); // Assuming books contains book data
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const { isbn } = req.params;
  const book = books.find(book => book.isbn === isbn);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(book);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const { author } = req.params;
  const matchingBooks = books.filter(book => book.author === author);

  if (!matchingBooks.length) {
    return res.status(404).json({ message: "No books found by this author" });
  }

  return res.status(200).json(matchingBooks);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const { title } = req.params;
  const matchingBooks = books.filter(book => book.title.toLowerCase().includes(title.toLowerCase()));

  if (!matchingBooks.length) {
    return res.status(404).json({ message: "No books found with this title" });
  }

  return res.status(200).json(matchingBooks);
});

// Get book review (assuming reviews are stored in booksdb.js)
public_users.get('/review/:isbn', function (req, res) {
  const { isbn } = req.params;
  const book = books.find(book => book.isbn === isbn);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Assuming reviews are part of the book object
  if (!book.reviews || !book.reviews.length) {
    return res.status(200).json({ message: "No reviews found for this book" });
  }

  return res.status(200).json(book.reviews);  // Return reviews if available
});

module.exports.general = public_users;