import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../components/Axios";
import { useAuth } from "../../components/AuthContext";
import Navbar from '../../components/Navbar'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [userType, setUserType] = useState("student");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axiosInstance.post(
        `/api/auth/${userType}/login`,
        userType === "student"
          ? { fileNo: identifier, password }
          : { email: identifier, password }
      );

      setLoading(false);

      if (data.success) {
        login(data.token, data.type);
        toast.success("Login Successful! Redirecting...", {
          position: "top-center",
        });
        setTimeout(() => navigate(`/${data.type}/dashboard`), 1200);
      } else {
        toast.error(data.message, { position: "top-center" });
      }
    } catch (error) {
      setLoading(false);
      toast.error(
        error.response?.data?.message || "Login failed. Please try again.",
        {
          position: "top-center",
        }
      );
    }
  };

  return (
    <>
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 to-indigo-800 p-6">
      <ToastContainer autoClose={2000} />
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Welcome Back! 👋
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Enter your credentials to access your dashboard.
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium">Login As</label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="librarian">Librarian</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">
              {userType === "student" ? "File Number" : "Email"}
            </label>
            <input
              type={userType === "student" ? "text" : "email"}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder={`Enter your ${
                userType === "student" ? "file number" : "email"
              }`}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          <div>
            <div className="relative">
              <label className="block text-gray-700 font-medium">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition pr-10"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 p-2 cursor-pointer text-gray-500 hover:text-gray-900"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium shadow-md hover:bg-indigo-700 transition flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-spin border-2 border-white border-l-transparent w-5 h-5 rounded-full"></span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="mt-5 text-center text-gray-600">
  <p className="mt-1.7">
    <a
      href="/forgot-password"
      className="text-gray-500 hover:text-indigo-500"
    >
      Forgot Password?
    </a>
  </p>
  <p className="mt-4">
    <a
      href="/"
      className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition"
    >
      ⬅ Back to Home
    </a>
  </p>
</div>

      </div>
    </div>
    </>
  );
};

export default Login;
