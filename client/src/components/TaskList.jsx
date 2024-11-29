import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";
import { FaTrash, FaEdit, FaUserPlus } from "react-icons/fa";
import TaskEditModal from "./TaskEditModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { userContext } from "../context/UserContext";
import UsersModal from "./UsersModals";
import { toast } from "react-toastify";
import PageLoader from "../pages/PageLoader";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [userModal, setUserModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [myTasks, setMyTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const { user } = useContext(userContext);

  const loggedInUserId = user?._id;

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/tasks?page=${page}&limit=5`);
      setTasks(data?.tasks);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
    if (tasks.length > 0 && user) {
      const filteredMyTasks = tasks.filter(
        (task) => task?.userId === loggedInUserId
      );
      const filteredAssignedTasks = tasks.filter(
        (task) => task?.assignedTo?._id === loggedInUserId
      );

      setMyTasks(filteredMyTasks);
      setAssignedTasks(filteredAssignedTasks);
    }
  }, [tasks, user]);

 useEffect(() => {
    if (user) fetchTasks();
  }, [user, page]);

  const handleEdit = (task) => {
    setOpen(!open);
    setEditTask(task);
  };

  const handleDelete = (id) => {
    setOpenDeleteModal(!openDeleteModal);
    setDeleteId(id);
  };

  const handleAssign = (taskId) => {
    setUserModal(!userModal);
    setSelectedTask(taskId);
  };

  const handleStatusChange = async (task, status) => {
    try {
      setLoading(true);
      const resp = await API.put(`/tasks/change-status/${task._id}`, {
        status,
      });
      //console.log(resp);
      toast.success("Status changes successfully");
      fetchTasks();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto mt-6">
      {open && (
        <TaskEditModal
          task={editTask}
          isOpen={open}
          setOpen={setOpen}
          fetchTasks={fetchTasks}
        />
      )}
      {openDeleteModal && (
        <DeleteConfirmationModal
          id={deleteId}
          open={openDeleteModal}
          setOpen={setOpenDeleteModal}
          fetchTasks={fetchTasks}
        />
      )}

      {userModal && (
        <UsersModal
          isOpen={userModal}
          setOpen={setUserModal}
          taskId={selectedTask}
          fetchTasks={fetchTasks}
        />
      )}
      {loading && <PageLoader />}

      <h1 className="text-3xl font-bold mb-6 text-center">Task List</h1>
      <div className="flex justify-center mb-4">
        <Link
          to="/tasks/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700"
        >
          Add Task
        </Link>
      </div>

      {/* Task List with Two Columns */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"> */}
      <div className="flex justify-around flex-wrap">
        {/* My Tasks Section */}
        <div className="lg:w-[45%] md:w-[45%]">
          <h2 className="text-2xl font-semibold mb-4 text-center">My Tasks</h2>
          {Array.isArray(myTasks) && myTasks.length > 0 ? (
            myTasks.map((task) => (
              <div
                key={task._id}
                className={`
                  ${task.priority === "High" ? "bg-red-300" : ""}
                  ${task.priority === "Medium" ? "bg-yellow-300" : ""}
                 ${task.priority === "Low" ? "bg-green-300" : ""}
                  shadow-md rounded-lg p-4 mb-4
                `}
              >
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {task.title}
                  </h2>
                  <p className="text-sm text-gray-600">
                    <strong>Due:</strong>{" "}
                    {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Priority:</strong> {task.priority}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Status:</strong> {task.status}
                  </p>
                </div>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task, e.target.value)}
                  className="border rounded mt-2 p-1"
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
                <div className="flex justify-between items-center mt-4">
                  <div>
                    <Link
                      to={`/task-details/${task._id}`}
                      className="text-white bg-green-600 px-3 py-1 rounded-lg hover:bg-green-700 text-sm"
                    >
                      View
                    </Link>
                  </div>

                  <button
                    onClick={() => handleAssign(task._id)}
                    className="text-white bg-yellow-500 px-3 py-1 ml-2 rounded-lg hover:bg-yellow-600 text-sm flex items-center"
                  >
                    <FaUserPlus className="mr-1" />
                    {task?.assignedTo
                      ? `Task assigned to ${task?.assignedTo?.name}`
                      : "Assign"}
                  </button>
                </div>

                <div className="flex justify-end mt-4 space-x-4">
                  <button
                    className="text-red-600 hover:text-red-800 flex items-center"
                    onClick={() => handleDelete(task._id)}
                  >
                    <FaTrash className="mr-1" />
                  </button>
                  <button
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                    onClick={() => handleEdit(task)}
                  >
                    <FaEdit className="mr-1" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No tasks available.</p>
          )}
        </div>
        <div class="w-[2px] h-auto bg-black"></div>

        {/* Assigned Tasks Section */}
        <div className="lg:w-[45%] md:w-[45%]">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Assigned Tasks
          </h2>
          {Array.isArray(assignedTasks) && assignedTasks.length > 0 ? (
            assignedTasks.map((task) => (
              <div
                key={task._id}
                className={`
        ${task.priority === "High" ? "bg-red-300" : ""}
        ${task.priority === "Medium" ? "bg-yellow-300" : ""}
        ${task.priority === "Low" ? "bg-green-300" : ""}
        shadow-md rounded-lg p-4 mb-4
      `}
              >
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {task.title}
                  </h2>
                  <p className="text-sm text-gray-600">
                    <strong>Due:</strong>{" "}
                    {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Priority:</strong> {task.priority}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Status:</strong> {task.status}{" "}
                  </p>
                </div>

                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task, e.target.value)}
                  className="border rounded mt-2 p-1"
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>

                <div className="flex justify-between items-center mt-4">
                  <div>
                    <Link
                      to={`/task-details/${task._id}`}
                      className="text-white bg-green-600 px-3 py-1 rounded-lg hover:bg-green-700 text-sm"
                    >
                      View
                    </Link>
                  </div>
                </div>

                <div className="flex justify-end mt-4 space-x-4">
                  <button
                    className="text-red-600 hover:text-red-800 flex items-center"
                    onClick={() => handleDelete(task._id)}
                  >
                    <FaTrash className="mr-1" />
                  </button>
                  {/* <button
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                    onClick={() => handleEdit(task)}
                  >
                    <FaEdit className="mr-1" />
                  </button> */}
                </div>
              </div>
            ))
          ) : (
            <p>No tasks assigned to you</p>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 mb-2">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className={`px-4 py-2 rounded-md shadow-md ${
            page === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Prev
        </button>
        <span className="mx-4 text-lg font-medium">{page} of {totalPages}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page===totalPages}
          className={`px-4 py-2 rounded-md shadow-md ${
            page===totalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}        >
          Next
        </button>
      </div>      
      </div>
  );
};

export default TaskList;
