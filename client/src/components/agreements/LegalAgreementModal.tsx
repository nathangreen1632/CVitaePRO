import React, { useEffect, useRef, useState } from "react";
import { loadLegalHtml } from "../../utils/loadLegalHtml.ts";

const documents = [
  { title: "Terms of Service", key: "tos", file: "terms-of-service.html" },
  { title: "Privacy Policy", key: "privacy", file: "privacy-policy.html" },
  { title: "Disclaimer", key: "disclaimer", file: "disclaimer-policy.html" },
  { title: "End User License Agreement (EULA)", key: "eula", file: "eula.html" }
];

interface LegalAgreementModalProps {
  onComplete: () => void;
  onReject?: () => void;
}

const LegalAgreementModal: React.FC<LegalAgreementModalProps> = ({ onComplete, onReject }) => {
  const [step, setStep] = useState(0);
  const [accepted, setAccepted] = useState<{ [key: string]: boolean }>({});
  const [htmlContent, setHtmlContent] = useState<string>("");

  const scrollRef = useRef<HTMLDivElement>(null); // 🆕 ref to scrollable container
  const currentDoc = documents[step];

  useEffect(() => {
    void (async () => {
      const text = await loadLegalHtml(currentDoc.file);
      setHtmlContent(text);

      // ✅ Auto-scroll to top AFTER content loads
      if (scrollRef.current) {
        scrollRef.current.scrollTop = 0;
      }
    })();
  }, [step]);

  const handleNext = () => {
    if (!accepted[currentDoc.key]) return;
    if (step < documents.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleDisagree = () => {
    if (onReject) {
      onReject();
    } else {
      window.location.href = "/";
    }
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccepted((prev) => ({ ...prev, [currentDoc.key]: e.target.checked }));
  };

  const progressPercent = ((step + 1) / documents.length) * 100;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isAccepted = accepted[currentDoc.key];
      if (!isAccepted) return;

      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [accepted, currentDoc.key]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-gray-900 text-white rounded-xl shadow-xl max-w-4xl w-full p-6 space-y-6 max-h-[90vh] overflow-hidden">

        {/* Title + Progress */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-1">{currentDoc.title}</h2>
          <p className="text-sm text-gray-300 mb-3">
            Step {step + 1} of {documents.length}
          </p>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-green-700 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Document Viewer */}
        <div
          ref={scrollRef}
          className="overflow-y-scroll bg-white text-black rounded-lg p-6 shadow-inner h-[400px] prose prose-sm prose-headings:text-black prose-p:text-black prose-li:text-black"
        >
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>

        {/* Checkbox */}
        <div className="flex items-center pt-4">
          <input
            id="agree-checkbox"
            type="checkbox"
            checked={accepted[currentDoc.key] ?? false}
            onChange={handleCheckbox}
            className="mr-2"
          />
          <label htmlFor="agree-checkbox" className="text-sm">
            I have read and agree to the {currentDoc.title}.
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center pt-2 gap-4">
          <button
            onClick={handleDisagree}
            className="w-1/2 px-4 py-2 rounded bg-red-700 hover:bg-red-900 text-white font-semibold"
          >
            I Do Not Agree
          </button>
          <button
            onClick={handleNext}
            disabled={!accepted[currentDoc.key]}
            className={`w-1/2 px-4 py-2 rounded font-semibold transition ${
              accepted[currentDoc.key]
                ? "bg-green-700 hover:bg-green-900 text-white"
                : "bg-gray-500 text-white cursor-not-allowed"
            }`}
          >
            {step === documents.length - 1 ? "Agree & Continue" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalAgreementModal;
