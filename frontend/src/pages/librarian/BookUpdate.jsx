import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../components/Axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const BookUpdate = () => {
  const { bookId } = useParams();
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    details: "",
    price: "",
    course: "",
    branch: "",
    stock: "",
  });
  const [copyId, setCopyId] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.get(`/api/librarian/getBookById/${bookId}`);
        const { bookDetails, bookCopy } = res.data;

        setBookData({
          title: bookDetails.title,
          author: bookDetails.author,
          details: bookDetails.details,
          price: bookDetails.price,
          course: bookDetails.course,
          branch: bookDetails.branch,
          stock: bookDetails.stock,
        });

        setCopyId(bookCopy.bookId); // now correctly setting copyId
      } catch (err) {
        MySwal.fire("❌ Error", "Failed to fetch book data", "error");
      }
    };

    fetchBook();
  }, [bookId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    const { title, author, details, price, course, branch, stock } = bookData;

    if (!title || !author || !details || !price || !course || !branch || !stock) {
      MySwal.fire("⚠️ Required", "All fields must be filled!", "warning");
      return;
    }

    try {
      const res = await api.put(`/api/librarian/update-book/${copyId}`, {
        title,
        author,
        details,
        price,
        course,
        branch,
        stock,
      });

      if (res.data.success) {
        MySwal.fire("✅ Success", "Book updated successfully", "success");
      } else {
        throw new Error(res.data.message);
      }
    } catch (err) {
      MySwal.fire("❌ Error", err.message || "Failed to update the book", "error");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">✏️ Update Book: {bookId}</h2>
      <div className="grid grid-cols-1 gap-4">
        {["title", "author", "details", "price", "course", "branch", "stock"].map((field) => (
          <input
            key={field}
            type={field === "price" || field === "stock" ? "number" : "text"}
            name={field}
            value={bookData[field]}
            onChange={handleChange}
            placeholder={`Enter ${field}`}
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ))}
        <button
          onClick={handleUpdate}
          className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
        >
          🔄 Update Book
        </button>
      </div>
    </div>
  );
};

export default BookUpdate;
