const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const expressJoi = require('@escook/express-joi');

const app = express();
const SECRET_KEY = 'your_secret_key';

const { reg_login_schema } = require('../server/schema/user.jsx'); // 导入验证规则

// 允许跨域请求
app.use(cors());
app.use(express.json()); // 解析JSON请求体数据

// MySQL连接池配置
const pool = mysql.createPool({
    connectionLimit: 10, // 连接池中最大连接数
    host: 'localhost',
    user: 'root',
    password: 'xxxxxx',
    database: 'xxxxxx'
});

// 注册用户
app.post('/register', expressJoi(reg_login_schema), async (req, res) => {
    const { username, password } = req.body;

    // 检查用户名是否已注册
    pool.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) {
            console.error('查询用户名失败:', err);
            res.status(500).json({ error: '查询用户名失败' });
            return;
        }

        if (results.length > 0) {
            res.status(409).json({ error: '用户名已存在' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
            if (err) {
                console.error('注册失败:', err);
                res.status(500).json({ error: '注册失败' });
                return;
            }

            // 注册成功后创建用户专属表格
            const tableName = `${username}_table`;
            const createTableQuery = `
                CREATE TABLE ?? (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255),
                    date DATE
                )
            `;
            pool.query(createTableQuery, [tableName], (err) => {
                if (err) {
                    console.error('创建用户专属表格失败:', err);
                    res.status(500).json({ error: '创建用户专属表格失败' });
                    return;
                }
                res.status(201).json({ message: '注册成功并创建用户专属表格' });
            });
        });
    });
});

// 用户登录
app.post('/login', expressJoi(reg_login_schema), (req, res) => {
    const { username, password } = req.body;

    pool.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) {
            console.error('登录失败:', err);
            res.status(500).json({ error: '登录失败' });
            return;
        }

        if (results.length === 0 || !(await bcrypt.compare(password, results[0].password))) {
            res.status(401).json({ error: '用户名或密码错误' });
            return;
        }

        const token = jwt.sign({ userId: results[0].id, username: results[0].username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    });
});

// 任务管理接口
app.use((req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: '未授权' });
    }
    try {
        const decoded = jwt.verify(token.split(' ')[1], SECRET_KEY); 
        req.userId = decoded.userId;
        req.username = decoded.username; // 存储用户名
        next();
    } catch (err) {
        return res.status(401).json({ error: '无效的令牌' });
    }
});

// 获取任务列表
app.get('/list', (req, res) => {
    const tableName = `${req.username}_table`;

    pool.query(`SELECT * FROM ??`, [tableName], (err, results) => {
        if (err) {
            console.error('获取任务列表失败:', err);
            res.status(500).json({ error: '获取任务列表失败' });
            return;
        }
        res.json(results);
    });
});

// 添加任务
app.post('/list', (req, res) => {
    const { name, date } = req.body;
    const newTask = { name, date };
    const tableName = `${req.username}_table`;

    pool.query('INSERT INTO ?? SET ?', [tableName, newTask], (err, result) => {
        if (err) {
            console.error('添加任务失败:', err);
            res.status(500).json({ error: '添加任务失败' });
            return;
        }
        newTask.id = result.insertId;
        res.status(201).json(newTask);
    });
});

// 删除任务
app.delete('/list/:id', (req, res) => {
    const taskId = req.params.id;
    const tableName = `${req.username}_table`;

    pool.query('DELETE FROM ?? WHERE id = ?', [tableName, taskId], (err, result) => {
        if (err) {
            console.error('删除任务失败:', err);
            res.status(500).json({ error: '删除任务失败' });
            return;
        }
        res.status(204).end();
    });
});

// 启动服务器
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`服务器正在运行在端口 ${PORT}`);
});
