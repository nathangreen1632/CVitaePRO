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
import HelpCenter from "../pages/HelpCenter.jsx";
import FaQ from "../tutorials/FAQ.jsx";
import ResumeSummaryTutorial from "../tutorials/ResumeSummaryTutorial.jsx";
import KeywordOptimizationTutorial from "../tutorials/KeywordOptimizationTutorial.jsx";
import ATSFormattingTutorial from "../tutorials/ATSFormattingTutorial.jsx";
import QuantifyingImpactTutorial from "../tutorials/QuantifyingImpactTutorial.jsx";
import TailoringResumeTutorial from "../tutorials/TailoringResumeTutorial.jsx";
import CommonResumeMistakesTutorial from "../tutorials/CommonResumeMistakesTutorial.jsx";
import TemplateUsageTutorial from "../tutorials/TemplateUsageTutorial.jsx";
import FileNamingExportingTutorial from "../tutorials/FileNamingExportingTutorial.jsx";
import EmploymentGapsTutorial from "../tutorials/EmploymentGapsTutorial.jsx";
import RemoteWorkTutorial from "../tutorials/RemoteWorkTutorial.jsx";
import CareerChangeTutorial from "../tutorials/CareerChangeTutorial.jsx";
import NoExperienceTutorial from "../tutorials/NoExperienceTutorial.jsx";
import NoExperienceResumeTips from "../tutorials/NoExperienceResumeTips.jsx";
import CollegeGradResumeTutorial from "../tutorials/CollegeGradResumeTutorial.jsx";
import GapExplanationTutorial from "../tutorials/GapExplanationTutorial.jsx";
import ResumeHeaderTutorial from "../tutorials/ResumeHeaderTutorial.jsx";
import IndustryFormattingTutorial from "../tutorials/IndustryFormattingTutorial.jsx";
import CertificationsTutorial from "../tutorials/CertificationsTutorial.jsx";
import HandlingEmploymentGaps from "../tutorials/HandlingEmploymentGaps.jsx";
import ShowcasingSoftSkills from "../tutorials/ShowcasingSoftSkills.jsx";
import InternationalStudentResumeTips from "../tutorials/InternationalStudentResumeTips.jsx";
import ResumeForCareerChange from "../tutorials/ResumeForCareerChange.jsx";
import BuildResumeFromScratch from "../tutorials/BuildResumeFromScratch.tsx";
import UsingAchievementsEffectively from "../tutorials/UsingAchievementsEffectively.tsx";
import FinalResumeChecklist from "../tutorials/FinalResumeChecklist.tsx";


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
      <Route path="/help-center" element={<HelpCenter />} />
      <Route path="/help-center/faq" element={<FaQ />} />
      <Route path="/help-center/tutorial" element={<ResumeTutorial />} />
      <Route path="/help-center/resume-summary-tutorial" element={<ResumeSummaryTutorial />} />
      <Route path="/help-center/keyword-guide" element={<KeywordOptimizationTutorial />} />
      <Route path="/help-center/ats-formatting" element={<ATSFormattingTutorial />} />
      <Route path="/help-center/quantifying-impact" element={<QuantifyingImpactTutorial />} />
      <Route path="/help-center/tailoring-resume" element={<TailoringResumeTutorial />} />
      <Route path="/help-center/common-mistakes" element={<CommonResumeMistakesTutorial />} />
      <Route path="/help-center/template-usage" element={<TemplateUsageTutorial />} />
      <Route path="/help-center/file-naming" element={<FileNamingExportingTutorial />} />
      <Route path="/help-center/employment-gaps" element={<EmploymentGapsTutorial />} />
      <Route path="/help-center/remote-work" element={<RemoteWorkTutorial />} />
      <Route path="/help-center/career-change" element={<CareerChangeTutorial />} />
      <Route path="/help-center/no-experience" element={<NoExperienceTutorial />} />
      <Route path="/help-center/no-experience-resume-tips" element={<NoExperienceResumeTips />} />
      <Route path="/help-center/college-grad" element={<CollegeGradResumeTutorial />} />
      <Route path="/help-center/gap-explanation" element={<GapExplanationTutorial />} />
      <Route path="/help-center/resume-header" element={<ResumeHeaderTutorial />} />
      <Route path="/help-center/industry-formatting" element={<IndustryFormattingTutorial />} />
      <Route path="/help-center/certifications" element={<CertificationsTutorial />} />
      <Route path="/help-center/handling-employment-gaps" element={<HandlingEmploymentGaps />} />
      <Route path="/help-center/showcasing-soft-skills" element={<ShowcasingSoftSkills />} />
      <Route path="/help-center/international-student-resume-tips" element={<InternationalStudentResumeTips />} />
      <Route path="/help-center/resume-for-career-change" element={<ResumeForCareerChange />} />
      <Route path="/help-center/build-resume-from-scratch" element={<BuildResumeFromScratch />} />
      <Route path="/help-center/using-achievements-effectively" element={<UsingAchievementsEffectively />} />
      <Route path="/help-center/final-resume-checklist" element={<FinalResumeChecklist />} />

      {/* Protected Routes */}
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
