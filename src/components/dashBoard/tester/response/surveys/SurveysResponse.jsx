import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/_lib/store/hooks";
import {
  addResponseTasks,
  clearResponseTask,
} from "@/_lib/store/features/tester/responseTask/responseTaskSlice";
import { clearAvailableTask } from "@/_lib/store/features/tester/availableTask/availableTaskSlice";
import { Card, Progress, Button, Modal } from "flowbite-react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import SurveyCard from "./SurveyCard";
import { FaChevronLeft, FaClipboardList } from "react-icons/fa";

const SurveysResponse = () => {
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");
  const type = searchParams.get("type"); // SurveyTask, YouTubeTask, AppTask
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [questionNo, setQuestionNo] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Define a mapping between task types and store keys
  const taskMapping = {
    SurveyTask: "surveys",
    YouTubeTask: "youtube",
    AppTask: "app"
  };

  // Get the corresponding tasks from the store based on type
  const taskInfo = useAppSelector((state) => {
    const storeKey = taskMapping[type]; // Map type to store key
    return state.availableTask[storeKey].find((task) => task._id === taskId); // Fetch the specific task
  });

  const testerId = useAppSelector((state) => state.userInfo.id);
  const noOfQuestions = taskInfo?.noOfQuestions || 0;
  const questions = taskInfo?.questions || [];

  const responseTaskData = useAppSelector(
    (state) => state.responseTask.response
  );

  const onSubmit = (event) => {
    event.preventDefault();

    if (selectedOption !== null) {
      const response = {
        questionId: questionNo,
        answer: questions[questionNo - 1].options[selectedOption],
      };

      dispatch(addResponseTasks([response]));

      if (questionNo < noOfQuestions) {
        setQuestionNo(questionNo + 1);
        setSelectedOption(null);
      } else {
        setShowConfirmModal(true);
      }
    } else {
      toast.error("Please select an option.");
    }
  };

  const handleSubmitTask = async () => {
    setIsSubmitting(true);
    setShowConfirmModal(false);
    try {
      const surveyResponse = { taskId, testerId, response: responseTaskData };
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOptionClick = (index) => {
    setSelectedOption(index);
  };

  const progressPercentage = (questionNo / noOfQuestions) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-3xl overflow-hidden bg-white rounded-lg shadow-xl">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <Button
              color="light"
              size="sm"
              onClick={() => router.push("dashboard?activeTab=available-task")}
              className="flex items-center px-4 py-2 text-blue-600 transition duration-300 bg-blue-100 rounded-full hover:bg-blue-200"
            >
              <FaChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h2 className="text-3xl font-bold text-gray-800">{task?.name}</h2>
          </div>

          <div className="mb-8">
            <Progress
              progress={progressPercentage}
              size="lg"
              color="blue"
              className="h-3 rounded-full"
            />
            <p className="mt-2 text-sm text-right text-gray-600">
              Question {questionNo} of {noOfQuestions}
            </p>
          </div>

          <SurveyCard
            questionNo={questionNo}
            questions={questions}
            selectedOption={selectedOption}
            handleOptionClick={handleOptionClick}
            handleSubmit={onSubmit}
            isSubmitting={isSubmitting}
            noOfQuestions={noOfQuestions}
          />
        </div>
      </Card>

      <Modal
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        className="bg-white rounded-lg shadow-xl"
      >
        <Modal.Header className="border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">Confirm Submission</h3>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col items-center justify-center p-4">
            <FaClipboardList className="w-16 h-16 mb-4 text-blue-500" />
            <p className="text-lg text-center text-gray-600">
              Are you sure you want to submit the survey?
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-center border-t border-gray-200">
          <Button
            onClick={handleSubmitTask}
            color="blue"
            disabled={isSubmitting}
            className="mr-2"
          >
            {isSubmitting ? "Submitting..." : "Yes, Submit"}
          </Button>
          <Button onClick={() => setShowConfirmModal(false)} color="light">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SurveysResponse;