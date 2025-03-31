import React, { useState } from "react";
import { Info } from "lucide-react";
import Modal from "../components/Modal";

const NoExperienceResumeTips: React.FC = () => {
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
          How to Write a Resume Without Paid Experience
        </h1>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-10">
          <ol className="flex space-x-4 text-sm text-neutral-600 dark:text-neutral-300">
            <li className="after:content-['→'] after:mx-2">Start with Strengths</li>
            <li className="after:content-['→'] after:mx-2">Leverage Unpaid Experience</li>
            <li className="after:content-['→'] after:mx-2">Show Transferable Skills</li>
            <li className="after:content-['→'] after:mx-2">Tailor for Each Job</li>
            <li>{formatTextWithRedPRO("CVitaePRO")} Assistance</li>
          </ol>
        </div>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Start With What You Bring to the Table</h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Everyone has value to offer—even without traditional employment. Begin your resume with a summary that focuses on your character traits, academic strengths, and eagerness to learn. This is your chance to set the tone and make a strong first impression.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            Use Volunteer Work, Clubs, and Projects
            <Info className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-500" onClick={() => toggleModal("unpaidWork")} />
          </h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Don't underestimate the power of unpaid experience. Internships, school projects, community service, leadership roles in student clubs, and even freelance work all demonstrate initiative and capability.
          </p>
          <Modal
            id="unpaidWork"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={<p>Include what you did, who it helped, and what you learned. For example: “Coordinated 3 fundraising events for the campus food drive, raising $4,500 and improving community engagement.”</p>}
          />
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Highlight Transferable Skills</h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Transferable skills are things like communication, teamwork, time management, organization, and problem-solving. These can be demonstrated through group projects, mentoring others, or balancing multiple responsibilities at school.
          </p>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200 mt-2">
            <li>Led a team of 4 students during a capstone project</li>
            <li>Presented research findings to a class of 40 peers</li>
            <li>Managed schedules and logistics for a campus organization</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            Customize Every Resume You Send
            <Info className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-500" onClick={() => toggleModal("tailoring")} />
          </h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Every job description is different. Use the company’s keywords and values. Match your school, club, or project experience to what they’re asking for. You only get one shot to prove you’re a good fit.
          </p>
          <Modal
            id="tailoring"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={<p>Look at the job title, duties, and qualifications. If the posting says “detail-oriented,” make sure your resume shows that skill clearly.</p>}
          />
        </section>

        {/* Section 5 */}
        <section className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">How {formatTextWithRedPRO("CVitaePRO")} Makes It Easier</h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>✓ Turns classroom and project experience into bullet points</li>
            <li>✓ Identifies and explains transferable skills in job language</li>
            <li>✓ Suggests summaries that highlight student potential</li>
            <li>✓ Flags weak or unclear content before submission</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default NoExperienceResumeTips;
