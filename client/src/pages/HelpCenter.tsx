import React from "react";
import { Link } from "react-router-dom";

const HelpCenter: React.FC = () => {
  const sections = [
    {
      title: "Getting Started",
      links: [
        { text: "Frequently Asked Questions", to: "/help-center/faq" },
        { text: "How to Build a Powerful Resume", to: "/help-center/tutorial" },
        { text: "Building a Resume from Scratch", to: "/help-center/build-resume-from-scratch" },
        { text: "Final Resume Checklist Before You Submit", to: "/help-center/final-resume-checklist" },
      ],
    },
    {
      title: "Writing Better Resumes",
      links: [
        { text: "How to Write a Resume Summary", to: "/help-center/resume-summary-tutorial" },
        { text: "Choosing the Right Keywords for ATS", to: "/help-center/keyword-guide" },
        { text: "Formatting Your Resume for ATS Systems", to: "/help-center/ats-formatting" },
        { text: "How to Quantify Your Impact on a Resume", to: "/help-center/quantifying-impact" },
        { text: "How to Tailor Your Resume for Every Job", to: "/help-center/tailoring-resume" },
        { text: "Using Achievements Effectively", to: "/help-center/using-achievements-effectively" },
        { text: "Showcasing Soft Skills Effectively", to: "/help-center/showcasing-soft-skills" },
      ],
    },
    {
      title: "Common Issues & Solutions",
      links: [
        { text: "Common Resume Mistakes to Avoid", to: "/help-center/common-mistakes" },
        { text: "Handling Employment Gaps on Your Resume", to: "/help-center/handling-employment-gaps" },
        { text: "How to Explain Career Changes on a Resume", to: "/help-center/career-change" },
        { text: "Resume Tips for Career Changers", to: "/help-center/resume-for-career-change" },
        { text: "How to Showcase Remote Work Experience Effectively", to: "/help-center/remote-work" },
      ],
    },
    {
      title: "Special Scenarios",
      links: [
        { text: "Resume Tips for Recent College Graduates", to: "/help-center/college-grad" },
        { text: "How to Build a Resume with No Work Experience", to: "/help-center/no-experience" },
        { text: "Resume Tips for Job Seekers with No Experience", to: "/help-center/no-experience-resume-tips" },
        { text: "Resume Tips for International Students", to: "/help-center/international-student-resume-tips" },
      ],
    },
    {
      title: "Formatting & Templates",
      links: [
        { text: "How to Use Resume Templates Effectively", to: "/help-center/template-usage" },
        { text: "Resume Formatting Across Different Industries", to: "/help-center/industry-formatting" },
        { text: "Crafting the Perfect Resume Header", to: "/help-center/resume-header" },
        { text: "Listing Certifications & Training on Your Resume", to: "/help-center/certifications" },
        { text: "Best Practices for File Naming & Exporting", to: "/help-center/file-naming" },
        { text: "How to Explain Employment Gaps on Your Resume", to: "/help-center/gap-explanation" },
      ],
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-gray-900 py-12 px-4 relative">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-2xl p-8 text-neutral-900 dark:text-neutral-100">
        <h1 className="text-4xl font-bold mb-10 text-center text-gray-900 dark:text-white">
          Help Center & Resources
        </h1>

        {sections.map((section) => (
          <div key={section.title} className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-red-500 border-b border-neutral-300 dark:border-neutral-700 pb-2">
              {section.title}
            </h2>
            <ul className="space-y-4 text-lg font-medium">
              {section.links.map((link) => (
                <li key={link.to} className="flex items-start space-x-3">
                  <span className="text-red-500 mt-1">•</span>
                  <Link
                    to={link.to}
                    className="text-neutral-700 dark:text-white hover:text-red-500 dark:hover:text-red-500 transition"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* 🔴 Floating Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 bg-red-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-red-700 transition"
        aria-label="Back to top"
      >
        ↑ Top
      </button>
    </div>
  );
};

export default HelpCenter;
