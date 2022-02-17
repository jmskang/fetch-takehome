const express = require('express');
const app = express();

// logging middleware
const morgan = require('morgan');
app.use(morgan('dev'));

// body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API endpoints
app.use('/points', require('./api/points'));

// error handling endware
app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500);
  res.send(err.message || 'Internal Server Error');
});

module.exports = app;
