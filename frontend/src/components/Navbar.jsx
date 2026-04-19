// src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../Images/Header/Header.gif";
import { FaSearch, FaUser, FaSignInAlt, FaUserPlus, FaEnvelope, FaTachometerAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import VisitorBadge from "./VisitorBadge";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Gallery", path: "/company-gallery" },
    { name: "Services", path: "/services" },
    { name: "Career", path: "/career" },
    { name: "Contact Us", path: "/contact" },
  ];

  // 🔥 Hide header on scroll down, show on scroll up
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
      if (!e.target.closest(".search")) {
        setIsSearchOpen(false);
      }
      if (!e.target.closest(".user-dropdown")) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
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
    navigate("/");
  };

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: showHeader ? 0 : -120 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="bg-gradient-to-r from-[#5B2EDB] via-[#7C3AED] to-[#9F3DDE] fixed top-0 left-0 w-full z-50"
    >
      <div className="search text-white flex items-center justify-end space-x-4 mr-16">
        {/* Search functionality - kept from original */}
        <div className="relative">
          {isSearchOpen && (
            <motion.input
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 200, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              type="search"
              autoFocus
              placeholder="Search..."
              className="text-sm px-4 py-2 rounded-full bg-white/35 placeholder-white/70 text-white focus:outline-none"
            />
          )}
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src={Logo}
              alt="Vidit Media Solutions Logo"
              className="h-18 w-36"
            />
          </Link>

          <div className="flex items-center gap-4">
            <VisitorBadge />
          </div>

          {/* Desktop Navigation - Only Nav Items, No Auth Buttons */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    px-5 py-2 text-lg font-medium
                    border-2 rounded-md
                    transition-all duration-300
                    
                    ${
                      isActive
                        ? "text-red-400 border-white"
                        : "text-white border-transparent hover:border-white hover:text-red-400"
                    }
                  `}
                >
                  {item.name}
                </Link>
              );
            })}

            {/* Video Button - kept from original */}
            <button
              onClick={() =>
                window.open(
                  "https://www.youtube.com/channel/UCaDBWHhaTzKVzZANKuMjpLA",
                  "_blank"
                )
              }
              className="
                text-white
                border-2 border-white
                rounded-md px-6 py-3
                hover:bg-white hover:text-black
                transition-all duration-300
                flex items-center space-x-2
              "
            >
              <span>Our Channel</span>
            </button>

            {/* Auth Section - REMOVED - No Login/Register or User Dropdown */}
          </nav>

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

        {/* Mobile Navigation - Only Nav Items, No Auth */}
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
                  className="text-white px-4 py-3 rounded-lg hover:bg-black/30 transition"
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Video Button - Mobile */}
              <button
                onClick={() => {
                  window.open(
                    "https://www.youtube.com/channel/UCaDBWHhaTzKVzZANKuMjpLA",
                    "_blank"
                  );
                  setIsMenuOpen(false);
                }}
                className="text-white border border-white rounded-md px-6 py-3 hover:bg-white hover:text-black transition-colors duration-300 flex items-center space-x-2"
              >
                <span>Our Channel</span>
              </button>

              {/* Auth Section - REMOVED from mobile */}
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;