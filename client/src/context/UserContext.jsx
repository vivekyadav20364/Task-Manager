import React, { createContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

export const userContext=createContext();
const UserContext = ({children}) => {
const navigate=useNavigate();
  const [user,setUser]=useState(null);
  const location = useLocation();

  useEffect(() => {
    const TaskUser = JSON.parse(localStorage.getItem("TaskUser"));

    if (TaskUser) {
      setUser(TaskUser);
    } else {
      // Check if the current route is not login or register
      if (location.pathname !== "/login" && location.pathname !== "/register") {
        navigate("/login");
      }
    }
  }, [location.pathname, navigate]);

  return (
    <userContext.Provider value={{user,setUser}}>
        {children}
    </userContext.Provider>
  )
}

export default UserContext;
