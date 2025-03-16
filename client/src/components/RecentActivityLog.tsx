import React from "react";

interface RecentActivityLogProps {
  activityLog: string[];
}

const RecentActivityLog: React.FC<RecentActivityLogProps> = ({ activityLog }) => {
  const scrollToResume = (resumeName: string) => {
    const el = document.querySelector(
      `[id^="resume-"][id$="-${resumeName.replace(/\s+/g, "-")}"]`
    );

    if (el instanceof HTMLElement) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });

      // ✅ Add glow class
      el.classList.add("ring-10", "ring-blue-800", "animate-pulse");

      // ❌ Remove it after 1.5 seconds
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
            const resumeName = item.split(" - ")[1];
            return (
              <li key={item} className="py-2 border-b">
                <button
                  className="hover:underline text-left w-full"
                  onClick={() => scrollToResume(resumeName)}
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
