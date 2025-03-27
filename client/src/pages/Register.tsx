import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import LegalAgreementModal from "../components/LegalAgreementModal";

const Register = (): React.JSX.Element => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [agreed, setAgreed] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const { success, token } = await register(username, password);

      if (!success || !token) {
        setError("Registration failed. Try a different username.");
        return;
      }

      const agreements = [
        { documentType: "tos", version: "2025-03-26" },
        { documentType: "privacy", version: "2025-03-26" },
        { documentType: "disclaimer", version: "2025-03-26" },
        { documentType: "eula", version: "2025-03-26" },
      ];

      await Promise.all(
        agreements.map((agreement) =>
          fetch("/api/legal/agree", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(agreement),
          })
        )
      );

      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      {!agreed && <LegalAgreementModal onComplete={() => setAgreed(true)} />}
      {agreed && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">Register</h2>
          {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete={"username"}
            className="w-full p-2 mb-4 border border-black rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={"new-password"}
            className="w-full p-2 mb-4 border border-black rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete={"new-password"}
            className="w-full p-2 mb-4 border border-black rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-800 transition"
          >
            Register
          </button>
        </form>
      )}
    </div>
  );
};

export default Register;
