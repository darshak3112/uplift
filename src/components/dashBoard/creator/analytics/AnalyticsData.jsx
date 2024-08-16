import dynamic from "next/dynamic";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function AnalyticsData() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const type = searchParams.get("type");

  // Example of fetched data (replace with actual API call if needed)
  const [data, setData] = useState({
    message: "Analytics",
    task: {
      id: "66b7084974192238b4d7a8d4",
      type: "survey",
      heading: "project-1 submission task 3",
      instruction: "ihiy",
      answers: [
        {
          question: "2+5",
          answers: { A: 10, B: 20, C: 30, D: 40 },
        },
        {
          question: "8+5",
          answers: { A: 5, B: 15, C: 25, D: 35 },
        },
        {
          question: "5+9",
          answers: { A: 12, B: 18, C: 24, D: 36 },
        },
      ],
    },
  });

  // Bar Chart Options
  const barChartOptions = {
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    title: {
      text: "Survey Results",
    },
    xaxis: {
      categories: data.task.answers.map((item) => item.question),
    },
  };

  const barChartSeries = [
    {
      name: "Responses",
      data: data.task.answers.map((item) =>
        Object.values(item.answers).reduce((a, b) => a + b, 0)
      ),
    },
  ];

  // Pie Chart Options
  const pieChartOptions = {
    labels: Object.keys(data.task.answers[0].answers),
    title: {
      text: "Response Distribution (First Question)",
    },
  };

  const pieChartSeries = Object.values(data.task.answers[0].answers);

  // Line Chart Options
  const lineChartOptions = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    title: {
      text: "Responses Over Time",
    },
    xaxis: {
      categories: data.task.answers.map((item) => item.question),
    },
  };

  const lineChartSeries = [
    {
      name: "Responses",
      data: data.task.answers.map((item) =>
        Object.values(item.answers).reduce((a, b) => a + b, 0)
      ),
    },
  ];

  // Radar Chart Options
  const radarChartOptions = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    title: {
      text: "Response Distribution (Radar)",
    },
    xaxis: {
      categories: Object.keys(data.task.answers[0].answers),
    },
  };

  const radarChartSeries = [
    {
      name: "Responses",
      data: Object.values(data.task.answers[0].answers),
    },
  ];

  return (
    <div className="p-5 bg-white rounded-lg shadow-lg">
      <h2 className="mb-5 text-2xl font-bold">{data.task.heading}</h2>
      <p className="mb-5 text-sm text-gray-700">{data.task.instruction}</p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
          <Chart
            options={barChartOptions}
            series={barChartSeries}
            type="bar"
            height={350}
          />
        </div>

        <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
          <Chart
            options={pieChartOptions}
            series={pieChartSeries}
            type="pie"
            height={350}
          />
        </div>

        <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
          <Chart
            options={lineChartOptions}
            series={lineChartSeries}
            type="line"
            height={350}
          />
        </div>

        <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
          <Chart
            options={radarChartOptions}
            series={radarChartSeries}
            type="radar"
            height={350}
          />
        </div>
      </div>
    </div>
  );
}
