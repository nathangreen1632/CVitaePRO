import React, { useState } from "react";
import { Info } from "lucide-react";
import Modal from "../components/Modal";

const CommonResumeMistakesTutorial: React.FC = () => {
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

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-2xl p-8 text-neutral-900 dark:text-neutral-100">
        <h1 className="text-4xl font-bold mb-10 text-center">
          Common Resume Mistakes to Avoid
        </h1>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-10">
          <ol className="flex space-x-4 text-sm text-neutral-600 dark:text-neutral-400">
            <li className="after:content-['→'] after:mx-2">Formatting Errors</li>
            <li className="after:content-['→'] after:mx-2">Overused Language</li>
            <li className="after:content-['→'] after:mx-2">No Metrics</li>
            <li className="after:content-['→'] after:mx-2">ATS Failures</li>
            <li>How {formatTextWithRedPRO("CVitaePRO")} Helps</li>
          </ol>
        </div>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            Formatting Mistakes
            <Info className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-500" onClick={() => toggleModal("formatting")} />
          </h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>Using tables, columns, or text boxes</li>
            <li>Non-standard fonts or inconsistent sizes</li>
            <li>Color-heavy themes that don’t print well</li>
          </ul>
          <Modal
            id="formatting"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={<p>Stick with clean, single-column formatting. Use standard fonts like Arial or Times New Roman for readability and compatibility.</p>}
          />
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Overused or Vague Language</h2>
          <p className="text-sm mb-3 text-neutral-700 dark:text-neutral-200">
            Avoid generic phrases that don’t communicate real value. Instead, be specific and action-driven:
          </p>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>❌ “Team player, hard worker, results-oriented”</li>
            <li>✅ “Collaborated with marketing team to boost engagement by 23%”</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            No Measurable Achievements
            <Info className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-500" onClick={() => toggleModal("metrics")} />
          </h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Hiring managers want results. You should quantify your work wherever possible.
          </p>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200 mt-2">
            <li>❌ “Responsible for sales”</li>
            <li>✅ “Generated $500K in annual revenue across 8 B2B clients”</li>
          </ul>
          <Modal
            id="metrics"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={<p>Quantified results (money, time, %, volume) increase credibility and help you stand out in a stack of generic resumes.</p>}
          />
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">ATS Compatibility Mistakes</h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>Using graphics or icons that can’t be read by machines</li>
            <li>Submitting resumes as images or non-standard file formats</li>
            <li>Leaving out keywords from the job description</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">How {formatTextWithRedPRO("CVitaePRO")} Helps</h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>✓ Warns about tables, columns, icons, and unusual fonts</li>
            <li>✓ Suggests metrics and action verbs in bullet points</li>
            <li>✓ Enhances keyword coverage for each job target</li>
            <li>✓ Ensures your resume is parseable and recruiter-ready</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default CommonResumeMistakesTutorial;