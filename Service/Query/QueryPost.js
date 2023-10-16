const { request } = require('express');
const { Post } = require('../../MongoDB/Model/Post');
const { User } = require('../../MongoDB/Model/Users');

/**
 * @NenoSann
 * @description 随机返回count数量的post，返回一个Promise表示完成情况
 * @param {Number} count 
 * @param {import('express').Response} res 
 * @returns {Promise}
 */
async function randomQuery(count, requestUserName, res) {
    const postArray = [];
    try {
        const requestUser = await User.findOne({ userName: requestUserName });
        const result = await Post.aggregate([{ $sample: { size: count } }]);
        if (result.length > 0) {
            for (const e of result) {
                await User.findById(e.author).then((foundUser) => {
                    postArray.push({
                        uploader: {
                            userName: foundUser.userName,
                            email: foundUser.email,
                            avatar: `data:image/jpeg;base64,${foundUser.avatar.toString('base64')}`,
                            userId: foundUser._id,
                        },
                        location: e.location,
                        postTime: e.date,
                        postContent: e.content,
                        likes: e.likes,
                        saves: e.saves,
                        commentCounts: e.comments.length,
                        commenents: e.comments,
                        postImage: `data:image/jpeg;base64,${e.image.toString('base64')}`,
                        postID: e._id,
                        isLiked: requestUser.likeList.includes(e._id),
                        isSaved: requestUser.saveList.includes(e._id)
                    });
                })
            };
            res.json({
                status: 'success',
                message: 'return random post',
                post: postArray
            });
            res.status(200).end();
        } else {
            console.log('No posts found.');
            res.json({
                status: 'fail',
                message: 'No posts found',
                post: []
            });
            res.status(200).end();
        }
    } catch (error) {
        console.error('Failed to retrieve random post:', error);
        // send error to the client when occurded
        res.status(500).json({ error: 'Failed to retrieve random post' });
        res.end();
    }

}

/**
 * @NenoSann
 * @description return user's post depends on passin type
 * @param {'like'|'save'|'own'} type
 * @param {String} requestUserId 
 * @param {import('express').Response} res 
 */
async function UserPostQuery(type, requestUserId, res) {
    try {
        let targetList;
        const postArray = [];
        const targetUser = await User.findOne({ _id: requestUserId });
        if (type === 'like') {
            targetList = targetUser.likeList;
        } else if (type === 'own') {
            targetList = targetUser.posts;
        } else if (type === 'save') {
            targetList = targetUser.saveList;
        }
        const uploader = {
            userName: targetUser.userName,
            email: targetUser.email,
            avatar: `data:image/jpeg;base64,${targetUser.avatar.toString('base64')}`,
            userId: targetUser._id
        }
        if (targetList.length === 0) {
            console.log('No posts found.');
            res.json({
                status: 'fail',
                message: 'No posts found',
                post: []
            });
            res.status(200).end();
        } else {
            for (const postId of targetList) {
                const post = await Post.findOne({ _id: postId }).lean();
                postArray.push({
                    uploader,
                    location: post.location,
                    postTime: post.date,
                    postContent: post.content,
                    likes: post.likes,
                    saves: post.saves,
                    commentCounts: post.comments.length,
                    commenents: post.comments,
                    postImage: `data:image/jpeg;base64,${post.image.toString('base64')}`,
                    postID: post._id,
                    // WRONG CODE HERE
                    isLiked: targetUser.likeList.includes(postId),
                    isSaved: targetUser.saveList.includes(postId)
                });
                console.log('likeList:', targetUser.likeList);
                console.log('saveList: ', targetUser.saveList);
            }
            res.json({
                status: 'success',
                message: `'return ${type} post'`,
                post: postArray
            });
            res.status(200).end();
        }
    } catch (error) {
        console.error(`'Failed to retrieve ${type} post:'`, error);
        // send error to the client when occurded
        res.status(500).json({ error: `'Failed to retrieve ${type} post'` });
        res.end();
    }
}
module.exports = { randomQuery, UserPostQuery }