import React, { useState } from "react";
import { Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";

const ResumeTutorial: React.FC = () => {
  const [showModal, setShowModal] = useState<string | null>(null);
  const navigate = useNavigate();

  const toggleModal = (id: string) => {
    setShowModal(prev => (prev === id ? null : id));
  };

  const handleStart = () => {
    navigate("/resume-form");
  };

  return (
    <div className="p-8 max-w-5xl mx-auto text-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-center">How to Build a Powerful Resume</h1>

      {/* Progress Indicator */}
      <div className="flex justify-center mb-8">
        <ol className="flex space-x-4 text-sm text-gray-600">
          <li className="after:content-['→'] after:mx-2">Purpose</li>
          <li className="after:content-['→'] after:mx-2">2-Page Rule</li>
          <li className="after:content-['→'] after:mx-2">Top 3 Jobs</li>
          <li className="after:content-['→'] after:mx-2">Mistakes</li>
          <li>How CVitaePRO Helps</li>
        </ol>
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2 flex items-center">
          The Purpose of a Resume
          <Info className="ml-2 w-5 h-5 cursor-pointer" onClick={() => toggleModal("purpose")} />
        </h2>
        <p>
          A resume isn’t a full autobiography—it’s a sales document. Recruiters spend an average of <strong>6 seconds</strong>{" "}
          scanning a resume before deciding if it’s worth a deeper look. That’s why <strong>short, targeted, and visually clean resumes</strong>{" "}
          win interviews.
        </p>
        <Modal
          id="purpose"
          activeId={showModal}
          onClose={() => setShowModal(null)}
          content={<p>This section helps users understand that resumes are marketing tools, not historical documents.</p>}
        />
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2 flex items-center">
          The 2-Page Rule
          <Info className="ml-2 w-5 h-5 cursor-pointer" onClick={() => toggleModal("rule")} />
        </h2>
        <p>
          Ideally, your resume should be <strong>no more than 2 pages</strong>. Longer resumes can overwhelm recruiters and fail{" "}
          ATS screening. CVitaePRO is designed to help keep you within this limit.
        </p>
        <Modal
          id="rule"
          activeId={showModal}
          onClose={() => setShowModal(null)}
          content={<p>We recommend 2 pages because that’s what hiring managers expect. Brevity shows focus.</p>}
        />
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Focus on Your Last 3 Positions</h2>
        <p>
          Instead of listing every job since high school, include only the <strong>last 3 positions</strong>{" "}
          that best show your skills and accomplishments. Employers care more about your recent, relevant experience.
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-green-600 border-2 rounded-xl p-4 bg-white shadow">
            <h3 className="text-lg font-semibold text-green-700 mb-2">✅ Great Resume (2 Pages)</h3>
            <img src="/images/good-resume-example.png" alt="Good Resume Example" className="rounded-xl mb-2" />
            <ul className="text-sm text-gray-700 list-disc list-inside">
              <li>Clean layout</li>
              <li>Relevant experiences only</li>
              <li>Strong keywords</li>
            </ul>
          </div>
          <div className="border-red-600 border-2 rounded-xl p-4 bg-white shadow">
            <h3 className="text-lg font-semibold text-red-700 mb-2">🚫 Bad Resume (4+ Pages)</h3>
            <img src="/images/bad-resume-example.png" alt="Bad Resume Example" className="rounded-xl mb-2" />
            <ul className="text-sm text-gray-700 list-disc list-inside">
              <li>Too much irrelevant data</li>
              <li>Cluttered design</li>
              <li>Hard to read</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Resume Stats Infographic */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">📊 What Recruiters Actually See</h2>
        <img src="/images/resume-stats-infographic.png" alt="Resume Stats Infographic" className="w-full rounded-xl shadow" />
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Common Resume Mistakes</h2>
        <div className="overflow-auto">
          <table className="w-full table-auto text-sm border-collapse border border-gray-300">
            <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">❌ Mistake</th>
              <th className="border border-gray-300 p-2 text-left">✅ Better Approach</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td className="border border-gray-300 p-2">Listing every job since 1999</td>
              <td className="border border-gray-300 p-2">Focus on last 7-10 years or 3 most relevant roles</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Using 5 fonts and emojis</td>
              <td className="border border-gray-300 p-2">Use 1 professional font (no emojis)</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Dense text blocks</td>
              <td className="border border-gray-300 p-2">Use bullet points and spacing</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Describing duties only</td>
              <td className="border border-gray-300 p-2">Show measurable impact (e.g. increased sales by 25%)</td>
            </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-12 text-center">
        <button
          className="text-lg px-6 py-3 bg-blue-700 text-white rounded-xl hover:bg-blue-600 transition"
          onClick={handleStart}
        >
          Start Building My Resume
        </button>
      </div>
    </div>
  );
};

export default ResumeTutorial;