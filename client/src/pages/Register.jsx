import React, { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [form, setForm] = useState({ name: "",email:"", password: "" });
  const [loading,setLoading]=useState(false);

  const navigate=useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const resp=await API.post("/auth/register", form);
      toast.success("User registered successfully!");
      //console.log(resp);
      setForm("");
    } catch (error) {
      toast.error("Registration failed!");
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 shadow">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <input
          className="w-full mb-3 p-2 border"
          type="text"
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="w-full mb-3 p-2 border"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="w-full mb-3 p-2 border"
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="w-full bg-blue-600 text-white p-2">{loading ?"Registering...":"Register"}</button>
        <p className="mt-2">Already registered? <span className="cursor-pointer" onClick={()=>navigate("/login")}>Login</span> </p> 
      </form>
    </div>
  );
};

export default Register;
