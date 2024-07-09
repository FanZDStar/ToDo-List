import React from 'react';
import { Empty } from 'antd';
import TaskItem from './TaskItem';

const TaskList = ({
    tasks,
    checkedTasks,
    isTaskDatePassed,
    handleCheckboxChange,
    handleDeleteTask,
    emptyShow
}) => {
    return (
        <div className="task-list">
            {!emptyShow && <Empty className="empty-message" />}
            {tasks.map((task, index) => (
                <TaskItem
                    key={index}
                    task={task}
                    index={index}
                    checked={checkedTasks[index]}
                    isTaskDatePassed={isTaskDatePassed}
                    handleCheckboxChange={handleCheckboxChange}
                    handleDeleteTask={handleDeleteTask}
                />
            ))}
        </div>
    );
};

export default TaskList;
