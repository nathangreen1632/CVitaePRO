import React, { useState } from "react";
import { Info } from "lucide-react";
import Modal from "../components/Modal";

const QuantifyingImpactTutorial: React.FC = () => {
  const [showModal, setShowModal] = useState<string | null>(null);

  const toggleModal = (id: string) => {
    setShowModal(prev => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-2xl p-8 text-neutral-900 dark:text-neutral-100">
        <h1 className="text-4xl font-bold mb-10 text-center">
          How to Quantify Your Impact on a Resume
        </h1>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-10">
          <ol className="flex space-x-4 text-sm text-neutral-600 dark:text-neutral-400">
            <li className="after:content-['→'] after:mx-2">Why Metrics Matter</li>
            <li className="after:content-['→'] after:mx-2">Responsibility vs Results</li>
            <li className="after:content-['→'] after:mx-2">What to Measure</li>
            <li className="after:content-['→'] after:mx-2">Power Verbs + Data</li>
            <li>Before/After Examples</li>
          </ol>
        </div>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            Why Metrics Matter
            <Info
              className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-400"
              onClick={() => toggleModal("metrics")}
            />
          </h2>
          <p>
            Recruiters skim resumes quickly. Numbers make accomplishments stand out. Quantifying your impact proves value with clarity.
          </p>
          <Modal
            id="metrics"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={<p>Examples: “increased sales by 20%,” “reduced costs by $30K,” “shortened delivery time by 10 days.”</p>}
          />
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Responsibilities vs Results</h2>
          <p>
            Many resumes stop at listing job duties. What hiring managers want to see is your outcome:
          </p>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200 mt-2">
            <li>❌ Responsible for managing client accounts</li>
            <li>✅ Managed 12 key client accounts generating $3M+ in annual revenue</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            What Should I Measure?
            <Info
              className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-400"
              onClick={() => toggleModal("measure")}
            />
          </h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>Revenue, profit, or savings ($)</li>
            <li>Time saved (hours, days, months)</li>
            <li>Efficiency increase (%)</li>
            <li>Team size managed</li>
            <li>Customer or user growth</li>
          </ul>
          <Modal
            id="measure"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={<p>Focus on results that had business impact — money saved, revenue gained, speed improved, errors reduced, etc.</p>}
          />
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            Combine Action Verbs with Metrics
            <Info
              className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-400"
              onClick={() => toggleModal("verbs")}
            />
          </h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>Increased customer retention by 18%</li>
            <li>Reduced support ticket backlog by 36%</li>
            <li>Generated $250K in new annual recurring revenue</li>
            <li>Led cross-functional team of 8 to launch new feature</li>
          </ul>
          <Modal
            id="verbs"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={<p>Always start with a strong verb: Led, Improved, Increased, Built, Launched, Reduced, Saved, Streamlined.</p>}
          />
        </section>

        {/* Section 5 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Before and After Examples</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-neutral-300 dark:border-red-600 p-4 rounded-xl bg-white dark:bg-neutral-700 shadow">
              <h3 className="text-red-700 dark:text-red-400 font-semibold mb-2">Before</h3>
              <p className="text-sm text-neutral-800 dark:text-neutral-200">
                Handled customer onboarding process and supported account managers.
              </p>
            </div>
            <div className="border border-neutral-300 dark:border-green-600 p-4 rounded-xl bg-white dark:bg-neutral-700 shadow">
              <h3 className="text-green-700 dark:text-green-400 font-semibold mb-2">After</h3>
              <p className="text-sm text-neutral-800 dark:text-neutral-200">
                Onboarded 60+ enterprise clients in Q1, increasing client retention by 25% and reducing churn rate by 18%.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default QuantifyingImpactTutorial;