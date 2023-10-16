const jwt = require('jsonwebtoken')
const { User } = require('../MongoDB/Model/Users');
const { emailValidate } = require('./Validation/emailValidation');
const { createJWT } = require('../Service/signJWT');
const bcrypt = require('bcrypt');
const saltRround = 10;
/**
 * @NenoSann
 * @description 将传入的对象进行登录校验
 * @param {Object} credentials
 * @param {import('express').Response } res
 * @param {string} credentials.email -邮箱
 * @param {string} credentials.password -密码
 * @returns {jwt} jwtToken
 */
async function userLogin(credentials, res) {
    const { email, password } = credentials;
    if (emailValidate(email)) {
        try {
            const user = await User.findOne({ email: email })
            if (user) {
                //如果user存在
                let avatarBase64;
                const match = await bcrypt.compare(password, user.password);
                if (match) {
                    const token = createJWT({ userID: user._id });
                    if (user.avatar !== undefined) {
                        avatarBase64 = user.avatar.toString('base64');
                    }
                    res.send({
                        status: 'success',
                        message: 'correct',
                        user: {
                            userName: user.userName,
                            email: user.email,
                            avatar: user.avatar !== undefined ? `data:image/jpeg;base64,${avatarBase64}` : null,
                            userId: user._id,
                        },
                        token: token,
                    });
                    res.status(200);
                    res.end();
                } else {
                    //用户存在但是密码不匹配
                    res.send({
                        status: 'fail',
                        message: 'wrong password',
                    })
                    res.status(401);
                    res.end();
                }
            } else {
                //用户不存在
                res.send({
                    status: 'fail',
                    message: 'user not exists'
                });
                res.status(401);
                res.end();
            }
        } catch (error) {
            //服务器出现错误，返回错误信息
            res.send({
                status: 'fail',
                message: 'server error'
            });
            res.status(500);
            res.end();
            console.log(error);
        }
    }
}

module.exports = { userLogin }