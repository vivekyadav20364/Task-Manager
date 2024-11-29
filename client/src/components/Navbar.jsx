import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../context/UserContext";

const Navbar = () => {
  const navigate = useNavigate();
  const {user,setUser}=useContext(userContext);
  const logout = () => {
    localStorage.removeItem("TaskUser");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 p-4 flex justify-between">
      <h1 className="text-white font-bold">Task Manager</h1>
      <div>
        <Link className="text-white mr-4" to="/">Tasks</Link>
        {user ? <button className="text-white">{user?.name}</button> :  <button className="text-white" onClick={()=>navigate("/login")}>Login</button>}
        {user && <button className="text-white ml-2" onClick={logout}>Logout</button> }
      </div>
    </nav>
  );
};

export default Navbar;
