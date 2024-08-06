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
  const [taskName, setTaskName] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [checkedTasks, setCheckedTasks] = useState([]);
  const [showState, setShowState] = useState(true);
  const [keyValue, setKeyValue] = useState("");
  const [emptyShow, setEmptyShow] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true); // 控制显示登录或注册

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    (async () => {
      try {
        const fetchedTasks = await fetchData();
        setTasks(fetchedTasks);
        setEmptyShow(!(fetchedTasks.length === 0));
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setIsAuthenticated(false);
      }
    })();
  }, []);

  const handleTaskNameChange = (e) => {
    setTaskName(e.target.value);
  };

  const handleDateChange = (date, dateString) => {
    setSelectedDate(dateString);
  };

  const handleAddButtonClick = async () => {
    if (taskName.trim() === "" || selectedDate === null) {
      setShowState(false);
      setTimeout(() => {
        setShowState(true);
      }, 1000);
      return;
    }

    try {
      const newTask = await addTask(taskName, selectedDate);
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      setCheckedTasks([...checkedTasks, false]);
      setTaskName("");
      setSelectedDate(null);
      setKeyValue(new Date());
      setEmptyShow(true);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleCheckboxChange = (index) => {
    const newCheckedTasks = [...checkedTasks];
    newCheckedTasks[index] = !newCheckedTasks[index];
    setCheckedTasks(newCheckedTasks);
  };

  const handleDeleteTask = async (index) => {
    const taskToDelete = tasks[index];

    try {
      await deleteTask(taskToDelete.id);
      const updatedTasks = tasks.filter((_, i) => i !== index);
      setTasks(updatedTasks);
      setCheckedTasks(checkedTasks.filter((_, i) => i !== index));
      setEmptyShow(!(updatedTasks.length === 0));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // 退出登录按钮
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return showLogin ? (
      <Login setIsAuthenticated={setIsAuthenticated} setShowLogin={setShowLogin} />
    ) : (
      <Register setIsAuthenticated={setIsAuthenticated} setShowLogin={setShowLogin} />
    );
  }

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="container">
          <div className="content">
            <h1 className="title">ToDo List</h1>
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
