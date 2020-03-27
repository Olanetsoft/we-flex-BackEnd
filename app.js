const express = require('express');
const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed')

const app = express();



//app.use(bodyParser.urlencoded()); // x-www-form-urlencoded used for <form>
app.use(bodyParser.json()); // used for application/json


app.use('/feed/', feedRoutes);




app.listen(8080);