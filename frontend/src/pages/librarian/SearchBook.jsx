import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../components/Axios";
import { FaDownload, FaPen } from "react-icons/fa";
import { jsPDF } from "jspdf";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const MySwal = withReactContent(Swal);

const SearchBook = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState({ bookId: "", title: "" });
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [selectedBook, setSelectedBook] = useState(null);
  const [isSearchMode, setIsSearchMode] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.bookId || searchQuery.title) {
        searchBooks(1);
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery((prev) => ({ ...prev, [name]: value }));
  };

  const generatePDF = async (book) => {
    const doc = new jsPDF();
    let x = 10, y = 10, count = 0, barcodesPerRow = 3;

    for (let copy of book.books) {
      const barcodeUrl = `https://barcodeapi.org/api/code128/${copy.bookId}`;
      try {
        const img = new Image();
        img.src = barcodeUrl;
        await new Promise((resolve) => (img.onload = resolve));
        doc.addImage(img, "PNG", x, y, 50, 20);
        x += 60;
        count++;
        if (count % barcodesPerRow === 0) {
          x = 10;
          y += 30;
        }
        if (count % 27 === 0) {
          doc.addPage();
          x = 10;
          y = 10;
        }
      } catch (error) {
        console.error(`Failed to load barcode for ${copy.bookId}`);
      }
    }

    doc.save(`Library_Barcodes_${book.title}.pdf`);
    MySwal.fire("📄 PDF Downloaded", "Barcodes saved as PDF.", "success");
  };

  const searchBooks = async (page) => {
    setLoading(true);
    setIsSearchMode(true);
    setMessage("");

    try {
      const res = await api.get("/api/librarian/getallbooks", {
        params: { bookId: searchQuery.bookId, title: searchQuery.title, page, limit: 6 }
      });

      if (res.data.success) {
        setBooks(res.data.books);
        setPagination(res.data.pagination);
      } else {
        setBooks([]);
        setMessage("⚠️ No books found.");
      }
    } catch (err) {
      setMessage("❌ Failed to fetch books.");
    }

    setLoading(false);
  };

  const fetchAllBooks = async (page = 1) => {
    setLoading(true);
    setIsSearchMode(false);
    setMessage("");

    try {
      const res = await api.get("/api/librarian/getallbooks", { params: { page, limit: 6 } });

      if (res.data.success) {
        setBooks(res.data.books);
        setPagination(res.data.pagination);
      } else {
        setBooks([]);
        setMessage("⚠️ No books found.");
      }
    } catch (err) {
      setMessage("❌ Failed to fetch books.");
    }

    setLoading(false);
  };

  const handlePageChange = (page) => {
    if (isSearchMode) {
      searchBooks(page);
    } else {
      fetchAllBooks(page);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-xl p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">📚 Search Books</h2>

        {/* Search Inputs */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input type="text" name="bookId" value={searchQuery.bookId} onChange={handleChange} placeholder="🔍 Book ID" className="p-3 border rounded-lg flex-1" disabled={loading} />
          <input type="text" name="title" value={searchQuery.title} onChange={handleChange} placeholder="📖 Book Title" className="p-3 border rounded-lg flex-1" disabled={loading} />
          <button onClick={() => searchBooks(1)} className="p-3 rounded-lg text-white font-semibold bg-indigo-500 hover:bg-indigo-600 transition" disabled={loading}>
            {loading ? "🔄 Searching..." : "🔎 Search"}
          </button>
          <button onClick={() => fetchAllBooks(1)} className="p-3 rounded-lg text-white font-semibold bg-green-500 hover:bg-green-600 transition" disabled={loading}>
            {loading ? "🔄 Fetching..." : "📚 Fetch All Books"}
          </button>
        </div>

        {message && <p className="text-center text-red-600 font-semibold">{message}</p>}

        {!loading && books.length > 0 && (
          <p className="text-gray-600 text-center mb-4">
            Showing {books.length} book{books.length !== 1 ? "s" : ""}
          </p>
        )}

        {/* Book Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {loading && books.length === 0 && (
            <div className="text-center col-span-2">
              <p className="text-gray-500 text-lg">🔄 Loading books...</p>
            </div>
          )}

          {books.map((book) => (
            <div key={book._id} className="p-6 border rounded-xl bg-white shadow-md hover:shadow-lg transition-all">
              <h3 className="text-xl font-semibold text-gray-800">📖 {book.title}</h3>
              <p className="text-gray-600">📌 <strong>Course:</strong> {book.course}</p>
              <p className="text-gray-600">🏢 <strong>Branch:</strong> {book.branch}</p>
              <p className="text-gray-600">💰 <strong>Price:</strong> ₹{book.price}</p>
              <p className="text-gray-600">📄 <strong>Details:</strong> {book.details}</p>

              <button onClick={() => setSelectedBook(book)} className="mt-4 text-blue-500 font-semibold underline hover:text-blue-700 transition">Show Copies</button>

              <button className="mt-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition w-full flex items-center justify-center" onClick={() => generatePDF(book)}>
                <FaDownload className="mr-2" /> Download QR Code
              </button>

              {book.books.length > 0 && (
                <button
                  onClick={() => navigate(`/librarian/update_book/${book.books[0].bookId}`)}
                  className="mt-2 p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition w-full flex items-center justify-center"
                >
                  <FaPen className="mr-2" /> Update Book
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex flex-wrap justify-center mt-6 gap-2">
            <button onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={pagination.currentPage <= 1 || loading} className="px-4 py-2 bg-gray-400 text-white rounded disabled:opacity-50">⬅️ Prev</button>

            {Array.from({ length: pagination.totalPages }, (_, index) => (
              <button key={index} onClick={() => handlePageChange(index + 1)} disabled={loading}
                className={`px-4 py-2 rounded font-semibold ${pagination.currentPage === index + 1 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}>
                {index + 1}
              </button>
            ))}

            <button onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={pagination.currentPage >= pagination.totalPages || loading} className="px-4 py-2 bg-gray-400 text-white rounded disabled:opacity-50">Next ➡️</button>
          </div>
        )}
      </div>

      {/* Modal for Viewing Copies */}
      {selectedBook && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white p-6 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <button onClick={() => setSelectedBook(null)} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl">✖</button>
            <h3 className="text-xl font-bold mb-4">📚 Copies of {selectedBook.title}</h3>
            <ul className="bg-gray-100 p-3 rounded-lg">
              {selectedBook.books.map((copy) => (
                <li key={copy._id} className="p-2 border-b last:border-none flex justify-between items-center">
                  <span>📖 <strong>ID:</strong> {copy.bookId}</span>
                  <span className={`font-semibold ${copy.issued ? "text-red-500" : "text-green-500"}`}>{copy.issued ? "🚫 Issued" : "✅ Available"}</span>
                  <button onClick={() => navigate(`/librarian/bookCopyAnalict/${copy.bookId}`)} className="ml-4 p-1 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition duration-300">
                    View Details
                  </button>
                </li>
              ))}
            </ul>
            <button onClick={() => setSelectedBook(null)} className="mt-4 p-2 bg-red-500 text-white rounded-lg w-full hover:bg-red-600 transition">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBook;
