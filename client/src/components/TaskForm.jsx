import React, { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const TaskForm = () => {
  const [form, setForm] = useState({ title: "", description: "", dueDate: "", priority: "Medium" });
  const [loading,setLoading]=useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!form.title || !form.description || !form.dueDate || !form.priority){
      toast.error("Please all the fields");
      return;
    }
    try {
      setLoading(true);
      const resp=await API.post("/tasks", form);
      if(resp){
        toast.success("Task created successfully");
        navigate("/");
      }
    } catch (error) {
      toast.error("Error occured while creating task");
    } 
    finally{
      setLoading(false);
    }  
  };

  return (
    <div className="container mx-auto mt-10">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 shadow">
        <h2 className="text-2xl font-bold mb-4">Add Task</h2>
        <input
          className="w-full mb-3 p-2 border"
          placeholder="Title"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          className="w-full mb-3 p-2 border"
          placeholder="Description"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          className="w-full mb-3 p-2 border"
          type="date"
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
        />
        <select
          className="w-full mb-3 p-2 border"
          onChange={(e) => setForm({ ...form, priority: e.target.value })}
        >
          <option value="High">High</option>
          <option value="Medium" selected>Medium</option>
          <option value="Low">Low</option>
        </select>
        <button className="w-full bg-blue-600 text-white p-2">{loading ? "Adding..." : "Add Task"}</button>
      </form>
    </div>
  );
};

export default TaskForm;
