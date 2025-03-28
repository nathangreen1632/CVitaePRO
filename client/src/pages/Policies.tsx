import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadLegalHtml } from "../utils/loadLegalHtml.js";


const Policies = (): React.JSX.Element => {
  const [step, setStep] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [htmlContent, setHtmlContent] = useState<string>("");

  const navigate = useNavigate();

  const documents = [
    { title: "Terms of Service", file: "terms-of-service.html" },
    { title: "Privacy Policy", file: "privacy-policy.html" },
    { title: "Disclaimer", file: "disclaimer-policy.html" },
    { title: "End User License Agreement", file: "eula.html" },
  ];

  const currentDoc = documents[step];

  useEffect(() => {
    const alreadyAgreed = localStorage.getItem("cvitaepro:policiesAgreed");
    if (alreadyAgreed === "true") {
      navigate("/register");
    }
  }, [navigate]);

  useEffect(() => {
    void (async () => {
      const text = await loadLegalHtml(currentDoc.file);
      setHtmlContent(text);
    })();
  }, [step]);


  const handleNext = (): void => {
    if (step < documents.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      localStorage.setItem("cvitaepro:policiesAgreed", "true");
      navigate("/register");
    }
  };

  const handleDisagree = (): void => {
    localStorage.removeItem("cvitaepro:policiesAgreed");
    navigate("/");
  };

  const progressPercent = ((step + 1) / documents.length) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
      <div className="bg-gray-900 text-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden mx-4 p-6 space-y-6">

        <div className="text-center">
          <h1 className="text-3xl font-bold mb-1">{documents[step].title}</h1>
          <p className="text-sm text-gray-300 mb-3">
            Step {step + 1} of {documents.length}
          </p>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="overflow-y-scroll bg-white text-black rounded-lg p-6 shadow-inner h-[400px] prose prose-sm prose-headings:text-black prose-p:text-black prose-li:text-black">
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>

        <div className="flex items-center pt-4">
          <input
            id="agree"
            type="checkbox"
            className="mr-2"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <label htmlFor="agree" className="text-sm">
            I have read and agree to the {documents[step].title}.
          </label>
        </div>

        <div className="flex justify-between gap-4 pb-2">
          <button
            onClick={handleDisagree}
            className="w-1/2 px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            I Do Not Agree
          </button>
          <button
            onClick={handleNext}
            disabled={!agreed}
            className={`w-1/2 px-4 py-2 rounded font-semibold transition ${
              agreed
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-500 text-white cursor-not-allowed"
            }`}
          >
            {step < documents.length - 1 ? "Next" : "Finish"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Policies;
