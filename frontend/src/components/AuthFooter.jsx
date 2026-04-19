// src/components/AuthFooter.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaUser,
  FaBook,
  FaTachometerAlt,
  FaEnvelope,
  FaUserCircle,
  FaSignOutAlt,
  FaCog,
  FaBriefcase,
  FaMapMarkerAlt,
  FaBuilding,
  FaMailBulk,
  FaGlobe,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import Logo from "../Images/Footer/Footer.png";

const AuthFooter = () => {
  const currentYear = new Date().getFullYear();
  const [visitorCount, setVisitorCount] = useState(0);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let count = localStorage.getItem("websiteVisitorCount");

    if (!count) {
      count = 1;
    } else {
      count = parseInt(count) + 1;
    }

    localStorage.setItem("websiteVisitorCount", count);
    
    if (count >= 1000000) {
      setVisitorCount((count / 1000000).toFixed(1) + "M");
    } else {
      setVisitorCount(count);
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Authenticated Links
  const authLinks = [
    { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt className="mr-2" /> },
    { name: "Contact Requests", path: "/contact-requests", icon: <FaEnvelope className="mr-2" /> },
    { name: "Profile", path: "/profile", icon: <FaUserCircle className="mr-2" /> },
    { name: "Settings", path: "/settings", icon: <FaCog className="mr-2" /> },
  ];

  // Common Links
  const commonLinks = [
    { name: "Career", path: "/career", icon: <FaBriefcase className="mr-2" /> },
    { name: "Testimonials", path: "/testimonials", icon: <FaUser className="mr-2" /> },
    { name: "Features", path: "/features", icon: <FaBook className="mr-2" /> },
  ];

  const linksToShow = [...authLinks, ...commonLinks];

  return (
    <footer className="bg-white text-gray-700 mt-auto">
      {/* MAIN FOOTER */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* COLUMN 1: LOGO */}
        <div>
          <img
            src={Logo}
            alt="Vidit Media Solutions"
            className="h-14 mb-3"
          />
        </div>

        {/* COLUMN 2: FOLLOW US */}
        <div>
          <h4 className="text-xl font-semibold mb-3">Follow Us</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href="https://www.facebook.com/vmsindiainfinity"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition"
              >
                <FaFacebookF />
                <span>Facebook</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/channel/UCaDBWHhaTzKVzZANKuMjpLA"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-600 hover:text-red-600 transition"
              >
                <FaYoutube />
                <span>YouTube</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/viditmediasolutions/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-600 hover:text-pink-600 transition"
              >
                <FaInstagram />
                <span>Instagram</span>
              </a>
            </li>
          </ul>
        </div>

        {/* COLUMN 3: REGISTERED ADDRESS */}
        <div>
          <h4 className="text-xl font-semibold mb-3">Registered Address</h4>
          <div className="flex items-start gap-2">
            <FaMapMarkerAlt className="text-purple-600 mt-1 flex-shrink-0" />
            <p className="text-sm text-gray-600">
              B-6 Yashoda Gardens,<br />
              Bagmugaliya,<br />
              Bhopal-462043
            </p>
          </div>
        </div>

        {/* COLUMN 4: OFFICE ADDRESS */}
        <div>
          <h4 className="text-xl font-semibold mb-3">Office Address</h4>
          <div className="flex items-start gap-2">
            <FaBuilding className="text-purple-600 mt-1 flex-shrink-0" />
            <p className="text-sm text-gray-600">
              B-93 Sant Ashram Nagar,<br />
              Near Krishna Arcade,<br />
              Bagmugaliya, Bhopal-462043
            </p>
          </div>
        </div>

        {/* COLUMN 5: CONTACT DETAILS */}
        <div>
          <h4 className="text-xl font-semibold mb-3">Contact Details</h4>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <FaMailBulk className="text-purple-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm text-gray-600">info@viditmediasolutions.com</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FaGlobe className="text-purple-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Website</p>
                <p className="text-sm text-gray-600">www.viditmediasolutions.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* COPYRIGHT */}
          <div className="text-xs text-gray-500 text-center md:text-left">
            © {currentYear} Vidit Media Solutions. All rights reserved.
          </div>
          
         
          {/* DEVELOPER CREDIT */}
          <a
            href="https://www.technovani.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs hover:text-purple-600 transition-colors"
          >
            Developed by TechnoVani Pvt. Ltd
          </a>
        </div>
      </div>
    </footer>
  );
};

export default AuthFooter;