import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";


const Navbar: React.FC = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, [location]); // Run again when route changes

  const publicPages = ["Home", "Login", "Register", "Features"];
  const privatePages = ["Dashboard", "Resume", "Resume-Editor", "Generate-Cover-Letter"];

  const visiblePages = isAuthenticated ? privatePages : publicPages;

  return (
    <nav className="bg-gray-900 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-wide">
          CVitae<span className="text-red-500">PRO</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-6">
          {visiblePages.map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase()}`}
              className="hover:text-red-400 transition-all duration-200"
            >
              {item.replace(/-/g, " ")}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white text-3xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-800 py-4 px-6">
          {visiblePages.map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase()}`}
              className="block py-2 text-white hover:text-red-400 transition-all duration-200"
              onClick={() => setMenuOpen(false)}
            >
              {item.replace(/-/g, " ")}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
