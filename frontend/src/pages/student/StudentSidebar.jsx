import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axiosInstance from "../../components/Axios";
import { useAuth } from "../../components/AuthContext";
import {
  FaTachometerAlt,
  FaBook,
  FaHistory,
  FaUser,
  FaLock,
  FaSignOutAlt,
} from "react-icons/fa";

const StudentSidebar = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post("/api/auth/logout");
      if (response.status === 200) {
        logout();
        navigate("/login");
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
        <h2 className="text-xl font-bold">🎓 Student Panel</h2>
        <button className="md:hidden text-gray-600 hover:text-gray-800" onClick={toggleSidebar}>
          ✖
        </button>
      </div>

      {/* Sidebar Navigation */}
      <nav className="mt-4 flex flex-col flex-grow space-y-1">
        <SidebarLink to="/student/dashboard" label="Dashboard" icon={<FaTachometerAlt />} />
        <SidebarLink to="/student/my-books" label="My Books" icon={<FaBook />} />
        <SidebarLink to="/student/book-history" label="Book History" icon={<FaHistory />} />
        <SidebarLink to="/student/profile" label="Profile" icon={<FaUser />} />
        <SidebarLink to="/student/changePassword" label="Change Password" icon={<FaLock />} />
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="m-6 px-4 py-2 flex items-center justify-center gap-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
};

// Reusable Sidebar Link Component with Icon
const SidebarLink = ({ to, label, icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-6 py-3 text-gray-800 hover:bg-gray-200 transition ${
        isActive ? "bg-gray-300 font-semibold" : ""
      }`
    }
  >
    <span className="text-lg">{icon}</span>
    <span>{label}</span>
  </NavLink>
);

export default StudentSidebar;
