const { Post } = require('../../MongoDB/Model/Post');
const { User } = require('../../MongoDB/Model/Users');
const { storeImageBucket, storeMultipleImage } = require('./ImageBucket');
/**
 * @description 接受一个表示Post的Object参数，并将JSON代表的数据传入数据库
 * @param {Object} postContent
 * @param {import('express').Response} res
 */

async function createPost(postContent, res) {
    const { json, imageBuffer } = postContent;
    const { author, location, date, content, orientation } = json;
    let { comments } = json;
    // when comments is null
    comments = comments === '' ? [] : comments;
    try {
        const user = await User.findOne({ userName: author });
        if (user !== null) {
            const newPost = new Post({
                author: user._id,
                location,
                date,
                content,
                comments,
                orientation
            });
            // use post id as image's key
            let cosResponse = 'ERROR';
            try {
                cosResponse = await storeImageBucket(imageBuffer, `/image/${newPost._id}.jpg`);
            } catch (e) {
                console.log(`error: ${e}`);
            }
            if (cosResponse === 'ERROR') {
                throw new Error('cos service error.');
            }
            newPost.image = cosResponse.Location;
            await newPost.save();
            user.posts.push(newPost._id);
            await user.save();
            res.json({ status: 'success', message: 'create post success', newPostId: newPost._id });
            res.send();
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({
            status: 'fail',
            message: 'create post fail',
            reason: err.toString()
        })
    }
}

async function _createPost(postContent) {
    return new Promise(async (resolve, reject) => {
        const { json, imageBuffers } = postContent;
        const { author, location, date, content } = json;
        try {
            const user = await User.findOne({
                userName: author
            })
            if (user === null) {
                throw new Error('User not exist')
            }
            const newPost = new Post({
                author: user._id,
                location,
                date,
                content,
                comments: [],
            })
            let cosResponse = 'ERROR';
            const keys = imageBuffers.map((buffer, index) => {
                const type = buffer.mimetype.split('/')[1];
                return `/image/${newPost._id}_${index}.${type}`;
            })
            cosResponse = await storeMultipleImage(imageBuffers, keys);
            newPost.image = cosResponse.map((res) => res.Location);
            user.posts.push(newPost._id);
            await newPost.save();
            await user.save();
            resolve({ status: 'success', message: 'create post success', newPostId: newPost._id })
        } catch (err) {
            reject({
                status: 'fail',
                message: 'create post fail',
                reason: err.toString()
            })
        }
    })
}

module.exports = createPost;