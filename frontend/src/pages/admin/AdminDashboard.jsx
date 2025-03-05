import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../components/Axios";  // Ensure you are using Axios instance
import AdminSidebar from "./Adminsidebar";
import RegisterLibrarian from "./Register_libarian";
import AdminAllLibrarians from "./Admin_alllibarian";
import AdminAllStudents from "./Admin_allstudent";
import ServerHealth from "./Server_helth";
import Admin_registerFeclty from "./Admin_registerFeclty";
import AdminAllFaculty from "./Admin_allfeclty";

const AdminDashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [greeting, setGreeting] = useState("");
  const location = useLocation();
  const navigate = useNavigate(); // Use for redirection

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening");
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Handle 402 response globally
  useEffect(() => {
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response, 
      (error) => {
        if (error.response && error.response.status === 401) {
          navigate("/login"); // Redirect to home page
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  const isDashboard = location.pathname === "/admin/dashboard";

  return (
    <div className={`flex min-h-screen transition-all duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      
      {/* Sidebar Toggle for Mobile */}
      <button
        className="md:hidden fixed top-4 left-4 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition z-50"
        onClick={() => setSidebarOpen(true)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />
      {isSidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-40 md:hidden" onClick={() => setSidebarOpen(false)}></div>}

      {/* Main Content */}
      <div className="flex-1 px-8 py-6 md:ml-64 transition-all duration-300">
        
        {/* Dashboard Overview */}
        {isDashboard && (
          <>
            <div className="mb-6 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-2xl flex flex-col items-center">
              <h1 className="text-3xl font-bold">{greeting}, Admin! 👋</h1>
              <p className="text-lg mt-2 text-gray-600 dark:text-gray-300">Manage your library system efficiently.</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              <QuickActionCard title="Register Librarian" link="register-librarian" color="bg-purple-600" />
              <QuickActionCard title="View All Librarians" link="all-librarians" color="bg-blue-500" />
              <QuickActionCard title="View All Students" link="all-students" color="bg-green-500" />
              <QuickActionCard title="Check Server Health" link="server-health" color="bg-red-500" />
            </div>
          </>
        )}

        {/* Dark Mode Toggle */}
        <div className="flex justify-end mb-6">
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition">
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        {/* Routes for Pages */}
        {!isDashboard && (
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6">
            <Routes>
              <Route path="register-librarian" element={<RegisterLibrarian />} />
              <Route path="register-faculty" element={<Admin_registerFeclty  />} />
              <Route path="all-librarians" element={<AdminAllLibrarians />} />
              <Route path="all-students" element={<AdminAllStudents />} />
              <Route path="all-faculty" element={<AdminAllFaculty />} />
              <Route path="server-health" element={<ServerHealth />} />
            </Routes>
          </div>
        )}
      </div>
    </div>
  );
};

// 📌 **Quick Action Card Component**
const QuickActionCard = ({ title, link, color }) => (
  <Link to={link} className={`p-5 rounded-xl shadow-md text-white text-center text-lg font-medium hover:scale-105 transition transform duration-200 ${color}`}>
    {title}
  </Link>
);

export default AdminDashboard;
