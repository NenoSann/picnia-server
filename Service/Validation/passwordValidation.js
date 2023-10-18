const { User } = require('../../MongoDB/Model/Users')
const bcrypt = require('bcrypt');
const saltRround = 10;

async function passwordValidation(plainPassword, passwordHash) {
    try {
        const result = await bcrypt.compare(plainPassword, passwordHash);
        return result;
    } catch (error) {
        // 处理错误情况
        console.error(error);
        return false;
    }
}

module.exports = { passwordValidation }
