import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
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

const AppRoutes = (): React.JSX.Element => {
  const { token } = useAuth();
  const isAuthenticated = !!token;

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/features" element={<Features />} />
      <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
      <Route path="/generate-cover-letter" element={isAuthenticated ? <GenerateCoverLetter /> : <Navigate to="/login" replace />} />
      <Route path="/resume" element={isAuthenticated ? <Resume /> : <Navigate to="/login" replace />} />
      <Route path="/resume-editor" element={isAuthenticated ? <ResumeEditor /> : <Navigate to="/login" replace />} />
      <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
