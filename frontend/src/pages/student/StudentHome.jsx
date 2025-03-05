import React, { useState, useEffect } from "react";
import axiosInstance from "../../components/Axios";
import { useNavigate } from "react-router-dom";

const StudentHome = () => {
  const [studentData, setStudentData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axiosInstance.get("/api/student/profile");
        if (response.data.success) {
          setStudentData(response.data.student);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error("Payment required or session expired. Redirecting to login...");
          navigate("/login"); // Redirect to login page
        } else {
          console.error("Error fetching student data:", error);
        }
      }
    };
    fetchStudentData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/student/logout");
      localStorage.removeItem("authToken");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const totalBooks = studentData?.issuedBooks.length || 0;
  const activeRentals = studentData?.issuedBooks.filter(book => !book.returned).length || 0;
  const course = studentData?.department || "N/A"; // Show department instead of membership

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold">Welcome, {studentData?.name || "Student"}!</h1>
        <p className="text-lg text-gray-200 mt-2">Here is your dashboard overview.</p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition">
          <p className="text-2xl font-semibold text-blue-600">{totalBooks}</p>
          <p className="text-gray-600">Books Borrowed</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition">
          <p className="text-2xl font-semibold text-green-600">{activeRentals}</p>
          <p className="text-gray-600">Active Rentals</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition">
          <p className="text-2xl font-semibold text-purple-600">{course}</p>
          <p className="text-gray-600">Course</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-blue-500 text-white p-4 rounded-md text-center hover:bg-blue-600 transition">
            View My Books
          </button>
          <button className="bg-green-500 text-white p-4 rounded-md text-center hover:bg-green-600 transition">
            Update Profile
          </button>
          <button onClick={handleLogout} className="bg-red-500 text-white p-4 rounded-md text-center hover:bg-red-600 transition">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;
