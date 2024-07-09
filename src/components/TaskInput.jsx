import React from 'react';
import { Input, Space, DatePicker, Button, Alert } from 'antd';
import moment from 'moment';

const TaskInput = ({
    taskName,
    selectedDate,
    showState,
    handleTaskNameChange,
    handleDateChange,
    handleAddButtonClick,
    keyValue
}) => {
    return (
        <div className="task-input-container">
            {!showState && <Alert message="时间和任务不能为空" type="error" />}
            <Input
                className="task-input"
                placeholder="输入任务名称"
                value={taskName}
                onChange={handleTaskNameChange}
            />
            <Space direction="vertical">
                <DatePicker 
                    onChange={handleDateChange} 
                    placeholder="选择截止时间" 
                    key={keyValue} 
                />
            </Space>
            <Button className="add-button" type="primary" onClick={handleAddButtonClick}>
                添加
            </Button>
        </div>
    );
};

export default TaskInput;
