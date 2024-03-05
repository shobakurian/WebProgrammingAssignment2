/*******************
  * ***********************************************************
  *  * ITE5315 – Assignment 2 * I declare that this assignment is my own work in accordance with
  *  Humber Academic Policy. * No part of this assignment has been copied manually or electronically 
  * from any other source * (including web sites) or distributed to other students. *
  *  * Name: Shoba Merin Kurian Student ID: N01511573 Date: 04-03-2024 * * ******************************************************************************/

// Import statements
var express = require('express');
var path = require('path');

// Create an Express application
var app = express();
const exphbs = require('express-handlebars');
const port = process.env.PORT || 3000;

// Read data from datasetA.json
let books = require("./datasetA.json"); // Load books data

// Update the Handlebars configuration
const { engine } = require("express-handlebars");
app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');

const hbs = engine({
  extname: ".hbs",
  // Define custom helpers
  helpers: {
    formatAvgReviews: function (avgReviews) {
      return avgReviews ? avgReviews : "N/A";
    },
    highlightEmptyReviews: function (avgReviews, options) {
      // If avgReviews is empty, add 'highlight' 
      return avgReviews ? "" : "highlight";
    },
  },
});

app.engine(".hbs", hbs);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Home route or default route
app.get('/', function (req, res) {
  res.render('index', { title: 'Express' });
});

// Route /users
app.get('/users', function (req, res) {
  res.send('respond with a resource');
});

app.get('/data', (req, res) => {
  res.render('data', { books });
});

app.get('/data/isbn/:index', (req, res) => {
    const index = req.params.index;
    // Check if the index is within the bounds of the 'books' array
    if (index >= 0 && index < books.length && books[index]) {
      res.render('isbn', { isbn: books[index].ISBN_13 });
    } else {
      // Handle case where index is out of bounds or books[index] is undefined
      res.status(404).send('Book not found');
    }
  });
  

// Middleware for parsing request bodies
app.use(express.urlencoded({ extended: true }));

// Display ISBN search form
app.get("/data/search/isbn", (req, res) => {
    res.render("isbn-search");
  });
  
  // Handle ISBN search
  app.post("/data/search/isbn", (req, res) => {
    const isbn = req.body.isbn;
    const book = books.find((book) => book.ISBN_13 === isbn);
  
    if (book) {
      res.render("isbnsearchresult", { isbn: isbn, books: [book] });
    } else {
      res.status(404).render("error", { message: "Book not found with the given ISBN." });
    }
  });
  

app.route('/data/search/title/')
  .get((req, res) => {
    res.render('titleSearch');
  })
  .post((req, res) => {
    const titleText = req.body.title; // Make sure the form has an input field named 'title'
    const booksFound = books.filter(book => book.title.includes(titleText));

    if (booksFound.length > 0) {
      const dataFound = booksFound.map(book => ({ ISBN: book.ISBN_13, Title: book.title, Author: book.author }));
      res.render('titleSearchResult', { data: dataFound });
    } else {
      res.status(404).send('No books found with the given title.');
    }
  });

app.get('/allData', (req, res) => {
  res.render('allData', { books });
});

// Rest all route renders error.hbs and prints the message 'Wrong Route'
app.get('*', function (req, res) {
  res.render('error', { title: 'Error', message: 'Wrong Route' });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
