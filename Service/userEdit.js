const { User } = require('../MongoDB/Model/Users')
const { passwordValidation } = require('./Validation/passwordValidation')
const bcrypt = require('bcrypt');
const saltRound = 10;
/**
 * @NenoSann
 * @description find and check user's password,then change it
 * @param {Object} requestBody 
 * @param {import('express').Response} res 
 */
async function changePassword(requestBody, res) {
    const { userId, prePassword, newPassword } = requestBody;
    try {
        const targetUser = await User.findOne({ _id: userId });
        if (targetUser !== null) {
            if (await passwordValidation(prePassword, targetUser.password)) {
                const newHashedPassword = await bcrypt(newPassword, saltRound);
                targetUser.password = newHashedPassword;
                await targetUser.save();
            } else {
                res.send({
                    status: 'fail',
                    message: 'fail to change password: password validate fail.'
                })
            }
        } else {
            res.send({
                status: 'fail',
                message: 'fail to change password: user not found.'
            })
        }
        res.send({
            status: 'success',
            message: 'change user password success.'
        })
    } catch (error) {
        res.send({
            status: 'fail',
            message: 'internal server error.'
        })
        res.status(500).end();
    }
}

module.exports = { changePassword }