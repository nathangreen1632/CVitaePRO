import React from "react";

interface Certification {
  name: string;
  year: string;
}

interface Props {
  resumeData: {
    certifications: Certification[];
    currentCertificationName?: string;
    currentCertificationYear?: string;
  };
  setResumeData: React.Dispatch<React.SetStateAction<any>>;
}

const CertificationsSection: React.FC<Props> = ({ resumeData, setResumeData }) => {
  const addCertification = () => {
    const name = resumeData.currentCertificationName?.trim();
    const year = resumeData.currentCertificationYear?.trim();

    if (!name || !year) return;

    setResumeData((prev: any) => ({
      ...prev,
      certifications: [...prev.certifications, { name, year }],
      currentCertificationName: "",
      currentCertificationYear: "",
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCertification();
    }
  };

  const removeCertification = (index: number) => {
    setResumeData((prev: any) => ({
      ...prev,
      certifications: prev.certifications.filter((_: Certification, i: number) => i !== index),
    }));
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-white mb-2">Certifications</h3>

      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Certification Name"
          value={resumeData.currentCertificationName ?? ""}
          onChange={(e) =>
            setResumeData((prev: any) => ({
              ...prev,
              currentCertificationName: e.target.value,
            }))
          }
          onKeyDown={handleKeyDown}
          className="flex-grow p-2 rounded bg-gray-700 text-white"
        />

        <input
          type="text"
          placeholder="Year"
          value={resumeData.currentCertificationYear ?? ""}
          onChange={(e) =>
            setResumeData((prev: any) => ({
              ...prev,
              currentCertificationYear: e.target.value,
            }))
          }
          onKeyDown={handleKeyDown}
          className="w-24 p-2 rounded bg-gray-700 text-white"
        />

        <button
          type="button"
          onClick={addCertification}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {resumeData.certifications.map((cert, idx) => (
          <span
            key={`${cert.name}-${cert.year}-${idx}`}
            className="bg-blue-300 dark:bg-blue-600 text-black dark:text-white px-3 py-1 rounded-full flex items-center gap-2"
          >
            {cert.name} ({cert.year})
            <button
              type="button"
              className="text-sm hover:text-red-500"
              onClick={() => removeCertification(idx)}
            >
              ❌
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default CertificationsSection;
