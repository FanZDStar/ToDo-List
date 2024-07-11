// src/App.js

import React, { useState, useEffect } from "react";
import "./App.css";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import { fetchData, addTask, deleteTask, isTaskDatePassed } from "./components/api";

const App = () => {
  const [taskName, setTaskName] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [checkedTasks, setCheckedTasks] = useState([]);
  const [showState, setShowState] = useState(true);
  const [keyValue, setKeyValue] = useState("");
  const [emptyShow, setEmptyShow] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const fetchedTasks = await fetchData();
        setTasks(fetchedTasks);
        setEmptyShow(!(fetchedTasks.length === 0));
      } catch (error) {
        console.error("Error fetching tasks:", error);
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

  return (
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
    </div>
  );
};

export default App;
