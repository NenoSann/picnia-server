const express = require('express')
const mongoose = require('mongoose')
const usersTable = require('./MongoDB/Model/Users');
const userRegiste = require('./Service/userRegiste');
const createComments = require('./Service/createComment');
const cors = require('cors');
const createPost = require('./Service/createPost');
const app = express();
const port = 3000;
const database = 'mongodb://localhost:27017/pinia-database';


//启动全局cors
app.use(cors());
app.use(express.json());

mongoose.connect(database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('connect to mongoDB');
    })
    .catch((error) => {
        console.error(error);
    });

//定义路由器
app.get('/users', async (req, res) => {
    try {
        const users = await usersTable.find();
        res.json(users);
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


app.post('/', async (req, res) => {
    try {
        console.log(req.body);
        userRegiste(req.body);
        res.sendStatus(200);
    } catch (error) {
        console.error('error on post', error);
        res.status(500).json({ error: 'server error' })
    }
})

/**
 * @description 代理创建Comment的请求
 */
app.post('/create/Comment', async (req, res) => {
    try {
        console.log('Get create comment: ', req.body);
        createComments(req.body);
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
})


/**
 * @description 代理创建Post请求
 */
app.post('/create/Post', async (req, res) => {
    try {
        console.log(req.body);
        createPost(req.body);
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(500)
    }
})


//启动服务器
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
