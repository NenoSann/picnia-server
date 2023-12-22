const { User } = require('../MongoDB/Model/Users');
const jwt = require('jsonwebtoken');
const { storeAvatar } = require('./Create/ImageBucket');
/**
 * @NenoSann
 * @description 将传入的avatar添加到user中
 * @param {*} user 
 * @param {import('express').Response } res
 */
async function changeUserAvatar(user, imgType, avatar, res) {
    try {
        const targetUser = await User.findOne({ userName: user.userName, email: user.email });
        //如果用户存在
        if (targetUser) {
            const cosResponse = await storeAvatar(avatar, targetUser._id, targetUser.avatar_v + 1, imgType);
            targetUser.avatar = cosResponse.Location;
            targetUser.avatar_v = targetUser.avatar_v + 1;
            await targetUser.save();
            res.status(200).json({ status: 'success', message: 'change avatar success' });
        } else {
            res.status(404).json({ status: 'fail', message: 'User not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'fail', message: "Internal server error", reason: error.toString() });
    }
}

module.exports = { changeUserAvatar };