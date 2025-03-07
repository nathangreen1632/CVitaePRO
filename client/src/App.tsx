import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Spline from "@splinetool/react-spline";
import Navbar from "./components/Navbar"; // ✅ Navbar included
import NotFound from "./pages/NotFound"; // ✅ 404 Route added
import Register from "./pages/Register";
import Login from "./pages/Login";
import ResumeEditor from "./pages/ResumeEditor";
import Home from "./pages/Home"; // ✅ Added Home page
import Features from "./pages/Features"; // ✅ Added Features page
import Resume from "./pages/Resume"; // ✅ Added Resume page
import { AuthProvider } from "./context/authProvider.js";

const App = (): React.JSX.Element => {
  return (
    <Router>
      <AuthProvider>
        <Navbar /> {/* ✅ Navbar persists on all pages */}

        <Routes>
          {/* ✅ Landing Page with Spline */}
          <Route
            path="/"
            element={
              <div className="relative w-full h-screen bg-black">
                <Spline
                  scene="https://prod.spline.design/ebUc8RxpXDIysAET/scene.splinecode"
                  onLoad={() => console.log("Spline loaded successfully")}
                  onError={(error) => console.error("Spline failed to load:", error)}
                />
                <div className="absolute top-4 left-4">
                  <a
                    href="/register"
                    className="text-white text-lg font-bold bg-red-500 px-6 py-3 rounded-lg shadow-lg hover:bg-red-600 transition"
                  >
                    Get Started
                  </a>
                </div>
              </div>
            }
          />

          {/* ✅ Other Pages */}
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/features" element={<Features />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/resume-editor" element={<ResumeEditor />} />

          {/* ✅ 404 Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;