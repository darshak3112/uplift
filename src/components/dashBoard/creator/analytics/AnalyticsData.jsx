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

const renderSurveyAnalytics = (task) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-1">
      {task.answers.map((answer, index) => {
        const options = Object.keys(answer.answers);
        const counts = options.map((option) => answer.answers[option]);

        const barOptions = {
          chart: { type: "bar", height: 350 },
          xaxis: {
            categories: options,
            title: { text: "Options" },
            labels: {
              show: false, // Show the labels at the bottom of the chart
              
            },
          },
          yaxis: {
            title: { text: "Frequency of Answers" },
          },
          title: {
            text: `Question ${index + 1}: ${answer.question}`,
            margin:10,
            style: {
              fontSize: '14px', // Adjust font size if needed
              whiteSpace: 'normal', // Allow text to wrap
              overflowWrap: 'break-word',
              textOverflow: 'ellipsis' // Break long words
            },
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
          <div key={index} className="p-4 w-max bg-white rounded-lg shadow-md">
            <Chart
              options={barOptions}
              series={barSeries}
              type="bar"
              height={550}
              width={1150}

            />
          </div>
        );
      })}
    </div>
  );
};

const renderYoutubeAnalytics = (task) => {
  const youtubeOptions = task.answers.answers.map((answer) => answer.option);
  const youtubeCounts = task.answers.answers.map((answer) => answer.count);

  const pieOptions = {
    chart: { type: "pie", height: 350 },
    labels: youtubeOptions,
  };

  const pieSeries = youtubeCounts;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
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

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-8 text-3xl font-bold text-center">Analytics Data</h1>
      {currentData.task.type === "survey"
        ? renderSurveyAnalytics(currentData.task)
        : renderYoutubeAnalytics(currentData.task)}
    </div>
  );
};

export default AnalyticsData;
