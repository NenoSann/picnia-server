const { User } = require('../../MongoDB/Model/Users');
const { passwordValidation } = require('../Validation/passwordValidation');
const bcrypt = require('bcrypt');
const saltRound = 10;

/**
 * @description Change the user's password, will check validation  
 * @param {string} userid userid in mongodb _id
 * @param {string} prevPwd user's previous password
 * @param {string} newPwd user's new password
 */
async function changeUserPwd(userid, prevPwd, newPwd) {
    return new Promise(async (resolve, reject) => {
        let failStatusCode = 500;
        try {
            if (!userid || !prevPwd || !newPwd) {
                failStatusCode = 400;
                throw new Error('argument validation failed');
            }

            const user = await User.findById(userid);
            if (user === null) {
                failStatusCode = 404;
                throw new Error('user not exist');
            }

            if (!passwordValidation(prevPwd, user.password)) {
                failStatusCode = 401;
                throw new Error('incorrect password');
            }

            const hashedPwd = await bcrypt.hash(newPwd, saltRound);
            user.password = hashedPwd;
            await user.save();
            resolve({
                status: 200,
                json: {
                    status: 'success',
                    message: 'success at change user password'
                }
            });
        } catch (error) {
            reject({
                status: failStatusCode,
                json: {
                    status: 'fail',
                    message: 'fail at changeUserpassword',
                    reason: error.message
                },
                failStatusCode
            });
        }
    });
}

module.exports = { changeUserPwd };