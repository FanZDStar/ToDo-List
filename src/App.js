import React, { useState, useEffect } from 'react';
import { Input, Space, DatePicker, Button, Checkbox, Empty, Alert } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import './App.css';

const App = () => {
  const [taskName, setTaskName] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [checkedTasks, setCheckedTasks] = useState([]);
  const [showState, setShowState] = useState(true);
  const [keyValue, setKeyValue] = useState('');
  const [emptyShow, setEmptyShow] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/list');
      setTasks(response.data);
      setEmptyShow(!(response.data.length === 0));
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const isTaskDatePassed = (dateString) => {
    const selectedDate = new Date(dateString);
    const currentDate = new Date();
    return selectedDate < currentDate;
  };

  const handleTaskNameChange = (e) => {
    setTaskName(e.target.value);
  };

  const handleDateChange = (date, dateString) => {
    setSelectedDate(dateString);
  };

  const handleAddButtonClick = async () => {
    if (taskName.trim() === '' || selectedDate === null) {
      setShowState(false);
      setTimeout(() => {
        setShowState(true);
      }, 1000);
      return;
    }

    try {
      const newTask = { name: taskName, date: selectedDate };
      const response = await axios.post('http://localhost:3000/list', newTask);
      const updatedTasks = [...tasks, response.data];
      setTasks(updatedTasks);
      setCheckedTasks([...checkedTasks, false]);
      setTaskName('');
      setSelectedDate(null);
      setKeyValue(new Date());
      setEmptyShow(true);
    } catch (error) {
      console.error('Error adding task:', error);
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
      await axios.delete(`http://localhost:3000/list/${taskToDelete.id}`);
      const updatedTasks = tasks.filter((_, i) => i !== index);
      setTasks(updatedTasks);
      setCheckedTasks(checkedTasks.filter((_, i) => i !== index));
      setEmptyShow(!(updatedTasks.length === 0));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const renderTaskItem = (task, index) => {
    return (
      <p key={index} className={`task-info task-item ${isTaskDatePassed(task.date) ? 'red-text' : ''}`}>
        <span className={checkedTasks[index] ? 'strikethrough' : ''}>
          {task.name}
          <br />
          截止时间：{task.date}
        </span>
        <span className="delete-checkbox">
          <Checkbox checked={checkedTasks[index]} onChange={() => handleCheckboxChange(index)}></Checkbox>
        </span>
        <span className="deleteOutlined" style={{ margin: '0 50px' }}>
          <DeleteOutlined onClick={() => handleDeleteTask(index)} />
        </span>
      </p>
    );
  };

  return (
    <div className="container">
      <div className="content">
        <h1 className="title">ToDo List</h1>
        {!showState && <Alert message="时间和任务不能为空" type="error" />}
        <Input className="task-input" placeholder="输入任务名称" value={taskName} onChange={handleTaskNameChange} />
        <Space direction="vertical">
          <DatePicker onChange={handleDateChange} placeholder="选择截止时间" key={keyValue} />
        </Space>
        <Button className="add-button" type="primary" onClick={handleAddButtonClick}>
          添加
        </Button>
        {!emptyShow && <Empty className="empty-message" />}
        {tasks.map((task, index) => renderTaskItem(task, index))}
      </div>
    </div>
  );
};

export default App;