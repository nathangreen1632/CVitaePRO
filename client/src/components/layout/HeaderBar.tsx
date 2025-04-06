import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.tsx";
import { useNavigate } from "react-router-dom";

interface HeaderBarProps {
  title: string;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ title }) => {
  const { logout } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/", { replace: true });
    logout();
  };

  const handleSettings = () => {
    navigate("/settings");
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center sticky top-0 z-20">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>

      <div className="flex gap-4">
        <button
          onClick={handleSettings}
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-4 py-2 rounded"
        >
          Settings
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-600 text-white font-medium px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default HeaderBar;
