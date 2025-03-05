import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../components/Axios";
import LibrarianSidebar from "./LibrarianSidebar";
import RegisterBook from "./RegisterBook";
import RegisterStudent from "./RegisterStudent";
import IssueBook from "./IssueBook";
import ReturnBook from "./ReturnBook";
import SearchBook from "./SearchBook";
import SearchStudent from "./SearchStudent";
import Profile from "./Profile";
import Libraian_Allstudent from "./Libraian_Allstudent";
import Libraian_uplode_book from "./Libraian_uplode_book";
import Libraian_uplode_student from "./Libraian_uplode_student";

const LibrarianDashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [dashboardData, setDashboardData] = useState({
    totalBooks: 0,
    totalStudents: 0,
    issuedBooks: 0,
    availableBooks: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate(); // Hook to navigate pages

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening");
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get("/api/librarian/dashboardData");
        if (response.data.success) {
          setDashboardData(response.data.data);
        } else {
          throw new Error("Failed to fetch dashboard data");
        }
      } catch (err) {
        if (err.response && (err.response.status === 401 || err.response.status === 402)) {
          console.error("Session expired or unauthorized access. Redirecting to login...");
          navigate("/login"); // Redirect to login page
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [navigate]);

  const isDashboard = location.pathname === "/librarian/dashboard";

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 transition-all duration-300">
      <button
        className="md:hidden fixed top-4 left-4 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition z-50"
        onClick={() => setSidebarOpen(true)}
      >
        ☰
      </button>
      <LibrarianSidebar isOpen={isSidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />
      {isSidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-40 md:hidden" onClick={() => setSidebarOpen(false)}></div>}
      <div className="flex-1 px-8 py-6 md:ml-64 transition-all duration-300">
        {isDashboard && (
          <>
            <div className="mb-6 p-6 bg-white shadow-lg rounded-2xl flex flex-col items-center">
              <h1 className="text-3xl font-bold">{greeting}, Librarian!</h1>
              <p className="text-lg mt-2 text-gray-600">Manage your library efficiently.</p>
            </div>
            {loading ? (
              <p className="text-center text-lg">Loading dashboard data...</p>
            ) : error ? (
              <p className="text-center text-red-500">Error: {error}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                <DashboardCard title="Total Books" value={dashboardData.totalBooks} color="bg-gradient-to-r from-green-400 to-green-600" />
                <DashboardCard title="Students Registered" value={dashboardData.totalStudents} color="bg-gradient-to-r from-blue-400 to-blue-600" />
                <DashboardCard title="Books Issued" value={dashboardData.issuedBooks} color="bg-gradient-to-r from-yellow-400 to-yellow-600" />
                <DashboardCard title="Available Books" value={dashboardData.availableBooks} color="bg-gradient-to-r from-purple-400 to-purple-600" />
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              <QuickActionCard title="Register Book" link="/librarian/register-book" color="bg-purple-600" />
              <QuickActionCard title="Register Student" link="/librarian/register-student" color="bg-orange-500" />
              <QuickActionCard title="Issue Book" link="/librarian/issubook" color="bg-blue-700" />
              <QuickActionCard title="Return Book" link="/librarian/returnbook" color="bg-red-500" />
              <QuickActionCard title="Search Book" link="/librarian/searchbook" color="bg-teal-600" />
              <QuickActionCard title="Search Student" link="/librarian/search-student" color="bg-indigo-600" />
              <QuickActionCard title="Edit Profile" link="/librarian/profile" color="bg-gray-700" />
            </div>
          </>
        )}
        {!isDashboard && (
          <div className="bg-white shadow-lg rounded-2xl p-6">
            <Routes>
              <Route path="/register-book" element={<RegisterBook />} />
              <Route path="/register-student" element={<RegisterStudent />} />
              <Route path="/issubook" element={<IssueBook />} />
              <Route path="/returnbook" element={<ReturnBook />} />
              <Route path="/searchbook" element={<SearchBook />} />
              <Route path="/search-student" element={<SearchStudent />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/allstudent" element={<Libraian_Allstudent />} />
              <Route path="/books_uplodes" element={<Libraian_uplode_book />} />
              <Route path="/student_uplodes" element={<Libraian_uplode_student />} />
            </Routes>
          </div>
        )}
      </div>
    </div>
  );
};

const DashboardCard = ({ title, value, color }) => (
  <div className={`p-6 rounded-xl shadow-lg text-white flex flex-col items-center ${color} bg-opacity-80 backdrop-blur-md`}>
    <p className="text-lg font-medium">{title}</p>
    <p className="text-3xl font-bold mt-1">{value}</p>
  </div>
);

const QuickActionCard = ({ title, link, color }) => (
  <Link to={link} className={`p-5 rounded-xl shadow-md text-white text-center text-lg font-medium hover:scale-105 transition transform duration-200 ${color}`}>
    {title}
  </Link>
);

export default LibrarianDashboard;
