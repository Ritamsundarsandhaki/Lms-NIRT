import React, { useState } from "react";
import axiosInstance from "../../components/Axios";
import { useNavigate } from "react-router-dom";
import { Loader, CheckCircle, AlertTriangle } from "lucide-react";

const LibrarianRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    libraryName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axiosInstance.post("/api/admin/register-librarian", formData);

      if (response.data.success) {
        setSuccess("Librarian registered successfully!");
        setTimeout(() => navigate("/admin/all-librarians"), 2000);
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 shadow-lg p-8 rounded-2xl border border-gray-300 dark:border-gray-700">
      <h2 className="text-3xl font-extrabold text-center text-indigo-700 dark:text-indigo-400">📚 Register Librarian</h2>
      <p className="text-center text-gray-600 dark:text-gray-400 mt-2">
        Fill in the details below to add a new librarian.
      </p>

      {/* Error & Success Messages */}
      {error && (
        <div className="flex items-center text-red-700 bg-red-200 border border-red-400 p-3 rounded-lg mt-4">
          <AlertTriangle size={20} className="mr-2" />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center text-green-700 bg-green-200 border border-green-400 p-3 rounded-lg mt-4">
          <CheckCircle size={20} className="mr-2" />
          {success}
        </div>
      )}

      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="text"
          name="mobile"
          placeholder="Mobile Number"
          value={formData.mobile}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="text"
          name="libraryName"
          placeholder="Library Name"
          value={formData.libraryName}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center p-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition"
        >
          {loading ? (
            <>
              <Loader size={20} className="animate-spin mr-2" /> Registering...
            </>
          ) : (
            "Register Librarian"
          )}
        </button>
      </form>
    </div>
  );
};

export default LibrarianRegister;
