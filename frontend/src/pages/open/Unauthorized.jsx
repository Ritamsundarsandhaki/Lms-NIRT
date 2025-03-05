import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

const NotFound = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#052277] px-6">
        {/* 404 Illustration */}
        <div className="flex flex-col items-center">
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/error-404-page-not-found-7277906-5940597.png"
            alt="404 Not Found"
            className="w-80 md:w-96 mb-6"
          />
          <h1 className="text-7xl font-extrabold text-indigo-300 mb-4">404</h1>
          <h2 className="text-3xl font-semibold mb-2">Oops! Page Not Found</h2>
          <p className="text-lg text-gray-300 mb-6 text-center max-w-md">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Link
            to="/"
            className="px-6 py-3 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 transform transition hover:scale-105"
          >
            Go Home
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
