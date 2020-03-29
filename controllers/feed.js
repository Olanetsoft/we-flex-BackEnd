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

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: 'Validation failed, entered data is incorrect.',
        errors: errors.array()
      });
    }
    const title = req.body.title;
    const content = req.body.content;
    const post = new Post({
      title: title,
      content: content,
      imageUrl: 'images/duck.jpg',
      creator: { name: 'Maximilian' }
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
        console.log(err);
      });
};