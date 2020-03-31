const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth');

//import auth
const isAuth = require('../middleware/is-auth');


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


router.post('/login', authController.login);

//gets user status
router.get('/status', isAuth, authController.getUserStatus);


//updates user status
router.patch(
    '/status',
    isAuth,
    [
      body('status')
        .trim()
        .not()
        .isEmpty()
    ],
    authController.updateUserStatus
  );


module.exports = router;