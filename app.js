const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed')

const app = express();


const MONGODB_URI = 'mongodb+srv://idris:Hayindehdb2019@cluster0-sszay.mongodb.net/messages?retryWrites=true&w=majority';



//app.use(bodyParser.urlencoded()); // x-www-form-urlencoded used for <form>
app.use(bodyParser.json()); // used for application/json


//Setting CORS for request from any server
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


app.use('/feed/', feedRoutes);

mongoose
  .connect(
    MONGODB_URI
  )
  .then(result => {
    app.listen(8080);
  })
  .catch(err => {
    console.log(err);
  });