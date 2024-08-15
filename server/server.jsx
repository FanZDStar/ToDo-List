const express = require('express'); 
const mysql = require('mysql'); // 连接 MySQL 数据库
const cors = require('cors'); // 允许跨域请求
const bcrypt = require('bcryptjs'); // 加密密码
const jwt = require('jsonwebtoken'); // 生成和验证 JWT（
const expressJoi = require('@escook/express-joi'); // 验证请求数据

const app = express(); 
const SECRET_KEY = 'your_secret_key'; // 密钥

const { reg_login_schema } = require('../server/schema/user.jsx'); // 导入用于注册和登录验证的 Joi 验证规则

app.use(cors()); 
app.use(express.json()); 

// 创建 MySQL 连接池配置，设置最大连接数等参数
const pool = mysql.createPool({
    connectionLimit: 10, // 连接池中最大连接数
    host: 'localhost', 
    user: 'root', 
    password: 'xxxxxx', 
    database: 'xxxxxx' 
});

// 注册用户接口
app.post('/register', expressJoi(reg_login_schema), async (req, res) => {
    const { username, password } = req.body; 

    // 检查用户名是否已被注册过
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

        const hashedPassword = await bcrypt.hash(password, 10); // 哈希加密

        // 插入新用户数据到数据库
        pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
            if (err) {
                console.error('注册失败:', err); 
                res.status(500).json({ error: '注册失败' }); 
                return;
            }

            // 注册成功后为新用户创建一个专属表格，使用${}
            const tableName = `${username}_table`; 
            const createTableQuery = `
                CREATE TABLE ?? (
                    id INT AUTO_INCREMENT PRIMARY KEY, 
                    name VARCHAR(255), // 任务名称
                    date DATE // 任务日期
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

// 用户登录接口
app.post('/login', expressJoi(reg_login_schema), (req, res) => {
    const { username, password } = req.body; // 从请求体中获取用户名和密码

    // 查询数据库，检查用户名是否存在
    pool.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) {
            console.error('登录失败:', err); 
            res.status(500).json({ error: '登录失败' }); 
            return;
        }

        // 用户名不存在或密码不正确
        if (results.length === 0 || !(await bcrypt.compare(password, results[0].password))) {
            res.status(401).json({ error: '用户名或密码错误' });
            return;
        }

        // JWT，用户ID和用户名，有效期为1小时
        const token = jwt.sign({ userId: results[0].id, username: results[0].username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token }); 
    });
});

// 任务管理接口
app.use((req, res, next) => {
    const token = req.headers['authorization']; 
    if (!token) {
        return res.status(401).json({ error: '未授权' }); // 如果没有 token，返回401状态码
    }
    try {
        const decoded = jwt.verify(token.split(' ')[1], SECRET_KEY); // 解码
        req.userId = decoded.userId; 
        req.username = decoded.username; 
        next(); // 继续处理请求
    } catch (err) {
        return res.status(401).json({ error: '无效的令牌' }); 
    }
});

// 获取任务列表接口
app.get('/list', (req, res) => {
    const tableName = `${req.username}_table`; // 获取当前用户的专属表格名称

    // 查询该表格中的所有任务
    pool.query(`SELECT * FROM ??`, [tableName], (err, results) => {
        if (err) {
            console.error('获取任务列表失败:', err); 
            res.status(500).json({ error: '获取任务列表失败' }); 
            return;
        }
        res.json(results); 
    });
});

// 添加任务接口
app.post('/list', (req, res) => {
    const { name, date } = req.body; 
    const newTask = { name, date }; 
    const tableName = `${req.username}_table`; 

    // 插入新任务到用户的专属表格中
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

// 删除任务接口
app.delete('/list/:id', (req, res) => {
    const taskId = req.params.id; // 从请求参数中获取任务ID
    const tableName = `${req.username}_table`; // 获取当前用户的专属表格名称

    // 从表格中删除指定ID的任务
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
const PORT = process.env.PORT || 5000; // 服务器端口默认为5000
app.listen(PORT, () => {
    console.log(`服务器正在运行在端口 ${PORT}`); // 启动服务器
});
