import React from "react";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Navigation */}
      <header className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Resume Dashboard</h1>
        <nav>
          <Link to="/settings" className="px-4 py-2 hover:text-blue-500">Settings</Link>
          <button className="px-4 py-2 bg-red-500 text-white rounded">Logout</button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Welcome to your Dashboard</h2>

        {/* Resume Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Link to="/upload" className="p-4 bg-blue-500 text-white text-center rounded">Upload Resume</Link>
          <Link to="/edit" className="p-4 bg-green-500 text-white text-center rounded">Edit Resume</Link>
          <Link to="/generate" className="p-4 bg-purple-500 text-white text-center rounded">Generate Resume</Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
          <ul>
            <li className="py-2 border-b">Edited Resume - <span className="text-blue-500">Software Engineer</span></li>
            <li className="py-2 border-b">Generated Resume - <span className="text-green-500">Marketing Specialist</span></li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
