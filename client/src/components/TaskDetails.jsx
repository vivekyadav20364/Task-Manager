import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/api";
import { toast } from "react-toastify";
import PageLoader from "../pages/PageLoader";

const TaskDetails = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    fetchTaskDetails();
  }, [taskId]);

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/tasks/task-by-id/${taskId}`);
      setTask(response.data?.task);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch task details.");
    } finally {
      setLoading(false);
    }
  };

// console.log(task);

  return (
    <div
      className={`
      ${task?.priority === "High" ? "bg-red-400" : ""}
      ${task?.priority === "Medium" ? "bg-yellow-300" : ""}
      ${task?.priority === "Low" ? "bg-green-300" : ""}
      max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10
    `}
    >
        {loading && <PageLoader/>}
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Task Details</h1>
      {task ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">{task.title}</h2>
          <p className="text-gray-600">
            <strong>Description:</strong> {task.description}
          </p>
          <p className="text-gray-600">
            <strong>Due Date:</strong>{" "}
            {new Date(task.dueDate).toLocaleDateString()}
          </p>
          <p className="text-gray-600">
            <strong>Status:</strong>{" "}
            <span
              className={`px-2 py-1 rounded-full ${
                task.status === "completed"
                  ? "bg-green-100 text-green-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {task.status}
            </span>
          </p>
          <p className="text-gray-600">
            <strong>Priority:</strong>{" "}
            <span
              className={`px-2 py-1 rounded-full ${
                task.priority === "High"
                  ? "bg-red-100 text-red-600"
                  : task.priority === "Medium"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {task.priority}
            </span>
          </p>
        </div>
      ) : (
        <p className="text-gray-500 text-center">No task found.</p>
      )}
    </div>
  );
};

export default TaskDetails;
