import React, { useState } from "react";
import { Info } from "lucide-react";
import Modal from "../components/core/modals/Modal.tsx";

const CollegeGradResumeTutorial: React.FC = () => {
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
          Resume Tips for Recent College Graduates
        </h1>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-10">
          <ol className="flex space-x-4 text-sm text-neutral-600 dark:text-neutral-400">
            <li className="after:content-['→'] after:mx-2">Education First</li>
            <li className="after:content-['→'] after:mx-2">Internships & Projects</li>
            <li className="after:content-['→'] after:mx-2">Skills Over Experience</li>
            <li className="after:content-['→'] after:mx-2">Extracurriculars Count</li>
            <li>{formatTextWithRedPRO("CVitaePRO")} Assistance</li>
          </ol>
        </div>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Put Education at the Top</h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            For new grads, education is often your strongest asset. Include:
          </p>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200 mt-2">
            <li>Full degree title and major/minor</li>
            <li>Relevant coursework tied to your desired field</li>
            <li>GPA (only if 3.5+), honors, dean’s list, scholarships</li>
            <li>Capstone projects, thesis topics, or standout achievements</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            Include Internships and Major Projects
            <Info className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-500" onClick={() => toggleModal("internships-projects")} />
          </h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Whether paid or unpaid, internships show real-world experience. So do major group assignments and volunteer collaborations.
          </p>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200 mt-2">
            <li>Use bullet points to describe what you accomplished</li>
            <li>Begin each bullet with an action verb ("Designed", "Analyzed", "Created")</li>
            <li>Whenever possible, include metrics or results ("Increased traffic by 22%")</li>
            <li>Don’t forget relevant software, platforms, or coding languages used</li>
          </ul>
          <Modal
            id="internships-projects"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={<p>Be sure to use action verbs and quantify results. Examples: "Increased engagement by 15%" or "Created dashboard using SQL."</p>}
          />
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">List Skills Strategically</h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200 mb-2">
            Your skills section helps fill in for lack of experience. Tailor this section for each job:
          </p>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>Hard skills: Excel, Tableau, React, Google Ads, SQL, etc.</li>
            <li>Soft skills: Adaptability, critical thinking, teamwork</li>
            <li>Languages, certifications, or licenses if applicable</li>
            <li>Match keywords directly from job descriptions when possible</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            Extracurricular Activities Matter
            <Info className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-500" onClick={() => toggleModal("extracurriculars")} />
          </h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200 mb-2">
            Don’t underestimate the power of involvement. These roles reveal initiative, time management, and leadership. Use bullet points to describe impact:
          </p>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>"President, Marketing Club – Hosted 4 networking events for 100+ students"</li>
            <li>"Resident Assistant – Managed safety and programming for 30 residents"</li>
            <li>"Volunteer Math Tutor – Helped 15 students improve test scores by an average of 20%"</li>
          </ul>
          <Modal
            id="extracurriculars"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={<p>Example: "Treasurer, Finance Club – Managed $2,500 budget and organized 3 events for 50+ students."</p>}
          />
        </section>

        {/* Section 5 */}
        <section className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">How {formatTextWithRedPRO("CVitaePRO")} Can Help</h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>✓ Converts academic or project-based experience into professional formats</li>
            <li>✓ Prompts for keywords from job descriptions and aligns them with your skills</li>
            <li>✓ Rewrites bullet points using metrics and active verbs</li>
            <li>✓ Keeps formatting ATS-safe while highlighting your strengths</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default CollegeGradResumeTutorial;
