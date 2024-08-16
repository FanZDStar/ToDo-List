
import React, { useState } from "react";
import axios from "axios";
import { Form, Input, Button, Typography, Alert } from "antd";
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; // 使用 useNavigate
import "./login.css";
import { fetchData } from "../api";

const { Title } = Typography;
const BASE_URL = "http://localhost:5000";

const Login = ({ setIsAuthenticated, setTasks, setEmptyShow }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // 使用 useNavigate

  const handleLogin = async (values) => {
    const { username, password } = values;
    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/login`, { username, password });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setIsAuthenticated(true);

        // 登录成功后立即获取任务数据
        const fetchedTasks = await fetchData();
        setTasks(fetchedTasks);
        setEmptyShow(fetchedTasks.length === 0);
        
        // 登录成功后跳转到主页面
        navigate('/'); 
      }
    } catch (error) {
      setError("Login failed");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Title level={2}>Login</Title>
      {error && <Alert message={error} type="error" showIcon />}
      <Form
        name="login"
        onFinish={handleLogin}
        layout="vertical"
        className="login-form"
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Login
          </Button>
        </Form.Item>
      </Form>
      <p>
        Don't have an account?{" "}
        <Button type="link" onClick={() => navigate('/register')}> {/* 使用 navigate */}
          Register
        </Button>
      </p>
    </div>
  );
};

export default Login;



