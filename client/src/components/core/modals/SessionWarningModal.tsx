import React, { useEffect, useRef, useState } from "react";

interface SessionWarningModalProps {
  onStayLoggedIn: () => void;
  onLogout: () => void;
  countdownLimit?: number;
}

const SessionWarningModal: React.FC<SessionWarningModalProps> = ({
                                                                   onStayLoggedIn,
                                                                   onLogout,
                                                                   countdownLimit = 2 * 60 * 1000,
                                                                 }) => {
  const [remainingTime, setRemainingTime] = useState(countdownLimit);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRemainingTime((prev) => Math.max(prev - 1000, 0));
    }, 1000);

    timeoutRef.current = setTimeout(() => {
      clearInterval(intervalRef.current!);
      onLogout();
    }, countdownLimit);

    return () => {
      clearInterval(intervalRef.current!);
      clearTimeout(timeoutRef.current!);
    };
  }, [countdownLimit, onLogout]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 text-center border border-gray-300 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Session Expiring Soon
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          You've been inactive for a while. Confirm to stay logged in.
        </p>

        <div className="text-3xl font-mono text-red-700 dark:text-red-400 mb-6">
          {formatTime(remainingTime)}
        </div>

        <div className="flex justify-center gap-4">
          <button
            aria-label="I'm still here"
            onClick={() => {
              clearInterval(intervalRef.current!);
              clearTimeout(timeoutRef.current!);
              onStayLoggedIn();
            }}
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded"
          >
            I'm still here
          </button>

          <button
            aria-label="Log me out"
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded"
          >
            Log me out
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionWarningModal;
