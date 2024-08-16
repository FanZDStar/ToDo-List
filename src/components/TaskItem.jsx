import React from 'react';
import { Checkbox } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

const TaskItem = ({
    task,
    index,
    isTaskDatePassed,
    handleCheckboxChange,
    handleDeleteTask,
    checkedTasks
}) => {
    return (
        <p key={index} className={`task-info task-item ${isTaskDatePassed(task.date) ? 'red-text' : ''}`}>
            <span className={checkedTasks[index] ? 'strikethrough' : ''}>
                {task.name}
                <br />
                截止时间：{moment(task.date).format('YYYY-MM-DD')}
            </span>
            <span className="delete-checkbox">
                <Checkbox
                    checked={checkedTasks[index]} // 使用 checkedTasks 来设置 checkbox 状态
                    onChange={() => handleCheckboxChange(index)} 
                />
            </span>
            <span className="deleteOutlined" style={{ margin: '0 50px' }}>
                <DeleteOutlined onClick={() => handleDeleteTask(index)} />
            </span>
        </p>
    );
};


export default TaskItem;
