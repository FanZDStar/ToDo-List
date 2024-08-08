## README

### ToDoList一些必要的说明

#### 1.项目结构介绍

[项目结构(按住Ctrl访问)](./imgs/截图02.jpg)

./dist：打包后的文件，后面再介绍

./server：后端代码(node.js+Express框架)

./src：前端代码，./components是组件文件夹，./style是样式文件夹

./node_modules：必要的模块

#### 2.配置相应的包(node_modules)

下载完成后，打开package.json查看配置。

```json
// package.json
{
  "name": "my-app",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@ant-design/icons": "^5.4.0",
    "@escook/express-joi": "^1.1.1",
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "antd": "^5.20.0",
    "axios": "^1.7.3",
    "bcryptjs": "2.4.3",
    "cors": "^2.8.5",
    "express": "^4.19.2",
    "joi": "^17.13.3",
    "jsonwebtoken": "8.5.1",
    "moment": "^2.30.1",
    "mysql": "^2.18.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "set PORT=4000 && react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "fro-build": "webpack",
    "back-start": "nodemon server/server.jsx",
    "start:prod": "pnpm run build:frontend && pnpm run start:backend"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "clean-webpack-plugin": "^4.0.0",
    "css-loader": "^7.1.2",
    "css-minimizer-webpack-plugin": "^7.0.0",
    "esbuild": "^0.23.0",
    "esbuild-loader": "^4.2.2",
    "html-webpack-plugin": "^5.6.0",
    "image-minimizer-webpack-plugin": "^4.1.0",
    "less": "^4.2.0",
    "less-loader": "^12.2.0",
    "style-loader": "^4.0.0",
    "webpack": "^5.93.0",
    "webpack-bundle-analyzer": "^4.10.2",
    "webpack-cli": "^5.1.4",
    "webpack-dev-server": "^5.0.4"
  }
}

```

进入项目根目录，打开终端，输入`npm install` 或者`pnpm install `，会按照packjson安装你的dependencies，如下图

![截图01](imgs/截图01.jpg)

然后直接启动`npm start` 或者`pnpm start`，这个项目会启动于4000端口，您也可以修改至其他端口，修改packjson中第27行即可`start": "set PORT=4000 && react-scripts start`,修改数字为你想要的端口数即可，例如4001或者4002(但是不要是5000)。

Ctrl+C键先关闭react项目的运行（没错你没看错，就是粘贴的那个）

#### 3.启动项目

1.先启动后端服务器`pnpm run back-start ` ，终止是键盘ctrl+c

![截图03](imgs/截图03.jpg)

证明你已经成功启动，这就是为什么我建议你不要在5000中启动前端react代码，会造成端口冲突。

2.启动前端代码`pnpm start `，终止是键盘ctrl+c

[^启动前端代码`pnpm start `，终止是键盘ctrl+c]:注意：先新建一个终端，也是进入根目录，再输入命令



![截图04](imgs/截图04.jpg)

证明你已经成功启动前端代码，你应该能看到如下登录界面：

![截图05](imgs/截图05.jpg)

#### 4.建立你的对应数据库

在文件

`./server/server.jsx` 中如下代码：

```jsx
const pool = mysql.createPool({
    connectionLimit: 10, // 连接池中最大连接数
    host: 'localhost',
    user: 'root',
    password: 'xxxxxx',
    database: 'xxxxxx'
});
```

修改成您自己的数据库，数据库下新建users的表，sql语句如下:

`create table users
(
    id       int auto_increment
        primary key,
    username varchar(255) not null,
    password varchar(255) not null
);`

新建好了，就可以启动前端和后端服务器，然后就可以开始你的操作啦！

#### 5.webpack打包

根目录下终端输入命令`pnpm run fro-build`即可，打包完成后出现一个dist文件夹，打开index.html即可。