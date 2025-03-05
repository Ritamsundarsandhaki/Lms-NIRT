import React, { useState, useEffect } from 'react';
import api from '../../components/Axios';

const Librarian_Allstudent = () => {
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState({ name: '', email: '' });

  const fetchAllStudents = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        ...(searchTerm.name && { name: searchTerm.name }),
        ...(searchTerm.email && { email: searchTerm.email })
      };

      const response = await api.get('/api/librarian/getAllStudents', { params });

      if (response.data.success) {
        setStudents(response.data.students);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllStudents();
  }, [currentPage]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchTerm(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchAllStudents();
  };

  const DetailItem = ({ label, value }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100">
      <span className="text-gray-600 font-medium">{label}</span>
      <span className="text-gray-900">{value}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 border-b-2 border-blue-200 pb-3">
          📚 Student Management
        </h1>

        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} className="mb-6 sm:mb-8 bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                name="name"
                placeholder="Search by name..."
                value={searchTerm.name}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 sm:py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Search by email..."
                value={searchTerm.email}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 sm:py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md flex items-center gap-2 justify-center"
          >
            🔍 Search
          </button>
        </form>

        {/* Students Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Name', 'Email', 'File No', 'Department', 'Actions'].map((header) => (
                        <th
                          key={header}
                          className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {students.map(student => (
                      <tr key={student._id} className="hover:bg-blue-50 transition-colors">
                        <td className="px-4 sm:px-6 py-3 font-medium text-gray-900">{student.name}</td>
                        <td className="px-4 sm:px-6 py-3 text-gray-600">{student.email}</td>
                        <td className="px-4 sm:px-6 py-3 text-gray-600 font-mono">{student.fileNo}</td>
                        <td className="px-4 sm:px-6 py-3 text-gray-600">{student.department}</td>
                        <td className="px-4 sm:px-6 py-3">
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-50 border-t border-gray-100 gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  ◀ Previous
                </button>
                <span className="text-gray-600">Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Next ▶
                </button>
              </div>
            </>
          )}
        </div>

        {selectedStudent && (
  <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-2xl max-h-[90vh] overflow-y-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3 sticky top-0 bg-white z-10">
        <h2 className="text-xl font-bold text-gray-800">{selectedStudent.name} - {selectedStudent.fileNo}</h2>
        <button onClick={() => setSelectedStudent(null)} className="p-2 hover:bg-gray-100 rounded-full">
          ✖
        </button>
      </div>

      {/* Student Details */}
      <div className="space-y-4 mt-4">
        <DetailItem label="📧 Email" value={selectedStudent.email} />
        <DetailItem label="📂 File No" value={selectedStudent.fileNo} />
        <DetailItem label="👨‍👩‍👦 Parent Name" value={selectedStudent.parentName} />
        <DetailItem label="📱 Mobile" value={selectedStudent.mobile} />
        <DetailItem label="🏫 Department" value={selectedStudent.department} />
        <DetailItem label="📚 Branch" value={selectedStudent.branch} />
      </div>

      {/* Issued Books */}
      {selectedStudent.issuedBooks.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800">📖 Issued Books</h3>
          <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
            <table className="w-full mt-2">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">Book ID</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">Issue Date</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">Returned</th>
                </tr>
              </thead>
              <tbody>
                {selectedStudent.issuedBooks.map((book) => (
                  <tr key={book._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{book.bookId}</td>
                    <td className="px-4 py-2">{new Date(book.issueDate).toLocaleDateString()}</td>
                    <td className="px-4 py-2">
                      {book.returned ? (
                        <span className="text-green-600 font-semibold">✔ Returned</span>
                      ) : (
                        <span className="text-red-600 font-semibold">❌ Not Returned</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="mt-6 text-gray-600">No books issued.</p>
      )}
    </div>
  </div>
)}


      </div>
    </div>
  );
};

export default Librarian_Allstudent;
