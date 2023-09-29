const mongoose = require('mongoose')
const User = require('./Users')
const { commentSchema } = require('./Comments');

/**
 * @description Picnia的Post model，用于表示用户发送的Po文
 *         { author: ref:'user'
 *           image:
 *           location:
 *           date:
 *           comments:[],
 *          }
 * @type {mongoose.Schema}
 */
const postSchema = mongoose.Schema({
    image: {
        type: mongoose.Schema.Types.Buffer,
    },
    author: {
        type: mongoose.Schema.Types.String,
        // required: true
    },
    location: {
        type: mongoose.Schema.Types.String,
    },
    date: {
        type: mongoose.Schema.Types.Date,
    },
    content: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    comments: [commentSchema],
});

const Post = mongoose.model('Post', postSchema);
module.exports = { postSchema, Post };