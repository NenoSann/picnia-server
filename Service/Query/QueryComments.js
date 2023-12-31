const { Post } = require('../../MongoDB/Model/Post');
const { User } = require('../../MongoDB/Model/Users');
const { Comment } = require('../../MongoDB/Model/Comments');

/**
 * @description return all comments in target post
 * @param {String} postId 
 * @param {import('express').Response} res 
 */
async function QueryComments(postId, res) {
    try {
        const foundComments = await Comment.find({ post: postId }).lean();
        console.log(foundComments)
        const updatedComments = []; // 用于存储更新后的评论对象
        for (const comment of foundComments) {
            const foundUser = await User.findOne({ _id: comment.sender });
            comment.sender = {
                avatar: foundUser.avatar ? `data:image/jpeg;base64,${foundUser.avatar.toString('base64')}` : null,
                userName: foundUser.userName,
                userId: foundUser._id
            }
            updatedComments.push(comment);
        }
        console.log('updated comments: ', updatedComments);
        res.send(JSON.stringify(updatedComments));
        res.status(200)
    } catch (error) {
        res.status(500);
        console.error('fail on query comments, ', error);
    }
}

module.exports = { QueryComments }