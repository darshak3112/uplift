import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import dynamic from "next/dynamic";
import { useAppDispatch, useAppSelector } from "@/_lib/store/hooks";
import toast from "react-hot-toast";
import { setAnalyticsData } from "@/_lib/store/features/creator/analyticsData/analyticsDataSlice";
import Skeleton from "@/components/shared/skeleton/Skeleton";
import { CldImage } from "next-cloudinary";
import { Modal } from "flowbite-react";
import { FaChevronLeft } from "react-icons/fa";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const fetchAnalyticsData = async (id, type) => {
  try {
    const response = await axios.post("/api/task/analytics", { id, type });
    return response.data;
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    toast.error("Failed to fetch analytics data");
    return null;
  }
};

const renderSurveyAnalytics = ({ task, handleBack, currentIndex, handlePrevious, handleNext }) => {
  // ... (keep existing survey analytics rendering logic)
};

const renderYoutubeAnalytics = ({ task, handleBack, selectedImage, setSelectedImage }) => {
  // ... (keep existing YouTube analytics rendering logic)
};

const renderAppTestingAnalytics = ({ task, handleBack }) => {
  // Implement app testing analytics rendering logic here
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="mb-4 text-2xl font-bold">App Testing Analytics</h2>
      {/* Add appropriate charts or data visualization for app testing */}
      <p>App testing analytics visualization to be implemented.</p>
      <button onClick={handleBack} className="mt-4 text-blue-600 hover:underline">
        Back to Analytics Selection
      </button>
    </div>
  );
};

const renderProductReviewAnalytics = ({ task, handleBack }) => {
  // Implement product review analytics rendering logic here
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="mb-4 text-2xl font-bold">Product Review Analytics</h2>
      {/* Add appropriate charts or data visualization for product reviews */}
      <p>Product review analytics visualization to be implemented.</p>
      <button onClick={handleBack} className="mt-4 text-blue-600 hover:underline">
        Back to Analytics Selection
      </button>
    </div>
  );
};

const AnalyticsData = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const type = searchParams.get("type");
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

  const { analyticsData } = useAppSelector((state) => state.analyticsData);

  useEffect(() => {
    const getAnalyticsData = async () => {
      if (id && type) {
        const existingData = analyticsData.find((item) => item.task.id === id);

        if (!existingData) {
          const data = await fetchAnalyticsData(id, type);
          if (data?.task) {
            dispatch(setAnalyticsData([...analyticsData, { task: data.task }]));
          }
        }
        setIsLoading(false);
      }
    };

    getAnalyticsData();
  }, [id, type, dispatch, analyticsData]);

  if (isLoading) return <Skeleton className="container px-4 py-8 mx-auto" />;

  const currentData = analyticsData.find((item) => item.task.id === id);

  if (!currentData) {
    return (
      <div className="container px-4 py-8 mx-auto text-center">
        <p className="text-xl text-gray-600">No analytics data available for this task.</p>
        <button onClick={() => router.back()} className="mt-4 text-blue-600 hover:underline">
          Back to Analytics Selection
        </button>
      </div>
    );
  }

  const totalCharts = currentData.task.answers?.length || 0;

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalCharts);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalCharts) % totalCharts);
  };

  const handleBack = () => {
    router.back();
  };

  const renderAnalytics = () => {
    switch (currentData.task.type) {
      case "survey":
        return renderSurveyAnalytics({
          task: currentData.task,
          currentIndex,
          handlePrevious,
          handleNext,
          handleBack,
        });
      case "youtube":
        return renderYoutubeAnalytics({
          task: currentData.task,
          handleBack,
          selectedImage,
          setSelectedImage,
        });
      case "app_testing":
        return renderAppTestingAnalytics({
          task: currentData.task,
          handleBack,
        });
      case "product_review":
        return renderProductReviewAnalytics({
          task: currentData.task,
          handleBack,
        });
      default:
        return (
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <p className="text-xl text-gray-600">Unsupported task type: {currentData.task.type}</p>
            <button onClick={handleBack} className="mt-4 text-blue-600 hover:underline">
              Back to Analytics Selection
            </button>
          </div>
        );
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-8 text-3xl font-bold text-center text-gray-800">
        Analytics Data
      </h1>
      {renderAnalytics()}
    </div>
  );
};

export default AnalyticsData;