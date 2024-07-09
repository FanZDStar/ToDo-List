import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // 发送GET请求获取用户数据
        axios.get('http://localhost:5000/list')  // 确保URL正确
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('获取用户列表失败:', error);
            });
    }, []);

    return (
        <div>
            <h2>用户列表</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
