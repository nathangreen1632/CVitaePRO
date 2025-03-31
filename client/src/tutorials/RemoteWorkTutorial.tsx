import React, { useState } from "react";
import { Info } from "lucide-react";
import Modal from "../components/Modal";

const RemoteWorkTutorial: React.FC = () => {
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
          How to Showcase Remote Work Experience Effectively
        </h1>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-10">
          <ol className="flex space-x-4 text-sm text-neutral-600 dark:text-neutral-400">
            <li className="after:content-['→'] after:mx-2">What Is Remote Work?</li>
            <li className="after:content-['→'] after:mx-2">Why It Matters</li>
            <li className="after:content-['→'] after:mx-2">Where to Mention It</li>
            <li className="after:content-['→'] after:mx-2">Keywords to Use</li>
            <li>{formatTextWithRedPRO("CVitaePRO")} Optimization</li>
          </ol>
        </div>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">What Counts as Remote Work?</h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Remote work includes any full-time, part-time, or contract role completed outside a traditional office. This includes hybrid roles, freelance gigs,
            or work-from-home setups. It’s not limited to tech roles—remote customer service, writing, marketing, HR, project management, and education are
            all valid.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            Why Employers Care About Remote Experience
            <Info className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-500" onClick={() => toggleModal("remote-value")} />
          </h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Hiring managers want candidates who can work independently, manage time, communicate clearly, and remain accountable. Remote work requires more
            self-discipline than in-office roles. Showing success in this area means you're trustworthy, reliable, and adaptive.
          </p>
          <Modal
            id="remote-value"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={<p>Proving remote-readiness shows you’re adaptable, self-motivated, experienced with collaboration tools, and capable of contributing without direct oversight.</p>}
          />
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Where to Mention Remote Work</h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>Add "Remote" as the location for past jobs: <em>Acme Corp — Remote</em></li>
            <li>Mention it in your summary or bullet points to highlight independence and digital fluency</li>
            <li>Include tools you used: Zoom, Slack, Trello, Notion, Google Workspace, GitHub, etc.</li>
            <li>If it was hybrid, clarify: <em>"Hybrid: 2 days onsite, 3 remote"</em></li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            Keywords That Matter for Remote Jobs
            <Info className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-500" onClick={() => toggleModal("keywords-remote")} />
          </h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>"Remote collaboration"</li>
            <li>"Asynchronous communication"</li>
            <li>"Self-starter with time management"</li>
            <li>"Familiar with distributed teams"</li>
            <li>"Virtual meetings and reporting"</li>
            <li>"Productivity in remote environments"</li>
          </ul>
          <Modal
            id="keywords-remote"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={<p>Include terminology that matches job descriptions for remote roles to boost your ATS score and credibility. Use context like project success or software used.</p>}
          />
        </section>

        {/* Section 5 */}
        <section className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">How {formatTextWithRedPRO("CVitaePRO")} Can Help</h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>✓ Highlights remote roles clearly on templates</li>
            <li>✓ Suggests remote-friendly language for summaries</li>
            <li>✓ Guides you in listing remote tools and achievements</li>
            <li>✓ Boosts visibility for distributed-team experience</li>
            <li>✓ Helps frame hybrid or freelance work for ATS readability</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default RemoteWorkTutorial;