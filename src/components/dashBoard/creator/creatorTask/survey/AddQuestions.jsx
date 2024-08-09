"use client";
import { useState } from "react";
import { Button, TextInput, Card } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/_lib/store/hooks";
import toast from "react-hot-toast";
import {
  addQuestion,
  clearSurveyTask,
} from "@/_lib/store/features/creator/surveyTask/surveyTaskSlice";
import axios from "axios";
import { useRouter } from "next/navigation";

export const AddQuestions = () => {
  const [options, setOptions] = useState([
    { text: "", color: "bg-red-500" },
    { text: "", color: "bg-blue-500" },
    { text: "", color: "bg-green-500" },
    { text: "", color: "bg-yellow-500" },
  ]);

  const router = useRouter();
  const [questionNo, setQuestionNo] = useState(1);
  const noOfQuestions = useAppSelector(
    (state) => state.surveyTask.noOfQuestions
  );

  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      options: [],
      answer_type: "MCQ",
    },
  });

  let uploadSurveyTaskData = useAppSelector((state) => state.surveyTask);

  const handleUploadTask = async () => {
    try {
      const response = await axios.post(
        "/api/task/survey/addtask",
        uploadSurveyTaskData
      );
      if (response.status === 201) {
        dispatch(clearSurveyTask());
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

  const onSubmit = async (data, event) => {
    event.preventDefault();
    const questionData = {
      title: data.title,
      options: options.map((ele) => ele.text),
      answer_type: "MCQ",
    };

    // Dispatch addQuestion action
    dispatch(addQuestion({ question: questionData }));

    // Show success toast
    toast.success("Question added successfully!");

    // Reset the form and options
    reset();
    setOptions([
      { text: "", color: "bg-red-500" },
      { text: "", color: "bg-blue-500" },
      { text: "", color: "bg-green-500" },
      { text: "", color: "bg-yellow-500" },
    ]);

    // Increment question number
    setQuestionNo((prev) => prev + 1);
  };

  const handleOptionChange = (index, value) => {
    setOptions((prevOptions) =>
      prevOptions.map((option, i) =>
        i === index ? { ...option, text: value } : option
      )
    );
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4 pb-4">
      {questionNo > noOfQuestions ? (
        <Button
          color={"blue"}
          onClick={handleUploadTask}
          className="w-full mt-4 text-center "
        >
          UploadTask
        </Button>
      ) : (
        <>
          <h2 className="mb-4 text-2xl font-bold">
            {questionNo} out of {noOfQuestions}
          </h2>
          <Card className="w-full max-w-3xl p-6">
            <form method="POST" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <TextInput
                  id="title"
                  type="text"
                  placeholder="Enter Question"
                  name="title"
                  {...register("title", {
                    required: "Title name is required",
                  })}
                  required
                  className="w-full mb-2 text-lg font-semibold text-center"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {options.map((option, index) => (
                  <div key={index} className="relative">
                    <textarea
                      value={option.text}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      className={`w-full py-8 text-xl font-bold text-white ${option.color}`}
                      required
                    />
                  </div>
                ))}
              </div>

              <Button
                type="submit"
                color={"blue"}
                className="w-full mt-4 text-center"
              >
                Save Questions
              </Button>
            </form>
          </Card>
        </>
      )}
    </div>
  );
};
