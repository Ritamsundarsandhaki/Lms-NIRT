import React, { useState } from "react";
import { jsPDF } from "jspdf";
import api from "../../components/Axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const BookRegistration = () => {
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    details: "",
    stock: "",
    price: "",
    course: "",
    branch: "",
  });
  const [registeredBooks, setRegisteredBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    setLoading(true);

    const { title, author, details, stock, price, course, branch } = bookData;

    // Basic validations
    if (
      !title ||
      !author ||
      !details ||
      !stock ||
      !price ||
      !course ||
      !branch
    ) {
      MySwal.fire("❌ Error", "All fields are required.", "error");
      setLoading(false);
      return;
    }

    if (
      isNaN(stock) ||
      Number(stock) <= 0 ||
      parseInt(stock) !== Number(stock)
    ) {
      MySwal.fire(
        "⚠️ Invalid Input",
        "Stock must be a positive integer.",
        "warning"
      );
      setLoading(false);
      return;
    }

    if (Number(stock) > 200) {
      MySwal.fire(
        "⚠️ Limit Exceeded",
        "Stock cannot exceed 200 copies.",
        "warning"
      );
      setLoading(false);
      return;
    }

    if (isNaN(price) || Number(price) < 0) {
      MySwal.fire(
        "⚠️ Invalid Input",
        "Price must be a positive number.",
        "warning"
      );
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/api/librarian/register-book", bookData);
      const data = response.data;

      if (!data.success) {
        MySwal.fire({
          icon: "warning",
          title: "⚠️ Registration Failed",
          text:
            data.message || "Something went wrong while registering the book.",
        });
      } else {
        setRegisteredBooks(data.book.books || []);
        setBookData({
          title: "",
          author: "",
          details: "",
          stock: "",
          price: "",
          course: "",
          branch: "",
        });

        MySwal.fire({
          icon: "success",
          title: "✅ Success",
          text: "Book registered successfully!",
        });
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "An unexpected error occurred while registering the book.";

      MySwal.fire({
        icon: "error",
        title: "❌ Error",
        text: message,
      });
    } finally {
      setLoading(false); // Always reset loading state
    }
  };

  const generatePDF = async () => {
    setPdfLoading(true);
    const doc = new jsPDF();
    let y = 10,
      x = 10,
      count = 0,
      barcodesPerRow = 3;
    for (let book of registeredBooks) {
      const barcodeUrl = `https://barcodeapi.org/api/code128/${book.bookId}`;
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
        console.error(`Error loading barcode for book ID ${book.bookId}`);
      }
    }
    doc.save("Library_Barcodes.pdf");
    setPdfLoading(false);
    MySwal.fire(
      "📄 PDF Downloaded",
      "All barcodes have been saved as PDF.",
      "success"
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl p-6 sm:p-8 border border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          📚 Register a New Book
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { name: "title", label: "Title" },
            { name: "author", label: "Author" },
            { name: "details", label: "Details" },
            { name: "stock", label: "Stock (Number of Copies)" },
            { name: "price", label: "Price (in ₹)" },
            { name: "course", label: "Course" },
            { name: "branch", label: "Branch" },
          ].map(({ name, label }) => (
            <div key={name} className="flex flex-col">
              <label htmlFor={name} className="mb-1 font-medium text-gray-700">
                {label}
              </label>
              <input
                id={name}
                type={name === "stock" || name === "price" ? "number" : "text"}
                name={name}
                value={bookData[name]}
                onChange={handleChange}
                placeholder={label}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 w-full"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleRegister}
          className="mt-6 w-full px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold shadow-lg hover:scale-105 transition-all disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "🔄 Registering..." : "✅ Register Book"}
        </button>

        {registeredBooks.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl sm:text-2xl font-bold mb-4">
              📋 Registered Books
            </h3>
            <button
              onClick={generatePDF}
              className="mb-4 w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:scale-105 transition-all disabled:opacity-50"
              disabled={pdfLoading}
            >
              {pdfLoading
                ? "⏳ Generating PDF..."
                : "📄 Download All Barcodes as PDF"}
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {registeredBooks.map((book) => (
                <div
                  key={book.bookId}
                  className="p-4 border rounded-xl bg-white shadow-md"
                >
                  <h4 className="text-lg font-semibold">📖 {book.title}</h4>
                  <p className="text-gray-600">
                    🆔 ID:{" "}
                    <span className="font-bold text-blue-600">
                      {book.bookId}
                    </span>
                  </p>
                  <button
                    onClick={() => setSelectedBook(book)}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                  >
                    📊 View Barcode
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookRegistration;
