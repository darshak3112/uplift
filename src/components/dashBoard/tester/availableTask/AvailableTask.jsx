import { useAppDispatch, useAppSelector } from "@/_lib/store/hooks";
import AvailableTasksCard from "./AvailableTasksCard";
import axios from "axios";
import { useEffect } from "react";
import { addAvailableTasks } from "@/_lib/store/features/tester/availableTask/availableTaskSlice";

export default function AvailableTask() {
  const dispatch = useAppDispatch();
  const testerId = useAppSelector((state) => state.userInfo.id);
  let availableTaskData = useAppSelector((state) => state.availableTask);

  const fetchAvaialbletasks = async () => {
    try {
      if (!availableTaskData?.isTaskAvailable && testerId) {
        const response = await axios.post("/api/task/list", {
          testerId,
        });
        if (response.status === 200) {
          const { surveys, youtube, app } = response.data;
          dispatch(addAvailableTasks({ surveys, youtube, app }));
        }
      }
    } catch (error) {
      const {
        response: {
          data: { message },
        },
      } = error;
      console.log(message);
      // Handle the error, e.g., display a message to the user
    }
  };

  useEffect(() => {
    if (testerId) {
      setTimeout(() => {
        fetchAvaialbletasks();
      }, 1000);
    }
  }, [testerId]);

  return (
    <div>
      <AvailableTasksCard tasksData={availableTaskData} />
    </div>
  );
}
