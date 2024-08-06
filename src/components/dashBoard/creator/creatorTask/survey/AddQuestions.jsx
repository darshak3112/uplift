import { useState } from "react";
import { Button, Label, TextInput, Card } from "flowbite-react";

export const AddQuestions = () => {
  const [question, setQuestion] = useState(
    "When did the first cornea transplant take place?"
  );
  const [options, setOptions] = useState([
    { text: "1888", color: "bg-red-500", shape: "triangle" },
    { text: "1905", color: "bg-blue-500", shape: "diamond" },
    { text: "1912", color: "bg-yellow-500", shape: "circle" },
    { text: "1942", color: "bg-green-500", shape: "square" },
  ]);
  const [timer, setTimer] = useState(20);

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <Card className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold">{question}</div>
          <div className="flex items-center">
            <div className="mr-2 text-2xl font-bold">{timer}</div>
            <Button size="sm">Skip</Button>
          </div>
        </div>
        <div className="flex justify-around mb-4">
          <img src="/kahoot-logo.png" alt="Kahoot" className="h-24" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {options.map((option, index) => (
            <Button
              key={index}
              className={`w-full py-8 text-xl font-bold ${option.color} text-white`}
              style={{ height: "100px" }}
            >
              {option.text}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
};
