## README

### ToDoList一些必要的说明

#### 1.安装axios

可以选择全局安装

```bash
pnpm install axios -g
```

也可以选择在项目的根目录下安装

此React项目中使用到了axios请求

#### 2.安装json-server

全局安装json-server

```
pnpm install -g json-server
```

在此项目的react目录下已经建好了list.json      `./public/list/json`      这是本项目保存用户操作后留下的数据的json文件，目前如下：

```json
{
  "list": [
    {
      "id": "a615",
      "name": "打余姝玥",
      "date": "2024-06-01"
    },
    {
      "id": "e2cf",
      "name": "和余鸿恺贴贴",
      "date": "2024-06-01"
    },
    {
      "id": "5644",
      "name": "生日",
      "date": "2024-06-01"
    }
  ]
}
```

在启动ToDoList之前，请您首先使用如下代码来启动json-server

```bash
json-server --watch list.json
```

list.json默认启动于localhost:3000,您无需担心会与REACT项目冲突，因为react已经修改为在4000端口中启动，详见./package.json中的第17行 `"start": "set PORT=4000 && react-scripts start",` 你也可以修改为其他端口，只需修改数字即可

#### 3.项目成功运行后的描述

`pnpm start`

 由于使用了json-server模拟后端，所以应该会出现有三条数据的渲染，用户再使用删除或者添加后数据会同步保存到list.json里，刷新list.json即可看到。我使用了这种方式来部分完成了选做的第一个。必做部分和作业要求中实现的一样。