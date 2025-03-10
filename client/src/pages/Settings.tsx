import React, { useContext } from "react";
import HeaderBar from "../components/HeaderBar";
import { AuthContext } from "../context/AuthContext";

const Settings: React.FC = () => {
  const { user, token } = useContext(AuthContext)!;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <HeaderBar title="Settings" />

      <main className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Account Settings</h2>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold mb-2">Your Info</h3>
          <p><strong>Username:</strong> {user ?? "Unavailable"}</p>
          <p><strong>Token:</strong> {token ? `${token.slice(0, 20)}...` : "Not logged in"}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold mb-2">Preferences</h3>
          <p className="text-gray-500 dark:text-gray-400">More settings coming soon, including:</p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2">
            <li>Change password</li>
            <li>Enable/disable auto-save</li>
            <li>Customize resume template</li>
            <li>Dark/light mode preference</li>
          </ul>
        </div>

        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 italic">
            Let us know what features you'd like to see here!
          </p>
        </div>
      </main>
    </div>
  );
};

export default Settings;
