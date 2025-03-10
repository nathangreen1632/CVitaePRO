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
import GenerateCoverLetter from "./pages/GenerateCoverLetter.jsx"; // ✅ NEW: Cover Letter Page
import Settings from "./pages/Settings.jsx"; // ✅ Add this line


const App = (): React.JSX.Element => {
  const isAuthenticated = !!localStorage.getItem("token"); // ✅ Auth check

  return (
    <Router>
      <AuthProvider>
        <Navbar />

        <Routes>
          {/* 🔥 Auto-redirect "/" to "/home" */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* ✅ Public Pages */}
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/features" element={<Features />} />


          {/* ✅ Auth-Protected Routes */}
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route path="/generate-cover-letter" element={isAuthenticated ? <GenerateCoverLetter /> : <Navigate to="/login" replace />} />
          <Route path="/resume" element={isAuthenticated ? <Resume /> : <Navigate to="/login" replace />} />
          <Route path="/resume-editor" element={isAuthenticated ? <ResumeEditor /> : <Navigate to="/login" replace />} /><Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" replace />} />



          {/* ✅ 404 Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
