import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import dynamic from "next/dynamic";
import { useAppDispatch, useAppSelector } from "@/_lib/store/hooks";
import toast from "react-hot-toast";
import { setAnalyticsData } from "@/_lib/store/features/creator/analyticsData/analyticsDataSlice";
import Skeleton from "@/components/shared/skeleton/Skeleton";

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

const renderSurveyAnalytics = ({ task, currentIndex, handlePrevious, handleNext }) => {
  const answer = task.answers[currentIndex];
  const options = Object.keys(answer.answers);
  const counts = options.map((option) => answer.answers[option]);

  const barOptions = {
    chart: { type: "bar", height: 350 },
    xaxis: {
      categories: options,
      title: { text: "Options" },
      labels: { show: false },
    },
    yaxis: {
      title: { text: "Frequency of Answers" },
    },
    title: {
      text: `Question ${currentIndex + 1}: ${answer.question}`,
      align: "left",
    },
    plotOptions: {
      bar: {
        distributed: true,
        horizontal: false,
      },
    },
    colors: ["#008FFB", "#00E396", "#FEB019", "#FF4560"],
  };

  const barSeries = [{ name: "Frequency", data: counts }];

  return (
    <div key={currentIndex} className="relative p-4 bg-white rounded-lg shadow-md">
      <div className="absolute top-2 right-2 flex space-x-2 z-10">
        <button
          onClick={handlePrevious}
          className="px-4 py-2 text-white bg-blue-600 rounded"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 text-white bg-blue-600 rounded"
        >
          Next
        </button>
      </div>
      <Chart
        options={barOptions}
        series={barSeries}
        type="bar"
        height={500}
        width={1150}
      />
    </div>
  );
};

const renderYoutubeAnalytics = ({ task, handlePrevious, handleNext }) => {
  const youtubeOptions = task.answers.answers.map((answer) => answer.option);
  const youtubeCounts = task.answers.answers.map((answer) => answer.count);

  const pieOptions = {
    chart: { type: "pie", height: 350 },
    labels: youtubeOptions,
  };

  const pieSeries = youtubeCounts;

  return (
    <div className="relative p-6 bg-white rounded-lg shadow-md">
      <div className="absolute top-2 right-2 flex space-x-2 z-10">
        <button
          onClick={handlePrevious}
          className="px-4 py-2 text-white bg-blue-500 rounded"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 text-white bg-blue-500 rounded"
        >
          Next
        </button>
      </div>
      <h2 className="mb-4 text-2xl font-bold">{task.heading}</h2>
      <p className="mb-6">{task.instruction}</p>
      <Chart options={pieOptions} series={pieSeries} type="pie" height={350} />
    </div>
  );
};

const AnalyticsData = () => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const type = searchParams.get("type");
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { analyticsData } = useAppSelector((state) => state.analyticsData);

  useEffect(() => {
    const getAnalyticsData = async () => {
      if (id && type) {
        const existingData = analyticsData.find((item) => item.task.id === id);

        if (!existingData) {
          const data = await fetchAnalyticsData(id, type);
          if (data?.task) {
            dispatch(setAnalyticsData([{ task: data.task }]));
          }
        }
        setIsLoading(false);
      }
    };

    getAnalyticsData();
  }, [id, type, dispatch, analyticsData]);

  if (isLoading) return <Skeleton className="container px-4 py-8 mx-auto" />;

  const currentData = analyticsData.find((item) => item.task.id === id);

  if (!currentData)
    return <p className="text-center text-gray-600">No data available</p>;

  const totalCharts = currentData.task.answers.length;

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalCharts);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalCharts) % totalCharts);
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-8 text-3xl font-bold text-center">Analytics Data</h1>
      {currentData.task.type === "survey"
        ? renderSurveyAnalytics({
            task: currentData.task,
            currentIndex,
            handlePrevious,
            handleNext,
          })
        : renderYoutubeAnalytics({
            task: currentData.task,
            handlePrevious,
            handleNext,
          })}
    </div>
  );
};

export default AnalyticsData;
