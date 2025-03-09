import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx"; // ✅ Navbar included
import NotFound from "./pages/NotFound.jsx"; // ✅ 404 Route added
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import ResumeEditor from "./pages/ResumeEditor.jsx";
import Home from "./pages/Home.jsx"; // ✅ Home page
import Features from "./pages/Features.jsx"; // ✅ Features page
import Resume from "./pages/Resume.jsx"; // ✅ Resume page
import { AuthProvider } from "./context/AuthContext.jsx"; // 🔥 ✅ Auth Context
import Dashboard from "./pages/Dashboard.jsx";

const App = (): React.JSX.Element => {
  return (
    <Router>
      <AuthProvider> {/* 🔥 Wrap everything inside AuthProvider */}
        <Navbar /> {/* ✅ Navbar persists on all pages */}

        <Routes>
          {/* 🔥 Auto-redirect "/" to "/home" */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* ✅ Other Pages */}
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/features" element={<Features />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/resume-editor" element={<ResumeEditor />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* ✅ 404 Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
