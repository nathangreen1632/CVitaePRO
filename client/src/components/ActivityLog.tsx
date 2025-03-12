import React from "react";
import { Link } from "react-router-dom";

interface ActivityLogProps {
  activityLog: string[];
}

const ActivityLog: React.FC<ActivityLogProps> = ({ activityLog }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-8">
      <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
      <ul>
        {activityLog.length > 0 ? (
          activityLog.map((item, index) => (
            <li key={index} className="py-2 border-b">
              <Link to="#" className="hover:underline">
                {item.includes("Generated") ? (
                  <>
                    Generated Resume - <span className="text-green-500">{item.split(" - ")[1]}</span>
                  </>
                ) : (
                  <>
                    Edited Resume - <span className="text-blue-500">{item.split(" - ")[1]}</span>
                  </>
                )}
              </Link>
            </li>
          ))
        ) : (
          <li className="py-2 text-gray-400">No recent activity yet.</li>
        )}
      </ul>
    </div>
  );
};

export default ActivityLog;
