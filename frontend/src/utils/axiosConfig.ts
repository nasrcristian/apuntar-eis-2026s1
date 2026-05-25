import axios from "axios";

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt"); // o donde guardes el token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axios;
