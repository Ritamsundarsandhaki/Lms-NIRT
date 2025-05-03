import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../components/Axios';

function AllStaff() {
  const [facultyList, setFacultyList] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    employeeId: '',
    department: '',
    mobile: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchFacultyData = async () => {
    try {
      setLoading(true);
      const { name, email, employeeId, department, mobile } = filters;
      const { page, limit } = pagination;

      const res = await axios.get('api/librarian/faculty-details', {
        params: { name, email, employeeId, department, mobile, page, limit },
      });

      setFacultyList(res.data.facultyList);
      setPagination(prev => ({
        ...prev,
        totalPages: res.data.pagination.totalPages,
      }));

    } catch (error) {
      console.error('Error fetching faculty data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacultyData();
    // eslint-disable-next-line
  }, [pagination.page, filters]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 on filter change
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <h1 className="text-4xl font-bold mb-10 text-center text-blue-700">Faculty Management</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {['name', 'email', 'employeeId', 'department', 'mobile'].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={`Search by ${field.charAt(0).toUpperCase() + field.slice(1)}`}
            value={filters[field]}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded-lg p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
          <table className="min-w-full text-gray-700">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-6 text-left">#</th>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Employee ID</th>
                <th className="py-3 px-6 text-left">Department</th>
                <th className="py-3 px-6 text-left">Mobile</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {facultyList.length > 0 ? (
                facultyList.map((faculty, index) => (
                  <tr key={faculty._id} className="hover:bg-gray-100 border-b transition duration-300">
                    <td className="py-4 px-6">{index + 1 + (pagination.page - 1) * pagination.limit}</td>
                    <td className="py-4 px-6">{faculty.name}</td>
                    <td className="py-4 px-6">{faculty.email}</td>
                    <td className="py-4 px-6">{faculty.employeeId}</td>
                    <td className="py-4 px-6">{faculty.department}</td>
                    <td className="py-4 px-6">{faculty.mobile}</td>
                    <td className="py-4 px-6 text-center">
                      <Link 
                        to={`/librarian/all-faculty/${faculty._id}`}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm transition"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-400">
                    No faculty found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center mt-10 gap-8">
        <button
          disabled={pagination.page <= 1}
          onClick={() => handlePageChange(pagination.page - 1)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Previous
        </button>

        <span className="font-medium text-gray-700">
          Page {pagination.page} of {pagination.totalPages}
        </span>

        <button
          disabled={pagination.page >= pagination.totalPages}
          onClick={() => handlePageChange(pagination.page + 1)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AllStaff;
