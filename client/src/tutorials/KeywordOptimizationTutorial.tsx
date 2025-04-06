import React, { useState } from "react";
import { Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/core/modals/Modal.tsx";

const KeywordOptimizationTutorial: React.FC = () => {
  const [showModal, setShowModal] = useState<string | null>(null);
  const navigate = useNavigate();

  const toggleModal = (id: string) => {
    setShowModal(prev => (prev === id ? null : id));
  };

  const handleEnhance = () => {
    navigate("/resume-form");
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

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-2xl p-8 text-neutral-900 dark:text-neutral-100">
        <h1 className="text-4xl font-bold mb-10 text-center">
          Choosing the Right Keywords for ATS
        </h1>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-10">
          <ol className="flex space-x-4 text-sm text-neutral-600 dark:text-neutral-400">
            <li className="after:content-['→'] after:mx-2">What Are Keywords?</li>
            <li className="after:content-['→'] after:mx-2">Why ATS Matters</li>
            <li className="after:content-['→'] after:mx-2">Finding Keywords</li>
            <li className="after:content-['→'] after:mx-2">
              Optimize with {formatTextWithRedPRO("CVitaePRO")}
            </li>
            <li>Enhance Resume</li>
          </ol>
        </div>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            What Are Resume Keywords?
            <Info
              className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-500"
              onClick={() => toggleModal("keywords")}
            />
          </h2>
          <p>
            Keywords are specific terms or phrases that relate to skills, experience, tools, and qualifications listed in job descriptions.
            Including them in your resume increases your chances of passing automated ATS filters.
          </p>
          <Modal
            id="keywords"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={
              <p>
                Examples include: “project management,” “JavaScript,” “data analysis,” “CRM software,” or “cross-functional collaboration.”
              </p>
            }
          />
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Why ATS Systems Depend on Keywords</h2>
          <p>
            ATS (Applicant Tracking Systems) scan resumes to match candidates to job postings. Without the right keywords, even qualified
            candidates can get filtered out. Recruiters often never see resumes that don’t match enough keywords.
          </p>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            How to Find the Right Keywords
            <Info
              className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-500"
              onClick={() => toggleModal("extracting")}
            />
          </h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200 mt-2">
            <li>Carefully review the job description</li>
            <li>Identify repeated terms or key qualifications</li>
            <li>Look at similar roles to find common industry language</li>
          </ul>
          <Modal
            id="extracting"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={
              <p>
                You can copy a job listing into a document and highlight all skills, tools, and action words. Then cross-check your resume to see what’s missing.
              </p>
            }
          />
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">
            Optimizing with {formatTextWithRedPRO("CVitaePRO")}
          </h2>
          <p>
            {formatTextWithRedPRO("CVitaePRO")} helps automate keyword optimization using AI. When you enhance a resume:
          </p>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200 mt-2">
            <li>Our AI reviews your resume content and job goals</li>
            <li>Injects missing skills, tools, and job-relevant language</li>
            <li>Formats the resume for clarity and ATS parsing</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Before and After Optimization</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-neutral-300 dark:border-red-600 p-4 rounded-xl bg-white dark:bg-neutral-900 shadow">
              <h3 className="text-red-700 dark:text-red-500 font-semibold mb-2">Before</h3>
              <p className="text-sm text-neutral-800 dark:text-neutral-200">
                Responsible for team projects. Helped implement processes. Worked with other departments.
              </p>
            </div>
            <div className="border border-neutral-300 dark:border-green-500 p-4 rounded-xl bg-white dark:bg-neutral-900 shadow">
              <h3 className="text-green-700 dark:text-green-400 font-semibold mb-2">After</h3>
              <p className="text-sm text-neutral-800 dark:text-neutral-200">
                Led cross-functional project teams using Agile methodology. Improved operational efficiency by 18% through automated reporting and workflow optimization.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={handleEnhance}
            className="text-lg px-6 py-3 bg-blue-700 text-white rounded-xl hover:bg-blue-900 transition"
          >
            Enhance My Resume for ATS
          </button>
        </div>
      </div>
    </div>
  );
};

export default KeywordOptimizationTutorial;
