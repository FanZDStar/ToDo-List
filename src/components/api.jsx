// src/api.js

import axios from "axios";
import moment from "moment";

const BASE_URL = "http://localhost:5000";

// 从本地存储获取JWT令牌
const getToken = () => localStorage.getItem('token');

// 获取任务列表
export const fetchData = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/list`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
        const formattedTasks = response.data.map((task) => ({
            ...task,
            date: moment(task.date).format("YYYY-MM-DD"),
        }));
        return formattedTasks;
    } catch (error) {
        console.error("Error fetching tasks:", error);
        throw error;
    }
};

// 添加任务
export const addTask = async (taskName, selectedDate) => {
    try {
        const newTask = { name: taskName, date: selectedDate };
        const response = await axios.post(`${BASE_URL}/list`, newTask, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error adding task:", error);
        throw error;
    }
};

// 删除任务
export const deleteTask = async (taskId) => {
    try {
        await axios.delete(`${BASE_URL}/list/${taskId}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
    } catch (error) {
        console.error("Error deleting task:", error);
        throw error;
    }
};

// 检查任务日期是否已过
export const isTaskDatePassed = (dateString) => {
    const selectedDate = new Date(dateString);
    const currentDate = new Date();
    return selectedDate < currentDate;
};
