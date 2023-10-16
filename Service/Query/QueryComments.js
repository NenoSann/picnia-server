const { Post } = require('../../MongoDB/Model/Post');
const { Comment } = require('../../MongoDB/Model/Comments');

/**
 * @description return all comments in target post
 * @param {String} postId 
 * @param {import('express').Response} res 
 */
async function QueryComments(postId, res) {
    try {
        const commentsArray = [];
        const foundComments = await Comment.find({ post: postId });
        console.log(foundComments)
        res.send(JSON.stringify(foundComments));
        res.status(200)
    } catch (error) {
        res.status(500);
        console.error('fail on query comments, ', error);
    }
}

module.exports = { QueryComments }