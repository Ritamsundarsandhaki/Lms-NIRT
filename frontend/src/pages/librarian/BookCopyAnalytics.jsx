import React, { useEffect, useState } from 'react';
import axios from '../../components/Axios';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom'; // <-- Import useParams

function BookCopyAnalytics() {
  const { bookId } = useParams(); // <-- Get bookId from URL
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!bookId) return; // if no bookId, do not proceed

    const fetchBookAnalytics = async () => {
      try {
        const response = await axios.get(`/api/librarian/bookTraking/${bookId}`);
        setBookData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookAnalytics();
  }, [bookId]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-lg text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-lg text-red-500">Error: {error}</div>;
  }

  if (!bookData) {
    return <div className="flex items-center justify-center h-screen text-lg text-gray-500">No Data Found</div>;
  }

  const { book, analytics, issueHistory } = bookData;

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-300 via-purple-300 to-sky-300 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl p-10 space-y-10">
        {/* Heading */}
        <motion.h1 
          className="text-4xl font-extrabold text-center text-gray-900"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          📚 Book Copy Analytics
        </motion.h1>

        {/* Book Metadata */}
        <motion.div 
          className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-2xl shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-5">Book Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-lg">
            <p><strong>Title:</strong> {book.title}</p>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Course:</strong> {book.course}</p>
            <p><strong>Branch:</strong> {book.branch}</p>
            <p><strong>Price:</strong> ₹{book.price}</p>
          </div>
        </motion.div>

        {/* Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Issued', value: analytics.totalIssued, colors: 'from-sky-400 to-sky-600' },
            { label: 'Total Returned', value: analytics.totalReturned, colors: 'from-green-400 to-green-600' },
            { label: 'Currently Issued', value: analytics.totalPending, colors: 'from-yellow-400 to-yellow-600' }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className={`bg-gradient-to-br ${item.colors} p-8 rounded-2xl text-center shadow-xl hover:scale-105 transition-transform`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 * (idx + 1) }}
            >
              <h2 className="text-xl font-bold text-white mb-3">{item.label}</h2>
              <p className="text-4xl font-extrabold text-white">{item.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Month-wise Analytics */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">📅 Month-wise Issued</h2>
          <div className="grid gap-4">
            {analytics.monthWiseData.map((data, index) => (
              <motion.div
                key={index}
                className="flex justify-between items-center p-5 bg-white rounded-2xl shadow hover:bg-indigo-50 transition-all"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <span className="text-lg font-medium">{data.month}</span>
                <span className="text-md font-semibold text-gray-700">{data.issuedCount} books</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Currently Issued Copies */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">📖 Currently Issued Copies</h2>
          {analytics.currentlyIssuedCopies.length > 0 ? (
            <div className="space-y-6">
              {analytics.currentlyIssuedCopies.map((copy, index) => (
                <motion.div
                  key={index}
                  className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <p><strong>Book ID:</strong> {copy.bookId}</p>
                  <p><strong>Issued To:</strong> {copy.issuedTo.name} ({copy.issuedTo.email})</p>
                  <p><strong>Issued By:</strong> {copy.issuedByLibrarian.name}</p>
                  <p><strong>Issue Date:</strong> {new Date(copy.issueDate).toLocaleString()}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No currently issued books.</p>
          )}
        </div>

        {/* Full Issue History */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">📝 Full Issue History</h2>
          <div className="max-h-[400px] overflow-y-auto pr-3 space-y-5">
            {issueHistory.length > 0 ? (
              issueHistory.map((history, index) => (
                <motion.div
                  key={index}
                  className="p-6 bg-white rounded-2xl shadow hover:bg-indigo-50 hover:scale-[1.02] transition-all"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <p><strong>Issued To:</strong> {history.userId.name} ({history.userId.email})</p>
                    <span className="text-sm text-gray-500">{history.userModel}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <p><strong>Librarian:</strong> {history.librarianId.name} ({history.librarianId.email})</p>
                    <p><strong>Issue Date:</strong> {new Date(history.issueDate).toLocaleString()}</p>
                  </div>
                  {history.returned && (
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-green-600 font-semibold">Returned</p>
                      <p><strong>Return Date:</strong> {new Date(history.returnDate).toLocaleString()}</p>
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500">No issue history available.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default BookCopyAnalytics;
