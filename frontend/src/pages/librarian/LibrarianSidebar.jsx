import React from "react";
import { Link, useLocation, useNavigate,NavLink } from "react-router-dom";
import api from "../../components/Axios"; // Import Axios instance
import {
  BookOpen,
  UserPlus,
  ClipboardList,
  RotateCcw,
  Search,
  User,
  LogOut,
  Upload,
  BookUp,
  Menu
} from "lucide-react";

const LibrarianSidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate(); // For redirecting after logout

  const handleLogout = async () => {
    try {
      await api.post("/api/librarian/logout"); // Call logout API
      localStorage.removeItem("token"); // Clear token from storage
      navigate("/"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className={`
      fixed top-0 left-0 h-full bg-white shadow-lg border-r border-gray-200 transform
      ${isOpen ? "translate-x-0 w-64" : "-translate-x-full w-16"} 
      md:translate-x-0 md:w-64 transition-transform z-50 flex flex-col`
    }>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-300 bg-gradient-to-r from-indigo-100 to-indigo-200">
        <h1 className={`text-xl font-semibold text-gray-900 tracking-wide transition-opacity 
          ${isOpen ? "opacity-100" : "opacity-0 hidden md:opacity-100 md:block"}`}>
            <NavLink to='/librarian/dashboard'>
            📚 Librarian
            </NavLink>
        </h1>
        <button className="md:hidden text-gray-600 hover:text-gray-900" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar Links */}
      <nav className="p-4 space-y-3 flex-1 overflow-y-auto">
        <SidebarLink to="/librarian/register-book" label="Register Book" icon={<BookOpen size={22} />} isOpen={isOpen} location={location} />
        <SidebarLink to="/librarian/register-student" label="Register Student" icon={<UserPlus size={22} />} isOpen={isOpen} location={location} />
        <SidebarLink to="/librarian/issubook" label="Issue Book" icon={<ClipboardList size={22} />} isOpen={isOpen} location={location} />
        <SidebarLink to="/librarian/returnbook" label="Return Book" icon={<RotateCcw size={22} />} isOpen={isOpen} location={location} />
        <SidebarLink to="/librarian/searchbook" label="Search Book" icon={<Search size={22} />} isOpen={isOpen} location={location} />
        <SidebarLink to="/librarian/search-student" label="Search Student" icon={<Search size={22} />} isOpen={isOpen} location={location} />
        <SidebarLink to="/librarian/profile" label="Profile" icon={<User size={22} />} isOpen={isOpen} location={location} />
        <SidebarLink to="/librarian/allstudent" label="All Student" icon={<User size={22} />} isOpen={isOpen} location={location} />
        <SidebarLink to="/librarian/books_uplodes" label="Upload Books" icon={<BookUp size={22} />} isOpen={isOpen} location={location} />
        <SidebarLink to="/librarian/student_uplodes" label="Upload Student" icon={<Upload size={22} />} isOpen={isOpen} location={location} />

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center w-full px-5 py-3 text-red-500 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all duration-300 shadow-md"
        >
          <LogOut size={22} className="mr-3" />
          <span className={`transition-opacity ${isOpen ? "opacity-100" : "opacity-0 hidden md:opacity-100 md:block"}`}>
            Logout
          </span>
        </button>
      </nav>
    </div>
  );
};

const SidebarLink = ({ to, label, icon, location, isOpen }) => {
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center px-5 py-3 rounded-lg transition-all duration-300 shadow-sm 
        ${isActive ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600"}`}
    >
      {icon}
      <span className={`ml-4 text-lg font-medium transition-opacity 
        ${isOpen ? "opacity-100" : "opacity-0 hidden md:opacity-100 md:block"}`}>
        {label}
      </span>
    </Link>
  );
};

export default LibrarianSidebar;
