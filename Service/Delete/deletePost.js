const { Post } = require('../../MongoDB/Model/Post');
const { User } = require('../../MongoDB/Model/Users');
/**
 * @description delete a post by its id, return a promise
 * @param {string} postId in mongodb ObjectId 
 * @returns {Promise}
 */
async function deletePostById(postId) {
    return new Promise(async (resolve, reject) => {
        // how to deal with error handling? doing it in here or move  
        // the error handling to express router
        try {
            const targetPost = await Post.findById(postId);
            if (targetPost === null) {
                throw new Error('target post is not exist');
            }
            targetPost.isInvalid = false;
            targetPost.save();
            resolve({
                statusCode: 200,
                message: {
                    status: 'success',
                    message: 'successfully delete the post'
                }
            })
        } catch (error) {
            reject({
                statusCode: 500,
                message: {
                    status: 'fail',
                    message: 'fail at deleting the post'
                }
            })
        }
    })
}

module.exports = { deletePostById }