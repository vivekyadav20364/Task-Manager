import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach token to headers
API.interceptors.request.use((req) => {
  const TaskUser = JSON.parse(localStorage.getItem("TaskUser"));
  const token=TaskUser?.token;
  if (TaskUser) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
