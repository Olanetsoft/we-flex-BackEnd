const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const helmet = require('helmet'); 
const compression = require('compression');


const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const app = express();


//using helmet to secure response
app.use(helmet());

//using compression
app.use(compression());



//declare the file storage procedure
const today = new Date();
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds() + '-' + file.originalname);
    }
});

//To filter the file type
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};


const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-sszay.mongodb.net/${process.env.MONGO_DEFAULT_DB}?retryWrites=true&w=majority`;



//app.use(bodyParser.urlencoded()); // x-www-form-urlencoded used for <form>
app.use(bodyParser.json()); // used for application/json


//Initializing multer
app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);



//statically rendering/serving images folder
app.use('/images', express.static(path.join(__dirname, 'images')));





//Setting CORS for request from any server
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);


//this is a global error declaration when error hits
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status)
        .json({
            message: message,
            data: data
        });
});

mongoose
    .connect(
        MONGODB_URI
    )
    .then(result => {
        const server =  app.listen(process.env.PORT || 8080);;
        //Setup/Establish socket.io connection
        const io = require('./socket').init(server);
        //Now lets use it to define event listeners
        io.on('connection', socket => {
            console.log('React Client Connected')
        });
    })
    .catch(err => {
        console.log(err);
    });