import React, { useState } from "react";
import { Info } from "lucide-react";
import Modal from "../components/Modal";
import ResumePreviewCarousel from "../components/ResumePreviewCarousel";

const BuildResumeFromScratch: React.FC = () => {
  const [showModal, setShowModal] = useState<string | null>(null);

  const toggleModal = (id: string) => {
    setShowModal(prev => (prev === id ? null : id));
  };

  const formatTextWithRedPRO = (text: string) => {
    const parts = text.split("CVitaePRO");
    return (
      <>
        {parts[0]}
        CVitae<span className="text-red-500">PRO</span>
        {parts[1]}
      </>
    );
  };

  const carouselImages = [
    "/platformShots/ResumeFormPage.png",
    "/platformShots/NameExperienceSection.png",
    "/platformShots/EducationCertificationsSection.png",
    "/platformShots/ResumeTemplateShot1.png",
    "/platformShots/ResumeTemplateShot2.png"
  ];

  const carouselPoints = [
    "Begin your resume from the Resume Form page",
    "Add your Summary and Work History one section at a time",
    "Add your Education and Skills sections in the same way",
    "Check out the preview after each resume build",
    "Enhance your resume using AI-powered suggestions"
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-2xl p-8 text-neutral-900 dark:text-neutral-100">
        <h1 className="text-4xl font-bold mb-10 text-center">
          How to Build a Resume from Scratch Using {formatTextWithRedPRO("CVitaePRO")}
        </h1>

        <div className="flex justify-center mb-10">
          <ol className="flex space-x-4 text-sm text-neutral-600 dark:text-neutral-300">
            <li className="after:content-['→'] after:mx-2">Getting Started</li>
            <li className="after:content-['→'] after:mx-2">Filling Out Sections</li>
            <li className="after:content-['→'] after:mx-2">Live Previews</li>
            <li className="after:content-['→'] after:mx-2">Enhancing Your Resume</li>
            <li>Saving & Exporting</li>
          </ol>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-2">Step 1: Start with the Resume Form</h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            First, log in to your {formatTextWithRedPRO("CVitaePRO")} account. Navigate to your dashboard and click the
            <strong> “Start Resume”</strong> button, or go directly to <code>/resume-form</code>. This launches our interactive resume builder.
          </p>
          <p className="mt-2 text-sm">
            The form is broken into intuitive, labeled sections so you never feel lost. Each step guides you through resume construction with best practices.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            Step 2: Fill Out Each Resume Section Carefully
            <Info className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-500" onClick={() => toggleModal("sectionDetails")} />
          </h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li><strong>Personal Info:</strong> Enter your name, email, phone, city/state, LinkedIn, and/or portfolio link.</li>
            <li><strong>Summary:</strong> Craft a 2–3 sentence summary. Highlight experience, key skills, and job intent.</li>
            <li><strong>Experience:</strong> Break down each job. Use 2–5 bullet points that start with action verbs. Emphasize results, not tasks.</li>
            <li><strong>Education:</strong> Include institution, degree, dates, GPA, honors, or coursework.</li>
            <li><strong>Skills:</strong> Add tags for technical and soft skills. Focus on relevance to your target role.</li>
            <li><strong>Certifications:</strong> Include valid and recognized credentials. Mention issuing org and date.</li>
          </ul>
          <Modal
            id="sectionDetails"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={<p>Use the STAR method (Situation, Task, Action, Result) for experience bullets. Use numbers when possible: "Increased retention by 35%."</p>}
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-2">Step 3: Preview As You Build</h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Every field dynamically updates a real-time resume preview. You’ll see exact formatting, bullet spacing, and layout.
          </p>
          <p className="text-sm mt-2">
            You can hover over any preview element to highlight and quickly edit that field in the form. This ensures you stay aligned visually and structurally.
          </p>
          <div className="mt-6">
            <ResumePreviewCarousel
              title="Live Resume Builder Preview"
              images={carouselImages}
              points={carouselPoints}
              colorClass="text-red-500"
            />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            Step 4: Use AI to Supercharge Your Resume
            <Info className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-500" onClick={() => toggleModal("aiAssist")} />
          </h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Once you've entered your content, click <strong>"Enhance Resume"</strong> in the editor. Our AI analyzes your resume and:
          </p>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200 mt-2">
            <li>Rewrites vague or weak summaries</li>
            <li>Adds job-relevant keywords to pass ATS filters</li>
            <li>Improves formatting, flow, and professionalism</li>
            <li>Suggests clearer bullet points with results-focused language</li>
          </ul>
          <Modal
            id="aiAssist"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={<p>The AI tool helps tailor your resume toward specific job targets. Use the suggestions to improve—not replace—your voice.</p>}
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-2">Step 5: Save and Export with Confidence</h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            When you're satisfied with your resume, take the next step:
          </p>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200 mt-2">
            <li><strong>Save:</strong> Keep it in your dashboard for future updates</li>
            <li><strong>Download:</strong> Export to clean PDF or Word format</li>
            <li><strong>Enhance again:</strong> Use AI again after edits</li>
            <li><strong>Create a cover letter:</strong> Launch our Cover Letter Wizard with your resume content preloaded</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Final Tips</h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>Keep resumes to 1–2 pages (unless you're in academia or a senior executive)</li>
            <li>Use simple fonts like Arial, Calibri, or Times New Roman</li>
            <li>Don’t include photos, icons, or personal details like age</li>
            <li>Proofread thoroughly—typos cost interviews</li>
            <li>Save different resume versions for different job types</li>
          </ul>
        </section>
      </div>
      {/* 🔴 Floating Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 bg-red-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-red-700 transition"
        aria-label="Back to top"
      >
        ↑ Top
      </button>

    </div>
  );
};

export default BuildResumeFromScratch;
