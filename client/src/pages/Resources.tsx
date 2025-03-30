import React from "react";
import { Link } from "react-router-dom";

const Resources: React.FC = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Resources</h1>
      <ul className="space-y-4 text-lg">
        <li>
          <Link to="/resources/faq" className="text-blue-700 hover:underline">
            ❓ Frequently Asked Questions
          </Link>
        </li>
        <li>
          <Link to="/resources/tutorial" className="text-blue-700 hover:underline">
            📘 Resume Tutorial
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Resources;
