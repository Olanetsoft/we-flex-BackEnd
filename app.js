const express = require('express');
const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed')

const app = express();



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




app.listen(8080);