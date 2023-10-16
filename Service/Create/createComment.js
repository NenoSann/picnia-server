const { Comment } = require('../../MongoDB/Model/Comments')
const { Post } = require('../../MongoDB/Model/Post')
/**
 * @description 接受一个表示Comment的Object参数，并将JSON代表的数据传入数据库
 * @param {Object} commentContent
 * @param {import('express').Response} res
 * 
 */
async function createComments(commentContent, res) {
    const { postId, sender, reception, date, content } = commentContent;
    try {
        const targetPost = await Post.findOne({ _id: postId });
        const newComment = new Comment({
            post: postId,
            sender: sender,
            reception: reception,
            content: content,
        })
            .save()
            .then(async (savedComment) => {
                targetPost.comments.push(savedComment._id);
                await targetPost.save();
                console.log('Comment saved successfuly', savedComment);
                res.send({
                    status: 'success',
                    message: 'create comment success'
                });
                res.end();
            })
            .catch((error) => {
                console.error(error);
                res.send({
                    status: 'fail',
                    message: 'create comment fail'
                })
                res.status(500);
            })
    } catch (error) {
        console.log('Create comment error!:', error);
    }
}

module.exports = { createComments };