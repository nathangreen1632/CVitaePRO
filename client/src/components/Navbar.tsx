import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, [location.pathname]); // ✅ Reacts to login/logout changes

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  // ✅ Pages shown to guests
  const guestPages = ["Home", "Login", "Register", "Features"];

  // ✅ Pages shown to authenticated users
  const authPages = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Resume", path: "/resume" },
    { name: "Resume Editor", path: "/resume-editor" },
    { name: "Generate Cover Letter", path: "/generate-cover-letter" },
  ];

  return (
    <nav className="bg-gray-900 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-wide">
          CVitae<span className="text-red-500">PRO</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-6">
          {!isAuthenticated &&
            guestPages.map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="hover:text-red-400 transition-all duration-200"
              >
                {item}
              </Link>
            ))}

          {isAuthenticated &&
            authPages.map(({ name, path }) => (
              <Link
                key={name}
                to={path}
                className="hover:text-red-400 transition-all duration-200"
              >
                {name}
              </Link>
            ))}

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="hover:text-red-400 transition-all duration-200"
            >
              Logout
            </button>
          )}
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
          {!isAuthenticated &&
            guestPages.map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="block py-2 text-white hover:text-red-400 transition-all duration-200"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </Link>
            ))}

          {isAuthenticated &&
            authPages.map(({ name, path }) => (
              <Link
                key={name}
                to={path}
                className="block py-2 text-white hover:text-red-400 transition-all duration-200"
                onClick={() => setMenuOpen(false)}
              >
                {name}
              </Link>
            ))}

          {isAuthenticated && (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="block py-2 text-white hover:text-red-400 transition-all duration-200"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
