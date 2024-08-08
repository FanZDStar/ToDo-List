import React, { useState, useEffect, Suspense } from "react";
import "./App.css"; 
import { fetchData, addTask, deleteTask, isTaskDatePassed } from "./components/api"; 
import Login from "./components/login"; 
import Register from "./components/register"; 
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"; 

// 懒加载组件
const TaskInput = React.lazy(() => import("./components/TaskInput"));
// const TaskItem = React.lazy(() => import("./components/TaskItem"));
const TaskList = React.lazy(() => import("./components/TaskList"));
// const UsersList = React.lazy(() => import("./components/UserList"));

const App = () => {
  const [taskName, setTaskName] = useState(""); // 任务名称的状态
  const [selectedDate, setSelectedDate] = useState(null); // 选中日期的状态
  const [tasks, setTasks] = useState([]); // 任务列表的状态
  const [checkedTasks, setCheckedTasks] = useState([]); // 任务的选中状态
  const [showState, setShowState] = useState(true); // 显示状态，用于处理任务输入错误提示
  const [keyValue, setKeyValue] = useState(""); // 用于强制刷新子组件的键值状态
  const [emptyShow, setEmptyShow] = useState(false); // 控制是否显示“无任务”信息
  const [isAuthenticated, setIsAuthenticated] = useState(false); // 用户是否已认证的状态
  const [showLogin, setShowLogin] = useState(true); // 控制显示登录或注册页面

  // 组件加载时调用的效果钩子，检查用户是否已登录并获取任务列表
  useEffect(() => {
    const token = localStorage.getItem('token'); // 获取JWT令牌
    if (!token) { // 没有令牌，设置用户为未认证状态
      setIsAuthenticated(false);
      return;
    }

    // 使用立即执行的异步函数来获取任务数据
    (async () => {
      try {
        const fetchedTasks = await fetchData(); // 调用API获取任务数据
        setTasks(fetchedTasks); 
        setEmptyShow(!(fetchedTasks.length === 0)); // 根据任务列表是否为空来更新显示状态
        setIsAuthenticated(true); 
      } catch (error) {
        console.error("Error fetching tasks:", error); 
        setIsAuthenticated(false); 
      }
    })();
  }, []); // 只在组件挂载时执行

  // 处理任务名称输入变化的函数
  const handleTaskNameChange = (e) => {
    setTaskName(e.target.value); 
  };

  // 处理日期选择变化的函数
  const handleDateChange = (date, dateString) => {
    setSelectedDate(dateString);
  };

  // 处理添加任务按钮点击的函数
  const handleAddButtonClick = async () => {
    if (taskName.trim() === "" || selectedDate === null) {
      setShowState(false); 
      setTimeout(() => {
        setShowState(true); 
      }, 1000);
      return; 
    }

    try {
      const newTask = await addTask(taskName, selectedDate); // 调用API添加新任务
      const updatedTasks = [...tasks, newTask]; // 将新任务添加到任务列表中
      setTasks(updatedTasks); // 更新任务列表状态
      setCheckedTasks([...checkedTasks, false]); // 初始化新任务的选中状态
      setTaskName(""); // 清空任务名称输入框
      setSelectedDate(null); // 清空选中日期
      setKeyValue(new Date()); 
      setEmptyShow(true); // 设置显示任务列表状态
    } catch (error) {
      console.error("Error adding task:", error); 
    }
  };

  // 处理任务复选框状态变化的函数
  const handleCheckboxChange = (index) => {
    const newCheckedTasks = [...checkedTasks]; // 创建选中任务状态的副本
    newCheckedTasks[index] = !newCheckedTasks[index]; // 切换选中状态
    setCheckedTasks(newCheckedTasks); 
  };

  // 处理删除任务的函数
  const handleDeleteTask = async (index) => {
    const taskToDelete = tasks[index]; 

    try {
      await deleteTask(taskToDelete.id); // 调用API删除任务
      const updatedTasks = tasks.filter((_, i) => i !== index); // 从任务列表中过滤掉已删除的任务
      setTasks(updatedTasks); // 更新任务列表状态
      setCheckedTasks(checkedTasks.filter((_, i) => i !== index)); 
      setEmptyShow(!(updatedTasks.length === 0)); 
    } catch (error) {
      console.error("Error deleting task:", error); 
    }
  };

  // 处理用户退出登录的函数
  const handleLogout = () => {
    localStorage.removeItem('token'); // 移除JWT令牌
    setIsAuthenticated(false); // 设置用户为未认证状态
  };

  // 如果用户未认证，则显示登录或注册页面
  if (!isAuthenticated) {
    return showLogin ? (
      // 通过props传递函数
      <Login
        setIsAuthenticated={setIsAuthenticated} // 设置用户认证状态
        setShowLogin={setShowLogin} // 控制显示登录或注册页面
        setTasks={setTasks} // 设置任务列表状态
        setEmptyShow={setEmptyShow} // 设置显示状态
      />
    ) : (
      <Register setIsAuthenticated={setIsAuthenticated} setShowLogin={setShowLogin} /> 
    );
  }

  // 如果用户已认证，则显示主页面
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}> {/* 使用Suspense组件在懒加载组件加载时显示Loading */}
        <div className="container"> {/* 包含应用内容的容器 */}
          <div className="content"> {/* 主内容区域 */}
            <h1 className="title">ToDo List</h1> {/* 应用标题 */}
            <TaskInput
              taskName={taskName} // 任务名称状态
              selectedDate={selectedDate} // 选中日期状态
              showState={showState} // 显示状态
              handleTaskNameChange={handleTaskNameChange} // 处理任务名称输入变化
              handleDateChange={handleDateChange} // 处理日期选择变化
              handleAddButtonClick={handleAddButtonClick} // 处理添加任务按钮点击
              keyValue={keyValue} // keyValue状态
            />
            <TaskList
              tasks={tasks} // 任务列表状态
              checkedTasks={checkedTasks} // 选中任务状态
              isTaskDatePassed={isTaskDatePassed} // 检查任务日期是否已过
              handleCheckboxChange={handleCheckboxChange} // 处理复选框状态变化
              handleDeleteTask={handleDeleteTask} // 处理删除任务
              emptyShow={emptyShow} // 显示状态
            />
          </div>
          <button className='logout-button' onClick={handleLogout}>退出登录</button> {/* 退出登录按钮 */}
        </div>
      </Suspense>
    </Router>
  );
};

export default App; 
