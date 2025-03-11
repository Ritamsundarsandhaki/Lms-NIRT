import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, ClipboardList, User, LogOut, Menu } from "lucide-react";
import axiosInstance from "../../components/Axios";

const FacultySidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();

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
    <div
      className={`fixed inset-y-0 left-0 z-50 bg-gray-100 text-gray-900 shadow-lg transform ${isOpen ? "translate-x-0 w-64" : "-translate-x-full w-16"} md:translate-x-0 md:w-64 transition-transform flex flex-col`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-300 bg-gradient-to-r from-gray-200 to-gray-100">
        <h1 className={`text-lg font-bold tracking-wide transition-opacity ${isOpen ? "opacity-100" : "opacity-0 hidden md:opacity-100 md:block"}`}>
          Faculty Dashboard
        </h1>
        <button className="md:hidden text-gray-900" onClick={toggleSidebar} aria-label="Toggle Sidebar">
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar Links */}
      <nav className="p-4 space-y-3 flex-1 overflow-y-auto">
        <SidebarLink to="/faculty/my-books" label="My Books" icon={<BookOpen size={22} />} location={location} />
        <SidebarLink to="/faculty/book-history" label="Book History" icon={<ClipboardList size={22} />} location={location} />
        <SidebarLink to="/faculty/profile" label="Profile" icon={<User size={22} />} location={location} />
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-auto flex items-center w-full px-5 py-3 text-red-600 hover:text-red-700 hover:bg-red-200 rounded-lg transition-all duration-300 shadow-md"
      >
        <LogOut size={22} className="mr-3" />
        <span className={`transition-opacity ${isOpen ? "opacity-100" : "opacity-0 hidden md:opacity-100 md:block"}`}>
          Logout
        </span>
      </button>
    </div>
  );
};

const SidebarLink = ({ to, label, icon, location }) => {
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center px-5 py-3 rounded-lg transition-all duration-300 shadow-sm ${isActive ? "bg-gray-300 text-gray-900" : "bg-white text-gray-700 hover:bg-gray-200 hover:text-gray-900"}`}
      aria-current={isActive ? "page" : undefined}
    >
      {icon}
      <span className="ml-4 text-lg font-medium">{label}</span>
    </Link>
  );
};

export default FacultySidebar;
