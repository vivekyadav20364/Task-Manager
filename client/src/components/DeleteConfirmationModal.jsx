import React from "react";
import API from "../utils/api";
import { toast } from "react-toastify";
import PageLoader from "../pages/PageLoader";

const DeleteConfirmationModal = ({ id, isOpen, setOpen, fetchTasks }) => {
  const [loading,setLoading]=useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const resp=await API.delete(`/tasks/${id}`);
      toast.success("Task deleted successfully");
      fetchTasks();
      setOpen(false);  
    } catch (error) {
      toast.error("Error occured while deleting task");
      return;
    }
    finally{
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
    {loading && <PageLoader/>}
      <div className="bg-white rounded-lg shadow-lg p-6 w-80">
        <h2 className="text-xl font-semibold text-gray-800">Delete Task</h2>
        <p className="mt-2 text-gray-600">Are you sure you want to delete this task? This action cannot be undone.</p>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={()=>setOpen(false)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            No
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
