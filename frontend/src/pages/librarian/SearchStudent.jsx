import React, { useState, useEffect } from "react";
import api from "../../components/Axios";

const SearchStudent = () => {
  const [searchQuery, setSearchQuery] = useState({ name: "", fileNo: "" });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery({ ...searchQuery, [name]: value });
  };

  const fetchStudents = async () => {
    setLoading(true);
    setMessage("");
    try {
      const { name, fileNo } = searchQuery;
      const params = { page, limit: 7 };
      if (name) params.name = name;
      if (fileNo) params.fileNo = fileNo;
      if (!name && !fileNo) {
        setMessage(" Provide either File No or Name to search");
        setLoading(false);
        return;
      }
      const response = await api.get("/api/librarian/search-student", { params });
      if (!response.data.success) {
        setMessage("⚠️ " + response.data.message);
        setStudents([]);
      } else {
        setStudents(response.data.students);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      setMessage("No student Found");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (page > 1) {
      fetchStudents();
    }
  }, [page]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl p-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">🎓 Search Students</h2>
        
        {/* Search Inputs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            name="name"
            value={searchQuery.name}
            onChange={handleChange}
            placeholder="👨‍🎓 Enter Student Name"
            className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="fileNo"
            value={searchQuery.fileNo}
            onChange={handleChange}
            placeholder="📂 Enter File No"
            className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={fetchStudents} 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-all" 
            disabled={loading}
          >
            {loading ? "🔄 Searching..." : "🔎 Search"}
          </button>
        </div>

        {message && <p className="text-center text-red-600 font-semibold">{message}</p>}

        {/* Students List */}
        <div className="space-y-4">
          {students.map((student, index) => (
            <div
              key={index}
              onClick={() => setSelectedStudent(student)}
              className="p-5 border border-gray-300 rounded-lg bg-white shadow-md hover:shadow-lg transition cursor-pointer"
            >
              <h3 className="text-lg font-semibold text-gray-900">👨‍🎓 {student.name}</h3>
              <p className="text-gray-600">📧 {student.email}</p>
              <p className="text-gray-600">📂 File No: {student.fileNo}</p>
            </div>
          ))}
        </div>

        {/* Student Details Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-[500px] max-h-[90vh] overflow-y-auto relative">
              <button 
                onClick={() => setSelectedStudent(null)} 
                className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition"
              >
                ✖
              </button>
              
              <h2 className="text-2xl font-bold mb-4 text-gray-800">{selectedStudent.name}</h2>
              
              {/* Student Information Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-gray-700">
                    <strong>📂 File No:</strong> {selectedStudent.fileNo}
                  </p>
                  <p className="text-gray-700">
                    <strong>📧 Email:</strong> {selectedStudent.email}
                  </p>
                  <p className="text-gray-700">
                    <strong>📱 Mobile:</strong> {selectedStudent.mobile}
                  </p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-gray-700">
                    <strong>👨‍👦 Parent:</strong> {selectedStudent.parentName}
                  </p>
                  <p className="text-gray-700">
                    <strong>🏫 Department:</strong> {selectedStudent.department}
                  </p>
                  <p className="text-gray-700">
                    <strong>🎓 Branch:</strong> {selectedStudent.branch}
                  </p>
                </div>
              </div>

              {/* Issued Books Section */}
              <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800">📚 Issued Books ({selectedStudent.issuedBooks?.length || 0})</h3>
              <ul className="space-y-2">
                {selectedStudent.issuedBooks?.length > 0 ? (
                  selectedStudent.issuedBooks.map((book, idx) => (
                    <li 
                      key={idx}
                      className="p-3 border rounded-md bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">📖 ID: {book.bookId}</p>
                          <p className={`text-sm ${book.returned ? 'text-green-600' : 'text-red-600'}`}>
                            🟢 {book.returned ? "Returned" : "Not Returned"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">
                            📅 Issued: {new Date(book.issueDate).toLocaleDateString()}
                          </p>
                          {book.returnDate && (
                            <p className="text-sm">
                              {book.returned ? '📅 Returned: ' : '⏳ Due: '}
                              {new Date(book.returnDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500 p-3 text-center">No books currently issued</li>
                )}
              </ul>

              {/* Additional Metadata */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Created: {new Date(selectedStudent.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  Last Updated: {new Date(selectedStudent.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchStudent;