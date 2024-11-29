import React, { useState } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';
import PageLoader from '../pages/PageLoader';

const TaskEditModal = ({ task,setOpen, fetchTasks }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [dueDate, setDueDate] = useState(task?.dueDate || '');
  const [loading,setLoading]=useState(false);
//   if (!isOpen) return null;

  const handleSave = async() => {

    try {
      setLoading(true);
      const resp=await API.put(`/tasks/${task._id}`,{title,description,dueDate});
      fetchTasks();
      toast.success("Task changed successfully");
      setOpen(false);
    } catch (error) {
      toast.error("Error occured");
    }
    finally{
      setLoading(false); 
    }

  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    {loading && <PageLoader/>}
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-xl font-bold mb-4">Edit Task</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              rows="3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Due Date</label>
            <input
              type="date"
              value={dueDate.split('T')[0]} // Handle ISO date format
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>
        <div className="flex justify-end mt-6 space-x-2">
          <button
            onClick={()=>setOpen(false)}
            className="px-4 py-2 bg-gray-300 rounded-md text-gray-700 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskEditModal;
