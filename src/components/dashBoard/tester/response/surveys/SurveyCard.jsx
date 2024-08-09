import { addResponseTasks } from "@/_lib/store/features/tester/responseTask/responseTaskSlice";
import { useAppDispatch } from "@/_lib/store/hooks";
import { Button, Card } from "flowbite-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function SurveyCard({ setQuestionNo, questionNo, questions }) {
  const { register, handleSubmit, reset } = useForm();
  const dispatch = useAppDispatch();

  const [options, setOptions] = useState([
    { color: "bg-red-500", shape: "triangle" },
    { color: "bg-blue-500", shape: "diamond" },
    { color: "bg-yellow-500", shape: "circle" },
    { color: "bg-green-500", shape: "square" },
  ]);
  const [selectedOption, setSelectedOption] = useState(null);

  const onSubmit = (data, event) => {
    event.preventDefault();

    if (selectedOption !== null) {
      // Create a response object based on the selected option
      const response = {
        questionId: questionNo,
        answer: questions[questionNo - 1].options[selectedOption],
      };

      // Dispatch the response to the Redux store
      dispatch(addResponseTasks([response]));

      // Move to the next question
      setQuestionNo(questionNo + 1);
      reset();
      setSelectedOption(null); // Reset selected option
    } else {
      toast.error("Please select an option.");
    }
  };

  const handleOptionClick = (index) => {
    setSelectedOption(index);
  };

  useEffect(() => {
    // Any additional side effects based on questionNo can be handled here
  }, [questionNo]);

  return (
    <form method="POST" onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold">
            {questions[questionNo - 1].title}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {questions[questionNo - 1].options.map((option, index) => (
            <Button
              key={index}
              className={`w-full py-8 text-xl font-bold ${
                selectedOption === index ? "bg-opacity-70" : ""
              } ${options[index].color} text-white`}
              style={{ height: "100px" }}
              // Handle option click
              onClick={() => handleOptionClick(index)}
            >
              {option}
            </Button>
          ))}
        </div>
        <Button
          type="submit"
          color={"blue"}
          className="w-full mt-4 text-center"
        >
          Submit Answer
        </Button>
      </Card>
    </form>
  );
}
