import React from "react";

interface RecentActivityLogProps {
  activityLog: string[];
}

const RecentActivityLog: React.FC<RecentActivityLogProps> = ({ activityLog }) => {
  const scrollToResume = (resumeId: string) => {
    const el = document.getElementById(`resume-${resumeId}`);

    if (el instanceof HTMLElement) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      el.classList.add("ring-10", "ring-blue-800", "animate-pulse");
      setTimeout(() => {
        el.classList.remove("ring-10", "ring-blue-800", "animate-pulse");
      }, 1500);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-8">
      <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
      <ul>
        {activityLog.length > 0 ? (
          activityLog.map((item: string) => {
            const match = RegExp(/- (.*?) \[(.*?)]$/).exec(item);
            const resumeName = match?.[1] ?? "Unknown";
            const resumeId = match?.[2] ?? "";

            return (
              <li key={item} className="py-2 border-b">
                <button
                  className="hover:underline text-left w-full"
                  onClick={() => scrollToResume(resumeId)}
                >
                  {item.includes("Generated") ? (
                    <>
                      Generated Resume - <span className="text-green-400">{resumeName}</span>
                    </>
                  ) : (
                    <>
                      Edited Resume - <span className="text-blue-400">{resumeName}</span>
                    </>
                  )}
                </button>
              </li>
            );
          })
        ) : (
          <li className="py-2 text-gray-400">No recent activity yet.</li>
        )}
      </ul>
    </div>
  );
};

export default RecentActivityLog;
