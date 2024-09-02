import { useAppDispatch, useAppSelector } from "@/_lib/store/hooks";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HistoryCard } from "./HistoryCard";

import { addHistoryUser } from "@/_lib/store/features/shared/history/historyTesterSlice";
import Skeleton from "@/components/shared/skeleton/Skeleton";

export default function HistoryUser() {
  const dispatch = useAppDispatch();
  const testerId = useAppSelector((state) => state.userInfo.id);
  const role = useAppSelector((state) => state.userInfo.role);
  const historyData = useAppSelector((state) => state.historyUser);
  const [isLoading, setIsLoading] = useState(true);

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
    } finally {
      setIsLoading(false); // Set loading to false after the fetch is complete
    }
  };

  useEffect(() => {
    if (testerId) {
      fetchHistoryTasks();
    }
  }, [testerId]);

  if (isLoading) {
    // Render skeletons while data is loading
    return (
      <div className="grid grid-cols-1 gap-4 p-5 rounded-lg shadow-md sm:grid-cols-2 lg:grid-cols-3 bg-gray-50">
        <Skeleton width="100%" height="8rem" count={6} shape="rect" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 p-5 rounded-lg shadow-md sm:grid-cols-2 lg:grid-cols-3 bg-gray-50">
      {historyData.history.map((task, index) => (
        <HistoryCard key={index} task={task} />
      ))}
    </div>
  );
}
