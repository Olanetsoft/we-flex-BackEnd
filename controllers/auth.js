//importing user model
const User = require('../models/user');

const { validationResult } = require('express-validator');

//requiring bcrypt for encrypting password
const bcrypt = require('bcryptjs');





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

    bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        email: email,
        name: name,
        password: hashedPassword
      });
      return user.save();
    })
    .then(result => {
        res.status(201).json({
            message: 'User created successfully!',
            userId: result._id
        });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });

};