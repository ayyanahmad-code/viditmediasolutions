// src/components/AuthHeader.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../Images/Header/Header.gif";
import { 
  FaUser, 
  FaSignOutAlt, 
  FaTachometerAlt, 
  FaEnvelope, 
  FaUserCircle, 
  FaCog, 
  FaBell,
  FaBriefcase,
  FaVideo,
  FaImage  // ✅ Added FaImage import
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
// ✅ Remove this import - it's causing issues
// import AdminGalleryForm from "../pages/AdminGalleryForm";

const AuthHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt className="mr-2" /> },
    { name: "Applications", path: "/career-applications", icon: <FaBriefcase className="mr-2" /> },
    { name: "Our Clients", path: "/admin/our-clients", icon: <FaUserCircle className="mr-2" /> }, 
    { name: "Videos", path: "/admin/videos", icon: <FaVideo className="mr-2" /> },
    { name: "Contact", path: "/contact-requests", icon: <FaEnvelope className="mr-2" /> },
    { name: "Create Career", path: "/create-career", icon: <FaBriefcase className="mr-2" /> },
    { name: "Gallery", path: "/admin/gallery/create", icon: <FaImage className="mr-2" /> }  
  ];

  // Hide header on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".user-dropdown")) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate("/login");
  };

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: showHeader ? 0 : -120 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="bg-gradient-to-r from-[#5B2EDB] via-[#7C3AED] to-[#9F3DDE] fixed top-0 left-0 w-full z-50 shadow-lg"
    >
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src={Logo}
              alt="Vidit Media Solutions Logo"
              className="h-20 w-32 object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    flex items-center px-5 py-2 text-md font-medium
                    border-2 rounded-md
                    transition-all duration-300
                    
                    ${
                      isActive
                        ? "text-white border-white bg-white/10"
                        : "text-white border-transparent hover:border-white hover:text-red-400"
                    }
                  `}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="relative user-dropdown">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="
                flex items-center space-x-3
                text-white border-2 border-white
                rounded-md px-6 py-2
                hover:bg-white hover:text-black
                transition-all duration-300
              "
            >
              <FaUser className="text-sm" />
              <span className="font-medium">{user?.name || "User"}</span>
              <span className="text-xs opacity-75">▼</span>
            </button>

            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-50"
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                  <p className="text-xs text-purple-600 mt-1">Logged In</p>
                </div>
                
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <FaUserCircle className="text-gray-400" />
                  My Profile
                </Link> 
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                  >
                    <FaSignOutAlt className="text-red-400" />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-black/30 hover:bg-black transition"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <span
                className={`block h-0.5 bg-white transition-all ${
                  isMenuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-white transition-all ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-white transition-all ${
                  isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden mt-4"
          >
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 text-white px-4 py-3 rounded-lg hover:bg-black/30 transition"
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
              
              <div className="border-t border-white/20 pt-4 mt-2">
                <div className="text-white px-4 py-2">
                  <p className="text-sm">Logged in as:</p>
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-xs text-white/70">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 text-red-300 px-4 py-3 rounded-lg hover:bg-black/30 transition w-full"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default AuthHeader;