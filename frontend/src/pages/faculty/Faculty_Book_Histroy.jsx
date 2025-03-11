import React, { useEffect, useState } from "react";
import axiosInstance from "../../components/Axios";

const FacultyBookHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axiosInstance.get("/api/faculty/history");
        if (response.data.success) {
          setHistory(response.data.history);
        }
      } catch (error) {
        console.error("Error fetching book history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="p-4 sm:p-6 bg-white shadow-md rounded-md overflow-x-auto">
      <h2 className="text-lg sm:text-xl font-bold mb-4">Faculty Book History</h2>
      {loading ? (
        <p>Loading history...</p>
      ) : history.length === 0 ? (
        <p>No book history available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm sm:text-base">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Title</th>
                <th className="border p-2">Issue Date</th>
                <th className="border p-2">Return Date</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((book, index) => (
                <tr key={index} className="text-center border">
                  <td className="border p-2">{book.title}</td>
                  <td className="border p-2">{new Date(book.issueDate).toLocaleDateString()}</td>
                  <td className="border p-2">
                    {book.returnDate !== "Not Returned" ? new Date(book.returnDate).toLocaleDateString() : "Not Returned"}
                  </td>
                  <td className={`border p-2 ${book.status === "Returned" ? "text-green-600" : "text-red-600"}`}>
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

export default FacultyBookHistory;
