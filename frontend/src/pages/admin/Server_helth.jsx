import React, { useEffect, useState } from "react";
import axiosInstance from "../../components/Axios";
import { Loader, XCircle, CheckCircle } from "lucide-react";

const ServerHealth = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await axiosInstance.get("/api/admin/health");
        setHealth(response.data);
      } catch (err) {
        setError("Failed to fetch server health. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-center text-indigo-700 dark:text-indigo-400">
        🔥 Server Health Check
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

      {health && (
        <div className="mt-5 p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800">
          <p className="text-lg font-semibold flex items-center">
            {health.success ? (
              <CheckCircle size={20} className="text-green-500 mr-2" />
            ) : (
              <XCircle size={20} className="text-red-500 mr-2" />
            )}
            {health.message}
          </p>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            <strong>Uptime:</strong> {Math.floor(health.uptime / 60)} minutes
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Timestamp:</strong> {new Date(health.timestamp).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default ServerHealth;