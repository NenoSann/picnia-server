const express = require('express');
const router = express.Router();

// import util function from Service
const { QueryUserIdByUsername, QueryUserByEmail } = require('../Service/Query/QueryUser');

router.post('/query/pre-registe/:userName:userEmail', async (req, res) => {
    try {
        const { userName: name, userEmail: email } = req.params;
        const result = {
            status: 'fail',
            reason: []
        };
        // Check username
        if (!name) {
            result.reason.push('username-omit');
        } else {
            const user = QueryUserIdByUsername(name);
            // if current username is existed
            if (user) {
                result.reason.push('username-duplicate');
            }
        }

        // Check email
        if (!email) {
            result.reason.push('useremail-omit ');
        } else {
            const user = await QueryUserByEmail(email);
            if (user) {
                result.reason.push('useremail-duplicate');
            }
        }

        // Determine status
        if (!result.reason.length) {
            result.status = 'success';
        }

        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({
            error: 'fail to query username and email'
        })
    }
})

module.exports = { router: UserRouter };