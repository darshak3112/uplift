import { Card } from "flowbite-react";
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
      className={`relative ${
        activeTab === "analytics" ? "cursor-pointer" : ""
      } max-w-sm overflow-hidden bg-white rounded-lg shadow-lg`}
      onClick={handleClick}
    >
      {activeTab === "analytics" && (
        <>
          <div className="absolute top-2 right-2 bg-cyan-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            {task?.type}
          </div>
          <div className="absolute top-2 left-2 bg-cyan-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            ID: {task?.id}
          </div>
        </>
      )}
      <div className="p-5">
        <h5 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
          {task?.heading}
        </h5>
        <p className="text-sm text-gray-700 dark:text-gray-400">
          {task?.instruction}
        </p>
      </div>
    </Card>
  );
}
