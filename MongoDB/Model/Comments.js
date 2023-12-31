// 导入mongoose模块
const mongoose = require('mongoose')

// Define Comment schema
const commentSchema = mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    reception: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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