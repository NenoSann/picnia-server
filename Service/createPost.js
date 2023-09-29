const { Post } = require('../MongoDB/Model/Post')
/**
 * @description 接受一个表示Post的Object参数，并将JSON代表的数据传入数据库
 * @param {Object} postContent
 */

function createPost(postContent) {
    const { image, author, location, date, comments, content } = postContent;
    const newPost = new Post({
        image: image,
        author: author,
        location: location,
        date: date,
        comments: comments || null,
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