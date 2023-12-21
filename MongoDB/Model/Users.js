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
        type: mongoose.Schema.Types.String,
        default: 'imagebucket-1322308688.cos.ap-tokyo.myqcloud.com/picnia/avatar/default/default.png',
    },
    avatar_v: {
        type: mongoose.Schema.Types.Number,
        default: 0,
    },
    posts: {
        type: [mongoose.Schema.Types.ObjectId],
        default: undefined,
    },
    userBrief: {
        type: mongoose.Schema.Types.String,
        default: undefined,
    },
    likeList: {
        type: [mongoose.Schema.Types.ObjectId],
        default: undefined,
    },
    saveList: {
        type: [mongoose.Schema.Types.ObjectId],
        default: undefined,
    },
    createDate: mongoose.Schema.Types.Date,
});

module.exports = { User };