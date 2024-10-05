import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from "@/_lib/store/hooks";
import axios from "axios";
import { addAvailableTasks } from "@/_lib/store/features/tester/availableTask/availableTaskSlice";
import AvailableTasksCard from "./AvailableTasksCard";

export default function AvailableTask() {
  const dispatch = useAppDispatch();
  const testerId = useAppSelector((state) => state.userInfo.id);
  const availableTaskData = useAppSelector((state) => state.availableTask);

  const fetchAvailableTasks = async () => {
    try {
      if (!availableTaskData?.isTaskAvailable && testerId) {
        const response = await axios.post("/api/task/list", { testerId });
        if (response.status === 200) {
          const { tasks } = response.data;
          const surveys = tasks.filter(task => task.type === "SurveyTask");
          const youtube = tasks.filter(task => task.type === "YoutubeTask");
          const app = tasks.filter(task => task.type === "AppTask");
          dispatch(addAvailableTasks({ surveys, youtube, app }));
        }
      }
    } catch (error) {
      console.error("Error fetching available tasks:", error);
    }
  };

  useEffect(() => {
    if (testerId) {
      fetchAvailableTasks();
    }
  }, [testerId]);

  return (
    <div>
      <AvailableTasksCard />
    </div>
  );
}