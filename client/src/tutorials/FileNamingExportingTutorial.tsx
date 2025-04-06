import React, { useState } from "react";
import { Info } from "lucide-react";
import Modal from "../components/core/modals/Modal.tsx";

const FileNamingExportingTutorial: React.FC = () => {
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
          Best Practices for File Naming & Exporting
        </h1>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-10">
          <ol className="flex space-x-4 text-sm text-neutral-600 dark:text-neutral-400">
            <li className="after:content-['→'] after:mx-2">File Name Rules</li>
            <li className="after:content-['→'] after:mx-2">PDF vs. DOCX</li>
            <li className="after:content-['→'] after:mx-2">Avoiding Errors</li>
            <li className="after:content-['→'] after:mx-2">Employer Expectations</li>
            <li>{formatTextWithRedPRO("CVitaePRO")} Export Options</li>
          </ol>
        </div>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            Smart Resume File Naming
            <Info className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-500" onClick={() => toggleModal("naming")} />
          </h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Always name your resume clearly and professionally. Use your full name and job target.
          </p>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200 mt-2">
            <li>✅ Jane_Doe_Product_Manager.pdf</li>
            <li>✅ JohnSmith_Resume2025.pdf</li>
            <li>❌ Resume_Final_v3_EDITED.pdf</li>
          </ul>
          <Modal
            id="naming"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={<p>Clear file names help recruiters locate and remember your document. Avoid generic or overly complex titles.</p>}
          />
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">PDF vs. DOCX — Which Should You Use?</h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            PDF is the safest and most professional option for most applications. It preserves formatting and works across devices.
            DOCX may be accepted by some systems but can risk layout shifts.
          </p>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 flex items-center">
            Avoid Common Exporting Errors
            <Info className="ml-2 w-5 h-5 cursor-pointer text-red-700 dark:text-red-500" onClick={() => toggleModal("export-errors")} />
          </h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>Don't leave track changes or comments in DOCX files</li>
            <li>Avoid file sizes over 1MB if uploading to job portals</li>
            <li>Don't password-protect your resume file</li>
          </ul>
          <Modal
            id="export-errors"
            activeId={showModal}
            onClose={() => setShowModal(null)}
            content={<p>Always export a final, clean version. Recruiters won’t open DOCX files with review marks or formatting issues.</p>}
          />
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">What Employers Expect</h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            Employers expect a professional-looking PDF resume that is named logically and is easily accessible. Fancy formats or locked files create friction.
          </p>
        </section>

        {/* Section 5 */}
        <section className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">Exporting with {formatTextWithRedPRO("CVitaePRO")}</h2>
          <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-200">
            <li>✓ One-click export to PDF and DOCX</li>
            <li>✓ Templates preserve clean formatting across formats</li>
            <li>✓ Files are named based on your name + title automatically</li>
            <li>✓ PDF output is ATS-safe and recruiter-ready</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default FileNamingExportingTutorial;
