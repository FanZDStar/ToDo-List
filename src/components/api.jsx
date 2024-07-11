// src/api.js

import axios from "axios";
import moment from "moment";

const BASE_URL = "http://localhost:5000";

export const fetchData = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/list`);
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

export const addTask = async (taskName, selectedDate) => {
    try {
        const newTask = { name: taskName, date: selectedDate };
        const response = await axios.post(`${BASE_URL}/list`, newTask);
        return response.data;
    } catch (error) {
        console.error("Error adding task:", error);
        throw error;
    }
};

export const deleteTask = async (taskId) => {
    try {
        await axios.delete(`${BASE_URL}/list/${taskId}`);
    } catch (error) {
        console.error("Error deleting task:", error);
        throw error;
    }
};

export const isTaskDatePassed = (dateString) => {
    const selectedDate = new Date(dateString);
    const currentDate = new Date();
    return selectedDate < currentDate;
};
