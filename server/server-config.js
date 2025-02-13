require('dotenv').config()
const express = require('express');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const todoRoutes = require('./routes/todos.js')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.use('/users', userRoutes);
app.use('/todos', todoRoutes);

module.exports = app;
