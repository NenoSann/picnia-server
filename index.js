const express = require('express')
const mongoose = require('mongoose')
const usersTable = require('./MongoDB/usersTable');
const userRegiste = require('./Service/userRegiste');
const cors = require('cors');
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
//启动服务器
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})