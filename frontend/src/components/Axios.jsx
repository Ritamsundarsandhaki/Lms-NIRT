import axios from "axios";

const API_BASE_URL = 'http://localhost:1407'; // ✅ No dotenv.config()

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
    withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
