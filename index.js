const express = require('express')
const mongoose = require('mongoose')
const fs = require('fs')
const usersTable = require('./MongoDB/Model/Users');
const userRegiste = require('./Service/userRegiste');
const createComments = require('./Service/createComment');
const createPost = require('./Service/createPost');
const createImage = require('./Service/createImage');
// 创建中间件
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const { createUser } = require('./Service/createUser');
const app = express();
const port = 3000;
const database = 'mongodb://localhost:27017/pinia-database';

//中间件实例
const storage = multer.memoryStorage({
})
const upload = multer({ storage: storage });


// multer的实例对象
//启动全局cors，JSON解析和multer多文件解析
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));



//连接mongoose
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


// /**
//  * @description 代理创建Post请求
//  */
// app.post('/create/Post', async (req, res) => {
//     try {
//         console.log(req.body);
//         res.json({
//             state: 'ok'
//         })
//         res.sendStatus(200);
//     } catch (error) {
//         console.error(error);
//         res.sendStatus(500)
//     }
// })

/**
 * @description 代理创建图片请求，
 */
app.post('/create/Image', upload.single('image'), async (req, res) => {
    console.log('create image')
    if (!req.file) {
        res.status(400).send('No file uploaded');
        return;
    }
    const imageFile = {
        name: req.file.originalname,
        buffer: req.file.buffer,
    }
    try {
        createImage(imageFile);
    } catch (error) {
        res.status(500);
        res.send();
        console.error('Fail to store image');
    }
    res.status(200);
    res.send();
})

/**
 * @description 代理创建Multipart 表单请求
 */
app.post('/create/Post', upload.fields([{ name: 'json' }, { name: 'image' }]), async (req, res) => {
    console.log('Take in two fields');
    console.log(JSON.parse((req.files.json[0].buffer).toString('utf8')));
    fs.writeFileSync(path.join(__dirname, '/uploads/', req.files.image[0].originalname), req.files.image[0].buffer);
    createPost({
        'json': JSON.parse(req.files.json[0].buffer),
        'imageBuffer': req.files.image[0].buffer,
    })
    res.status(200);
    res.send();
})


/**
 * @description 代理创建User的请求,同时返回用户的jwtToken
 */
app.post('/create/User', upload.single('json'), async (req, res) => {
    try {
        const jwtToken = createUser(JSON.parse(req.file.buffer.toString('utf-8')));
        res.status(200);
        res.json({
            success: true,
            token: jwtToken,
        });
        console.log('Create new User')
        res.end();
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            token: null,
        })
    }
})

//启动服务器
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
