const { validationResult } = require('express-validator');

//importing post model
const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [
            {
                _id: '1',
                title: "The First post !",
                content: "This is the first fucking post :)",
                imageUrl: 'images/download.png',
                creator: {
                    name: 'idris',
                },
                createdAt: new Date().toISOString()
            }
        ]
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
    const title = req.body.title;
    const content = req.body.content;
    const post = new Post({
      title: title,
      content: content,
      imageUrl: 'images/duck.jpg',
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
          if(!err.statusCode){
            err.statusCode = 500;
          }
          next(err);
      });
};