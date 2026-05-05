import axios from "axios";

const axiosApi = axios.create({
  baseURL: import.meta.env.DEV
    ? "http://localhost:5000/api"
    : "https://drivana.onrender.com/api",
});

export default axiosApi;
