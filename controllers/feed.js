const { validationResult } = require('express-validator')

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
    const title = req.body.title;
    const content = req.body.content;
    const errors = validationResult(req);

    if (!errors) {
        return res.status(422)
            .json({
            message: 'Validation failed, Entered data is incorrect...',
            errors: errors.array()
        }
        )
    }

    //Create post
    res.status(201).json({
        message: 'post created successfully',
        post: {
            _id: new Date().toISOString(),
            title: title,
            content: content,
            creator: { name: 'AY' },
            createdAt: new Date()
        }
    })
};