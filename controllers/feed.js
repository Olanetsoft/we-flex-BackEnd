exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [{ title: "The First post", content: "This is the first fucking post :)" }]
    });
};

exports.createPost = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;

    //Create post
    res.status(201).json({
        message: 'post created successfully',
        post: {
            id: new Date().toISOString(),
            title: title,
            content: content
        }
    })
};