- # ToDoList 项目
  
  ## 目录
  
  - [项目概述](#项目概述)
  - [技术栈](#技术栈)
  - [安装与运行](#安装与运行)
  - [功能介绍](#功能介绍)
  - [开发环境配置](#开发环境配置)
  - [打包与部署](#打包与部署)
  - [许可协议](#许可协议)
  
  ## 项目概述
  
  ToDoList 是一个基于 React 的待办事项管理应用，支持用户注册、登录及任务管理功能。项目采用前后端分离架构，前端使用 React 和 Ant Design，后端使用 Node.js 和 MySQL。
  
  ## 技术栈
  
  - **React**: 构建用户界面的 JavaScript 库
  - **Axios**: 发送 HTTP 请求的库
  - **React Router**: 实现前端路由的库
  - **Ant Design**: UI 组件库
  
  ## 安装与运行
  
  1. **克隆仓库**
  
  	```bash
  	git clone https://github.com/FanZDStar/ToDo-List.git
  	cd ToDo-List
  	```
  
  2. **安装依赖**
  
  	```bash
  	pnpm install # 或者 pnpm install
  	```
  
  3. **启动后端服务器**
  
  	```bash
  	pnpm run back-start
  	```
  
  4. **启动前端项目**
  
  	```bash
  	pnpm start
  	```
  
  	默认项目运行在 4000 端口。您可以通过修改 `package.json` 中的 `start` 脚本更改端口。
  
  ## 功能介绍
  
  - **用户认证**: 支持用户注册、登录。
  - **任务管理**: 包括查询、添加、更新、删除任务等功能。
  
  ## 开发环境配置
  
  1. **Node.js**: 请确保安装 Node.js 16.x 或更高版本。
  
  2. **数据库**: 项目使用 MySQL 数据库，请确保本地安装并配置了 MySQL。
  
  	在 `server/server.jsx` 文件中配置数据库连接：
  
  	```javascript
  	const pool = mysql.createPool({
  	    connectionLimit: 10,
  	    host: 'localhost',
  	    user: 'root',
  	    password: '你的密码',
  	    database: '你的数据库名'
  	});
  	```
  
  3. **前端依赖**: 通过 `pnpm install` 安装前端依赖。
  
  ## 打包与部署
  
  使用以下命令打包项目：
  
  ```bash
  pnpm run build
  ```
  
  打包完成后，静态文件将生成在 `build` 目录中。可以使用 `live-server` 或其他服务器部署这些文件。
  
  ## 许可协议
  
  本项目采用 MIT 许可协议。