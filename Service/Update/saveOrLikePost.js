const { Post } = require('../../MongoDB/Model/Post.js');
const { User } = require('../../MongoDB/Model/Users.js');

/**
 * @NenoSann
 * @description 根据target类型来进行post的点赞和收藏功能，需要注意的是如果用户已经点赞/收藏过目标post，
 * 函数会取消点赞/收藏
 * @param {"save"|"like"} target 
 * @param {String} userName`` 
 * @param {String} postId
 * @param {import('express').Response} res 
 * @returns {Promise}
 */
async function saveOrLikePost(target, userName, postId, res) {
    try {
        const targetUser = await User.findOne({ userName: userName });
        const targetPost = await Post.findbyId(postId);
        if (target === 'like') {

        }
    } catch (error) {

    }
}

module.exports = { saveOrLikePost }