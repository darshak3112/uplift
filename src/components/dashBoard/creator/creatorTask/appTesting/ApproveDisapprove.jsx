import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Spinner,
  TextInput,
  Select,
  Modal,
} from "flowbite-react";
import {
  FaSort,
  FaCheck,
  FaTimes,
  FaSearch,
  FaFilter,
  FaArrowLeft,
} from "react-icons/fa";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppSelector } from "@/_lib/store/hooks";
import toast from "react-hot-toast"; // Import react-hot-toast

export default function ApproveDisapprove() {
  const [testerDetails, setTesterDetails] = useState([]);
  const [filteredTesters, setFilteredTesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState({ type: "", testerId: "" });

  const searchParams = useSearchParams();
  const router = useRouter();
  const taskId = searchParams.get("taskId");
  const taskType = searchParams.get("taskType");
  const creatorId = useAppSelector((state) => state.userInfo.id);

  useEffect(() => {
    fetchTesterList();
  }, []);

  useEffect(() => {
    filterTesters();
  }, [searchTerm, ageFilter, testerDetails]);

  const fetchTesterList = async () => {
    try {
      let endpoint = "";

      if (taskType === "AppTask") {
        endpoint = "/api/task/app/applied-tester-list";
      } else if (taskType === "MarketingTask") {
        endpoint = "/api/task/marketing/applied-tester-list";
      } else {
        // Handle other task types or throw an error
        throw new Error("Invalid task type");
      }

      const response = await axios.post(endpoint, {
        taskId,
        creatorId,
      });

      setTesterDetails(response.data.testerDetails);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tester list:", error);
      setLoading(false);
      toast.error("Failed to fetch tester list");
    }
  };

  const filterTesters = () => {
    let filtered = testerDetails.filter(
      (tester) =>
        tester.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tester.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (ageFilter) {
      filtered = filtered.filter(
        (tester) => tester.age.toString() === ageFilter
      );
    }

    setFilteredTesters(filtered);
  };

  const handleSort = (column) => {
    const newDirection =
      sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(newDirection);

    const sorted = [...filteredTesters].sort((a, b) => {
      if (a[column] < b[column]) return newDirection === "asc" ? -1 : 1;
      if (a[column] > b[column]) return newDirection === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredTesters(sorted);
  };

  const handleApproveDisapprove = (testerId, action) => {
    setModalAction({ type: action, testerId });
    setShowModal(true);
  };

  const confirmAction = async () => {
    const { type: action, testerId } = modalAction;
    setShowModal(false);
    setLoading(true);

    try {
      let endpoint = "";

      if (taskType === "AppTask") {
        endpoint = `/api/task/app/${action}`;
      } else if (taskType === "MarketingTask") {
        endpoint = `/api/task/marketing/${action}`;
      } else {
        // Handle other task types or throw an error
        throw new Error("Invalid task type");
      }
      const response = await axios.post(endpoint, {
        testerId,
        taskId,
        creatorId,
      });

      if (response.status === 200) {
        await fetchTesterList();
        toast.success(
          `Tester ${
            action === "approve" ? "approved" : "disapproved"
          } successfully!`
        );
      } else {
        toast.error(`Problem ${action}ing tester`);
      }
    } catch (error) {
      console.error(`Error ${action}ing tester:`, error);
      toast.error(`Error ${action}ing tester`);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="container p-6 mx-auto bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          Tester Approval List
        </h2>
        <Button color="light" onClick={goBack}>
          <FaArrowLeft className="mr-2" /> Back
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-between mb-4 space-y-2 md:space-y-0">
        <div className="flex items-center w-full space-x-2 md:w-auto">
          <TextInput
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={FaSearch}
          />
          <Select
            value={ageFilter}
            onChange={(e) => setAgeFilter(e.target.value)}
          >
            <option value="">All Ages</option>
            {[...new Set(testerDetails.map((t) => t.age))]
              .sort((a, b) => a - b)
              .map((age) => (
                <option key={age} value={age}>
                  {age}
                </option>
              ))}
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <FaFilter className="text-gray-500" />
          <span className="text-sm text-gray-600">
            Showing {filteredTesters.length} of {testerDetails.length} testers
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table hoverable className="w-full">
          <Table.Head>
            {["Name", "Email", "Age", "Actions"].map((header) => (
              <Table.HeadCell
                key={header}
                onClick={() => handleSort(header.toLowerCase())}
                className="cursor-pointer"
              >
                <div className="flex items-center">
                  {header}
                  <FaSort
                    className={`ml-1 ${
                      sortColumn === header.toLowerCase()
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  />
                </div>
              </Table.HeadCell>
            ))}
          </Table.Head>
          <Table.Body className="divide-y">
            {filteredTesters.map((tester) => (
              <Table.Row
                key={tester.email}
                className="bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {tester.name}
                </Table.Cell>
                <Table.Cell>{tester.email}</Table.Cell>
                <Table.Cell>{tester.age}</Table.Cell>
                <Table.Cell>
                  <div className="flex space-x-2">
                    <Button
                      color="success"
                      size="sm"
                      onClick={() =>
                        handleApproveDisapprove(tester.testerId, "approve")
                      }
                    >
                      <FaCheck className="mr-2" /> Approve
                    </Button>
                    <Button
                      color="failure"
                      size="sm"
                      onClick={() =>
                        handleApproveDisapprove(tester.testerId, "disapprove")
                      }
                    >
                      <FaTimes className="mr-2" /> Disapprove
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Confirm Action</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Are you sure you want to {modalAction.type} this tester?
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="blue" onClick={confirmAction}>
            Yes, {modalAction.type}
          </Button>
          <Button color="gray" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
