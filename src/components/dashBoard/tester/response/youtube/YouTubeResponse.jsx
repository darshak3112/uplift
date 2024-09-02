import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Modal } from "flowbite-react";
import { CldImage } from "next-cloudinary";
import { useAppDispatch, useAppSelector } from "@/_lib/store/hooks";
import { clearResponseTask } from "@/_lib/store/features/tester/responseTask/responseTaskSlice";
import { clearAvailableTask } from "@/_lib/store/features/tester/availableTask/availableTaskSlice";
import toast from "react-hot-toast";
import axios from "axios";

export default function YouTubeResponse() {
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");
  const type = searchParams.get("type");
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Get taskInfo from Redux store
  const taskInfo = useAppSelector((state) =>
    type ? state.availableTask[type].find((task) => task?._id === taskId) : null
  );

  const youtubeThumbnails = taskInfo?.youtube_thumbnails || [];
  const testerId = useAppSelector((state) => state.userInfo?.id); // Assuming testerId is stored in the Redux store

  const [selectedThumbnailId, setSelectedThumbnailId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalThumbnail, setModalThumbnail] = useState(null);

  const handleSubmitTask = async (event) => {
    event.preventDefault();
    try {
      // Find the selected thumbnail by its ID
      const selectedThumbnail = youtubeThumbnails.find(
        (thumbnail) => thumbnail._id === selectedThumbnailId
      );

      // Construct the task submission object
      const taskSubmission = {
        taskId,
        testerId,
        response: selectedThumbnail?.title || "No response selected", // Using `title` as the `src` value
      };

      const response = await axios.post(
        "/api/task/youtube/taskResponse",
        taskSubmission
      );

      if (response.status === 201) {
        // Clear tasks from Redux store
        dispatch(clearResponseTask());
        dispatch(clearAvailableTask());
        // Show success toast and redirect
        toast.success("Task submitted successfully!");
        router.push("/dashboard?activeTab=history");
      }
    } catch (error) {
      console.error(
        "Error Submitting task:",
        error.response?.data || error.message
      );
      toast.error("Failed to submit task.");
    }
  };

  const handleThumbnailSelect = (thumbnailId) => {
    setSelectedThumbnailId(thumbnailId);
  };

  const handleThumbnailClick = (thumbnail) => {
    setModalThumbnail(thumbnail);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalThumbnail(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 pb-4">
      <h2 className="mb-4 text-2xl font-bold">
        Which thumbnail catches your eye?
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {youtubeThumbnails.map((thumbnail) => (
          <div
            key={thumbnail._id}
            className={`max-w-sm mx-2 cursor-pointer ${
              selectedThumbnailId === thumbnail._id
                ? "border-2 border-blue-500"
                : ""
            }`}
            onClick={() => handleThumbnailSelect(thumbnail._id)}
          >
            <CldImage
              width="400"
              height="300"
              src={thumbnail.title} // Here, title is used as the src
              alt={`Thumbnail ${thumbnail._id}`}
              className="object-cover w-full h-auto"
              onClick={() => handleThumbnailClick(thumbnail)}
            />
          </div>
        ))}
      </div>
      <Button
        color="blue"
        onClick={handleSubmitTask}
        className="w-full mt-4 text-center"
        disabled={selectedThumbnailId === null}
      >
        Submit Task
      </Button>

      <Modal
        show={isModalOpen}
        size="4xl"
        onClose={handleModalClose}
        dismissible
      >
        <div className="relative flex justify-center">
          {modalThumbnail && (
            <>
              <CldImage
                width="800"
                height="600"
                src={modalThumbnail.title} // Displaying the modal image
                alt={`Thumbnail ${modalThumbnail._id}`}
                className="object-cover w-full h-auto"
              />
              <button
                onClick={handleModalClose}
                className="absolute p-2 text-white bg-black bg-opacity-50 rounded-full top-4 right-4 hover:bg-opacity-75"
              >
                ✕
              </button>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
