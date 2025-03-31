import React, { useState } from "react";
import { Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";

const ResumeHeaderTutorial: React.FC = () => {
  const [showModal, setShowModal] = useState<string | null>(null);
  const navigate = useNavigate();

  const toggleModal = (id: string) => {
    setShowModal(prev => (prev === id ? null : id));
  };

  const handleEdit = () => {
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
          Crafting the Perfect Resume Header
        </h1>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-10">
          <ol className="flex space-x-4 text-sm text-neutral-600 dark:text-neutral-300">
            <li className="after:content-['→'] after:mx-2">What Goes In</li>
            <li className="after:content-['→'] after:mx-2">What to Leave Out</li>
            <li className="after:content-['→'] after:mx-2">Formatting Tips</li>
            <li className="after:content-['→'] after:mx-2">Modern Contact Options</li>
            <li>{formatTextWithRedPRO("CVitaePRO")} Suggestions</li>
          </ol>
        </div>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">What Should Be in Your Header</h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>Full Name (bold, largest text on page)</li>
            <li>Phone number (professional voicemail message)</li>
            <li>Email address (no nicknames or outdated domains)</li>
            <li>LinkedIn profile (custom URL preferred)</li>
            <li>Portfolio link or GitHub (for relevant roles)</li>
            <li>City and State (no full street address)</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            What to Leave Out
            <Info className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-500" onClick={() => toggleModal("leaveout")} />
          </h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Your header should be clean and focused. Skip details that are unnecessary, distracting, or could invite bias.
          </p>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200 mt-2">
            <li>❌ Full mailing address</li>
            <li>❌ Date of birth or age</li>
            <li>❌ Personal photo</li>
            <li>❌ Multiple phone numbers</li>
            <li>❌ Nicknames or novelty emails</li>
          </ul>
          <Modal
            id="leaveout"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={<p>Excluding unnecessary details keeps your header ATS-friendly and reduces unconscious bias during screening.</p>}
          />
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Formatting Tips</h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Your header should be readable and professional. Use a single line or stacked layout based on your template:
          </p>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200 mt-2">
            <li>Keep font size between 10–12 pt for contact info</li>
            <li>Use bold and spacing for clarity—not color</li>
            <li>Never include headers in images or graphics</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Modern Contact Options</h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Having a LinkedIn or portfolio link is essential for many industries. Ensure your LinkedIn is up to date and consistent with your resume.
          </p>
          <p className="text-sm mt-2 text-neutral-700 dark:text-neutral-200">
            If applying for tech or creative roles, always include GitHub, personal websites, or Behance/Dribbble links as appropriate.
          </p>
        </section>

        {/* Section 5 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">How {formatTextWithRedPRO("CVitaePRO")} Helps</h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>✓ Highlights formatting mistakes in your resume header</li>
            <li>✓ Suggests stronger contact presentation (email, URL, etc.)</li>
            <li>✓ Warns against personal info that could cause ATS or bias issues</li>
            <li>✓ Aligns header with industry-standard templates</li>
          </ul>
        </section>

        {/* CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={handleEdit}
            className="text-lg px-6 py-3 bg-blue-700 text-white rounded-xl hover:bg-blue-900 transition"
          >
            Edit My Resume Header
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeHeaderTutorial;
