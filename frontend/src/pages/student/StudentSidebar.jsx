import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axiosInstance from "../../components/Axios";

const StudentSidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post("/api/student/logout");
      if (response.status === 200) {
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white text-gray-900 shadow-lg transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 transition-transform duration-300 z-50 flex flex-col border-r border-gray-200`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300">
        <h2 className="text-xl font-bold">Student Panel</h2>
        <button className="md:hidden text-gray-600 hover:text-gray-800" onClick={toggleSidebar}>
          ✖
        </button>
      </div>

      {/* Sidebar Navigation */}
      <nav className="mt-4 flex flex-col flex-grow">
        <SidebarLink to="/student/dashboard" label="Dashboard" />
        <SidebarLink to="/student/my-books" label="My Books" />
        <SidebarLink to="/student/book-history" label="Book History" />
        <SidebarLink to="/student/profile" label="Profile" />
      </nav>
      
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="m-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
};

// Reusable Sidebar Link Component
const SidebarLink = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `block px-6 py-3 text-gray-800 hover:bg-gray-200 transition ${
        isActive ? "bg-gray-300 font-bold" : ""
      }`
    }
  >
    {label}
  </NavLink>
);

export default StudentSidebar;