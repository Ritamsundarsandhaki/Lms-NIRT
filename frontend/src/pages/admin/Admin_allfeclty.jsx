import React, { useEffect, useState } from "react";
import axiosInstance from "../../components/Axios";
import { Loader, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

const AdminAllFaculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await axiosInstance.get("/api/admin/facultys");
        if (response.data.success) {
          setFaculty(response.data.faculty);
        } else {
          throw new Error("Failed to fetch faculty members");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong!");
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 shadow-lg p-8 rounded-2xl border border-gray-300 dark:border-gray-700">
      <h2 className="text-3xl font-extrabold text-center text-indigo-700 dark:text-indigo-400">👨‍🏫 Faculty List</h2>

      {/* Error Handling */}
      {error && (
        <div className="flex items-center text-red-700 bg-red-200 border border-red-400 p-3 rounded-lg mt-4">
          <AlertTriangle size={20} className="mr-2" />
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center mt-5">
          <Loader size={40} className="animate-spin text-indigo-600" />
        </div>
      ) : (
        <div className="overflow-x-auto mt-5">
          <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="p-3">#</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Employee ID</th>
                <th className="p-3">Department</th>
                <th className="p-3">Mobile</th>
                <th className="p-3">Issued Books</th>
              </tr>
            </thead>
            <tbody>
              {faculty.length > 0 ? (
                faculty.map((member, index) => (
                  <tr key={member._id} className="border-b border-gray-300 dark:border-gray-700 text-center">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{member.name}</td>
                    <td className="p-3">{member.email}</td>
                    <td className="p-3">{member.employeeId}</td>
                    <td className="p-3">{member.department}</td>
                    <td className="p-3">{member.mobile}</td>
                    <td className="p-3">
                      {member.issuedBooks.length > 0 ? (
                        <ul className="text-left">
                          {member.issuedBooks.map((book) => (
                            <li key={book._id} className="flex items-center space-x-2">
                              <span className="font-semibold">{book.bookId}</span>
                              {book.returned ? (
                                <CheckCircle size={16} className="text-green-500" />
                              ) : (
                                <XCircle size={16} className="text-red-500" />
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-500">No books issued</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-5 text-center text-gray-500 dark:text-gray-400">
                    No faculty members found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminAllFaculty;
