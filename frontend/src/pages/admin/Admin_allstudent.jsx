import React, { useEffect, useState } from "react";
import axiosInstance from "../../components/Axios";
import { Loader, XCircle, BookOpen, CheckCircle, X, Search } from "lucide-react";

const AdminAllStudents = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axiosInstance.get("/api/admin/students");
        setStudents(response.data.students);
        setFilteredStudents(response.data.students);
      } catch (err) {
        setError("Failed to load students. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const filtered = students.filter((student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.fileNo.toString().includes(searchQuery) ||
      student.branch.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchQuery, students]);

  return (
    <div className="max-w-7xl mx-auto mt-10 p-8 bg-white dark:bg-gray-900 shadow-lg rounded-xl border border-gray-300 dark:border-gray-700">
      <h2 className="text-4xl font-bold text-center text-indigo-700 dark:text-indigo-400 mb-6">
        🎓 All Students
      </h2>

      <div className="flex justify-end mb-6">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search by Name, File No, Branch..."
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={20} className="absolute right-3 top-3 text-gray-500 dark:text-gray-400" />
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center my-5">
          <Loader size={32} className="animate-spin text-indigo-600" />
        </div>
      )}

      {error && (
        <div className="flex items-center text-red-600 bg-red-200 border border-red-400 p-4 rounded-lg mb-4">
          <XCircle size={24} className="mr-3" />
          {error}
        </div>
      )}

      {!loading && !error && filteredStudents.length === 0 && (
        <p className="text-center text-gray-600 dark:text-gray-400 my-5 text-lg">
          No students found.
        </p>
      )}

      {!loading && filteredStudents.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 text-left shadow-sm rounded-lg">
            <thead>
              <tr className="bg-indigo-600 text-white text-lg">
                <th className="p-4 border">Profile</th>
                <th className="p-4 border">Name</th>
                <th className="p-4 border">Email</th>
                <th className="p-4 border">File No</th>
                <th className="p-4 border">Mobile</th>
                <th className="p-4 border">Department</th>
                <th className="p-4 border">Branch</th>
                <th className="p-4 border">Issued Books</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr
                  key={student._id}
                  className="border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-200"
                >
                  <td className="p-4 border flex justify-center">
                    <img
                      src={student.profileImage || "https://via.placeholder.com/50"}
                      alt={student.name}
                      className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm"
                    />
                  </td>

                  <td className="p-4 border font-semibold text-gray-900 dark:text-gray-200">{student.name}</td>
                  <td className="p-4 border text-gray-700 dark:text-gray-300">{student.email}</td>
                  <td className="p-4 border text-gray-700 dark:text-gray-300">{student.fileNo}</td>
                  <td className="p-4 border text-gray-700 dark:text-gray-300">{student.mobile}</td>
                  <td className="p-4 border text-gray-700 dark:text-gray-300">{student.department}</td>
                  <td className="p-4 border text-gray-700 dark:text-gray-300">{student.branch}</td>

                  <td className="p-4 border">
                    {student.issuedBooks.length > 0 ? (
                      <ul className="list-disc pl-4 space-y-2">
                        {student.issuedBooks.map((book) => (
                          <li key={book._id} className="flex items-center">
                            <BookOpen size={18} className="text-blue-600 mr-2" />
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                              {book.bookId}
                            </span>
                            <span className="ml-2 text-sm text-gray-500">
                              {new Date(book.issueDate).toLocaleDateString()}
                            </span>
                            {book.returned ? (
                              <CheckCircle size={18} className="text-green-500 ml-2" />
                            ) : (
                              <X size={18} className="text-red-500 ml-2" />
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-500">No Books Issued</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminAllStudents;