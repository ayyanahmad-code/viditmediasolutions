// src/pages/Services.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  FaBullhorn,
  FaVideo,
  FaCalendarAlt,
  FaChartLine,
  FaFileAlt,
  FaMobileAlt,
} from "react-icons/fa";
import Header from "../pages/Services/Header";
import Cards from "../pages/Services/Cards";


const Services = () => {
 

  return (
    <div className="bg-gradient-to-r from-[#5B2EDB] via-[#7C3AED] to-[#9F3DDE] min-h-screen py-20 px-4 mt-10">
      {/* Header */}
      <Header />

      {/* Cards */}
      <Cards />

      {/* Bottom Button */}
      <div className="text-center mt-14">
        <button className="border px-8 py-3 bg-yellow-400 text-black font-bold rounded-full shadow-lg hover:bg-[#7C3AED] hover:text-white transition-all duration-300">
          Know More
        </button>
      </div>
    </div>
  );
};

export default Services;
