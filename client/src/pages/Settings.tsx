import React, { useContext, useState, useEffect } from "react";
import HeaderBar from "../components/layout/HeaderBar.tsx";
import { AuthContext } from "../context/AuthContext";

const Settings: React.FC = () => {
  const { user, token } = useContext(AuthContext)!;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChangePassword = async () => {
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Failed to change password.");
      } else {
        setSuccess(data.message ?? "Password updated successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      console.error("Change password error:", err);
      setError("Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <HeaderBar title="Settings" />

      <main className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Account Settings</h2>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold mb-2">Your Info</h3>
          <p><strong>Username:</strong> {user ?? "Unavailable"}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold mb-4">Change Password</h3>

          {mounted && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void handleChangePassword();
              }}
              className="space-y-4"
            >
              {/* ✅ Hidden field for username to satisfy autofill/accessibility */}
              <input
                type="text"
                name="username"
                autoComplete="username"
                value={user ?? ""}
                readOnly
                hidden
              />

              <div>
                <label htmlFor="currentPassword" className="block mb-1 font-medium">Current Password</label>
                <div className="flex">
                  <input
                    autoComplete="off"
                    id="currentPassword"
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full p-2 rounded-l border border-r-0 bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((prev) => !prev)}
                    className="px-5 bg-gray-300 dark:bg-gray-800 rounded-r border-l hover:bg-gray-600 border-gray-400 dark:border-gray-500"
                  >
                    {showCurrent ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="newPassword" className="block mb-1 font-medium">New Password</label>
                <div className="flex">
                  <input
                    autoComplete="off"
                    id="newPassword"
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2 rounded-l border border-r-0 bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((prev) => !prev)}
                    className="px-5 bg-gray-300 dark:bg-gray-800 rounded-r border-l hover:bg-gray-600 border-gray-400 dark:border-gray-500"
                  >
                    {showNew ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block mb-1 font-medium">Confirm New Password</label>
                <div className="flex">
                  <input
                    autoComplete="off"
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2 rounded-l border border-r-0 bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((prev) => !prev)}
                    className="px-5 bg-gray-300 dark:bg-gray-800 rounded-r border-l hover:bg-gray-600 border-gray-400 dark:border-gray-500"
                  >
                    {showConfirm ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {error && <p className="text-red-500 mt-3">{error}</p>}
              {success && <p className="text-green-700 mt-3">{success}</p>}

              <div className="text-right mt-6">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded disabled:opacity-60"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold mb-2">Preferences</h3>
          <p className="text-gray-500 dark:text-gray-400">More settings coming soon, including:</p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2">
            <li>Enable/disable auto-save</li>
            <li>Customize resume template</li>
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
