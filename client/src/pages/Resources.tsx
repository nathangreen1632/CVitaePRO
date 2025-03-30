import React from "react";
import { Link } from "react-router-dom";

const Resources: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-neutral-800 shadow-md rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-8 text-center">
          Resources
        </h1>
        <ul className="space-y-6 text-lg">
          <li>
            <Link
              to="/resources/faq"
              className="text-red-700 dark:text-red-400 hover:underline"
            >
              Frequently Asked Questions
            </Link>
          </li>
          <li>
            <Link
              to="/resources/tutorial"
              className="text-red-700 dark:text-red-400 hover:underline"
            >
              Resume Tutorial
            </Link>
          </li>
          <li>
            <Link
              to="/resources/resume-summary-tutorial"
              className="text-red-700 dark:text-red-400 hover:underline"
            >
              How to Write a Resume Summary
            </Link>
          </li>
          <li>
            <Link
              to="/resources/keyword-guide"
              className="text-red-700 dark:text-red-400 hover:underline"
            >
              Choosing the Right Keywords for ATS
            </Link>
          </li>
          <li>
            <Link
              to="/resources/ats-formatting"
              className="text-red-700 dark:text-red-400 hover:underline"
            >
              Formatting Your Resume for ATS Systems
            </Link>
          </li>
          <li>
            <Link
              to="/resources/quantifying-impact"
              className="text-red-700 dark:text-red-400 hover:underline"
            >
              How to Quantify Your Impact on a Resume
            </Link>
          </li>
          <li>
            <Link
              to="/resources/tailoring-resume"
              className="text-red-700 dark:text-red-400 hover:underline"
            >
              How to Tailor Your Resume for Every Job
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Resources;
