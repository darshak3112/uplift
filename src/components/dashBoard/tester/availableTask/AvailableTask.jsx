import { useAppDispatch, useAppSelector } from "@/_lib/store/hooks";
import AvailableTasksCard from "./AvailableTasksCard";
import axios from "axios";
import { useEffect } from "react";
import { addAvailableTasks } from "@/_lib/store/features/tester/availableTask/availableTaskSlice";

export default function AvailableTask() {
  const dispatch = useAppDispatch();
  const testerId = useAppSelector((state) => state.userInfo.id);
  const availableTaskData = useAppSelector((state) => state.availableTask);

  const fetchAvailableTasks = async () => {
    try {
      if (!availableTaskData?.isTaskAvailable && testerId) {
        const response = await axios.post("/api/task/list", { testerId });
        if (response.status === 200) {
          const { surveys, youtube, app } = response.data;
          dispatch(addAvailableTasks({ surveys, youtube, app }));
        }
      }
      console.log(response);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "An error occurred.";
      console.error(errorMessage);
      // Handle the error, e.g., display a message to the user
    }
  };
  console.log(fetchAvailableTasks);
  useEffect(() => {
    if (testerId) {
      fetchAvailableTasks();
    }
  }, [testerId]);

  return (
    <div>
      <AvailableTasksCard tasksData={availableTaskData} />
    </div>
  );
}
