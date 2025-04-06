import React, { useState } from "react";
import { Info } from "lucide-react";
import Modal from "../components/core/modals/Modal.tsx";

const NoExperienceTutorial: React.FC = () => {
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
          Building a Resume with No Work Experience
        </h1>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-10">
          <ol className="flex space-x-4 text-sm text-neutral-600 dark:text-neutral-400">
            <li className="after:content-['→'] after:mx-2">Start With Strengths</li>
            <li className="after:content-['→'] after:mx-2">Focus on Education</li>
            <li className="after:content-['→'] after:mx-2">Leverage Projects</li>
            <li className="after:content-['→'] after:mx-2">Use Volunteering</li>
            <li>{formatTextWithRedPRO("CVitaePRO")} Enhancements</li>
          </ol>
        </div>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Start With What You Do Have</h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Everyone has something to offer—even if it’s not from paid employment. Skills, interests, learning experiences, and character can all show up powerfully on a resume.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            Put Education Front and Center
            <Info className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-500" onClick={() => toggleModal("education-focus")} />
          </h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Especially for students or recent grads, education is a major asset. List your school, major, GPA (if strong), and relevant coursework.
          </p>
          <Modal
            id="education-focus"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={<p>You can also list academic honors, study abroad programs, student org leadership, or certifications.</p>}
          />
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Showcase Personal or Class Projects</h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>Include GitHub, design portfolios, writing samples, or school projects</li>
            <li>Describe the tools and skills used (e.g. Figma, React, Python)</li>
            <li>Highlight results, even small ones: "Created a budgeting app with 3 active users"</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            Volunteering = Experience
            <Info className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-500" onClick={() => toggleModal("volunteer-power")} />
          </h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Volunteer roles demonstrate responsibility, collaboration, and initiative. They also allow you to build real-world skills in leadership, event planning, teaching, and more.
          </p>
          <Modal
            id="volunteer-power"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={<p>Treat volunteer work like any job: title, organization, dates, and accomplishments. Show your impact!</p>}
          />
        </section>

        {/* Section 5 */}
        <section className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">How {formatTextWithRedPRO("CVitaePRO")} Can Help</h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>✓ Guides you to highlight non-traditional experience</li>
            <li>✓ Uses AI to rewrite weak bullet points for clarity</li>
            <li>✓ Boosts projects and skills to feel professional</li>
            <li>✓ Suggests ATS-safe phrasing for student resumes</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default NoExperienceTutorial;
