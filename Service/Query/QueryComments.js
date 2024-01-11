const { Post } = require('../../MongoDB/Model/Post');
const { User } = require('../../MongoDB/Model/Users');
const { Comment } = require('../../MongoDB/Model/Comments');
const defaultAvatar = 'https://imagebucket-1322308688.cos.ap-tokyo.myqcloud.com/picnia/avatar/default/default.png';
/**
 * @description return all comments in target post
 * @param {String} postId 
 * @param {import('express').Response} res 
 */
async function QueryCommentsById(postId, res) {
    try {
        const foundComments = await Comment.find({ post: postId }).lean();
        console.log(foundComments)
        const updatedComments = []; // 用于存储更新后的评论对象
        for (const comment of foundComments) {
            const foundUser = await User.findOne({ _id: comment.sender });
            comment.sender = {
                avatar: foundUser.avatar ? `https://${foundUser.avatar}` : `https://${defaultAvatar}`,
                userName: foundUser.userName,
                userId: foundUser._id
            }
            updatedComments.push(comment);
        }
        console.log('updated comments: ', updatedComments);
        res.send(JSON.stringify({
            postId: postId,
            item: updatedComments
        }));
        res.status(200)
    } catch (error) {
        res.status(500);
        console.error('fail on query comments, ', error);
    }
}
module.exports = { QueryCommentsById }