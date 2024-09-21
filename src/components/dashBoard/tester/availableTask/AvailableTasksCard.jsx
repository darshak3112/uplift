import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "flowbite-react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/_lib/store/hooks";
import toast from "react-hot-toast";
import { clearAvailableTask } from "@/_lib/store/features/tester/availableTask/availableTaskSlice";
import axios from "axios";

// Skeleton Loader Component
const SkeletonLoader = () => (
  <Card className="mx-auto overflow-hidden transition-transform transform bg-white rounded-lg shadow-md w-[300px] animate-pulse">
    <div className="flex items-center justify-between p-4 border-b border-blue-200 bg-blue-50">
      <div className="w-20 h-4 bg-blue-100 rounded-full"></div>
    </div>
    <div className="p-4">
      <div className="w-full h-6 mb-2 bg-gray-300 rounded"></div>
      <div className="w-3/4 h-4 mb-4 bg-gray-200 rounded"></div>
      <div className="space-y-2">
        <div className="w-full h-4 bg-gray-200 rounded"></div>
        <div className="w-full h-4 bg-gray-200 rounded"></div>
        <div className="w-full h-4 bg-gray-200 rounded"></div>
      </div>
      <div className="w-full h-10 mt-4 bg-blue-600 rounded-md"></div>
    </div>
  </Card>
);

function TaskCard({ task, type }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const testerId = useAppSelector((state) => state.userInfo?.id);

  const handleRedirect = async () => {
    if (type === "app") {
      try {
        const response = await axios.post("/api/task/app/apply", {
          testerId,
          taskId: task._id,
        });
        if (response.status === 200) {
          dispatch(clearAvailableTask());
          toast.success("Task submitted successfully!");
          router.push("/dashboard?activeTab=applied-task");
        } else {
          toast.error(response?.data?.message || "An error occurred.");
        }
      } catch (error) {
        toast.error("An error occurred.");
      }
    } else {
      router.push(`/dashboard?activeTab=available-task&taskId=${task._id}&type=${type}`);
    }
  };

  return (
    <Card className="max-w-sm mx-auto overflow-hidden transition-transform transform bg-white rounded-lg shadow-md hover:shadow-lg">
      <div className="flex items-center justify-between p-4 border-b border-blue-200 bg-blue-50">
        <span className="px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
          Task ID: {task._id}
        </span>
      </div>
      <div className="p-4">
        <h5 className="mb-2 text-xl font-semibold text-gray-900">
          {task.heading}
        </h5>
        <p className="mb-4 text-gray-700">{task.instruction}</p>
        <div className="mb-4 text-sm text-gray-500">
          <div>Country: {task.country}</div>
          <div>End Date: {new Date(task.end_date).toLocaleDateString()}</div>
          <div>Tester Min Age: {task.tester_age}</div>
          <div>Tester Gender: {task.tester_gender}</div>
        </div>
        <Button
          color="blue"
          onClick={handleRedirect}
          className="w-full py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Apply
        </Button>
      </div>
    </Card>
  );
}

export default function AvailableTasksCard() {
  const availableTaskData = useAppSelector((state) => state.availableTask);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [typeFilter, setTypeFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleSortOptionChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleTypeFilterChange = (event) => {
    setTypeFilter(event.target.value);
  };

  const addTypeToTasks = (tasks, type) => {
    return tasks.map((task) => ({ ...task, type }));
  };

  const filterTasks = (tasks) => {
    return tasks.filter(
      (task) =>
        (task.heading.toLowerCase().includes(searchTerm) ||
          task.instruction.toLowerCase().includes(searchTerm)) &&
        (typeFilter === "" || task.type === typeFilter)
    );
  };

  const sortTasks = (tasks) => {
    return tasks.sort((a, b) => {
      let comparison = 0;
      if (sortOption === "date") {
        comparison = new Date(a.end_date) - new Date(b.end_date);
      } else if (sortOption === "age") {
        comparison = a.tester_age - b.tester_age;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
  };

  useEffect(() => {
    const applyFiltersAndSorting = async () => {
      setLoading(true);
      // Simulate a delay for applying filters and sorting
      setTimeout(() => {
        setLoading(false);
      }, 1000); // Adjust time as needed
    };

    applyFiltersAndSorting();
  }, [searchTerm, sortOption, sortOrder, typeFilter]);

  const availableTasks = [
    ...addTypeToTasks(availableTaskData?.surveys || [], "surveys"),
    ...addTypeToTasks(availableTaskData?.youtube || [], "youtube"),
    ...addTypeToTasks(availableTaskData?.app || [], "app"),
  ];

  const filteredTasks = filterTasks(availableTasks);
  const sortedTasks = sortTasks(filteredTasks);

  return (
    <div className="p-6 rounded-lg shadow-md bg-gray-50">
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="Search tasks..."
          className="p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={handleSearch}
        />
        <select
          className="p-3 border rounded-md shadow-sm"
          value={sortOption}
          onChange={handleSortOptionChange}
        >
          <option value="date">Sort by Date</option>
          <option value="age">Sort by Age</option>
        </select>
        <select
          className="p-3 border rounded-md shadow-sm"
          value={sortOrder}
          onChange={handleSortOrderChange}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <select
          className="p-3 border rounded-md shadow-sm"
          value={typeFilter}
          onChange={handleTypeFilterChange}
        >
          <option value="">All Types</option>
          <option value="surveys">Surveys</option>
          <option value="youtube">YouTube</option>
          <option value="app">App</option>
        </select>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <SkeletonLoader key={index} />
          ))
        ) : sortedTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
            <Image
              src="/images/NoData.png"
              alt="No Data Available"
              width={400}
              height={300}
              className="mb-4"
            />
            <p className="text-lg text-gray-600">No data available.</p>
          </div>
        ) : (
          sortedTasks.map((task) => (
            <TaskCard key={task._id} task={task} type={task.type} />
          ))
        )}
      </div>
    </div>
  );
}