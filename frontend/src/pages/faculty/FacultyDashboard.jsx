import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Link } from "react-router-dom";
import { Menu } from "lucide-react";
import axiosInstance from "../../components/Axios";
import FacultySidebar from "./Faculty_Sidebar";
import FacultyMyBook from "./Facuty_Mybook";
import FacultyBookHistory from "./Faculty_Book_Histroy";
import Profile from "./Faculty_Profile";

const FacultyDashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [facultyData, setFacultyData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const response = await axiosInstance.get("/api/faculty/profile");
        if (response.data.success) {
          setFacultyData(response.data.faculty);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("authToken");
          navigate("/");
        } else {
          console.error("Error fetching faculty data:", error);
        }
      }
    };
    fetchFacultyData();
  }, [navigate]);

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening");
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/faculty/logout");
      localStorage.removeItem("authToken");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 text-gray-900">
      <button
        className="md:hidden fixed top-4 left-4 px-3 py-2 bg-blue-600 text-white rounded-md shadow-md text-sm flex items-center gap-2"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={20} /> Menu
      </button>

      <FacultySidebar isOpen={isSidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black opacity-50 z-40 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      <div className="flex-1 px-4 sm:px-6 py-6 md:ml-64 transition-all duration-300">
        <div className="mb-6 p-4 sm:p-6 bg-gradient-to-r from-blue-100 to-purple-200 shadow-md rounded-lg text-center flex flex-col items-center">
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
            {greeting}, {facultyData ? facultyData.name : "Faculty"}!
          </h1>
          <p className="text-sm sm:text-md text-gray-700 mt-2">Welcome back! Manage your dashboard.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <DashboardCard title="Books Issued" value={facultyData ? facultyData.issuedBooks.filter(book => !book.returned).length : 0} color="from-green-400 to-green-600" />
          <DashboardCard title="Department" value={facultyData ? facultyData.department : "-"} color="from-yellow-400 to-yellow-600" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <QuickActionCard title="View My Books" link="/faculty/my-books" color="from-purple-500 to-purple-700" />
          <QuickActionCard title="Check Book History" link="/faculty/book-history" color="from-orange-500 to-orange-700" />
        </div>

        <div className="flex justify-center md:justify-end mb-6">
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-md bg-red-600 text-white text-sm hover:bg-red-500 transition-all shadow-md"
          >
            Logout
          </button>
        </div>

        <div className="bg-white shadow-md rounded-md p-4 sm:p-6">
          <Routes>
            <Route path="/my-books" element={<FacultyMyBook />} />
            <Route path="/book-history" element={<FacultyBookHistory />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, value, color }) => (
  <div className={`w-full p-4 sm:p-6 rounded-lg shadow-lg text-white text-center text-md bg-gradient-to-br ${color} hover:scale-105 transition-all duration-200`}>
    <p className="font-medium text-sm sm:text-base">{title}</p>
    <p className="text-lg sm:text-2xl font-bold mt-2">{value}</p>
  </div>
);

const QuickActionCard = ({ title, link, color }) => (
  <Link
    to={link}
    className={`p-3 sm:p-4 rounded-md shadow-md text-white text-center text-xs sm:text-sm font-medium bg-gradient-to-br ${color} hover:scale-105 transition-all duration-200`}
  >
    {title}
  </Link>
);

export default FacultyDashboard;
