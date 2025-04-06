import React, { useEffect, useState } from "react";
import HeaderBar from "../components/layout/HeaderBar.tsx";

interface LogEntry {
  userId: string;
  username: string;
  document: string;
  version: string;
  acceptedAt: string;
}

const AdminLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("/api/admin/legal-logs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setLogs(data.logs);
        } else {
          setError(data.error || "Failed to fetch logs");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Unable to retrieve logs.");
      } finally {
        setLoading(false);
      }
    };

    void fetchLogs();
  }, []);

  const exportCSV = () => {
    const headers = ["User ID", "Username", "Document", "Version", "Accepted At"];
    const rows = logs.map((log) =>
      [log.userId, log.username, log.document, log.version, log.acceptedAt].join(",")
    );
    const csvContent = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "legal_logs.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "legal_logs.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderContent = () => {
    if (loading) {
      return <p className="text-gray-300">Loading logs...</p>;
    }

    if (error) {
      return <p className="text-red-500">{error}</p>;
    }

    return (
      <>
        <div className="mb-4 flex gap-4">
          <button
            onClick={exportCSV}
            className="bg-blue-600 hover:bg-blue-800 text-white font-semibold px-4 py-2 rounded"
          >
            Export CSV
          </button>
          <button
            onClick={exportJSON}
            className="bg-green-600 hover:bg-green-800 text-white font-semibold px-4 py-2 rounded"
          >
            Export JSON
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="min-w-full bg-white text-black rounded-md overflow-hidden">
            <thead className="bg-gray-200 text-sm uppercase text-left font-semibold">
            <tr>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Document</th>
              <th className="px-4 py-3">Version</th>
              <th className="px-4 py-3">Accepted At</th>
            </tr>
            </thead>
            <tbody>
            {logs.map((log) => (
              <tr
                key={`${log.userId}-${log.document}-${log.acceptedAt}`}
                className="border-t border-gray-300 text-sm"
              >
                <td className="px-4 py-2">{log.username}</td>
                <td className="px-4 py-2">{log.document}</td>
                <td className="px-4 py-2">{log.version}</td>
                <td className="px-4 py-2">{new Date(log.acceptedAt).toLocaleString()}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <HeaderBar title="Admin Panel" /> {/* ✅ Step 2: Add it here */}
      <div className="p-8">{renderContent()}</div>
    </div>
  );
};

export default AdminLogsPage;
