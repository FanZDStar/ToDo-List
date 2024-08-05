// src/components/Login.js

import React, { useState } from "react";
import axios from "axios";
import { Form, Input, Button, Typography, Alert } from "antd";
import "../style/login.css";

const { Title } = Typography;

const BASE_URL = "http://localhost:5000";

const Login = ({ setIsAuthenticated, setShowLogin }) => {
  const [error, setError] = useState(null);

  const handleLogin = async (values) => {
    const { username, password } = values;
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
    }
  };

  return (
    <div className="login-container">
      <Title level={2}>登录</Title>
      {error && <Alert message={error} type="error" showIcon />}
      <Form
        name="login"
        onFinish={handleLogin}
        layout="vertical"
        className="login-form"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
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
