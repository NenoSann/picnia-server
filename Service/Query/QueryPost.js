const { Post } = require('../../MongoDB/Model/Post');
const { User } = require('../../MongoDB/Model/Users');

/**
 * @NenoSann
 * @description 随机返回count数量的post，返回一个Promise表示完成情况
 * @param {Number} count 
 * @param {import('express').Response} res 
 * @returns {Promise}
 */
async function randomQuery(count, res) {
    const postArray = [];
    try {
        const result = await Post.aggregate([{ $sample: { size: count } }]);
        if (result.length > 0) {
            for (const e of result) {
                await User.findById(e.author).then((foundUser) => {
                    postArray.push({
                        uploader: {
                            userName: foundUser.userName,
                            email: foundUser.email,
                            avatar: `data:image/jpeg;base64,${foundUser.avatar.toString('base64')}`
                        },
                        location: e.location,
                        postTime: e.date,
                        postContent: e.content,
                        likes: e.likes,
                        saves: e.saves,
                        commentCounts: e.comments.length,
                        commenents: e.comments,
                        postImage: `data:image/jpeg;base64,${e.image.toString('base64')}`,
                        postID: e._id
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

module.exports = { randomQuery }