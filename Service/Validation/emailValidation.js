const Validator = require('validator');
/**
 * @NenoSann
 * @description 对传入的邮箱进行验证，返回邮箱是否符合规范
 * @param {String} email 
 * @returns {Boolean}
 */
function emailValidate(email) {
    if (!Validator.isEmail(email + '')) {
        throw new Error('invalid email');
    }
}

module.exports = { emailValidate }