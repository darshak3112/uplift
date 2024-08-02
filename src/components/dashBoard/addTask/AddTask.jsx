"use client";

import { Dropdown } from "flowbite-react";
import { useState } from "react";
import PriductReview from "../creatorTask/productReview/ProductReview";
import YouTube from "../creatorTask/youtube/YouTube";
import AppTesting from "../creatorTask/appTesting/AppTesting";
import Survey from "../creatorTask/survey/Survey";
import DefaultComponent from "../default/Default";

export default function AddTask() {
  const TaskList = [
    "Product Review",
    "YouTube thumbnail",
    "App Testing",
    "Survey",
  ];

  const TaskListMap = {
    "Product Review": PriductReview,
    "YouTube thumbnail": YouTube,
    "App Testing": AppTesting,
    Survey: Survey,
  };

  const [task, setTask] = useState(null);

  const handleTaskSelect = (selectedTask) => {
    setTask(selectedTask);
  };

  const TaskComponent = TaskListMap[task] || DefaultComponent;

  return (
    <div className="mx-auto">
      {task === null ? (
        <Dropdown
          label="Select Task"
          className="ml-6"
          color={"blue"}
          placement="bottom"
        >
          {TaskList.map((task, index) => (
            <Dropdown.Item onClick={() => handleTaskSelect(task)} key={index}>
              {task}
            </Dropdown.Item>
          ))}
        </Dropdown>
      ) : (
        <TaskComponent />
      )}
    </div>
  );
}
