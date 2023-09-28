// 导入mongoose模块
const mongoose = require('mongoose')
const User = require('./Users');

// Define Comment schema
const commentSchema = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
    },
    reception: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
    },
    date: {
        type: mongoose.Schema.Types.Date,
        default: Date.now,
    },
    content: {
        type: mongoose.Schema.Types.String,
        required: true,
    }
})

// Create Comment model
const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Comment, commentSchema }