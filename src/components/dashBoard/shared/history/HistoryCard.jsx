import React from "react";
import { useSearchParams, useRouter } from "next/navigation";

export function HistoryCard({ task }) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("activeTab");
  const router = useRouter();

  const handleClick = () => {
    if (activeTab === "analytics") {
      const url = `/dashboard?activeTab=analytics&id=${task?.id}&type=${task?.type}`;
      router.push(url);
    } else if (activeTab === "review-creator") {
      const url = `?activeTab=review-creator&taskId=${task.id}&type=${task.type}`;
      router.push(url);
    }
  };

  const statusColor = (status) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const typeIcon = (type) => {
    switch (type.toLowerCase()) {
      case "surveytask":
        return "📋";
      case "youtubetask":
        return "🎥";
      case "apptask":
        return "📱";
      case "marketingtask":
        return "📢";
      default:
        return "❓";
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden transition duration-300 ${
        activeTab === "analytics"
          ? "cursor-pointer hover:shadow-lg hover:-translate-y-1"
          : ""
      }`}
      onClick={handleClick}
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-600">
            {typeIcon(task?.type)} {task?.type.replace("Task", "")}
          </span>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColor(
              task?.status
            )}`}
          >
            {task?.status}
          </span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-800">
          {task?.heading}
        </h3>
        <p className="mb-4 text-sm text-gray-600 line-clamp-2">
          {task?.instruction}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>ID: {task?.id.slice(0, 8)}...</span>
          <span>{new Date(task?.date).toLocaleDateString()}</span>
        </div>
      </div>
      {activeTab === "analytics" && (
        <div className="p-3 text-center bg-blue-50">
          <span className="text-sm font-medium text-blue-600">
            View Analytics
          </span>
        </div>
      )}
    </div>
  );
}
