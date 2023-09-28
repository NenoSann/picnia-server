const mongoose = require('mongoose')
const User = require('./Users')
const Comment = require('./Comments');
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
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    location: {
        type: mongoose.Schema.Types.String,
    },
    data: {
        type: mongoose.Schema.Types.Date,
    },
    comments: [Comment],
});

const Post = mongoose.model(postSchema);
module.exports = postSchema, Post;