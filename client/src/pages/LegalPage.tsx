import React, { useRef, useEffect, useState } from "react";
import HeaderBar from "../components/layout/HeaderBar.tsx";

const legalDocs = [
  { title: "AI Fair Use Policy", file: "ai-fair-use-policy.html", key: "ai" },
  { title: "Cookie Policy", file: "cookie-policy.html", key: "cookie" },
  { title: "Copyright & IP Policy", file: "copyright-policy.html", key: "copyright" },
  { title: "Data Processing Addendum", file: "dpa-policy.html", key: "dpa" },
  { title: "Disclaimer", file: "disclaimer-policy.html", key: "disclaimer" },
  { title: "End User License Agreement", file: "eula.html", key: "eula" },
  { title: "GDPR Representative Agreement", file: "gdpr.html", key: "gdpr" },
  { title: "Privacy Policy", file: "privacy-policy.html", key: "privacy" },
  { title: "Security Policy", file: "security-policy.html", key: "security" },
  { title: "Terms of Service", file: "terms-of-service.html", key: "tos" },
];

const LegalPage = (): React.JSX.Element => {
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [activeKey, setActiveKey] = useState<string>("ai");
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [navOpen, setNavOpen] = useState<boolean>(false);

  const handleScrollTo = (key: string) => {
    const el = sectionRefs.current[key];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveKey(key);
      setHighlighted(key);
      setTimeout(() => setHighlighted(null), 2000);
      setNavOpen(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) {
          const key = Object.entries(sectionRefs.current).find(
            ([_, ref]) => ref === visible.target
          )?.[0];
          if (key) setActiveKey(key);
        }
      },
      { rootMargin: "-100px 0px -70% 0px", threshold: 0.2 }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 pb-28">
      <HeaderBar title="Legal Documents" />

      <div className="py-10 px-4 md:px-12">
        <h1 className="text-4xl font-bold text-center mb-8">Legal Documents</h1>

        {/* Navigation */}
        <div className="mb-10 sticky top-4 z-40">
          <div className="flex justify-center mb-4 md:hidden">
            <button
              onClick={() => setNavOpen(!navOpen)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              {navOpen ? "Hide Documents" : "Show Documents"}
            </button>
          </div>

          <div
            className={`flex flex-wrap justify-center gap-4 bg-gray-900 py-2 transition-all duration-300 ease-in-out ${
              navOpen ? "block" : "hidden md:flex"
            }`}
          >
            {legalDocs.map((doc) => (
              <button
                key={doc.key}
                onClick={() => handleScrollTo(doc.key)}
                className={`px-4 py-2 rounded text-sm font-medium transition border
                  ${
                  activeKey === doc.key
                    ? "bg-blue-700 text-white border-blue-900"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-600"
                }`}
              >
                {doc.title}
              </button>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-20">
          {legalDocs.map((doc) => (
            <div
              key={doc.key}
              ref={(el) => {
                sectionRefs.current[doc.key] = el;
              }}
              className={`bg-white rounded-lg shadow p-6 transition-all duration-500 ${
                highlighted === doc.key ? "ring-10 ring-red-800 animate-pulse" : ""
              }`}
            >
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">{doc.title}</h2>
              <iframe
                title={doc.title}
                src={`/legal/${doc.file}`}
                className="w-full h-[600px] border rounded"
              />
              <div className="mt-6 text-center">
                <button
                  onClick={scrollToTop}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-md transition"
                >
                  Back to Top
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
