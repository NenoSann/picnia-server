const { User } = require('../MongoDB/Model/Users');
const { createJWT } = require('../Service/signJWT');

/**
 * 
 * @param {*} body 
 * @returns token
 */
function createUser(body) {
    const { userName, email, password } = body;
    console.log(body)
    const newUser = new User({
        userName: userName,
        email: email,
        password: password,
        // avatar,
        createDate: Date.now(),
    });
    try {
        newUser.save();
        return createJWT({ userID: newUser._id });
    } catch (error) {
        throw (error);
    }
}

module.exports = { createUser };