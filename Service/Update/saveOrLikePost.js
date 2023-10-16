const { Post } = require('../../MongoDB/Model/Post.js');
const { User } = require('../../MongoDB/Model/Users.js');

/**
 * @NenoSann
 * @description 根据target类型来进行post的点赞和收藏功能，需要注意的是如果用户已经点赞/收藏过目标post，
 * 函数会取消点赞/收藏
 * @param {"save"|"like"} target 
 * @param {String} userName
 * @param {String} postId
 * @param {import('express').Response} res 
 * @returns {Promise}
 */
async function saveOrLikePost(target, userName, postId, res) {
    try {
        console.log(userName);
        const targetUser = await User.findOne({ userName: userName });
        const targetPost = await Post.findOne({ _id: postId });
        let targetList;
        let targetCount;
        if (target === 'like') {
            targetList = targetUser.likeList;
            targetCount = targetPost.likes;
        } else if (target === 'save') {
            targetList = targetUser.saveList;
            targetCount = targetPost.saves;
        }

        const targetIndex = targetList.indexOf(postId);
        // if post is not exist
        if (targetIndex === -1) {
            targetList.push(postId);
            targetCount++;
        } else {
            targetList.splice(targetIndex, 1);
            targetCount--;
        }

        if (target === 'like') {
            targetPost.likes = targetCount;
        } else if (target === 'save') {
            targetPost.saves = targetCount;
        }
        await targetUser.save();
        await targetPost.save();

        res.send({
            status: 'success',
            message: `successfully toggle ${target}`
        }).end();
    } catch (error) {
        console.log('saveOrLikePost fail, ', error)
        res.send({
            status: 'fail',
            message: `fail to toggle ${target}`
        }).status(500).end();
    }
}

module.exports = { saveOrLikePost }