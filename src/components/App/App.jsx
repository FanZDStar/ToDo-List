import React, { useState, useEffect, Suspense } from "react";
import { useNavigate } from 'react-router-dom';
import "./App.css";
import { fetchData, addTask, deleteTask, updateTaskCompletion, isTaskDatePassed } from "../api";

const TaskInput = React.lazy(() => import("./TaskInput"));
const TaskList = React.lazy(() => import("./TaskList"));

const App = ({ tasks, setTasks, emptyShow, setEmptyShow, handleLogout }) => {
  const [taskName, setTaskName] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [checkedTasks, setCheckedTasks] = useState([]);
  const [showState, setShowState] = useState(true);
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
      setTasks(prevTasks => {
        const updatedTasks = [...prevTasks, newTask];
        setEmptyShow(updatedTasks.length === 0);
        return updatedTasks;
      });
      setCheckedTasks(prevCheckedTasks => [...prevCheckedTasks, newTask.completed]);
      setTaskName("");
      setSelectedDate(null);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleCheckboxChange = async (index) => {
    const newCompletedStatus = !checkedTasks[index];
    try {
      await updateTaskCompletion(tasks[index].id, newCompletedStatus);
      setCheckedTasks(prevCheckedTasks => {
        const updatedCheckedTasks = [...prevCheckedTasks];
        updatedCheckedTasks[index] = newCompletedStatus;
        return updatedCheckedTasks;
      });
    } catch (error) {
      console.error("Error updating task completion status:", error);
    }
  };

  const handleDeleteTask = async (index) => {
    try {
      await deleteTask(tasks[index].id);
      setTasks(prevTasks => {
        const updatedTasks = prevTasks.filter((_, i) => i !== index);
        setEmptyShow(updatedTasks.length === 0);
        return updatedTasks;
      });
      setCheckedTasks(prevCheckedTasks => prevCheckedTasks.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const logout = () => {
    handleLogout(); 
    navigate('/login');
  };

  return (
    <Suspense fallback={<div className="loading">Loading...</div>}>
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
