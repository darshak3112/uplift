import React, { useState, useEffect } from "react";
import axios from "axios";
import { OnGoingTaskCard } from "./OnGoingTaskCard";
import { useAppSelector } from "@/_lib/store/hooks";

export default function OnGoingTask() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      {tasks.length === 0 ? (
        <div className="py-10 text-center text-gray-600">
          No ongoing tasks available.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <OnGoingTaskCard key={task._id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
