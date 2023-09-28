const mongoose = require('mongoose')

const User = mongoose.model('User', {
    userID: mongoose.Types.ObjectId,
    userName: String,
    avatar: String,
    posts: [
        {
            post_id: mongoose.Types.ObjectId,
            title: String,
            content: String,
            timeStamp: Date
        }
    ]
});

module.exports = User;