const fs = require('fs');
const path = require('path');

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
    if (!req.file) {
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



//update post by ID
exports.updatePost = (req, res, next) => {
    const extractedFromTheUrl = req.params.postId;

    //To check if any error exist
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect... ');
        error.statusCode = 422;
        throw error;
    }

    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;
    //If the req.file has a file then the path is saved to imageUrl
    if (req.file) {
        imageUrl = req.file.path;
    }
    //If there is no path in imageUrl error will be thrown
    if (!imageUrl) {
        const error = new Error('No file picked.');
        error.statusCode = 422;
        throw error;
    };

    Post.findById(extractedFromTheUrl)
        .then(post => {
            if (!post) {
                const error = new Error('Could not find post.');
                error.statusCode = 404;
                throw error;
            }
            if (imageUrl !== post.imageUrl) {
                clearImage(post.imageUrl);
            }
            post.title = title;
            post.imageUrl = imageUrl;
            post.content = content;
            return post.save();
        })
        .then(result => {
            res.status(200).json({ message: 'Post updated!', post: result });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};


//helper function to clear the image from the path
const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
};