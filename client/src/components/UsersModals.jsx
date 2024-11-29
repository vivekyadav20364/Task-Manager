import React, { useContext, useEffect, useState } from "react";
import API from "../utils/api";
import { userContext } from "../context/UserContext";
import { toast } from "react-toastify";

const UsersModal = ({ isOpen, setOpen, taskId,fetchTasks }) => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const {user}=useContext(userContext);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await API.get("/auth/users"); // Replace with your users API endpoint
        setUsers(data);
        fetchTasks();
        console.log(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users.");
      }
    };

    if (isOpen) fetchUsers();
  }, [isOpen]);

  const handleAssign = async() => {
    if (selectedUserId) {
       const resp=await API.put(`/tasks/assign-task/${taskId}`,{selectedUserId});
       //console.log(resp);
       toast.success("Task assigned successfully");
       fetchTasks();
       setOpen(false);
    } else {
      toast.error("Please select a user to assign the task.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-96 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Assign Task</h2>
        <div className="mb-4">
          {users?.length >0 ? (
            <select
              className="w-full border p-2 rounded"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <option value="">Select a User</option>
              {users.map((user1) => (
                user1._id !== user._id && (
                  <option key={user1._id} value={user1._id}>
                    {user1.name} ({user1.email})
                  </option>
              )))}
            </select>
          ) : (
            <p className="text-sm text-gray-600">No users available.</p>
          )}
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            className={`px-4 py-2 rounded ${
              selectedUserId
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
            disabled={!selectedUserId} // Disable if no user is selected
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsersModal;
