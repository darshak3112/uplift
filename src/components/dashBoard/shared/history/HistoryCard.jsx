import { Card } from "flowbite-react";

export function HistoryCard({ task }) {
  return (
    <Card className="max-w-sm">
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {task?.heading}
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        {task?.instruction}
      </p>
    </Card>
  );
}
