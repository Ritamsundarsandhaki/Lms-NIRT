import React, { useEffect, useState } from "react";
import axiosInstance from "../../components/Axios";
import { Loader, CheckCircle, XCircle, UserCircle } from "lucide-react";

const AdminAllLibrarians = () => {
  const [librarians, setLibrarians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLibrarians = async () => {
      try {
        const response = await axiosInstance.get("/api/admin/librarians");
        setLibrarians(response.data.librarians);
      } catch (err) {
        setError("Failed to load librarians. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLibrarians();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-3xl font-bold text-center text-indigo-700 dark:text-indigo-400">
        📚 All Librarians
      </h2>

      {loading && (
        <div className="flex justify-center items-center mt-5">
          <Loader size={28} className="animate-spin text-indigo-600" />
        </div>
      )}

      {error && (
        <div className="flex items-center text-red-600 bg-red-200 border border-red-400 p-3 rounded-lg mt-4">
          <XCircle size={20} className="mr-2" />
          {error}
        </div>
      )}

      {!loading && !error && librarians.length === 0 && (
        <p className="text-center text-gray-600 dark:text-gray-400 mt-5">
          No librarians found.
        </p>
      )}

      {!loading && librarians.length > 0 && (
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700">
            <thead>
              <tr className="bg-indigo-600 text-white text-left">
                <th className="p-3 border">Profile</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Mobile</th>
                <th className="p-3 border">Library</th>
                <th className="p-3 border">Approval</th>
              </tr>
            </thead>
            <tbody>
              {librarians.map((lib) => (
                <tr
                  key={lib._id}
                  className="border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  {/* Profile Image */}
                  <td className="p-3 border">
                    <div className="flex items-center">
                      <img
                        src={lib.profileImage || "https://via.placeholder.com/50"}
                        alt={lib.name}
                        className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600"
                      />
                    </div>
                  </td>

                  <td className="p-3 border">{lib.name}</td>
                  <td className="p-3 border">{lib.email}</td>
                  <td className="p-3 border">{lib.mobile}</td>
                  <td className="p-3 border">{lib.libraryName}</td>
                  
                  {/* Approval Status */}
                  <td className="p-3 border flex items-center">
                    {lib.isApproved ? (
                      <CheckCircle size={18} className="text-green-600 mr-2" />
                    ) : (
                      <XCircle size={18} className="text-red-600 mr-2" />
                    )}
                    {lib.isApproved ? "Approved" : "Pending"}
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

export default AdminAllLibrarians;
