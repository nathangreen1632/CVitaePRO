// Handles dynamic certifications input
import React from 'react';

interface CertificationEntry {
  name: string;
  year: string;
}

interface Props {
  resumeData: {
    certifications: CertificationEntry[];
  };
  setResumeData: React.Dispatch<React.SetStateAction<any>>;
}

const CertificationsSection: React.FC<Props> = ({ resumeData, setResumeData }) => {
  const handleCertChange = (
    index: number,
    field: keyof CertificationEntry,
    value: string
  ) => {
    const updated = [...resumeData.certifications];
    updated[index][field] = value;
    setResumeData((prev: any) => ({ ...prev, certifications: updated }));
  };

  const addCertification = () => {
    setResumeData((prev: any) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        { name: '', year: '' },
      ],
    }));
  };

  const removeCertification = (index: number) => {
    const updated = [...resumeData.certifications];
    updated.splice(index, 1);
    setResumeData((prev: any) => ({ ...prev, certifications: updated }));
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-white mb-2">Certifications</h3>
      {resumeData.certifications.map((cert, index) => (
        <div key={index} className="space-y-2 bg-gray-700 p-4 rounded-lg mb-4">
          <input
            type="text"
            placeholder="Certification Name"
            value={cert.name}
            onChange={(e) => handleCertChange(index, 'name', e.target.value)}
            className="w-full p-2 rounded bg-gray-600 text-white"
          />
          <input
            type="text"
            placeholder="Year"
            value={cert.year}
            onChange={(e) => handleCertChange(index, 'year', e.target.value)}
            className="w-full p-2 rounded bg-gray-600 text-white"
          />
          <button
            type="button"
            onClick={() => removeCertification(index)}
            className="text-red-400 hover:underline"
          >
            Remove Certification
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addCertification}
        className="mt-2 px-4 py-2 bg-blue-500 rounded text-white"
      >
        + Add Certification
      </button>
    </div>
  );
};

export default CertificationsSection;