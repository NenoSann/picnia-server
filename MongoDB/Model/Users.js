const mongoose = require('mongoose')
const { postSchema } = require('./Post')
const User = mongoose.model('User', {
    userID: mongoose.Schema.Types.ObjectId,
    userName: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
    },
    email: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
    },
    password: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    // 使用Buffer作为用户的头像，也许可以替换为id或者其他的非字节类型以提高性能
    avatar: {
        type: mongoose.Schema.Types.Buffer,
        default: undefined,
    },
    posts: {
        type: [postSchema],
        default: undefined,
    },
    createDate: mongoose.Schema.Types.Date,
});

module.exports = { User };