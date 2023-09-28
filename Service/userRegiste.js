const usersTable = require('../MongoDB/usersTable');

/**
 * @description: 接受一个json参数，将json中的参数解析后存入mongodb的用户表中
 * @param {Object} userDateObject
 * @returns {boolean}
 */
function registeUser(userDataObject) {
    const { userName, avatar, post = null } = userDataObject;
    const newUser = new usersTable({
        userName: userName,
        avatar: avatar,
        post: post,
    })
        .save()
        .then((savedUser) => {
            console.log('User saved successfully,', savedUser);
        })
        .catch((error) => { console.error(error); })
}

module.exports = registeUser;