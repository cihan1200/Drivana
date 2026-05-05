import axios from "axios";

const axiosApi = axios.create({
  baseURL: import.meta.env.DEV
    ? "http://localhost:5000"
    : "https://drivana.onrender.com",
});

export default axiosApi;
