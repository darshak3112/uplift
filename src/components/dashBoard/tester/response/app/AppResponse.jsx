import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Button, Card, Label, Textarea } from "flowbite-react";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { useAppSelector } from "@/_lib/store/hooks";

const AppResponse = () => {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    checkOngoingTask();
  }, []);

  const { id } = useAppSelector((state) => state.userInfo);
  const taskId = searchParams.get("taskId");

  const checkOngoingTask = async () => {
    try {
      const result = await axios.post("/api/task/ongoing/check", {
        id,
        taskId,
      });

      if (result.status === 200) {
        setLoading(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("This task has already been checked today.");
        router.push("/dashboard?activeTab=available-task");
      } else {
        toast.error("An error occurred. Please try again.");
        router.push("/dashboard?activeTab=available-task");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const result = await axios.post("/api/task/app/taskResponse", {
        testerId: id,
        taskId,
        text: response,
      });

      if (result.status === 201) {
        toast.success("Response submitted successfully!");
        setResponse("");
        router.push("/dashboard?activeTab=available-task");
      }
    } catch (error) {
      toast.error("Failed to submit response. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl p-4 mx-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <Card>
        <h2 className="m-auto mb-4 text-2xl font-bold text-gray-900">
          Today&apos;s Feedback
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="response" value="Your Response" />
            <Textarea
              id="response"
              placeholder="Enter your response here..."
              required
              rows={6}
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button color="blue" type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <FaSpinner className="mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <FaPaperPlane className="mr-2" />
                Submit Response
              </>
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AppResponse;
