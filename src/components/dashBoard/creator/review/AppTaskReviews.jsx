import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { Card, Badge, Avatar, TextInput, Select, Button } from 'flowbite-react';
import { FaUser, FaClock, FaUsers, FaSearch, FaSort } from 'react-icons/fa';

const AppTaskReviews = () => {
  const [taskData, setTaskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [filterTester, setFilterTester] = useState('all');
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      const taskId = searchParams.get('taskId');
      const taskType = searchParams.get('type');

      if (!taskId || !taskType) {
        setError('Missing task information');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post('/api/task/analytics', {
          id: taskId,
          type: taskType
        });
        setTaskData(response.data.task);
      } catch (err) {
        setError('Failed to fetch task data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        <div className="h-12 bg-gray-200 rounded-md animate-pulse"></div>
        <div className="w-1/2 h-4 bg-gray-200 rounded-md animate-pulse"></div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-200 rounded-md animate-pulse"></div>
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
    .filter(response => 
      response.text.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterTester === 'all' || response.testerName === filterTester)
    )
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.date) - new Date(a.date);
      } else {
        return new Date(a.date) - new Date(b.date);
      }
    });

  const uniqueTesters = [...new Set(taskData.answers.detailedResponses.map(r => r.testerName))];

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">{taskData.heading}</h1>
      <p className="text-lg text-gray-600">{taskData.instruction}</p>
      
      <div className="flex items-center space-x-4">
        <Badge color="info" icon={FaUsers}>
          Total Responses: {taskData.answers.totalResponses}
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
          <Select onChange={(e) => setFilterTester(e.target.value)}>
            <option value="all">All Testers</option>
            {uniqueTesters.map(tester => (
              <option key={tester} value={tester}>{tester}</option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAndSortedResponses.map((response, index) => (
          <Card key={index}>
            <div className="flex items-center space-x-4">
              <Avatar rounded>
                <FaUser className="text-gray-400" />
              </Avatar>
              <div>
                <p className="font-medium">{response.testerName}</p>
                <p className="text-sm text-gray-500">{response.email}</p>
              </div>
            </div>
            <p className="mt-4">{response.text}</p>
            <div className="flex items-center mt-4 text-sm text-gray-500">
              <FaClock className="mr-2" />
              {new Date(response.date).toLocaleDateString()}
            </div>
          </Card>
        ))}
      </div>

      {filteredAndSortedResponses.length === 0 && (
        <p className="mt-8 text-center text-gray-500">No reviews found matching your criteria.</p>
      )}
    </div>
  );
};

export default AppTaskReviews;