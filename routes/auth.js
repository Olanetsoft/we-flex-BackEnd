const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth');


//Importing User
const User = require('../models/user');

const router = express.Router();



//sign up route
router.put('/signup', [
    body('email')
        .isEmail()
        .withMessage("Please Enter a valid Email")
        .custom((value, { req }) => {
            return User.findOne({ email: value })
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject(
                            'E-Mail exists already, please pick a different one.'
                        );
                    }
                });
        })
        .normalizeEmail(),
    body('password',
        'Valid password Required with at least 5 characters')
        .isLength({ min: 5 })
        .trim(),
    body('name')
        .trim()
        .not().isEmpty()//To confirm its not empty

], authController.signUp)



module.exports = router;