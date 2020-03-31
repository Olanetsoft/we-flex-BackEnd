const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');


//importing io
const io = require('../socket');

//importing post model
const Post = require('../models/post');


//importing User model
const User = require('../models/user');


// //gets all posts with then and catch
// exports.getPosts = (req, res, next) => {
//     const currentPage = req.query.page || 1;
//     const perPage = 2;
//     let totalItems;
//     Post.find()
//         .countDocuments()
//         .then(count => {
//             totalItems = count;
//             return Post.find()
//                 .skip((currentPage - 1) * perPage)
//                 .limit(perPage);
//         })
//         .then(posts => {
//             res.status(200)
//                 .json({
//                     message: 'Fetched Post successfully',
//                     posts: posts,
//                     totalItems: totalItems
//                 })
//         })
//         .catch(err => {
//             if (!err.statusCode) {
//                 err.statusCode = 500;
//             }
//             next(err);
//         });
// };


//get post with async await
exports.getPosts = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    try {
      const totalItems = await Post.find().countDocuments();
      const posts = await Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
  
      res.status(200).json({
        message: 'Fetched posts successfully.',
        posts: posts,
        totalItems: totalItems
      });
    } catch (error) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
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
    let creator;
    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: req.userId
    });
    post
        .save()
        .then(result => {
            return User.findById(req.userId);
        })
        .then(user=> {
            creator = user;
            user.posts.push(post);
            return user.save();
           
        })
        .then(result => {
            //This informs other user before sending the status with the help os socket.io
            io.getIO()
            .emit('posts', {action: 'create', post: post })//send message to all users
            res.status(201).json({
                message: 'Post created successfully!',
                post: post,
                creator: {_id: creator._id, name: creator.name}
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
            //to check if the user is the post creator
            if(post.creator.toString() !== req.userId){
                const error = new Error('Not authorized !');
                error.statusCode = 403;
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



//To delete a post
exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('could not find post');
                error.statusCode = 400;
                throw error;
            }

            //checking logged in user
             //to check if the user is the post creator before deleting
             if(post.creator.toString() !== req.userId){
                const error = new Error('Not authorized !');
                error.statusCode = 403;
                throw error;
            }
            clearImage(post.imageUrl);
            return Post.findByIdAndRemove(postId);
        })
        .then(result => {
            return User.findById(req.userId);
          })
          .then(user => {
            user.posts.pull(postId);//in this section mongoose provides pull method so i used it to remove the post from the user when deleted 
            return user.save();
          })
        .then(result => {
            console.log(result);
            res.status(200).json({ message: 'Post Deleted !' });
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