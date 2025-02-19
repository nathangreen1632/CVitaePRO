import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Spline from "@splinetool/react-spline";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ResumeEditor from "./pages/ResumeEditor"; // ✅ Added ResumeEditor import
import { AuthProvider } from "./context/authProvider.js";

const App = (): React.JSX.Element => {
  return (
    <Router>
      <AuthProvider>
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
                  <Link to="/register" className="text-white text-lg font-bold hover:underline">
                    Get Started
                  </Link>
                </div>
              </div>
            }
          />
          {/* ✅ Other Pages */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/resume-editor" element={<ResumeEditor />} /> {/* ✅ Added ResumeEditor Route */}
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
