const { User } = require('../../MongoDB/Model/Users');

/**
 * @description Change the target user's username, and return a promise that indicate  
 *              wether the opration is successful or not.
 * @param {string} userid 
 * @param {string} username 
 * @returns {Promise}
 */
async function changeUsername(userid, username) {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findById(userid);
            if (user !== null) {
                user.userName = username;
                await user.save();
                resolve({
                    status: 'success',
                    message: `changed user ${user._id} username to ${username}`
                })
            } else {
                throw new Error('user not exists');
            }
        } catch (e) {
            reject({
                status: 'fail',
                message: 'fail at change Username',
                reason: e.toString()
            })
        }
    })
}

module.exports = { changeUsername }