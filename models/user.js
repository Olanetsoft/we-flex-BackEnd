const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'I am new here !'
    },
    posts:[ {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }]
},

{ timestamps: true }//Updated at and created at will automatically be added to the database each time a post is created

);


module.exports = mongoose.model('User', userSchema);