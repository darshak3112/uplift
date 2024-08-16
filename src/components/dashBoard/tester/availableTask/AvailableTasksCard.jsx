import { useRouter } from "next/navigation";
import { Button, Card } from "flowbite-react";
import { useAppSelector } from "@/_lib/store/hooks";

function TaskCard({ task, type }) {
  const router = useRouter();

  const handleRedirect = () => {
    // Assuming you want to redirect to a path that includes the task ID
    router.push(
      `/dashboard?activeTab=available-task&taskId=${task._id}&type=${type}`
    );
  };

  return (
    <Card className="max-w-sm mx-2">
      <div className="flex items-center my-2">
        <span className="ml-3 mr-2 rounded bg-cyan-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
          Task ID: {task._id}
        </span>
      </div>
      <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
        {task.heading}
      </h5>

      <p className="text-gray-700 dark:text-gray-400">{task.instruction}</p>

      <div className="mt-4">
        <span className="block text-sm text-gray-500">
          Country: {task.country}
        </span>
        <span className="block text-sm text-gray-500">
          End Date: {new Date(task.end_date).toLocaleDateString()}
        </span>
        <span className="block text-sm text-gray-500">
          Tester Min Age: {task.tester_age}
        </span>
        <span className="block text-sm text-gray-500">
          Tester Gender: {task.tester_gender}
        </span>
      </div>

      <div className="mt-5">
        <Button color={"blue"} onClick={handleRedirect} className="w-full">
          Apply
        </Button>
      </div>
    </Card>
  );
}

export default function AvailableTasksCard() {
  const availableTaskData = useAppSelector((state) => state.availableTask);

  return (
    <div className="grid grid-cols-1 gap-4 p-5 rounded-lg shadow-md sm:grid-cols-2 lg:grid-cols-3 bg-gray-50">
      {availableTaskData?.surveys?.map((task) => (
        <TaskCard key={task._id} task={task} type={"surveys"} />
      ))}
    </div>
  );
}
