const Comment = require('../MongoDB/Model/Comments')
/**
 * @description 接受一个表示Comment的Object参数，并将JSON代表的数据传入数据库
 * @param {Object} commentContent
 * 
 */
function createComments(commentContent) {
    const { sender, reception, date, content } = commentContent;
    const newComment = new Comment({
        sender: sender,
        reception: reception,
        date: date,
        content: content,
    })
        .save()
        .then((savedComment) => {
            console.log('Comment saved successfuly', savedComment);
        })
        .catch((error) => {
            console.error(error);
        })

}

module.exports = createComments;