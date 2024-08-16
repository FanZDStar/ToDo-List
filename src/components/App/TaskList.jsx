import React from 'react';
import { Empty } from 'antd';
import TaskItem from './TaskItem';

const TaskList = ({
    tasks,
    isTaskDatePassed,
    handleCheckboxChange,
    handleDeleteTask,
    emptyShow,
    checkedTasks
}) => {
    return (
        <div className="task-list">
            {emptyShow && <Empty className="empty-message" />}
            {tasks.map((task, index) => (
                <TaskItem
                    key={index}
                    task={task}
                    index={index}
                    isTaskDatePassed={isTaskDatePassed}
                    handleCheckboxChange={handleCheckboxChange}
                    handleDeleteTask={handleDeleteTask}
                    checkedTasks={checkedTasks} 
                />
            ))}
        </div>
    );
};


export default TaskList;
