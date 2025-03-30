import React from "react";
import { Routes, Route } from "react-router-dom";
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
import ProtectedRoute from "../components/ProtectedRoutes.jsx";
import ActivityWatcher from "../components/ActivityWatcher.jsx";
import Policies from "../pages/Policies.jsx";
import LegalPage from "../pages/LegalPage.jsx";
import AdminLogsPage from "../pages/AdminLogsPage.jsx";
import AdminRoute from "../components/AdminRoute.jsx";
import ResumeTutorial from "../tutorials/ResumeTutorial.jsx";
import Resources from "../pages/Resources.jsx";
import FaQ from "../tutorials/FAQ.jsx";
import ResumeSummaryTutorial from "../tutorials/ResumeSummaryTutorial.jsx";
import KeywordOptimizationTutorial from "../tutorials/KeywordOptimizationTutorial.jsx";
import ATSFormattingTutorial from "../tutorials/ATSFormattingTutorial.jsx";
import QuantifyingImpactTutorial from "../tutorials/QuantifyingImpactTutorial.jsx";
import TailoringResumeTutorial from "../tutorials/TailoringResumeTutorial.jsx";







const AppRoutes = (): React.JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/features" element={<Features />} />
      <Route path="/policies" element={<Policies />} />
      <Route path="/legal" element={<LegalPage />} />

      {/* Resources */}
      <Route path="/resources" element={<Resources />} />
      <Route path="/resources/faq" element={<FaQ />} />
      <Route path="/resources/tutorial" element={<ResumeTutorial />} />
      <Route path="/resources/resume-summary-tutorial" element={<ResumeSummaryTutorial />} />
      <Route path="/resources/keyword-guide" element={<KeywordOptimizationTutorial />} />
      <Route path="/resources/ats-formatting" element={<ATSFormattingTutorial />} />
      <Route path="/resources/quantifying-impact" element={<QuantifyingImpactTutorial />} />
      <Route path="/resources/tailoring-resume" element={<TailoringResumeTutorial />} />





      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <ActivityWatcher>
              <Dashboard />
            </ActivityWatcher>
          </ProtectedRoute>
        }
      />
      <Route
        path="/generate-cover-letter"
        element={
          <ProtectedRoute>
            <ActivityWatcher>
              <GenerateCoverLetter />
            </ActivityWatcher>
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume-form"
        element={
          <ProtectedRoute>
            <ActivityWatcher>
              <Resume />
            </ActivityWatcher>
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume-editor"
        element={
          <ProtectedRoute>
            <ActivityWatcher>
              <ResumeEditor />
            </ActivityWatcher>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <ActivityWatcher>
              <Settings />
            </ActivityWatcher>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <ActivityWatcher>
              <AdminRoute>
                <AdminLogsPage />
              </AdminRoute>
            </ActivityWatcher>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
