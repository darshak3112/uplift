import React, { useState, useEffect } from "react";
import axios from "axios";
import { OnGoingTaskCard } from "./OnGoingTaskCard";
import { useAppSelector } from "@/_lib/store/hooks";
import Image from "next/image";

export default function OnGoingTask() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [taskTypeFilter, setTaskTypeFilter] = useState("all");
  const [sortOption, setSortOption] = useState("date");
  const [isFiltering, setIsFiltering] = useState(false);

  const { id, role } = useAppSelector((state) => state.userInfo);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await axios.post("/api/task/ongoing", {
          id,
          role,
        });
        setTasks(response.data.tasks);
      } catch (err) {
        setError("Failed to fetch ongoing tasks");
        console.error("Error fetching ongoing tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id && role) {
      fetchTasks();
    }
  }, [id, role]);

  useEffect(() => {
    if (isFiltering) {
      const timer = setTimeout(() => {
        setIsFiltering(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isFiltering]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setIsFiltering(true);
  };

  const handleTaskTypeFilter = (e) => {
    setTaskTypeFilter(e.target.value);
    setIsFiltering(true);
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (taskTypeFilter !== "all") {
        // Normalize task type to lowercase to handle different task type names
        const normalizedTaskType = task.type?.toLowerCase();
        const normalizedFilter = taskTypeFilter.toLowerCase();

        // Filter based on the task type filter value
        return (
          (normalizedTaskType.includes("app") && normalizedFilter === "app") ||
          (normalizedTaskType.includes("youtube") &&
            normalizedFilter === "youtube") ||
          (normalizedTaskType.includes("survey") &&
            normalizedFilter === "survey") ||
          (normalizedTaskType.includes("marketing") &&
            normalizedFilter === "marketing")
        );
      }
      return true;
    })
    .filter((task) => {
      const heading = task.heading?.toLowerCase() || "";
      const instruction = task.instruction?.toLowerCase() || "";
      return (
        heading.includes(searchTerm.toLowerCase()) ||
        instruction.includes(searchTerm.toLowerCase())
      );
    });

  // Skeleton loader for ongoing tasks
  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return <div className="py-10 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-8 shadow-2xl bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
      <h2 className="mb-8 text-3xl font-extrabold text-center text-gray-800">
        Ongoing Tasks
      </h2>
      <div className="flex flex-col mb-6 space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4">
        <input
          type="text"
          placeholder="Search tasks..."
          className="flex-grow p-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={handleSearch}
        />
        <div className="flex space-x-2">
          <select
            className="p-2 border border-gray-300 rounded-md"
            value={taskTypeFilter}
            onChange={handleTaskTypeFilter}
          >
            <option value="all">All Types</option>
            <option value="survey">Survey</option>
            <option value="youtube">YouTube</option>
            <option value="app">App</option>
            <option value="marketing">Marketing</option>
          </select>
        </div>
      </div>
      {isFiltering ? (
        <SkeletonLoader />
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <OnGoingTaskCard key={task._id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
