const express = require('express')
const mongoose = require('mongoose')
const usersTable = require('./MongoDB/Model/Users');
const userRegiste = require('./Service/userRegiste');
const createPost = require('./Service/Create/createPost');
const createImage = require('./Service/Create/createImage');
// 创建中间件
const { jwtValidation } = require('./Middleware/jwtValidation.js');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const { createUser } = require('./Service/Create/createUser');
const { env } = require('process');
const app = express();
const port = 3000;
const MONGODB_URL = 'mongodb://NenoSan:2440060505Jkl.@43.163.234.220:27017/pinia-database-test';

//中间件实例
const storage = multer.memoryStorage({
})
const upload = multer({ storage: storage });


// multer的实例对象
//启动全局cors，JSON解析和multer多文件解析
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(jwtValidation);


//连接mongoose
mongoose.connect(MONGODB_URL, {
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
app.post('/create/comment', async (req, res) => {
    const { createComments } = require('./Service/Create/createComment');
    try {
        console.log('Get create comment: ', req.body);
        createComments(req.body, res);
    } catch (error) {
        console.error(error);
    }
})


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
    createPost({
        'json': JSON.parse(req.files.json[0].buffer),
        'imageBuffer': req.files.image[0].buffer,
    }, res);
})


/**
 * @description 代理创建User的请求,同时返回用户的jwtToken
 */
app.post('/create/User', async (req, res) => {
    const { emailValidate } = require('./Service/Validation/emailValidation');
    const { duplicateUserName } = require('./Service/Validation/usernameValidation');
    try {
        //进行信息校验
        emailValidate(req.body.email);
        duplicateUserName(req.body.userName);
        const jwtToken = await createUser(req.body);
        res.json({
            status: 'success',
            message: 'create success',
            token: jwtToken,
            user: {
                userName: req.body.username,
                email: req.body.email,
            }
        });
        res.status(201);
        console.log('Create new User')
        res.end();
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: 'failed',
            token: null,
            message: error.message,
        })
    }
})

/**
 * @NenoSann
 * @description 处理登录函数，登陆成功返回jwtToken，登陆失败返回失败信息
 */
app.post('/login', async (req, res) => {
    const { userLogin } = require('./Service/userLogin');
    try {
        userLogin(req.body, res);
    } catch (e) {
        console.log('login error', e);
        res.status(500);
        res.end();
    }
})

/**
 * @NenoSann
 * @description 处理修改用户头像的功能
 */
app.post('/edit/avatar', upload.fields([{ name: 'json' }, { name: 'image' }]), async (req, res) => {
    console.log('set user avatar')
    const { changeUserAvatar } = require('./Service/Update/changeUserAvatar.js');
    const { userName, email, imgType } = JSON.parse(req.files.json[0].buffer.toString('utf-8'));
    await changeUserAvatar({ userName, email }, imgType,
        req.files.image[0].buffer,
        res);
});

/**
 * @NenoSann
 * @description 随机返回10个post
 */
app.post('/get/post', async (req, res) => {
    const { randomQuery } = require('./Service/Query/QueryPost');
    const { requestUserName } = req.body;
    randomQuery(10, requestUserName, res);
})

app.post('/get/post/user', async (req, res) => {
    const { UserPostQuery } = require('./Service/Query/QueryPost')
    const { type, userId } = req.body;
    UserPostQuery(type, userId, res)
})

/**
 * @NenoSann
 * @description 返回目标post的所有comments 
 */
app.post('/get/comment', async (req, res) => {
    try {
        console.log(req.body)
        const { QueryCommentsById } = require('./Service/Query/QueryComments');
        const postId = req.body.postId;
        QueryCommentsById(postId, res);
    } catch (error) {
        console.log('get coments error: ', error);
    }
})

/**
 * @NenoSann
 * @description 处理post的点赞和收藏功能
 */
app.post('/update/saveOrLikePost', async (req, res) => {
    const { saveOrLikePost } = require('./Service/Update/saveOrLikePost');
    console.log(req.body)
    const { target, userName, postId } = req.body;
    saveOrLikePost(target, userName, postId, res);
})

app.post('/update/changeUsername', async (req, res) => {
    const { changeUsername } = require('./Service/Update/changeUsername');
    const { userId, username } = req.body;
    try {
        const result = await changeUsername(userId, username);
        res.status(200).json(result);
    } catch (e) {
        res.status(400).json(e);
    }
})

app.get('/', async (req, res) => {
    res.status(200).send('You connect to the server');
})

app.put('/test/cos', async (req, res) => {
    const { storeImageBucket } = require('./Service/Create/createImage.js');
    const result = await storeImageBucket(SecretId, SecretKey);
    res.send(result);
})

//启动服务器
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
