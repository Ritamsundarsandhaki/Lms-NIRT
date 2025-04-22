import React, { useState } from "react";
import api from "../../components/Axios";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const IssueBook = () => {
  const [formData, setFormData] = useState({
    fileNo: "",
    employeeId: "",
    bookIds: [""],
    userType: "student",
  });
  const [loading, setLoading] = useState(false);

  const toggleType = () => {
    setFormData({
      fileNo: "",
      employeeId: "",
      bookIds: [""],
      userType: formData.userType === "student" ? "faculty" : "student",
    });
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name === "fileNo" || name === "employeeId") {
      setFormData({ ...formData, [name]: value });
    } else {
      const updatedBookIds = [...formData.bookIds];
      updatedBookIds[index] = value;
      setFormData({ ...formData, bookIds: updatedBookIds });
    }
  };

  const addBookField = () =>
    setFormData({ ...formData, bookIds: [...formData.bookIds, ""] });
  const removeBookField = (index) =>
    setFormData({
      ...formData,
      bookIds: formData.bookIds.filter((_, i) => i !== index),
    });

  const showAlert = (type, text) => {
    MySwal.fire({
      icon: type,
      title: type === "success" ? "Success ✅" : "Oops 😕",
      html: `<pre style="text-align: left; white-space: pre-wrap;">${text}</pre>`,
      confirmButtonColor: "#6366f1",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.userType === "student" && !formData.fileNo.trim()) {
      showAlert("error", "File Number is required for students.");
      setLoading(false);
      return;
    }

    if (formData.userType === "faculty" && !formData.employeeId.trim()) {
      showAlert("error", "Employee ID is required for faculty.");
      setLoading(false);
      return;
    }

    if (formData.bookIds.some((id) => id.trim().length < 5)) {
      showAlert("error", "Each Book ID must be at least 5 digits.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/api/librarian/issue-book", formData);
      const { success, message, issuedBooks, failedBooks } = response.data;

      let finalMessage = "";

      if (success) {
        finalMessage += `✅ ${message}\nIssued Books: ${issuedBooks.join(", ")}`;
      }

      if (failedBooks && failedBooks.length > 0) {
        const failedList = failedBooks
          .map((book) => `❌ ${book.bookId}: ${book.reason}`)
          .join("\n");
        finalMessage += `\n\nFailed to Issue:\n${failedList}`;
      }

      showAlert(success ? "success" : "error", finalMessage.trim());
    } catch (error) {
      if (error.response) {
        showAlert("error", error.response.data.message || "Something went wrong.");
      } else if (error.request) {
        showAlert("error", "No response from the server. Please check your connection.");
      } else {
        showAlert("error", "An unexpected error occurred. Try again later.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
          📚 Issue Book
        </h2>
        <button
          onClick={toggleType}
          className={`w-full mb-4 p-3 rounded-lg text-white font-semibold transition-all shadow-lg ${
            formData.userType === "student" ? "bg-blue-500" : "bg-green-500"
          }`}
        >
          {formData.userType === "student"
            ? "Switch to Faculty Issue"
            : "Switch to Student Issue"}
        </button>
        <form onSubmit={handleSubmit} className="space-y-5">
          {formData.userType === "student" ? (
            <InputField
              type="text"
              name="fileNo"
              value={formData.fileNo}
              onChange={handleChange}
              placeholder="📁 File No"
              required
            />
          ) : (
            <InputField
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              placeholder="🆔 Employee ID"
              required
            />
          )}
          {formData.bookIds.map((bookId, index) => (
            <div key={index} className="flex items-center space-x-2">
              <InputField
                type="text"
                name="bookId"
                value={bookId}
                onChange={(e) => handleChange(e, index)}
                placeholder="📖 Book ID (Min 5 digits)"
                required
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeBookField(index)}
                  className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all shadow-md"
                >
                  ✖
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addBookField}
            className="w-full p-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-md"
          >
            ➕ Add Another Book
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 rounded-lg text-white font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 transition-all flex justify-center items-center shadow-lg"
          >
            {loading ? <LoadingSpinner /> : "📤 Issue Book"}
          </button>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ type, name, value, onChange, placeholder, required }) => (
  <input
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-2 focus:ring-indigo-400 transition-all duration-300 hover:bg-gray-100 hover:shadow-md"
  />
);

const LoadingSpinner = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 1 }}
    className="w-6 h-6 border-4 border-white border-t-transparent rounded-full"
  ></motion.div>
);

export default IssueBook;
