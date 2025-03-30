import React, { useState } from "react";
import { Info } from "lucide-react";
import Modal from "../components/Modal";

const TailoringResumeTutorial: React.FC = () => {
  const [showModal, setShowModal] = useState<string | null>(null);

  const toggleModal = (id: string) => {
    setShowModal(prev => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-2xl p-8 text-neutral-900 dark:text-neutral-100">
        <h1 className="text-4xl font-bold mb-10 text-center">
          How to Tailor Your Resume for Every Job
        </h1>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-10">
          <ol className="flex space-x-4 text-sm text-neutral-600 dark:text-neutral-400">
            <li className="after:content-['→'] after:mx-2">Why Tailoring Matters</li>
            <li className="after:content-['→'] after:mx-2">What to Customize</li>
            <li className="after:content-['→'] after:mx-2">The 80/20 Rule</li>
            <li className="after:content-['→'] after:mx-2">Checklist</li>
            <li>Real Example</li>
          </ol>
        </div>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            Why Tailoring Matters
            <Info
              className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-400"
              onClick={() => toggleModal("why")}
            />
          </h2>
          <p>
            Submitting the same resume to every job lowers your chances of getting past ATS filters. Tailoring aligns your resume to
            the language and priorities of each role.
          </p>
          <Modal
            id="why"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={<p>Most companies use ATS to filter resumes by keyword relevance. Tailoring increases your match rate and recruiter engagement.</p>}
          />
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">What Should You Customize?</h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>Resume summary — align it to the target role</li>
            <li>Skills section — include required tools and tech</li>
            <li>Job experience bullets — emphasize relevant work</li>
            <li>Certifications — highlight those required/preferred</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            The 80/20 Rule
            <Info
              className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-400"
              onClick={() => toggleModal("rule")}
            />
          </h2>
          <p>
            80% of your resume can stay the same — core responsibilities, formatting, structure. 20% should be adapted to match
            each job post’s keywords and tone.
          </p>
          <Modal
            id="rule"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={<p>This saves time while still improving ATS scores and showing recruiters you’ve read the posting closely.</p>}
          />
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Tailoring Checklist</h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>✔️ Paste the job description into a document</li>
            <li>✔️ Highlight repeating phrases and required skills</li>
            <li>✔️ Match those terms in your summary and bullets</li>
            <li>✔️ Adjust titles to reflect job language (if applicable)</li>
            <li>✔️ Prioritize bullets that match role responsibilities</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Real-World Example</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-neutral-300 dark:border-red-600 p-4 rounded-xl bg-white dark:bg-neutral-700 shadow">
              <h3 className="text-red-700 dark:text-red-400 font-semibold mb-2">❌ Generic Resume</h3>
              <p className="text-sm text-neutral-800 dark:text-neutral-200">
                Experienced professional skilled in teamwork, problem-solving, and customer service. Seeking growth opportunities.
              </p>
            </div>
            <div className="border border-neutral-300 dark:border-green-600 p-4 rounded-xl bg-white dark:bg-neutral-700 shadow">
              <h3 className="text-green-700 dark:text-green-400 font-semibold mb-2">✅ Tailored Resume</h3>
              <p className="text-sm text-neutral-800 dark:text-neutral-200">
                Customer Success Manager with 5+ years in SaaS onboarding and user retention. Skilled in Salesforce, Intercom, and cross-team collaboration to reduce churn by 22%.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TailoringResumeTutorial;