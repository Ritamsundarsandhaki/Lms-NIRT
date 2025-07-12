import React, { useState, useEffect } from "react";
import axiosInstance from "../../components/Axios";

const BookHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axiosInstance.get("/api/student/history");
        console.log(response);
        if (response.data.success) {
          setHistory(response.data.history);
        } else {
          throw new Error("Failed to fetch book history");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Book History</h1>
      <p className="text-gray-600">List of all borrowed books.</p>

      {loading ? (
        <p className="text-center text-lg">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : (
        <div className="overflow-x-auto  max-h-96 mt-4 border border-gray-300 rounded">
          <table className="min-w-full border-collapse">
            <thead className="sticky top-0 bg-gray-200 z-10">
              <tr>
                <th className="p-2 border whitespace-nowrap">Book ID</th>
                <th className="p-2 border whitespace-nowrap">Issue Date</th>
                <th className="p-2 border whitespace-nowrap">Return Date</th>
                <th className="p-2 border whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((book, index) => (
                <tr key={index} className="text-center">
                  <td className="p-2 border whitespace-nowrap">{book.bookId || "N/A"}</td>
                  <td className="p-2 border whitespace-nowrap">
                    {new Date(book.issueDate).toLocaleDateString()}
                  </td>
                  <td className="p-2 border whitespace-nowrap">
                    {book.returnDate !== "Not Returned"
                      ? new Date(book.returnDate).toLocaleDateString()
                      : "Not Returned"}
                  </td>
                  <td
                    className={`p-2 border font-bold whitespace-nowrap ${
                      book.status === "Returned"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {book.status}
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

export default BookHistory;
