import React from "react";
import { Link } from "react-router-dom";

const HelpCenter: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-2xl p-8 text-neutral-900 dark:text-neutral-100">
        <h1 className="text-4xl font-bold mb-10 text-center">
          Help Center & Resources
        </h1>
        <ul className="space-y-6 text-lg font-medium">
          <li className="flex items-start space-x-3">
            <span className="text-red-500 mt-1">•</span>
            <Link
              to="/help-center/faq"
              className="text-neutral-700 dark:text-white hover:text-red-500 dark:hover:text-red-500 transition"
            >
              Frequently Asked Questions
            </Link>
          </li>
          <li className="flex items-start space-x-3">
            <span className="text-red-500 mt-1">•</span>
            <Link
              to="/help-center/tutorial"
              className="text-neutral-700 dark:text-white hover:text-red-500 dark:hover:text-red-500 transition"
            >
              How to Build a Powerful Resume
            </Link>
          </li>
          <li className="flex items-start space-x-3">
            <span className="text-red-500 mt-1">•</span>
            <Link
              to="/help-center/resume-summary-tutorial"
              className="text-neutral-700 dark:text-white hover:text-red-500 dark:hover:text-red-500 transition"
            >
              How to Write a Resume Summary
            </Link>
          </li>
          <li className="flex items-start space-x-3">
            <span className="text-red-500 mt-1">•</span>
            <Link
              to="/help-center/keyword-guide"
              className="text-neutral-700 dark:text-white hover:text-red-500 dark:hover:text-red-500 transition"
            >
              Choosing the Right Keywords for ATS
            </Link>
          </li>
          <li className="flex items-start space-x-3">
            <span className="text-red-500 mt-1">•</span>
            <Link
              to="/help-center/ats-formatting"
              className="text-neutral-700 dark:text-white hover:text-red-500 dark:hover:text-red-500 transition"
            >
              Formatting Your Resume for ATS Systems
            </Link>
          </li>
          <li className="flex items-start space-x-3">
            <span className="text-red-500 mt-1">•</span>
            <Link
              to="/help-center/quantifying-impact"
              className="text-neutral-700 dark:text-white hover:text-red-500 dark:hover:text-red-500 transition"
            >
              How to Quantify Your Impact on a Resume
            </Link>
          </li>
          <li className="flex items-start space-x-3">
            <span className="text-red-500 mt-1">•</span>
            <Link
              to="/help-center/tailoring-resume"
              className="text-neutral-700 dark:text-white hover:text-red-500 dark:hover:text-red-500 transition"
            >
              How to Tailor Your Resume for Every Job
            </Link>
          </li>
          <li className="flex items-start space-x-3">
            <span className="text-red-500 mt-1">•</span>
            <Link
              to="/help-center/common-mistakes"
              className="text-neutral-700 dark:text-white hover:text-red-500 dark:hover:text-red-500 transition"
            >
              Common Resume Mistakes to Avoid
            </Link>
          </li>
          <li className="flex items-start space-x-3">
            <span className="text-red-500 mt-1">•</span>
            <Link
              to="/help-center/template-usage"
              className="text-neutral-700 dark:text-white hover:text-red-500 dark:hover:text-red-500 transition"
            >
              How to Use Resume Templates Effectively
            </Link>
          </li>
          <li className="flex items-start space-x-3">
            <span className="text-red-500 mt-1">•</span>
            <Link
              to="/help-center/file-naming"
              className="text-neutral-700 dark:text-white hover:text-red-500 dark:hover:text-red-500 transition"
            >
              Best Practices for File Naming & Exporting
            </Link>
          </li>
          <li className="flex items-start space-x-3">
            <span className="text-red-500 mt-1">•</span>
            <Link
              to="/help-center/employment-gaps"
              className="text-neutral-700 dark:text-white hover:text-red-500 dark:hover:text-red-500 transition"
            >
              How to Address Employment Gaps
            </Link>
          </li>
          <li className="flex items-start space-x-3">
            <span className="text-red-500 mt-1">•</span>
            <Link
              to="/help-center/remote-work"
              className="text-neutral-700 dark:text-white hover:text-red-500 dark:hover:text-red-500 transition"
            >
              How to Showcase Remote Work Experience Effectively
            </Link>
          </li>
          <li className="flex items-start space-x-3">
            <span className="text-red-500 mt-1">•</span>
            <Link
              to="/help-center/career-change"
              className="text-neutral-700 dark:text-white hover:text-red-500 dark:hover:text-red-500 transition"
            >
              How to Explain Career Changes on a Resume
            </Link>
          </li>
          <li className="flex items-start space-x-3">
            <span className="text-red-500 mt-1">•</span>
            <Link
              to="/help-center/no-experience"
              className="text-neutral-700 dark:text-white hover:text-red-500 dark:hover:text-red-500 transition"
            >
              How to Build a Resume with No Work Experience
            </Link>
          </li>
          <li className="flex items-start space-x-3">
            <span className="text-red-500 mt-1">•</span>
            <Link
              to="/help-center/college-grad"
              className="text-neutral-700 dark:text-white hover:text-red-500 dark:hover:text-red-500 transition"
            >
              Resume Tips for Recent College Graduates
            </Link>
          </li>
          <li className="flex items-start space-x-3">
            <span className="text-red-500 mt-1">•</span>
            <Link
              to="/help-center/gap-explanation"
              className="text-neutral-700 dark:text-white hover:text-red-500 dark:hover:text-red-500 transition"
            >
              How to Explain Employment Gaps on Your Resume
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HelpCenter;
