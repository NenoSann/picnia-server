const { User } = require('../../MongoDB/Model/Users');
const { createJWT } = require('../signJWT');
const bcrypt = require('bcrypt');
const saltRound = 10;
/**
 * 
 * @param {*} body 
 * @returns {String} token
 */
async function createUser(body) {
    const { userName, email } = body;
    let { password } = body;
    console.log(body);
    try {
        const hashedPassword = await bcrypt.hash(password, saltRound);
        password = hashedPassword;
        const newUser = new User({
            userName: userName,
            email: email,
            password: password,
            // avatar,
            createDate: Date.now(),
            likeList: [],
            saveList: [],
            posts: [],
        });
        await newUser.save();
        return createJWT({ userID: newUser._id });
    }
    catch (error) {
        throw (error);
    }
}

module.exports = { createUser };