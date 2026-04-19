// src/components/Footer.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaUser,
  FaBook,
} from "react-icons/fa";

import Logo from "../Images/Footer/Footer.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    let count = localStorage.getItem("websiteVisitorCount");

    if (!count) {
      count = 1;
    } else {
      count = parseInt(count) + 1+"M";
    }

    localStorage.setItem("websiteVisitorCount", count);
    setVisitorCount(count);
  }, []);


  return (
    <footer className="bg-white text-gray-700">
      {/* MAIN FOOTER */}
      <div className="max-w-7xl mx-auto px-1 py-10 grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* LOGO + ABOUT */}
        <div>
          <img
            src={Logo}
            alt="Vidit Media Solutions"
            className="h-14 mb-3"
          />
          <p className="text-lg leading-relaxed text-gray-600">
            We go the extra mile in order to surpass your expectations.
            We have been making inroads in the field of Advertising &
            Communication, Design, Media Planning, Market Research,
            Data Collection, Digital and Public Relation services.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div className="" >
          <h4 className="text-xl font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-lg">
            <li><Link to="/" className="hover:text-black">Home</Link></li>
            <li><Link to="/about" className="hover:text-black">About Us</Link></li>
            <li><Link to="/services" className="hover:text-black">Services</Link></li>
            <li><Link to="/contact" className="hover:text-black">Contact Us</Link></li>
          </ul>
        </div>

        {/* FOLLOW US */}
        <div>
          <h4 className="text-2xl font-semibold mb-3">Follow Us</h4>

          <ul className="space-y-4 text-lg ">
            <li>
              <a
                href="https://www.facebook.com/vmsindiainfinity"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition"
              >
                <span className="w-8 h-8 rounded-full flex items-center justify-center">
                  <FaFacebookF />
                </span>
                <span>VMS@Facebook</span>
              </a>
            </li>

            <li>
              <a
                href="https://www.youtube.com/channel/UCaDBWHhaTzKVzZANKuMjpLA"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-600 hover:text-red-600 transition"
              >
                <span className="w-8 h-8 rounded-full flex items-center justify-center">
                  <FaYoutube />
                </span>
                <span>VMS@Youtube</span>
              </a>
            </li>

            <li>
              <a
                href="https://www.instagram.com/viditmediasolutions/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-600 hover:text-pink-600 transition"
              >
                <span className="w-8 h-8 rounded-full flex items-center justify-center">
                  <FaInstagram />
                </span>
                <span>VMS@Instagram</span>
              </a>
            </li>
          </ul>
        </div>

        {/* CONTACT ADDRESS */}
        <div>
          <h4 className="text-2xl font-semibold mb-3">Contact Address</h4>

          <p className="text-lg text-gray-600 mb-2">
            <strong>Registered Address:</strong><br />
            B-6 Yashoda Gardens, Bagmugaliya, Bhopal-462043
          </p>

          <p className="text-lg text-gray-600 mb-2">
            <strong>Office Address:</strong><br />
            B-93 Sant Ashram Nagar Near Krishna Arcade,
            Bagmugaliya Bhopal-462043
          </p>

          <p className="text-md text-gray-600">
            <strong>E-Mail:</strong> info@viditmediasolutions.com<br />
            <strong>Website:</strong> www.viditmediasolutions.com
          </p>
        </div>

      </div>

      {/* BOTTOM BAR */}
     {/* BOTTOM BAR */}
      <div className="border-t border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3">

          {/* COPYRIGHT */}
          <div className="text-sm text-gray-500 text-center md:text-left">
            © {currentYear} Vidit Media Solutions. All rights reserved.
          </div>

          {/* DEVELOPER CREDIT */}
          <a
            href="https://www.technovani.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm hover:underline"
          >
            Developed by TechnoVani Pvt. Ltd
          </a>

        </div>
      </div>


    </footer>
  );
};

export default Footer;
