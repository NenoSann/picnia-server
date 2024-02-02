const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../Service/signJWT');
/**
 * @description the middleware that handle all jwt validation.
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {Function} next 
 */
function jwtValidation(req, res, next) {
    const token = req.headers.authorization;
    // skip JWT validation for certain url
    if (req.url === 'register') {
        next();
    }
    jwt.verify(token, SECRET_KEY, (err) => {
        res.status(401).json({
            status: 'failed',
            message: err?.message
        });
        // if token is valid, then call next middleware
        next();
    });
}


module.exports = { jwtValidation };