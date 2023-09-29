const mongoose = require('mongoose')
const { postSchema } = require('./Post')

const User = mongoose.model('User', {
    userID: mongoose.Types.ObjectId,
    userName: String,
    avatar: String,
    posts: [
        postSchema
    ]
});

module.exports = { User };