import React, { useState } from "react";
import { Info } from "lucide-react";
import Modal from "../components/Modal";

const UsingAchievementsEffectively: React.FC = () => {
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
          How to Use Achievements Effectively on Your Resume
        </h1>

        <div className="flex justify-center mb-10">
          <ol className="flex space-x-4 text-sm text-neutral-600 dark:text-neutral-300">
            <li className="after:content-['→'] after:mx-2">Why They Matter</li>
            <li className="after:content-['→'] after:mx-2">Framing the Story</li>
            <li className="after:content-['→'] after:mx-2">Measurable Impact</li>
            <li className="after:content-['→'] after:mx-2">Action Verbs</li>
            <li>How {formatTextWithRedPRO("CVitaePRO")} Helps</li>
          </ol>
        </div>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Why Achievements Outshine Responsibilities</h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Recruiters don't just want to know what your job was — they want to know how well you did it. Listing accomplishments instead of duties highlights your impact.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            How to Frame Your Achievements
            <Info className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-500" onClick={() => toggleModal("framing")} />
          </h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Start each bullet point with a strong verb, then explain the outcome. Use the STAR method:
          </p>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200 mt-2">
            <li><strong>S</strong>ituation</li>
            <li><strong>T</strong>ask</li>
            <li><strong>A</strong>ction</li>
            <li><strong>R</strong>esult</li>
          </ul>
          <Modal
            id="framing"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={<p>Example: "Reduced onboarding time by 35% by streamlining training materials and introducing digital documentation workflows."</p>}
          />
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Quantify Whenever Possible</h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Numbers give weight to your work. If you increased revenue, how much? If you saved time, how many hours? Adding real data proves value.
          </p>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200 mt-2">
            <li>Increased customer satisfaction scores by 18%</li>
            <li>Managed $250,000 advertising budget with 12% under-spend</li>
            <li>Resolved 95% of support tickets within 24 hours</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Use Action-Driven Language</h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Avoid passive phrases. Instead of "Was responsible for managing accounts," say "Managed a portfolio of 40+ client accounts."
          </p>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200 mt-2">
            <li>Led</li>
            <li>Created</li>
            <li>Improved</li>
            <li>Developed</li>
            <li>Optimized</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">How {formatTextWithRedPRO("CVitaePRO")} Helps</h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>✓ Flags passive language and vague phrases</li>
            <li>✓ Suggests stronger action verbs and quantifiers</li>
            <li>✓ Recommends formatting improvements to highlight impact</li>
            <li>✓ Helps you rewrite duties as achievement-based statements</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default UsingAchievementsEffectively;
