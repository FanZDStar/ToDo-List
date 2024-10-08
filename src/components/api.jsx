
import axios from "axios";
import moment from "moment";

const BASE_URL = "http://localhost:5000";


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


// 更新任务完成状态
export const updateTaskCompletion = async (taskId, completed) => {
    try {
        await axios.patch(`${BASE_URL}/list/${taskId}`, { completed }, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
    } catch (error) {
        console.error("Error updating task completion:", error);
        throw error;
    }
};


// 检查任务日期是否已过（包括今天）
export const isTaskDatePassed = (dateString) => {
    const selectedDate = new Date(dateString);
    const currentDate = new Date();
    // 将日期设为 00:00:00 来仅比较日期部分
    selectedDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    return selectedDate < currentDate;
};
