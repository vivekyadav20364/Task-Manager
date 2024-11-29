import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { toast } from "react-toastify";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading,setLoading]=useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await API.post("/auth/login", form);

      if(data?.message==="Invalid Email or Password" || data?.message==="user not found"){
        toast.error("Invalid Email or Password");
        return;
      }
      localStorage.setItem("TaskUser", JSON.stringify(data));
      if(data) navigate("/");
     // console.log(data);
    } catch (error) {
      toast.error("Login failed!");
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 shadow">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
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
        <button className="w-full bg-blue-600 text-white p-2">{loading?"Logging in...":"Login"}</button>
        <p className="mt-2">New here? <span className="cursor-pointer" onClick={()=>navigate("/register")}>Register</span> </p> 
      </form>
    </div>
  );
};

export default Login;
