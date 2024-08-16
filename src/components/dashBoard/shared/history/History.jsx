import { useAppDispatch, useAppSelector } from "@/_lib/store/hooks";
import axios from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { HistoryCard } from "./HistoryCard";
import { addHistoryUser } from "@/_lib/store/features/tester/history/historyTesterSlice";

export default function HistoryUser() {
  const dispatch = useAppDispatch();
  const testerId = useAppSelector((state) => state.userInfo.id);
  const role = useAppSelector((state) => state.userInfo.role);
  const historyData = useAppSelector((state) => state.historyUser);
  

  const fetchHistoryTasks = async () => {
    try {
      if (!historyData.isHistoryAvailable && testerId) {
        const response = await axios.post("/api/task/history", {
          id: testerId,
          role,
        });

        if (response.status === 200) {
          const { history } = response.data;
          dispatch(addHistoryUser(history));
        }
      }
    } catch (error) {
      console.error(
        "Error fetching history tasks:",
        error.response ? error.response.data : error.message
      );
      toast.error("Failed to fetch history");
    }
  };

  useEffect(() => {
    if (testerId) {
      setTimeout(() => {
        fetchHistoryTasks();
      }, 1000);
    }
  }, [testerId]);

  return (
    <div className="grid grid-cols-1 gap-4 p-5 rounded-lg shadow-md sm:grid-cols-2 lg:grid-cols-3 bg-gray-50">
      {historyData.history.map((task, index) => (
        <HistoryCard key={index} task={task} />
      ))}
    </div>
  );
}
