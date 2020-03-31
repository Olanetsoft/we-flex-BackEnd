//importing user model
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const { validationResult } = require('express-validator');

//requiring bcrypt for encrypting password
const bcrypt = require('bcryptjs');




//method to sign up a new user
exports.signUp = (req, res, next) => {
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

//logs  user in
exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                const error = new Error('A user with this email could not be found.');
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Wrong password');
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign({
                email: loadedUser.email, 
                userId: loadedUser._id.toString()
            },
                'somesupersecretsecret',//can be as long as possible
                {
                    expiresIn: '1h'//this makes the token expires after an hour
                });

            res.status(200).json({ token: token, userId: loadedUser._id.toString() });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};


//gets user status
exports.getUserStatus = async (req, res, next) => {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        const error = new Error('User not found.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ status: user.status });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };

  //updates user status
  exports.updateUserStatus = async (req, res, next) => {
    const newStatus = req.body.status;
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        const error = new Error('User not found.');
        error.statusCode = 404;
        throw error;
      }
      user.status = newStatus;
      await user.save();
      res.status(200).json({ message: 'User updated.' });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };
