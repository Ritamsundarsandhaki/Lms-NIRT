import React, { useState, useEffect } from "react";
import axiosInstance from "../../components/Axios";

const Profile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/api/student/profile");
        console.log(response);
        if (response.data.success) {
          setStudent(response.data.student);
        } else {
          throw new Error("Failed to fetch profile details");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <p className="text-gray-600 dark:text-gray-300">Manage your account details.</p>

      {loading ? (
        <p className="text-center text-lg">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : (
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Name:</p>
              <p className="text-gray-700 dark:text-gray-300">{student.name}</p>
            </div>
            <div>
              <p className="font-semibold">Email:</p>
              <p className="text-gray-700 dark:text-gray-300">{student.email}</p>
            </div>
            <div>
              <p className="font-semibold">File No:</p>
              <p className="text-gray-700 dark:text-gray-300">{student.fileNo}</p>
            </div>
            <div>
              <p className="font-semibold">Parent Name:</p>
              <p className="text-gray-700 dark:text-gray-300">{student.parentName}</p>
            </div>
            <div>
              <p className="font-semibold">Mobile:</p>
              <p className="text-gray-700 dark:text-gray-300">{student.mobile}</p>
            </div>
            <div>
              <p className="font-semibold">Department:</p>
              <p className="text-gray-700 dark:text-gray-300">{student.department}</p>
            </div>
            <div>
              <p className="font-semibold">Branch:</p>
              <p className="text-gray-700 dark:text-gray-300">{student.branch}</p>
            </div>
          </div>

          {/* Issued Books Section */}
          <h2 className="text-xl font-bold mt-6 mb-2">Issued Books</h2>
          <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="p-2 border">Book ID</th>
                <th className="p-2 border">Issue Date</th>
                <th className="p-2 border">Return Date</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {student.issuedBooks.map((book, index) => (
                <tr key={index} className="text-center">
                  <td className="p-2 border">{book.bookId}</td>
                  <td className="p-2 border">{new Date(book.issueDate).toLocaleDateString()}</td>
                  <td className="p-2 border">{book.returnDate ? new Date(book.returnDate).toLocaleDateString() : "Not Returned"}</td>
                  <td
                    className={`p-2 border font-bold ${
                      book.returned ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {book.returned ? "Returned" : "Issued"}
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

export default Profile;
