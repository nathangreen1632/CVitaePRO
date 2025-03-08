import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="text-gray-300 mt-4">Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-6 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
