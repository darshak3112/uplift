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
      className={`relative overflow-hidden transition-transform duration-300 hover:shadow-2xl rounded-lg ${
        activeTab === "analytics" ? "cursor-pointer hover:-translate-y-2" : ""
      }`}
      onClick={handleClick}
    >
      {activeTab === "analytics" && (
        <div className="absolute top-0 left-0 flex items-center justify-between w-full p-2 bg-gradient-to-r from-indigo-500 to-purple-500">
          <Badge color="info" size="sm">
            ID: {task?.id}
          </Badge>
          <Badge color="success" size="sm">
            {task?.type}
          </Badge>
        </div>
      )}
      <div className={`p-6 ${activeTab === "analytics" ? "pt-10" : ""}`}>
        <h5 className="mb-3 text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
          {task?.heading}
        </h5>
        <p className="text-sm text-gray-700 dark:text-gray-400 line-clamp-3">
          {task?.instruction}
        </p>
      </div>
    </Card>
  );
}
