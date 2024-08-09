// 用于注册和登录验证的 Joi 验证规则

const Joi = require('joi');

// 用户名的验证规则
const username = Joi.string().alphanum().min(1).max(10).required();

// 密码的验证规则
const password = Joi.string().pattern(/^[\S]{6,12}$/).required();

// 注册和登录表单的验证规则对象
exports.reg_login_schema = {
  body: {
    username,
    password,
  },
};
