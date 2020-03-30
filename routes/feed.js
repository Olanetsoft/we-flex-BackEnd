const express = require('express');
const { body } = require('express-validator');

const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');

const router = express.Router();


//GET /feed /posts
router.get('/posts', isAuth, feedController.getPosts);

//POST /feed/post
router.post('/post',
    [
        body('title')
            .trim()
            .isLength({ min: 5 }),
        body('content')
            .trim()
            .isLength({ min: 5 })
    ],
    feedController.createPost);


//GET /feed /post
router.get('/post/:postId', feedController.getPost);

//PUT /feed/post
router.put('/post/:postId', [
    body('title')
        .trim()
        .isLength({ min: 5 }),
    body('content')
        .trim()
        .isLength({ min: 5 })
], feedController.updatePost);


//DELETE /feed /post
router.delete('/post/:postId', feedController.deletePost);

module.exports = router;
