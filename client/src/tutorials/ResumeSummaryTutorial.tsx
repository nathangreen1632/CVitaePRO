import React, { useState } from "react";
import { Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/core/modals/Modal.tsx";

const ResumeSummaryTutorial: React.FC = () => {
  const [showModal, setShowModal] = useState<string | null>(null);
  const navigate = useNavigate();

  const toggleModal = (id: string) => {
    setShowModal(prev => (prev === id ? null : id));
  };

  const handleEditResume = () => {
    navigate("/resume-form");
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-2xl p-8 text-neutral-900 dark:text-neutral-100">
        <h1 className="text-4xl font-bold mb-10 text-center">
          How to Write a Powerful Resume Summary
        </h1>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-10">
          <ol className="flex space-x-4 text-sm text-neutral-600 dark:text-neutral-300">
            <li className="after:content-['→'] after:mx-2">Purpose</li>
            <li className="after:content-['→'] after:mx-2">Structure</li>
            <li className="after:content-['→'] after:mx-2">Examples</li>
            <li className="after:content-['→'] after:mx-2">Do/Don't</li>
            <li>Edit Your Summary</li>
          </ol>
        </div>

        {/* Section: Why Summary Matters */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            Why Your Summary Matters
            <Info
              className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-500"
              onClick={() => toggleModal("importance")}
            />
          </h2>
          <p>
            Your resume summary is the first thing a recruiter sees. In 2–3 lines, it should explain who you are, what you do,
            and why you're a strong candidate.
          </p>
          <Modal
            id="importance"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={<p>A well-written summary increases your chance of making it past the 6-second recruiter skim. It's your elevator pitch.</p>}
          />
        </section>

        {/* Section: Structure */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">How to Structure It</h2>
          <p>A simple and effective formula:</p>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200 mt-2">
            <li><strong>Professional Title</strong> – who you are</li>
            <li><strong>Years of Experience</strong> – how long you've done it</li>
            <li><strong>Core Strengths</strong> – what you bring to the table</li>
          </ul>
        </section>

        {/* Section: Before/After Examples */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Before and After Examples</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-neutral-300 dark:border-red-600 p-4 rounded-xl bg-white dark:bg-neutral-900 shadow">
              <h3 className="text-red-700 dark:text-red-500 font-semibold mb-2">Weak Summary</h3>
              <p className="text-sm text-neutral-800 dark:text-neutral-200">
                I am a hard-working and passionate person looking for a challenging position where I can grow.
              </p>
            </div>
            <div className="border border-neutral-300 dark:border-green-600 p-4 rounded-xl bg-white dark:bg-neutral-900 shadow">
              <h3 className="text-green-700 dark:text-green-500 font-semibold mb-2">Improved Summary</h3>
              <p className="text-sm text-neutral-800 dark:text-neutral-200">
                Data Analyst with 4+ years of experience transforming complex data into actionable insights. Proven ability to improve reporting efficiency and deliver business-critical metrics.
              </p>
            </div>
          </div>
        </section>

        {/* Section: Common Mistakes */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Common Mistakes to Avoid</h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>Too vague or generic ("I'm passionate and hard-working")</li>
            <li>Too long—summary should be 2–3 concise sentences</li>
            <li>Repeating your cover letter or job title without value</li>
            <li>Using first person (avoid "I" or "my")</li>
          </ul>
        </section>

        {/* CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={handleEditResume}
            className="text-lg px-6 py-3 bg-blue-700 text-white rounded-xl hover:bg-blue-900 transition"
          >
            Edit My Resume Summary
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeSummaryTutorial;
