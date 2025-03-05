import React, { useState } from "react";
import api from "../../components/Axios"; // Axios instance
import { Upload, Loader2 } from "lucide-react";

const LibrarianUploadStudent = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [invalidStudents, setInvalidStudents] = useState([]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setMessage("");
    setInvalidStudents([]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select an Excel file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setMessage("");

    try {
      const response = await api.post("/api/librarian/upload-students", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(response.data.message);
      setInvalidStudents(response.data.invalidStudents || []);
    } catch (error) {
      setMessage(error.response?.data?.message || "Upload failed. Please try again.");
      setInvalidStudents(error.response?.data?.invalidStudents || []);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">📚 Upload Student Data</h2>

      <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center">
        <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          Browse Files
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        {file && <p className="mt-2 text-gray-600">📂 {file.name}</p>}
      </div>

      {message && (
        <div className={`mt-4 p-3 rounded-lg text-center ${invalidStudents.length ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
          {message}
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading || !file}
        className={`w-full flex items-center justify-center bg-green-600 text-white py-3 rounded-md font-medium hover:bg-green-700 transition mt-4 disabled:bg-gray-400 disabled:cursor-not-allowed`}
      >
        {uploading ? <Loader2 className="animate-spin mr-2" /> : <Upload className="mr-2" />} {uploading ? "Uploading..." : "Upload Students"}
      </button>

      {invalidStudents.length > 0 && (
        <div className="mt-6 p-4 bg-yellow-50 text-yellow-800 rounded-lg">
          <h3 className="font-semibold">⚠️ Invalid Entries:</h3>
          <ul className="list-disc pl-5">
            {invalidStudents.map((student, index) => (
              <li key={index} className="text-sm">
                {student.row.Name || "Unknown"} - {student.reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LibrarianUploadStudent;
