const jwt = require('jsonwebtoken');
/**
 * @NenoSann
 * @description 将传入的load经过jwt计算后返回jwt
 * @param {*} load
 * @param {Number} expiredDay
 * @returns {jwt.Jwt} token
 */
const SECRET_KEY = 'TestKEY';
function createJWT(load, expiredDay = 7) {
    const token = jwt.sign(load, SECRET_KEY, { expiresIn: `${expiredDay}d` });
    return token;
}

module.exports = { createJWT };