import React, { useState, useEffect } from "react";
import axiosInstance from "../../components/Axios";

const MyBooks = () => {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("card"); // 'card' or 'table'

  useEffect(() => {
    const fetchIssuedBooks = async () => {
      try {
        const response = await axiosInstance.get("/api/student/issued-books");
        if (response.data.success) {
          setIssuedBooks(response.data.issuedBooks);
        } else {
          throw new Error("Failed to fetch issued books");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchIssuedBooks();
  }, []);

  // Switch between views (card or table)
  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === "card" ? "table" : "card"));
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">📚 My Issued Books</h1>
      <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
        View the books you've borrowed along with return info and any fines.
      </p>

      {/* Mode Toggle Button */}
      <div className="text-center mb-4">
        <button
          onClick={toggleViewMode}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 focus:outline-none"
        >
          Switch to {viewMode === "card" ? "Table" : "Card"} View
        </button>
      </div>

      {loading ? (
        <p className="text-center text-lg">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : issuedBooks.length === 0 ? (
        <p className="text-center text-gray-500">No books issued.</p>
      ) : viewMode === "card" ? (
        // Card View
        <div className="space-y-6">
          {issuedBooks.map((book, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-6 shadow-md hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{book.bookId?.bookId || "N/A"}</h3>
                <p
                  className={`text-sm ${
                    book.bookId.returned ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {book.bookId.returned ? "Returned" : "Not Returned"}
                </p>
              </div>

              <div className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                <p>
                  <strong>Issue Date: </strong>
                  {new Date(book.bookId.issueDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Return Date: </strong>
                  {book.bookId.returnDate
                    ? new Date(book.bookId.returnDate).toLocaleDateString()
                    : "Not Returned"}
                </p>
                <p className="text-red-600 font-semibold mt-2">
                  <strong>Fine: </strong> ₹{book.fine}
                </p>
              </div>

              {/* Return Button */}
              {!book.bookId.returned && (
                <button
                  className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 focus:outline-none"
                  onClick={() => alert("Returning Book...")} // Placeholder for return book logic
                >
                  Return Book
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        // Table View with Horizontal Scrolling
        <div className="overflow-x-auto w-full">
          <table className="min-w-full mt-4 border-collapse border border-gray-300 text-xs sm:text-sm md:text-base table-fixed">
            <thead>
              <tr className="bg-gray-200 text-xs sm:text-sm md:text-base">
                <th className="p-2 border whitespace-nowrap">Book ID</th>
                <th className="p-2 border whitespace-nowrap">Issue Date</th>
                <th className="p-2 border whitespace-nowrap">Return Date</th>
                <th className="p-2 border whitespace-nowrap">Returned</th>
                <th className="p-2 border whitespace-nowrap">Fine</th>
              </tr>
            </thead>
            <tbody>
              {issuedBooks.map((book, index) => (
                <tr
                  key={index}
                  className="text-center border text-xs sm:text-sm md:text-base"
                >
                  <td className="p-2 border whitespace-nowrap">{book.bookId?.bookId || "N/A"}</td>
                  <td className="p-2 border whitespace-nowrap">{new Date(book.bookId.issueDate).toLocaleDateString()}</td>
                  <td className="p-2 border whitespace-nowrap">
                    {book.bookId.returnDate
                      ? new Date(book.bookId.returnDate).toLocaleDateString()
                      : "Not Returned"}
                  </td>
                  <td className="p-2 border whitespace-nowrap">
                    {book.bookId.returned ? "Yes" : "No"}
                  </td>
                  <td className="p-2 border text-red-500 whitespace-nowrap">
                    ₹{book.fine}
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

export default MyBooks;
