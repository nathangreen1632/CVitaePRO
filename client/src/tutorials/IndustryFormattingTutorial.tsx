import React from "react";
import { Info } from "lucide-react";
import Modal from "../components/core/modals/Modal.tsx";

const IndustryFormattingTutorial: React.FC = () => {
  const [showModal, setShowModal] = React.useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-2xl p-8 text-neutral-900 dark:text-neutral-100">
        <h1 className="text-4xl font-bold mb-10 text-center">
          Resume Formatting Across Different Industries
        </h1>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-10">
          <ol className="flex space-x-4 text-sm text-neutral-600 dark:text-neutral-300">
            <li className="after:content-['→'] after:mx-2">Overview</li>
            <li className="after:content-['→'] after:mx-2">Tech & Engineering</li>
            <li className="after:content-['→'] after:mx-2">Creative Roles</li>
            <li className="after:content-['→'] after:mx-2">Corporate & Finance</li>
            <li>How {formatTextWithRedPRO("CVitaePRO")} Adapts</li>
          </ol>
        </div>

        {/* Section 1: Overview */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Not All Resumes Are Built the Same</h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Different industries expect different formatting. A design portfolio resume will not perform well in a law firm, and vice versa. Understanding these expectations can drastically improve your chances of getting hired.
          </p>
        </section>

        {/* Section 2: Tech/Engineering */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Technology & Engineering</h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>Keep formatting clean and ATS-friendly</li>
            <li>Prioritize technical skills and tools</li>
            <li>Include links to GitHub, Stack Overflow, or portfolio</li>
            <li>Use bullet points to quantify impact (load times, uptime, deployments)</li>
          </ul>
        </section>

        {/* Section 3: Creative */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            Creative Roles
            <Info
              className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-500"
              onClick={() => toggleModal("creative")}
            />
          </h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            While visual presentation matters, most creative resumes still go through ATS filters. Always balance flair with function.
          </p>
          <Modal
            id="creative"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={<p>Use an ATS-friendly version for job applications, and save the visually enhanced version for portfolio reviews or direct emails to hiring managers.</p>}
          />
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200 mt-2">
            <li>Use color and layout to show style but avoid complex graphics</li>
            <li>Link to Behance, Dribbble, or your website</li>
            <li>Include project-based bullets and tools used</li>
          </ul>
        </section>

        {/* Section 4: Corporate/Finance */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Corporate, Business & Finance</h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>Use traditional formatting—black font, single column, no icons</li>
            <li>Focus on achievements and metrics (revenue, ROI, cost savings)</li>
            <li>Keep everything aligned, minimal, and professional</li>
            <li>Use formal job titles and avoid slang or emojis</li>
          </ul>
        </section>

        {/* Section 5: CVitaePRO support */}
        <section className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">How {formatTextWithRedPRO("CVitaePRO")} Adjusts Format Based on Industry</h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>✓ Automatically strips visuals for ATS compliance</li>
            <li>✓ Adjusts template layout based on selected role type</li>
            <li>✓ Prioritizes relevant sections based on job field</li>
            <li>✓ Tailors keywords and tone based on industry jargon</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default IndustryFormattingTutorial;
