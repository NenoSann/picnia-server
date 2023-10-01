const { Post } = require('../MongoDB/Model/Post')
/**
 * @description 接受一个表示Post的Object参数，并将JSON代表的数据传入数据库
 * @param {Object} postContent
 */

function createPost(postContent) {
    const { json, imageBuffer } = postContent;
    const { author, location, date, content } = json;
    let { comments } = json;
    comments = comments === '' ? [] : comments;
    const newPost = new Post({
        image: imageBuffer,
        author: author,
        location: location,
        date: date,
        comments: comments,
        content: content,
    })
        .save()
        .then((savedPost) => {
            console.log('Post saved successfully: ', savedPost)
        })
        .catch((error) => {
            console.error(error);
        })
}

module.exports = createPost;