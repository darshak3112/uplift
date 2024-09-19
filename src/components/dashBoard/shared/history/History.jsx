import { useAppDispatch, useAppSelector } from "@/_lib/store/hooks";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HistoryCard } from "./HistoryCard";
import { addHistoryUser } from "@/_lib/store/features/shared/history/historyTesterSlice";
import { Spinner } from "flowbite-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function HistoryUser() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("activeTab");
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
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (testerId) {
      fetchHistoryTasks();
    }
  }, [testerId]);

  if (isLoading) {
    // Skeleton loader
    return (
      <div className="grid grid-cols-1 gap-6 p-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array(6)
          .fill("")
          .map((_, index) => (
            <div
              key={index}
              className="h-64 bg-gray-200 animate-pulse rounded-xl"
            ></div>
          ))}
      </div>
    );
  }

  return (
    <div className="p-8 shadow-2xl bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
      <h2 className="mb-8 text-3xl font-extrabold text-center text-gray-800">
        {activeTab === "analytics" ? "Analytics" : "Task History"}
      </h2>
      {historyData.history.length === 0 ? (
        <div className="flex flex-col items-center">
          <Image
            src="/images/NoData.png"
            alt="No Data Available"
            width={400}
            height={300}
            className="mb-4"
          />
          <p className="text-lg text-gray-600">No history available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {historyData.history.map((task, index) => (
            <HistoryCard key={index} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
