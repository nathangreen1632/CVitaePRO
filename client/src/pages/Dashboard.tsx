import React, { useState } from "react";
import { Link } from "react-router-dom";
import ResumeCard from "../pages/ResumeCard.jsx"; // ✅ Ensure correct import

const Dashboard: React.FC = () => {
  const [resumes, setResumes] = useState<{ id: string; name: string; jobTitle: string; resumeSnippet: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Capture Resume Form Data
  const [resumeData, setResumeData] = useState({
    name: "",
    email: "",
    phone: "",
    summary: "",
    experience: "",
    education: "",
    skills: "",
  });

  // ✅ Update Form Inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setResumeData({ ...resumeData, [e.target.name]: e.target.value });
  };

  // ✅ Fetching the list of resumes from the backend with Authorization Header
  const fetchResumes = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token"); // ✅ Retrieve the token

    if (!token) {
      console.error("❌ No token found in localStorage.");
      setError("Unauthorized: No token found.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/resume/list", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Ensure token is sent
        },
      });

      if (!response.ok) {
        setError("Failed to load resumes. Please try again later.");
        return;
      }

      const data = await response.json();
      setResumes(data);
    } catch (error) {
      console.error("Error fetching resumes:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Generate Resume Function (Sends Form Data to Backend with Correct Structure)
  const handleGenerateResume = async () => {
    setLoading(true);
    setError(null);

    const formattedResumeData = {
      type: "resume",
      resumeData: {
        name: resumeData.name,
        email: resumeData.email,
        phone: resumeData.phone,
        summary: resumeData.summary,
        experience: resumeData.experience.split("\n").map((exp) => ({
          company: exp.trim(),
          role: "Software Engineer",
          start_date: "2023-01-01",
          end_date: "",
          responsibilities: ["Worked on multiple projects"],
        })),
        education: [
          {
            institution: resumeData.education,
            degree: "Bachelor's Degree",
            graduation_year: "2025",
          },
        ],
        skills: resumeData.skills.split(",").map((skill) => skill.trim()),
      },
    };

    console.log("🚀 Debug: Sending resume data:", JSON.stringify(formattedResumeData));

    try {
      const response = await fetch("/api/resume/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedResumeData),
      });

      if (!response.ok) {
        setError("Failed to generate resume.");
        return;
      }

      const responseData = await response.json();
      console.log("✅ Resume Generated Response:", responseData);

      await fetchResumes();
    } catch (error) {
      console.error("Error generating resume:", error);
      setError("Something went wrong while generating the resume.");
    } finally {
      setLoading(false);
    }
  };


  // ✅ Enhance Resume Function (Sends Latest Resume to Backend)
  const handleEnhanceResume = async () => {
    setLoading(true);
    setError(null);

    if (resumes.length === 0) {
      console.error("❌ No resumes available to enhance.");
      setError("No resumes found to enhance.");
      return;
    }

    const latestResume = resumes[0];

    console.log("🚀 Debug: Latest resume before enhancing:", latestResume);

    // **FORCE CHECK**: Ensure resumeId is a UUID
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(latestResume.id);
    if (!isUUID) {
      console.error("❌ Invalid resume ID detected (not UUID):", latestResume.id);
      setError("Invalid resume ID. Cannot enhance resume.");
      return;
    }

    console.log("✅ Resume ID is valid UUID:", latestResume.id);

    try {
      const requestBody = {
        resumeId: latestResume.id,
        resumeText: latestResume.resumeSnippet,
      };

      console.log("📤 Sending API Request:", JSON.stringify(requestBody));

      const response = await fetch("/api/openai/enhance-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      console.log("📩 Received Response Status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Failed to enhance resume:", errorData);
        setError("Failed to enhance resume.");
        return;
      }

      console.log("✅ Resume enhanced successfully!");
      await fetchResumes();
    } catch (error) {
      console.error("❌ Error enhancing resume:", error);
      setError("Something went wrong while enhancing the resume.");
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Navigation */}
      <header className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Resume Dashboard</h1>
        <nav>
          <Link to="/settings" className="px-4 py-2 hover:text-blue-500">Settings</Link>
          <button className="px-4 py-2 bg-red-500 text-white rounded">Logout</button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Welcome to your Dashboard</h2>

        {/* Resume Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button className="p-4 bg-blue-500 text-white text-center rounded">Upload Resume</button>
          <button onClick={handleGenerateResume} className="p-4 bg-purple-500 text-white text-center rounded">
            Generate Resume
          </button>
          <button onClick={handleEnhanceResume} className="p-4 bg-green-500 text-white text-center rounded">
            Enhance Resume
          </button>
        </div>

        {/* Error Message Display */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* ✅ Recent Activity (Restored) */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
          <ul>
            <li className="py-2 border-b">Edited Resume - <span className="text-blue-500">Software Engineer</span></li>
            <li className="py-2 border-b">Generated Resume - <span className="text-green-500">Marketing Specialist</span></li>
          </ul>
        </div>

        {/* Your Resumes Section */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-center">Your Resumes</h3>
          {loading ? (
            <p className="text-center text-gray-400">Loading resumes...</p>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {resumes.map((resume) => (
                <ResumeCard
                  key={resume.id}
                  id={resume.id}
                  name={resume.name}
                  jobTitle={resume.jobTitle}
                  resumeSnippet={resume.resumeSnippet}
                  refreshResumes={fetchResumes}
                  onViewResume={() => console.log(`Viewing resume: ${resume.id}`)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ✅ Resume Details Form */}
        <div className="bg-gray-800 p-6 rounded-lg w-full max-w-3xl shadow-lg mx-auto mt-12">
          <h2 className="text-2xl font-semibold mb-4 text-center text-white">Resume Details</h2>

          <label className="block mb-3">
            <span className="text-gray-300">Full Name</span>
            <input type="text" name="name" value={resumeData.name} onChange={handleChange} className="w-full p-3 bg-gray-700 rounded-lg text-white" placeholder="John Doe" />
          </label>

          <label className="block mb-3">
            <span className="text-gray-300">Email</span>
            <input type="text" name="email" value={resumeData.email} onChange={handleChange} className="w-full p-3 bg-gray-700 rounded-lg text-white" placeholder="example@example.com" />
          </label>

          <label className="block mb-3">
            <span className="text-gray-300">Phone Number</span>
            <input type="text" name="phone" value={resumeData.phone} onChange={handleChange} className="w-full p-3 bg-gray-700 rounded-lg text-white" placeholder="555-555-5555" />
          </label>

          <label className="block mb-3">
            <span className="text-gray-300">Professional Summary</span>
            <textarea name="summary" value={resumeData.summary} onChange={handleChange} className="w-full p-3 bg-gray-700 rounded-lg text-white" placeholder="Write a brief summary..."></textarea>
          </label>

          <label className="block mb-3">
            <span className="text-gray-300">Work Experience</span>
            <textarea name="experience" value={resumeData.experience} onChange={handleChange} className="w-full p-3 bg-gray-700 rounded-lg text-white" placeholder="List your work experience..."></textarea>
          </label>

          <label className="block mb-3">
            <span className="text-gray-300">Education</span>
            <textarea name="education" value={resumeData.education} onChange={handleChange} className="w-full p-3 bg-gray-700 rounded-lg text-white" placeholder="List your educational background..."></textarea>
          </label>

          <label className="block mb-3">
            <span className="text-gray-300">Skills</span>
            <input type="text" name="skills" value={resumeData.skills} onChange={handleChange} className="w-full p-3 bg-gray-700 rounded-lg text-white" placeholder="E.g. JavaScript, React, Node.js" />
          </label>

          <div className="flex justify-center mt-6 ">
            <button onClick={handleGenerateResume} className="bg-green-500 text-white px-6 py-3 rounded-lg">
              Generate Resume
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
