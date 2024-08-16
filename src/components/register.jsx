import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import '../style/register.css';

const { Title } = Typography;
const BASE_URL = "http://localhost:5000";

const Register = ({ setIsAuthenticated, setShowLogin }) => {
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/register`, {
        username: values.username,
        password: values.password
      });

      if (response.status === 201) {
        const loginResponse = await axios.post(`${BASE_URL}/login`, {
          username: values.username,
          password: values.password
        });

        if (loginResponse.data.token) {
          localStorage.setItem('token', loginResponse.data.token);
          setIsAuthenticated(false);
          setShowLogin(true); // 返回登录页面
        }
      }
    } catch (error) {
      message.error('用户名重复了捏');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <Title level={2}>Register</Title>
      <Form
        name="register"
        onFinish={handleRegister}
        layout="vertical"
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your Username!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' },
            {
              pattern: /^[\S]{6,12}$/,
              message: 'Password must be 6 to 12 characters and cannot contain spaces!',
            },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          rules={[{ required: true, message: 'Please confirm your Password!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
