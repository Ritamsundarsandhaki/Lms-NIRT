import React, { useEffect, useState } from "react";
import axiosInstance from "../../components/Axios"; // Import the Axios instance

// Custom Card Component
const Card = ({ children }) => (
  <div className="bg-white shadow-xl border border-gray-200 rounded-2xl p-8 w-full max-w-md transition-transform hover:scale-105 duration-300">
    {children}
  </div>
);

// Custom Skeleton Loader
const Skeleton = () => (
  <div className="w-full max-w-md bg-white shadow-xl border border-gray-200 rounded-2xl p-8 animate-pulse">
    <div className="flex flex-col items-center gap-4">
      <div className="w-28 h-28 bg-gray-300 rounded-full"></div>
      <div className="w-32 h-6 bg-gray-300 rounded-md"></div>
      <div className="w-40 h-4 bg-gray-300 rounded-md"></div>
      <div className="w-36 h-4 bg-gray-300 rounded-md"></div>
    </div>
  </div>
);

// Custom Avatar Component
const Avatar = ({ src, alt, fallback }) => (
  <div className="w-28 h-28 rounded-full border-4 border-blue-600 shadow-md overflow-hidden flex items-center justify-center text-white text-3xl font-semibold bg-gray-400">
    {src ? <img src={src} alt={alt || "User Avatar"} className="w-full h-full object-cover" /> : fallback}
  </div>
);

function Profile() {
  const [librarian, setLibrarian] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/api/librarian/profile");
        setLibrarian(response.data.librarian);
      } catch (error) {
        console.error("Error fetching profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <Skeleton />;
  }

  if (!librarian) {
    return <p className="text-red-500 text-center text-lg font-semibold">⚠️ Failed to load profile.</p>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <Card>
        <div className="flex flex-col items-center gap-6 text-center">
          <Avatar
            src={librarian.avatar || "/default-avatar.png"}
            alt={librarian.name || "Librarian"}
            fallback={librarian.name ? librarian.name.charAt(0) : "?"}
          />
          <h2 className="text-3xl font-bold text-gray-900">
            {librarian.name || "Unknown User"}
          </h2>
          <p className="text-gray-700 text-lg">
            {librarian.email || "No email available"}
          </p>
          <p className="text-gray-500 font-medium text-base">📚 Role: Librarian</p>
        </div>
      </Card>
    </div>
  );
}

export default Profile;
