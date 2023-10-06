const jwt = require('jsonwebtoken');
/**
 * @NenoSann
 * @description 将传入的load经过jwt计算后返回jwt
 * @param {*} load
 * @returns {jwt.Jwt} token
 */
const SECRET_KEY = 'TestKEY';
function createJWT(load) {
    const token = jwt.sign(load, SECRET_KEY);
    return token;
}

module.exports = { createJWT };