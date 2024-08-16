import { useEffect, useState } from "react";
import { Button } from "flowbite-react";
import { useAppDispatch, useAppSelector } from "@/_lib/store/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import SurveyCard from "./SurveyCard";
import axios from "axios";
import { clearResponseTask } from "@/_lib/store/features/tester/responseTask/responseTaskSlice";
import toast from "react-hot-toast";
import { clearAvailableTask } from "@/_lib/store/features/tester/availableTask/availableTaskSlice";

export default function SurveysResponse() {
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");
  const type = searchParams.get("type");
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [questionNo, setQuestionNo] = useState(1);

  let taskInfo = useAppSelector((state) => type && state.availableTask[type]);
  let testerId = useAppSelector((state) => state.userInfo.id);

  taskInfo = taskInfo.filter((task) => task?._id === taskId);

  const noOfQuestions = taskInfo[0]?.noOfQuestions || null;
  const questions = taskInfo[0]?.questions || null;

  const responseTaskData = useAppSelector(
    (state) => state.responseTask.response
  );

  const handleSubmitTask = async (event) => {
    event.preventDefault();
    try {
      let surveyResponse = { taskId, testerId, response: responseTaskData };
      const response = await axios.post(
        "/api/task/survey/taskResponse",
        surveyResponse
      );
      if (response.status === 201) {
        dispatch(clearResponseTask());
        dispatch(clearAvailableTask());
        toast.success("Task submitted successfully!");
        router.push("dashboard?activeTab=history");
      }
    } catch (error) {
      console.error(
        "Error Submitting task:",
        error.response ? error.response.data : error.message
      );
      toast.error("Failed to submit task.");
    }
  };

  useEffect(() => {}, [questionNo]);

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4 pb-4">
      {questionNo > noOfQuestions ? (
        <Button
          color={"blue"}
          onClick={handleSubmitTask}
          className="w-full mt-4 text-center "
        >
          Submit Task
        </Button>
      ) : (
        <>
          <h2 className="mb-4 text-2xl font-bold">
            {questionNo} out of {noOfQuestions}
          </h2>
          <SurveyCard
            setQuestionNo={setQuestionNo}
            questions={questions}
            questionNo={questionNo}
          />
        </>
      )}
    </div>
  );
}
