import React, { useState, useEffect } from "react";
import axios from "axios";
import { HiOutlineUserCircle } from "react-icons/hi2";

export default function OnGoingTask() {
  const [testerDetails, setTesterDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTesterDetails() {
      try {
        setLoading(true);
        const response = await axios.post("/api/task/app/applied-tester-list", {
          taskId: "66e3ed65a3387a53855cda5a",
        });
        if (response.data && response.data.testerDetails) {
          setTesterDetails(response.data.testerDetails);
        }
      } catch (error) {
        console.error("Error fetching tester details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTesterDetails();
  }, []);

  const handleApprove = (email) => {
    console.log(`Approved: ${email}`);
  };

  const handleDisapprove = (email) => {
    console.log(`Disapproved: ${email}`);
  };

  const SkeletonRow = () => (
    <tr className="bg-white border-b animate-pulse">
      <td className="px-6 py-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
      </td>
      <td className="px-6 py-4"><div className="w-3/4 h-4 bg-gray-200 rounded"></div></td>
      <td className="px-6 py-4"><div className="w-3/4 h-4 bg-gray-200 rounded"></div></td>
      <td className="px-6 py-4"><div className="w-full h-4 bg-gray-200 rounded"></div></td>
      <td className="px-6 py-4"><div className="w-1/4 h-4 bg-gray-200 rounded"></div></td>
      <td className="px-6 py-4">
        <div className="flex space-x-2">
          <div className="w-20 h-8 bg-gray-200 rounded"></div>
          <div className="w-20 h-8 bg-gray-200 rounded"></div>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="max-w-full min-h-screen p-6 bg-gray-100">
      <div className="mx-auto overflow-hidden bg-white rounded-lg shadow-lg">
        <div className="px-6 py-4 bg-indigo-600">
          <h1 className="flex justify-center text-3xl font-bold text-white">
            Applied testers
          </h1>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">User</th>
                  <th scope="col" className="px-6 py-3">First Name</th>
                  <th scope="col" className="px-6 py-3">Last Name</th>
                  <th scope="col" className="px-6 py-3">Email</th>
                  <th scope="col" className="px-6 py-3">Age</th>
                  <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <>
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                  </>
                ) : (
                  testerDetails.map((tester, index) => {
                    const [firstName, lastName] = tester.name.split(" ");
                    return (
                      <tr key={index} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <HiOutlineUserCircle className="w-10 h-10 text-indigo-500" />
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          {firstName}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          {lastName}
                        </td>
                        <td className="px-6 py-4">{tester.email}</td>
                        <td className="px-6 py-4">{tester.age}</td>
                        <td className="px-6 py-4">
                          <button
                            className="px-3 py-1 mr-2 text-xs font-semibold text-white bg-green-500 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                            onClick={() => handleApprove(tester.email)}
                          >
                            Approve
                          </button>
                          <button
                            className="px-3 py-1 text-xs font-semibold text-white bg-red-500 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                            onClick={() => handleDisapprove(tester.email)}
                          >
                            Disapprove
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}