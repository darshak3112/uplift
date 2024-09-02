import React from "react";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/_lib/store/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "flowbite-react";
import { CldImage } from "next-cloudinary";
import { clearResponseTask } from "@/_lib/store/features/tester/responseTask/responseTaskSlice";
import { clearAvailableTask } from "@/_lib/store/features/tester/availableTask/availableTaskSlice";
import toast from "react-hot-toast";

export default function YouTubeResponse() {
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");
  const type = searchParams.get("type");
  const dispatch = useAppDispatch();
  const router = useRouter();

  const taskInfo = useAppSelector((state) =>
    type ? state.availableTask[type].find((task) => task?._id === taskId) : null
  );

  const youtubeThumbnails = taskInfo?.youtube_thumbnails || [];

  const handleSubmitTask = async (event) => {
    event.preventDefault();
    try {
      // Assuming you have a task submission API
      // const response = await axios.post("/api/task/submit", { taskId, response: ... });
      dispatch(clearResponseTask());
      dispatch(clearAvailableTask());
      toast.success("Task submitted successfully!");
      router.push("/dashboard?activeTab=history");
    } catch (error) {
      console.error(
        "Error Submitting task:",
        error.response?.data || error.message
      );
      toast.error("Failed to submit task.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 pb-4">
      <h2 className="mb-4 text-2xl font-bold">
        Which thumbnail catches your eye?
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {youtubeThumbnails.map((thumbnail) => (
          <div key={thumbnail._id} className="max-w-sm mx-2">
            <CldImage
              width="400"
              height="300"
              src={thumbnail.title}
              alt={`Thumbnail ${thumbnail._id}`}
              className="object-cover w-full h-auto"
            />
          </div>
        ))}
      </div>
      <Button
        color="blue"
        onClick={handleSubmitTask}
        className="w-full mt-4 text-center"
      >
        Submit Task
      </Button>
    </div>
  );
}
