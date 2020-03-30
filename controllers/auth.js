//importing user model
const User = require('../models/user');

const { validationResult } = require('express-validator');

exports.signUp = (req, res, next) =>{
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect... ');
        error.statusCode = 422;
        error.data = errors.array();//this allow to keep errors retrieved by validation package
        throw error;
    }
    
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;

};