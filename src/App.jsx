import React, { useState, useEffect, Suspense } from "react";
import "./App.css";
import { fetchData, addTask, deleteTask, updateTaskCompletion, isTaskDatePassed } from "./components/api";
import Login from "./components/login";
import Register from "./components/register";
import { BrowserRouter as Router } from "react-router-dom";

// 懒加载组件
const TaskInput = React.lazy(() => import("./components/TaskInput"));
const TaskList = React.lazy(() => import("./components/TaskList"));

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
        setCheckedTasks(fetchedTasks.map(task => task.completed)); // 初始化任务的选中状态
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
      setCheckedTasks([...checkedTasks, newTask.completed]); // 初始化新任务的选中状态
      setTaskName(""); // 清空任务名称输入框
      setSelectedDate(null); // 清空选中日期
      setKeyValue(new Date());
      setEmptyShow(true); // 设置显示任务列表状态
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleCheckboxChange = async (index) => {
    const newCheckedTasks = [...checkedTasks];
    const taskId = tasks[index].id;
    const newCompletedStatus = !newCheckedTasks[index];
    newCheckedTasks[index] = newCompletedStatus;

    // 先更新前端状态
    setCheckedTasks(newCheckedTasks);

    console.log('Updated checkedTasks:', newCheckedTasks); // 调试输出

    try {
        // 调用 API 更新数据库
        await updateTaskCompletion(taskId, newCompletedStatus);
    } catch (error) {
        console.error("Error updating task completion status:", error);
        // 如果 API 调用失败，可以考虑恢复状态或显示错误信息
    }
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
      <Login
        setIsAuthenticated={setIsAuthenticated}
        setShowLogin={setShowLogin}
        setTasks={setTasks}
        setEmptyShow={setEmptyShow}
      />
    ) : (
      <Register setIsAuthenticated={setIsAuthenticated} setShowLogin={setShowLogin} />
    );
  }

  // 如果用户已认证，则显示主页面
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="container">
          <div className="content">
            <h1 className="title">ToDoList</h1>
            <TaskInput
              taskName={taskName}
              selectedDate={selectedDate}
              showState={showState}
              handleTaskNameChange={handleTaskNameChange}
              handleDateChange={handleDateChange}
              handleAddButtonClick={handleAddButtonClick}
              keyValue={keyValue}
            />
            <TaskList
              tasks={tasks}
              checkedTasks={checkedTasks}
              isTaskDatePassed={isTaskDatePassed}
              handleCheckboxChange={handleCheckboxChange}
              handleDeleteTask={handleDeleteTask}
              emptyShow={emptyShow}
            />
          </div>
          <button className='logout-button' onClick={handleLogout}>退出登录</button>
        </div>
      </Suspense>
    </Router>
  );
};

export default App;
