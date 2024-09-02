import { useEffect } from "react";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import { toast } from "react-hot-toast";
import { Button } from "flowbite-react";
import { useAppSelector, useAppDispatch } from "@/_lib/store/hooks";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  addThumbnail,
  clearThumbnails,
  clearYouTubeTask,
  removeThumbnail,
} from "@/_lib/store/features/creator/youTubeTask/youTubeTaskSlice";

const uploadOptions = {
  cloudName: "dyuys2vzy",
  uploadPreset: "uplift",
  tags: ["single-image-upload"],
};

const cloudinaryApiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const cloudinaryApiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;
const cloudName = "dyuys2vzy";

export const YouTubeAddImages = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const noOfThumbNails = parseInt(
    useAppSelector((state) => state.youTubeTask.noOfThumbNails)
  );

  const youtube_thumbnails = useAppSelector(
    (state) => state.youTubeTask.youtube_thumbnails
  );

  const uploadYouTubeTaskData = useAppSelector((state) => state.youTubeTask);
  const uploaded_thumbnails = youtube_thumbnails.length;

  useEffect(() => {
    dispatch(clearThumbnails());
  }, [noOfThumbNails, dispatch]);

  const handleSuccess = (result) => {
    const publicId = result.info.public_id;
    dispatch(addThumbnail(publicId));
    toast.success("Image uploaded successfully!");
  };

  const handleError = (error) => {
    toast.error("Image upload failed!");
    console.error("Upload Error:", error);
  };

  const handleDelete = async (publicId) => {
    try {
      const timestamp = new Date().getTime();
      const string_to_sign = `public_id=${publicId}&timestamp=${timestamp}${cloudinaryApiSecret}`;
      const signature = await generateSHA1(string_to_sign);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
        {
          public_id: publicId,
          signature: signature,
          api_key: cloudinaryApiKey,
          timestamp: timestamp,
        }
      );

      if (response.data.result === "ok") {
        dispatch(removeThumbnail(publicId));
        toast.success("Image deleted successfully!");
      } else {
        throw new Error("Failed to delete image");
      }
    } catch (error) {
      toast.error("Failed to delete image");
      console.error("Delete Error:", error);
    }
  };

  // Function to generate SHA1 hash
  const generateSHA1 = async (message) => {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-1", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  };

  const handleUploadTask = async () => {
    try {
      const response = await axios.post(
        "/api/task/youtube/addtask",
        uploadYouTubeTaskData
      );

      if (response.status === 201) {
        dispatch(clearYouTubeTask());
        toast.success("Task uploaded successfully!");
        router.push("dashboard?activeTab=analytics");
      }
    } catch (error) {
      console.error(
        "Error uploading task:",
        error.response ? error.response.data : error.message
      );
      toast.error("Failed to upload task.");
    }
  };

  return (
    <div className="w-full p-4 overflow-x-auto bg-gray-100 rounded-lg">
      <div className="inline-block min-w-full">
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-4`}
        >
          {Array.from({ length: noOfThumbNails }).map((_, index) => (
            <div
              key={index}
              className="relative p-2 bg-white rounded-lg shadow-lg group"
            >
              {youtube_thumbnails[index] ? (
                <>
                  <CldImage
                    width={300} // Set a fixed width in pixels
                    height={200} // Set a fixed height in pixels
                    src={youtube_thumbnails[index].title} // Access the title property here
                    sizes="(min-width: 1280px) 300px, (min-width: 1024px) 250px, (min-width: 768px) 200px, (min-width: 640px) 150px, 100px"
                    alt={`Uploaded Image ${index + 1}`}
                    className="object-cover w-full rounded-lg"
                  />
                  <button
                    onClick={() =>
                      handleDelete(youtube_thumbnails[index].title)
                    }
                    className="absolute p-2 text-white transition-opacity bg-red-500 rounded-full opacity-0 top-2 right-2 group-hover:opacity-100"
                  >
                    <FaTrash />
                  </button>
                </>
              ) : (
                <CldUploadWidget
                  uploadPreset={uploadOptions.uploadPreset}
                  options={uploadOptions}
                  onSuccess={handleSuccess}
                  onError={handleError}
                >
                  {({ open }) => (
                    <Button
                      type="button"
                      color="blue"
                      onClick={open} // Changed to `open` directly
                      className="flex items-center justify-center w-full h-48 text-center sm:h-64"
                    >
                      Upload Image {index + 1}
                    </Button>
                  )}
                </CldUploadWidget>
              )}
            </div>
          ))}
        </div>
        {uploaded_thumbnails === noOfThumbNails && (
          <Button className="m-auto" color={"blue"} onClick={handleUploadTask}>
            Upload Task
          </Button>
        )}
      </div>
    </div>
  );
};
