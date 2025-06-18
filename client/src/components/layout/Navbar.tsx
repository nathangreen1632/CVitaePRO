import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    try {
      if (token) {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setIsAdmin(decoded?.role === "admin");
      } else {
        setIsAdmin(false);
      }
    } catch {
      setIsAdmin(false);
    }
  }, [location]);

  const publicPages = ["Home", "Login", "Register", "Features"];
  const privatePages = ["Dashboard", "Resume-Form", "Resume-Editor", "Generate-Cover-Letter"];

  const visiblePages = isAuthenticated ? privatePages : publicPages;

  const isActive = (path: string) => {
    const route = path === "Home" ? "/" : `/${path.toLowerCase()}`;
    return location.pathname === route;
  };

  return (
    <nav className="bg-gray-900 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6">

        <Link to="/" className="text-xl font-bold tracking-wide">
          CVitae<span className="text-red-500">PRO</span>
        </Link>

        <div className="hidden md:flex space-x-6">
          {visiblePages.map((item) => {
            const path = item === "Home" ? "/" : `/${item.toLowerCase()}`;
            return (
              <Link
                key={item}
                to={path}
                className={`transition-all duration-200 ${
                  isActive(item) ? "text-red-500" : "hover:text-red-400"
                }`}
              >
                {item.replace(/-/g, " ")}
              </Link>
            );
          })}

          <Link
            to="/help-center"
            className={`transition-all duration-200 ${
              location.pathname === "/help-center" ? "text-red-500" : "hover:text-red-400"
            }`}
          >
            Help Center
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className={`font-semibold transition-all duration-200 ${
                location.pathname === "/admin" ? "text-red-500" : "hover:text-red-400"
              }`}
            >
              Admin Panel
            </Link>
          )}

          <Link
            to="/legal"
            className={`transition-all duration-200 ${
              location.pathname === "/legal" ? "text-red-500" : "hover:text-red-400"
            }`}
          >
            Legal
          </Link>
        </div>

        <button
          className="md:hidden text-white text-3xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-gray-800 py-4 px-6">
          {visiblePages.map((item) => {
            const path = item === "Home" ? "/" : `/${item.toLowerCase()}`;
            return (
              <Link
                key={item}
                to={path}
                className={`block py-2 transition-all duration-200 ${
                  isActive(item) ? "text-red-500" : "text-white hover:text-red-400"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {item.replace(/-/g, " ")}
              </Link>
            );
          })}

          <Link
            to="/help-center"
            className={`block py-2 transition-all duration-200 ${
              location.pathname === "/help-center" ? "text-red-500" : "text-white hover:text-red-400"
            }`}
            onClick={() => setMenuOpen(false)}
          >
            Help Center
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className={`block py-2 font-semibold transition-all duration-200 ${
                location.pathname === "/admin" ? "text-red-500" : "text-white hover:text-red-400"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              Admin Panel
            </Link>
          )}

          <Link
            to="/legal"
            className={`block py-2 transition-all duration-200 ${
              location.pathname === "/legal" ? "text-red-500" : "text-white hover:text-red-400"
            }`}
            onClick={() => setMenuOpen(false)}
          >
            Legal
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
