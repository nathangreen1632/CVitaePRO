import React, { useState } from "react";
import { Info } from "lucide-react";
import Modal from "../components/Modal";

const ShowcasingSoftSkills: React.FC = () => {
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
          How to Showcase Soft Skills Effectively
        </h1>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-10">
          <ol className="flex space-x-4 text-sm text-neutral-600 dark:text-neutral-300">
            <li className="after:content-['→'] after:mx-2">What Are Soft Skills?</li>
            <li className="after:content-['→'] after:mx-2">Why They Matter</li>
            <li className="after:content-['→'] after:mx-2">Top Soft Skills</li>
            <li className="after:content-['→'] after:mx-2">Show, Don’t Tell</li>
            <li>{formatTextWithRedPRO("CVitaePRO")} Tips</li>
          </ol>
        </div>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">What Are Soft Skills?</h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Soft skills are personal traits and behaviors that influence how you work and interact with others. They include communication, leadership, teamwork, adaptability, and more.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            Why Soft Skills Matter
            <Info className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-500" onClick={() => toggleModal("importance")} />
          </h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Recruiters aren’t just looking for technical know-how. Soft skills reveal your potential to collaborate, lead, and adapt in real-world environments.
          </p>
          <Modal
            id="importance"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={<p>92% of hiring managers say soft skills matter as much or more than hard skills, especially for leadership and communication-heavy roles.</p>}
          />
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Top Soft Skills Employers Value</h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>Communication</li>
            <li>Time Management</li>
            <li>Teamwork</li>
            <li>Problem-Solving</li>
            <li>Adaptability</li>
            <li>Leadership</li>
            <li>Critical Thinking</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            Show, Don’t Just Tell
            <Info className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-500" onClick={() => toggleModal("examples")} />
          </h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Instead of simply listing “great communicator,” give context. Use achievements to demonstrate the trait in action.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div className="border border-red-500 p-4 rounded-xl bg-white dark:bg-neutral-900 shadow">
              <h3 className="text-red-700 dark:text-red-400 font-semibold mb-2">❌ Weak</h3>
              <p className="text-sm">Excellent problem solver and team player.</p>
            </div>
            <div className="border border-green-500 p-4 rounded-xl bg-white dark:bg-neutral-900 shadow">
              <h3 className="text-green-700 dark:text-green-400 font-semibold mb-2">✅ Strong</h3>
              <p className="text-sm">Led weekly team stand-ups to identify and resolve workflow bottlenecks, improving project turnaround time by 18%.</p>
            </div>
          </div>
          <Modal
            id="examples"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={<p>Use action + result: "Facilitated onboarding for 3 new hires, reducing training ramp-up by 25%." This proves soft skills in action.</p>}
          />
        </section>

        {/* Section 5 */}
        <section className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">How {formatTextWithRedPRO("CVitaePRO")} Helps You Highlight Soft Skills</h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>✓ Translates vague terms into concrete, action-driven examples</li>
            <li>✓ Analyzes job postings to recommend soft skills to highlight</li>
            <li>✓ Balances hard and soft skills throughout your resume</li>
            <li>✓ Suggests bullet points that integrate measurable soft skill usage</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default ShowcasingSoftSkills;