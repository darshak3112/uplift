import { Card, Badge } from "flowbite-react";
import { useSearchParams, useRouter } from "next/navigation";

export function HistoryCard({ task }) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("activeTab");
  const router = useRouter();

  const handleClick = () => {
    if (activeTab === "analytics") {
      const url = `/dashboard?activeTab=analytics&id=${task?.id}&type=${task?.type}`;
      router.push(url);
    }
  };

  return (
    <Card
      className={`relative overflow-hidden rounded-lg shadow-md transform transition duration-300 ${
        activeTab === "analytics" ? "cursor-pointer hover:shadow-lg hover:-translate-y-2" : ""
      }`}
      onClick={handleClick}
    >
      {activeTab === "analytics" && (
        <div className="absolute top-0 left-0 flex items-center justify-between w-full p-3 text-white bg-gradient-to-r from-blue-500 to-indigo-600">
          <Badge color="info" size="sm">
            ID: {task?.id}
          </Badge>
          <Badge color="success" size="sm">
            {task?.type}
          </Badge>
        </div>
      )}
      <div className={`p-6 space-y-4 ${activeTab === "analytics" ? "pt-12" : ""}`}>
        <h5 className="text-xl font-semibold leading-tight text-gray-900 truncate dark:text-white">
          {task?.heading}
        </h5>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 line-clamp-3">
          {task?.instruction}
        </p>
      </div>
    </Card>
  );
}
