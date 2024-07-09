const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();

// 允许跨域请求
app.use(cors());
app.use(express.json()); // 解析JSON请求体

// MySQL连接配置
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'itcast'
});

// 连接到MySQL
connection.connect(err => {
    if (err) {
        console.error('数据库连接失败:', err);
        return;
    }
    console.log('数据库连接成功');
});

// 处理GET请求获取任务列表
app.get('/list', (req, res) => {
    connection.query('SELECT * FROM tasks_test', (err, results) => {
        if (err) {
            console.error('获取任务列表失败:', err);
            res.status(500).json({ error: '获取任务列表失败' });
            return;
        }
        res.json(results);
    });
});

// 处理POST请求添加新任务
app.post('/list', (req, res) => {
    const { name, date } = req.body;
    const newTask = { name, date };

    connection.query('INSERT INTO tasks_test SET ?', newTask, (err, result) => {
        if (err) {
            console.error('添加任务失败:', err);
            res.status(500).json({ error: '添加任务失败' });
            return;
        }
        newTask.id = result.insertId;
        res.status(201).json(newTask);
    });
});

// 处理DELETE请求删除任务
app.delete('/list/:id', (req, res) => {
    const taskId = req.params.id;

    connection.query('DELETE FROM tasks_test WHERE id = ?', [taskId], (err, result) => {
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
