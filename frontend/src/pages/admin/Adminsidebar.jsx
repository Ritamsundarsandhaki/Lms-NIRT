import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Users, UserPlus, ClipboardList, Server, LogOut } from "lucide-react";
import axiosInstance from "../../components/Axios";

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation(); // Get current route
  const navigate = useNavigate(); // For navigation

  // Logout function
  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/admin/logout");
      localStorage.removeItem("adminToken"); // Clear stored token if any
      navigate("/"); // Redirect to home page
    } catch (error) {
      console.error("Logout failed:", error.response?.data?.message || "Server error");
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 shadow-lg border-r border-gray-200 dark:border-gray-700 transform 
        ${isOpen ? "translate-x-0" : "-translate-x-72"} 
        transition-transform md:translate-x-0 md:w-64 z-50`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-300 dark:border-gray-700 bg-gradient-to-r from-indigo-100 to-indigo-200 dark:from-gray-800 dark:to-gray-700">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-wide">🛠️ Admin Panel</h1>
        <button className="md:hidden text-gray-600 dark:text-white hover:text-gray-900 dark:hover:text-gray-400" onClick={toggleSidebar}>
          ✕
        </button>
      </div>

      {/* Sidebar Links */}
      <nav className="p-4 space-y-3">
        <SidebarLink to="/admin/register-librarian" label="Register Librarian" icon={<UserPlus size={22} />} location={location} />
        <SidebarLink to="/admin/all-faculty" label="All Faculty" icon={<UserPlus size={22} />} location={location} />
        <SidebarLink to="/admin/all-librarians" label="All Librarians" icon={<Users size={22} />} location={location} />
        <SidebarLink to="/admin/register-faculty" label="Register Faculty" icon={<UserPlus size={22} />} location={location} />
        <SidebarLink to="/admin/all-students" label="All Students" icon={<ClipboardList size={22} />} location={location} />
        <SidebarLink to="/admin/server-health" label="Server Health" icon={<Server size={22} />} location={location} />

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-8 flex items-center w-full px-5 py-3 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-800 rounded-lg transition-all duration-300 shadow-md"
        >
          <LogOut size={22} className="mr-3" />
          Logout
        </button>
      </nav>
    </div>
  );
};

// Sidebar Link Component with Active Highlighting
const SidebarLink = ({ to, label, icon, location }) => {
  const isActive = location.pathname === to; // Check if current route is active
  return (
    <Link
      to={to}
      className={`flex items-center px-5 py-3 rounded-lg transition-all duration-300 shadow-sm 
        ${isActive ? "bg-indigo-500 text-white dark:bg-indigo-600" 
                   : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-700 hover:text-indigo-600 dark:hover:text-white"}`}
    >
      {icon}
      <span className="ml-4 text-lg font-medium">{label}</span>
    </Link>
  );
};

export default AdminSidebar;
