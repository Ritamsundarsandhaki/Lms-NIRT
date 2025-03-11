import React, { useEffect, useState } from "react";
import axiosInstance from "../../components/Axios";

function Faculty_MyBook() {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIssuedBooks = async () => {
      try {
        const { data } = await axiosInstance.get("/api/faculty/issued-books");
        if (data.success) {
          setIssuedBooks(data.issuedBooks);
        } else {
          setError("Failed to fetch issued books.");
        }
      } catch (err) {
        setError("Error fetching data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchIssuedBooks();
  }, []);

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg w-full max-w-4xl mx-auto overflow-hidden">
      <h1 className="text-2xl font-bold mb-4 text-center">My Issued Books</h1>
      <p className="text-gray-600 text-center">List of currently borrowed books.</p>

      {loading ? (
        <p className="text-center text-lg">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="w-full mt-4 border-collapse border border-gray-300 text-xs sm:text-sm md:text-base">
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
              {issuedBooks.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No books issued.
                  </td>
                </tr>
              ) : (
                issuedBooks.map((book, index) => (
                  <tr key={index} className="text-center border text-xs sm:text-sm md:text-base">
                    <td className="p-2 border whitespace-nowrap">{book.bookId?.bookId || "N/A"}</td>
                    <td className="p-2 border whitespace-nowrap">{new Date(book.bookId.issueDate).toLocaleDateString()}</td>
                    <td className="p-2 border whitespace-nowrap">
                      {book.bookId.returnDate ? new Date(book.bookId.returnDate).toLocaleDateString() : "Not Returned"}
                    </td>
                    <td className="p-2 border whitespace-nowrap">{book.bookId.returned ? "Yes" : "No"}</td>
                    <td className="p-2 border text-red-500 whitespace-nowrap">₹{book.fine}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Faculty_MyBook;
