const express = require('express');
const router = express.Router();

// import util function from Service
const { QueryUserIdByUsername, QueryUserByEmail } = require('../Service/Query/QueryUser');

router.post('/preRegiste', async (req, res) => {
    try {
        const { userName: name, userEmail: email } = req.query;
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

router.post('/checkValidity', async (req, res) => {
    try {
        const { type, value } = req.query; // 传入类型和对应的值
        const result = {
            status: 'fail',
            reason: []
        };

        // 验证参数
        if (!type || !value) {
            result.reason.push('type-or-value-omit');
            return res.status(400).json(result); // 返回 400 状态码
        }

        // 处理用户名或邮箱验证
        if (type === 'username') {
            const targetUser = await QueryUserIdByUsername(value);
            if (!value) {
                result.reason.push('username-omit');
            } else if (targetUser) {
                result.reason.push('username-duplicate');
            }
        } else if (type === 'useremail') {
            const targetUser = await QueryUserByEmail(value);
            if (!value) {
                result.reason.push('useremail-omit');
            } else if (targetUser) {
                result.reason.push('useremail-duplicate');
            }
        } else {
            result.reason.push('invalid-type'); // 处理无效类型
        }

        // 确定状态
        result.status = result.reason.length === 0 ? 'success' : 'fail';
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            error: 'fail to validate'
        });
    }
});

module.exports = { userRouter: router };