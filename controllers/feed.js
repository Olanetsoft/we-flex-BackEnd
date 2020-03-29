const { validationResult } = require('express-validator');

//importing post model
const Post = require('../models/post');


//gets all posts
exports.getPosts = (req, res, next) => {
    Post.find()
    .then(posts => {
        res.status(200)
        .json({
            message: 'Fetched Post successfully',
            posts: posts
        })
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};



//create new post
exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect... ');
        error.statusCode = 422;
        throw error;
    }
    //check if image not set
    if(!req.file){
        const error = new Error('No image provided');
        error.statusCode = 422;
        throw error;
    }
    //Then set the imageUrl
    const imageUrl = req.file.path;

    const title = req.body.title;
    const content = req.body.content;
    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl, 
        creator: { name: 'Idris' }
    });
    post
        .save()
        .then(result => {
            res.status(201).json({
                message: 'Post created successfully!',
                post: result
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

//get post by ID
exports.getPost = (req, res, next) => {
    const extractedPostIdFromTheUrl = req.params.postId;
    Post.findById(extractedPostIdFromTheUrl)//mongoose
        .then(post => {
            if (!post) {
                const error = new Error('could not find post');
                error.statusCode = 400;
                throw error;
            }
            res.status(200)
                .json({
                    message: 'Post Fetched',
                    post: post
                })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};