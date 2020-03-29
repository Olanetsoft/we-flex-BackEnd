const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    content: {
        type: Number,
        required: true
    },
    creator: {
        type: String,
        required: true
    }
},
    { timestamps: true }//Updated at and created at will automatically be added to the database each time an item is posted
);

module.exports = mongoose.model('Post', postSchema);