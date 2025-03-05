import React, { useState } from "react";
import api from "../../components/Axios";
import { motion } from "framer-motion";

const ReturnBook = () => {
  const [formData, setFormData] = useState({ fileNo: "", employeeId: "", bookIds: [""] });
  const [userType, setUserType] = useState("student");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const addBookField = () => setFormData({ ...formData, bookIds: [...formData.bookIds, ""] });
  const removeBookField = (index) => setFormData({ ...formData, bookIds: formData.bookIds.filter((_, i) => i !== index) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!formData.fileNo.trim() && !formData.employeeId.trim()) {
      setMessage({ type: "error", text: "File Number or Employee ID is required." });
      setLoading(false);
      return;
    }
    if (formData.bookIds.some((id) => id.trim().length < 5)) {
      setMessage({ type: "error", text: "Each Book ID must be at least 5 digits." });
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/api/librarian/return-book", { ...formData, userType });
      setMessage({
        type: response.data.success ? "success" : "error",
        text: response.data.message || "Books returned successfully!",
        details: [
          response.data.returnedBooks?.length ? `✅ Returned: ${response.data.returnedBooks.join(", ")}` : null,
          response.data.notFoundBooks?.length ? `❌ Not Found: ${response.data.notFoundBooks.join(", ")}` : null,
        ].filter(Boolean),
      });
      if (response.data.success) {
        setFormData({ fileNo: "", employeeId: "", bookIds: [""] });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Server error. Please try again." });
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">🔄 Return Book</h2>
        {message && <Modal message={message} onClose={() => setMessage(null)} />}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex space-x-4">
            <button type="button" onClick={() => setUserType("student")} className={`p-3 rounded-lg font-semibold transition-all ${userType === "student" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Student</button>
            <button type="button" onClick={() => setUserType("faculty")} className={`p-3 rounded-lg font-semibold transition-all ${userType === "faculty" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Faculty</button>
          </div>
          {userType === "student" && <InputField type="text" name="fileNo" value={formData.fileNo} onChange={handleChange} placeholder="📁 Student File No" required />}
          {userType === "faculty" && <InputField type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} placeholder="🏢 Employee ID" required />}
          {formData.bookIds.map((bookId, index) => (
            <div key={index} className="flex items-center space-x-2">
              <InputField type="text" name="bookId" value={bookId} onChange={(e) => handleChange(e, index)} placeholder="📖 Book ID (Min 5 digits)" required />
              {index > 0 && (
                <button type="button" onClick={() => removeBookField(index)} className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all shadow-md">✖</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addBookField} className="w-full p-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-md">➕ Add Another Book</button>
          <button type="submit" disabled={loading} className="w-full p-3 rounded-lg text-white font-semibold bg-gradient-to-r from-green-500 via-yellow-500 to-orange-500 hover:from-green-600 hover:to-orange-600 transition-all flex justify-center items-center shadow-lg">
            {loading ? <LoadingSpinner /> : "📤 Return Book"}
          </button>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ type, name, value, onChange, placeholder, required }) => (
  <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-2 focus:ring-green-400 transition-all duration-300 hover:bg-gray-100 hover:shadow-md" />
);

const LoadingSpinner = () => (
  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-6 h-6 border-4 border-white border-t-transparent rounded-full"></motion.div>
);

const Modal = ({ message, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-white p-6 rounded-lg shadow-lg text-center">
      <p className={`text-lg font-semibold ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>{message.text}</p>
      {message.details?.map((detail, index) => <p key={index} className="text-sm mt-2">{detail}</p>)}
      <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">OK</button>
    </motion.div>
  </div>
);

export default ReturnBook;