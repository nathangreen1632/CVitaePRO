import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard.jsx";
import GenerateCoverLetter from "../pages/GenerateCoverLetter.jsx";
import Resume from "../pages/Resume.jsx";
import ResumeEditor from "../pages/ResumeEditor.jsx";
import Settings from "../pages/Settings.jsx";
import Register from "../pages/Register.jsx";
import Login from "../pages/Login.jsx";
import Features from "../pages/Features.jsx";
import NotFound from "../pages/NotFound.jsx";
import Home from "../pages/Home.jsx";
import ProtectedRoute from "../components/ProtectedRoutes.jsx"; // ✅ NEW

const AppRoutes = (): React.JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/features" element={<Features />} />

      {/* ✅ Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/generate-cover-letter"
        element={
          <ProtectedRoute>
            <GenerateCoverLetter />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume"
        element={
          <ProtectedRoute>
            <Resume />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume-editor"
        element={
          <ProtectedRoute>
            <ResumeEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
