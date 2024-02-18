const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../Service/signJWT');
/**
 * @description the middleware that handle all jwt validation.
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {Function} next 
 */
function jwtValidation(req, res, next) {
    if (req.url === '/create/User' || req.url === '/login') {
        next();
        return;
    }
    // skip JWT validation for certain url
    console.log(req.url);
    if (!req.headers.authorization) {
        return res.status(403).json({
            status: 'failed',
            message: 'Authorization not include'
        })
    }
    const token = req.headers.authorization.slice(7);
    jwt.verify(token, SECRET_KEY, (err) => {
        if (err) {
            return res.status(401).json({
                status: 'failed',
                message: err?.message
            });
        }
        next();
    });
}


module.exports = { jwtValidation };