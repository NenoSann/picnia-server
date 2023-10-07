const { User } = require('../../MongoDB/Model/Users');
/**
 * @NenoSann
 * @description 判断数据库内是否有重复的用户名
 * @param {String} username 
 * @returns {Boolean}
 * @throws {error}
 */
async function duplicateUserName(username) {
    if (username == undefined) {
        throw new Error('no username');
    }
    try {
        const res = await User.findOne({ userName: username });
        return !!res;
    } catch (error) {
        throw new Error('Error on checking duplicated username');
    }
}
module.exports = { duplicateUserName }