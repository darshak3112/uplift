import { useAppDispatch, useAppSelector } from "@/_lib/store/hooks";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HistoryCard } from "./HistoryCard";
import { addHistoryUser } from "@/_lib/store/features/shared/history/historyTesterSlice";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { AiOutlineLoading } from "react-icons/ai"; // Import spinner icon

export default function HistoryUser() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("activeTab");
  const dispatch = useAppDispatch();
  const testerId = useAppSelector((state) => state.userInfo.id);
  const role = useAppSelector((state) => state.userInfo.role);
  const historyData = useAppSelector((state) => state.historyUser);
  
  // State for search and filter
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false); // State to handle spinner during filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [taskTypeFilter, setTaskTypeFilter] = useState("all");

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
      setTimeout(() => {
        fetchHistoryTasks();
      }, 1500);
    }
  }, [testerId]);

  // Handle Search and Filter
  const filteredTasks = historyData.history
    .filter((task) => {
      // Filter by task type
      if (taskTypeFilter !== "all") {
        return task.type === taskTypeFilter;
      }
      return true;
    })
    .filter((task) => {
      // Search by task title or instruction
      return (
        task.heading.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.instruction.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

  // Handle loading state during filtering/search
  useEffect(() => {
    if (isFiltering) {
      setTimeout(() => {
        setIsFiltering(false);
      }, 500); // Simulate a delay for the spinner
    }
  }, [isFiltering]);

  // Always display skeleton loader if loading is true
  if (isLoading) {
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

      {/* Search and Filter Controls */}
      <div className="flex items-center justify-between mb-6">
        <input
          type="text"
          placeholder="Search tasks..."
          className="p-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsFiltering(true); // Trigger filtering spinner
          }}
        />
        <select
          className="p-2 border border-gray-300 rounded-md"
          value={taskTypeFilter}
          onChange={(e) => {
            setTaskTypeFilter(e.target.value);
            setIsFiltering(true); // Trigger filtering spinner
          }}
        >
          <option value="all">All Types</option>
          <option value="survey">Survey</option>
          <option value="youtube">YouTube</option>
          <option value="app">App</option>
        </select>
      </div>

      {/* Show spinner if filtering */}
      {isFiltering ? (
        <div className="flex items-center justify-center py-10">
          <AiOutlineLoading className="text-4xl text-blue-600 animate-spin" />
        </div>
      ) : filteredTasks.length === 0 ? (
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
          {filteredTasks.map((task, index) => (
            <HistoryCard key={index} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
