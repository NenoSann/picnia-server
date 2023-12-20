const { Post } = require('../../MongoDB/Model/Post');
const { User } = require('../../MongoDB/Model/Users');
const { storeImageBucket } = require('./ImageBucket');
/**
 * @description 接受一个表示Post的Object参数，并将JSON代表的数据传入数据库
 * @param {Object} postContent
 * @param {import('express').Response} res
 */

async function createPost(postContent, res) {
    const { json, imageBuffer } = postContent;
    const { author, location, date, content } = json;
    let { comments } = json;
    // when comments is null
    comments = comments === '' ? [] : comments;
    try {
        const user = await User.findOne({ userName: author });
        if (user !== null) {
            const newPost = new Post({
                author: foundUser._id,
                location,
                date,
                content,
                comments,
            });
            // use post id as image's key
            const cosResponse = await storeImageBucket(imageBuffer, `/image/${newPost._id}`);
            if (cosResponse === 'ERROR') {
                throw new Error('cos service error.');
            }
            newPost.image = cosResponse.Location;
            await newPost.save();
            user.posts.push(newPost._id);
            await user.save();
            res.json({ status: 'success', message: 'create post success', newPostId: savedPost._id });
            res.send();
        }
    } catch (err) {
        res.status(500).send({
            status: 'fail',
            message: 'create post fail',
            reason: err.toString()
        })
    }

    // await User.findOne({ userName: author }).then((foundUser) => {
    //     const newPost = new Post({
    //         image: imageBuffer,
    //         author: foundUser._id,
    //         location,
    //         date,
    //         content,
    //         comments,
    //     }).save().then(async (savedPost) => {
    //         foundUser.posts.push(savedPost._id);
    //         await foundUser.save();
    //         console.log('newPost id: ', savedPost._id)
    //         res.json({ status: 'success', message: 'create post success', newPostId: savedPost._id });
    //         res.send();
    //         console.log('Post saved successfully: ');
    //     })
    //         .catch((error) => {
    //             res.json({ status: 'fail', message: 'create post fail' });
    //             console.log('Create fail: ', error);
    //         })
    // })

}

module.exports = createPost;