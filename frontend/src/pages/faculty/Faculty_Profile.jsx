import React, { useEffect, useState } from "react";
import axiosInstance from "../../components/Axios";

const FacultyProfile = () => {
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacultyProfile = async () => {
      try {
        const response = await axiosInstance.get("/api/faculty/profile");
        if (response.data.success) {
          setFaculty(response.data.faculty);
        }
      } catch (error) {
        console.error("Error fetching faculty profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFacultyProfile();
  }, []);

  return (
    <div className="p-4 sm:p-6 bg-white shadow-md rounded-md max-w-3xl mx-auto">
      <h2 className="text-lg sm:text-xl font-bold mb-4 text-center">Faculty Profile</h2>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <p className="animate-pulse text-gray-600">Loading profile...</p>
        </div>
      ) : faculty ? (
        <div className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <p><strong>Name:</strong> {faculty.name}</p>
            <p><strong>Email:</strong> {faculty.email}</p>
            <p><strong>Employee ID:</strong> {faculty.employeeId}</p>
            <p><strong>Department:</strong> {faculty.department}</p>
            <p><strong>Mobile:</strong> {faculty.mobile}</p>
          </div>
          <h3 className="text-md font-bold mt-6 border-b pb-2">Issued Books</h3>
          {faculty.issuedBooks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="border p-2">Book ID</th>
                    <th className="border p-2">Issue Date</th>
                    <th className="border p-2">Return Date</th>
                    <th className="border p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {faculty.issuedBooks.map((book) => (
                    <tr key={book._id} className="text-center border">
                      <td className="border p-2">{book.bookId}</td>
                      <td className="border p-2">{new Date(book.issueDate).toLocaleDateString()}</td>
                      <td className="border p-2">
                        {book.returnDate && book.returnDate !== "Not Returned"
                          ? new Date(book.returnDate).toLocaleDateString()
                          : "Not Returned"}
                      </td>
                      <td
                        className={`border p-2 font-semibold ${book.returned ? "text-green-600" : "text-red-600"}`}
                      >
                        {book.returned ? "Returned" : "Issued"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No books issued.</p>
          )}
        </div>
      ) : (
        <p>Faculty profile not found.</p>
      )}
    </div>
  );
};

export default FacultyProfile;
