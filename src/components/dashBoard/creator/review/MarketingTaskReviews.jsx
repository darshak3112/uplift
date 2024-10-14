import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  Badge,
  TextInput,
  Select,
  Button,
  Avatar,
  Modal,
} from "flowbite-react";
import {
  FaUsers,
  FaSearch,
  FaSort,
  FaArrowLeft,
  FaClock,
  FaUser,
  FaShoppingCart,
  FaLink,
  FaCheck,
  FaTimes,
  FaExpandAlt,
} from "react-icons/fa";
import { CldImage } from "next-cloudinary";
import toast from "react-hot-toast";

const ReviewCard = ({ response, handleApprove, handleDisapprove }) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  return (
    <>
      <Card className="overflow-hidden">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar rounded size="md" />
            <div>
              <p className="text-lg font-bold">{response.testerName}</p>
              <p className="text-sm text-gray-600">
                <FaShoppingCart className="inline mr-1" />
                Order ID: {response.orderId}
              </p>
              <p className="text-sm text-gray-600">
                <FaClock className="inline mr-1" />
                Ordered: {new Date(response.orderDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <a
            href={response.reviewLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:underline"
          >
            <FaLink className="mr-1" />
            Review
          </a>
        </div>

        {response.reviewImage && (
          <div
            className="mb-4 cursor-pointer"
            onClick={() => setIsImageModalOpen(true)}
          >
            <CldImage
              width="600"
              height="400"
              src={response.reviewImage}
              alt="Review Image"
              className="w-full h-auto rounded-md"
            />
          </div>
        )}

        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            <FaClock className="inline mr-1" />
            Submitted: {new Date(response.submittedAt).toLocaleString()}
          </p>
        </div>
        <div className="flex mt-2 space-x-2">
          <Button
            color="success"
            size="sm"
            onClick={() => handleApprove(response.testerId)}
            disabled={response.status === "approved"}
          >
            <FaCheck className="mr-1" />
            {response.status === "approved" ? "Approved" : "Approve"}
          </Button>
          <Button
            color="failure"
            size="sm"
            onClick={() => handleDisapprove(response.testerId)}
            disabled={response.status === "disapproved"}
          >
            <FaTimes className="mr-1" />
            {response.status === "disapproved" ? "Disapproved" : "Disapprove"}
          </Button>
        </div>
      </Card>

      <Modal
        show={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        size="xl"
      >
        <Modal.Header>Review Image</Modal.Header>
        <Modal.Body>
          <div className="flex justify-center">
            <CldImage
              width="800"
              height="600"
              src={response.reviewImage}
              alt="Review Image"
              className="h-auto max-w-full rounded-md"
            />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

const MarketingTaskReviews = () => {
  const [taskData, setTaskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [actionLoading, setActionLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, [searchParams]);

  const fetchData = async () => {
    const taskId = searchParams.get("taskId");
    const taskType = searchParams.get("type");

    if (!taskId || !taskType) {
      setError("Missing task information");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/task/analytics", {
        id: taskId,
        type: taskType,
      });
      setTaskData(response.data.task);
    } catch (err) {
      setError("Failed to fetch task data: " + err.message);
      toast.error("Failed to fetch task data");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/dashboard?activeTab=review-creator");
  };

  const handleResponseStatus = async (testerId, status) => {
    if (actionLoading) return;
    setActionLoading(true);

    try {
      const response = await axios.post("/api/task/marketing/response-status", {
        testerId: testerId,
        taskId: taskData.id,
        status: status,
      });

      if (
        response.data &&
        response.data.message === "Task response status updated successfully"
      ) {
        toast.success(
          status === "response-accepted"
            ? "Response approved successfully"
            : "Response disapproved successfully"
        );

        // Update the local state
        setTaskData((prevData) => ({
          ...prevData,
          answers: {
            ...prevData.answers,
            detailedResponses: prevData.answers.detailedResponses.map(
              (response) =>
                response.testerId === testerId
                  ? {
                      ...response,
                      status:
                        status === "response-accepted"
                          ? "approved"
                          : "disapproved",
                    }
                  : response
            ),
          },
        }));
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      toast.error(
        `Failed to ${
          status === "response-accepted" ? "approve" : "disapprove"
        } response: ${error.message}`
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = (testerId) =>
    handleResponseStatus(testerId, "response-accepted");
  const handleDisapprove = (testerId) =>
    handleResponseStatus(testerId, "response-rejected");

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        <div className="h-12 bg-gray-200 rounded-md animate-pulse"></div>
        <div className="w-1/2 h-4 bg-gray-200 rounded-md animate-pulse"></div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-40 bg-gray-200 rounded-md animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="m-8">
        <p className="text-center text-red-500">{error}</p>
      </Card>
    );
  }

  if (!taskData) {
    return null;
  }

  const filteredAndSortedResponses = taskData.answers.detailedResponses
    .filter(
      (response) =>
        response.reviewLink.toLowerCase().includes(searchTerm.toLowerCase()) ||
        response.testerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        response.orderId.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.submittedAt) - new Date(a.submittedAt);
      } else {
        return new Date(a.submittedAt) - new Date(b.submittedAt);
      }
    });

  return (
    <div className="p-8 space-y-8 shadow-2xl bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
      <div className="flex items-center justify-between">
        <Button color="light" onClick={handleBack}>
          <FaArrowLeft className="mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold text-gray-800">{taskData.heading}</h1>
      </div>

      <p className="text-lg text-gray-600 whitespace-pre-line">
        {taskData.instruction}
      </p>

      <div className="flex items-center space-x-4">
        <Badge color="info" icon={FaUsers}>
          Total Orders: {taskData.answers.totalOrders}
        </Badge>
        <Badge color="success" icon={FaClock}>
          Avg. Time to Review:{" "}
          {taskData.answers.averageTimeBetweenOrderAndReview}
        </Badge>
      </div>

      <div className="flex flex-col items-start justify-between space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
        <div className="flex-1">
          <TextInput
            icon={FaSearch}
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex space-x-4">
          <Select icon={FaSort} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAndSortedResponses.map((response, index) => (
          <ReviewCard
            key={index}
            response={response}
            handleApprove={handleApprove}
            handleDisapprove={handleDisapprove}
          />
        ))}
      </div>

      {filteredAndSortedResponses.length === 0 && (
        <p className="mt-8 text-center text-gray-500">
          No reviews found matching your criteria.
        </p>
      )}
    </div>
  );
};

export default MarketingTaskReviews;
