const { User } = require('../../MongoDB/Model/Users')
const bcrypt = require('bcrypt');
const saltRround = 10;

async function passwordValidation(plainPassword, passwordHash) {
    await bcrypt.compare(plainPassword, passwordHash).then(() => {
        return true;
    }, () => {
        return false;
    })
}

module.exports = { passwordValidation }
