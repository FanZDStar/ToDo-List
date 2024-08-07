// src/components/Login.js

import React, { useState } from "react";
import axios from "axios";
import { Form, Input, Button, Typography, Alert } from "antd";
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import "../style/login.css"; // 导入自定义样式

const { Title } = Typography;

const BASE_URL = "http://localhost:5000";

const Login = ({ setIsAuthenticated, setShowLogin }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    const { username, password } = values;
    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        username,
        password,
      });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setIsAuthenticated(true);
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
        <Button type="link" onClick={() => setShowLogin(false)}>
          Register
        </Button>
      </p>
    </div>
  );
};

export default Login;
