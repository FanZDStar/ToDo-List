import React, { useState, useEffect, Suspense } from "react";
import { useNavigate } from 'react-router-dom';
import "./App.css";
import { fetchData, addTask, deleteTask, updateTaskCompletion, isTaskDatePassed } from "../api";
import TaskInput from "./TaskInput";
import TaskList from "./TaskList";

const App = ({ tasks, setTasks, emptyShow, setEmptyShow, handleLogout }) => { 
  const [taskName, setTaskName] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [checkedTasks, setCheckedTasks] = useState([]);
  const [showState, setShowState] = useState(true);
  const [keyValue, setKeyValue] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const fetchedTasks = await fetchData();
        setTasks(fetchedTasks);
        setCheckedTasks(fetchedTasks.map(task => task.completed));
        setEmptyShow(fetchedTasks.length === 0);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    loadTasks();
  }, [setTasks, setEmptyShow]);

  const handleTaskNameChange = (e) => setTaskName(e.target.value);

  const handleDateChange = (date, dateString) => setSelectedDate(dateString);

  const handleAddButtonClick = async () => {
    if (taskName.trim() === "" || !selectedDate) {
      setShowState(false);
      setTimeout(() => setShowState(true), 1000);
      return;
    }

    try {
      const newTask = await addTask(taskName, selectedDate);
      setTasks(prevTasks => [...prevTasks, newTask]);
      setCheckedTasks(prevCheckedTasks => [...prevCheckedTasks, newTask.completed]);
      setTaskName("");
      setSelectedDate(null);
      setKeyValue(new Date());
      setEmptyShow(false);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleCheckboxChange = async (index) => {
    const newCheckedTasks = [...checkedTasks];
    const taskId = tasks[index].id;
    const newCompletedStatus = !newCheckedTasks[index];
    newCheckedTasks[index] = newCompletedStatus;

    setCheckedTasks(newCheckedTasks);

    try {
      await updateTaskCompletion(taskId, newCompletedStatus);
    } catch (error) {
      console.error("Error updating task completion status:", error);
    }
  };

  const handleDeleteTask = async (index) => {
    const taskToDelete = tasks[index];

    try {
      await deleteTask(taskToDelete.id);
      setTasks(prevTasks => prevTasks.filter((_, i) => i !== index));
      setCheckedTasks(prevCheckedTasks => prevCheckedTasks.filter((_, i) => i !== index));
      setEmptyShow(prevTasks.length === 0);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const logout = () => {
    handleLogout(); 
    navigate('/login');
  };

  return (
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
        <button className='logout-button' onClick={logout}>Logout</button>
      </div>
    </Suspense>
  );
};

export default App;
