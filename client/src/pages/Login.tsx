import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth.tsx";
import { useNavigate } from "react-router-dom";

const Login = (): React.JSX.Element => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // State for username & password
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      const success: boolean = await login(username, password);
      if (success) {
        navigate("/dashboard");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      {/* 🔹 Dark background applied to full screen */}
      <form className="bg-white p-8 rounded-lg shadow-md w-96" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">Login</h2>
        {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full p-2 mb-4 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 mb-4 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
