// src/components/HeroSection.jsx
import React from "react";
import { motion } from "framer-motion";
import { FaPhoneAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import VideoSlider from "./VideoSlider";

const HeroSection = () => {
  return (
    <section
      className="relative min-h-[60vh] flex items-center justify-center overflow-hidden 
      bg-gradient-to-r from-[#5B2EDB] via-[#7C3AED] to-[#9F3DDE] 
      px-4 sm:px-6 md:px-10 
      pt-[80px] sm:pt-[90px] md:pt-[100px] pb-10 sm:pb-12"
    >
      {/* 🔥 BACKGROUND BLOBS */}
      <div className="absolute top-10 left-5 sm:left-10 w-[150px] sm:w-[250px] h-[150px] sm:h-[250px] bg-purple-400/30 blur-[100px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-10 right-5 sm:right-10 w-[180px] sm:w-[300px] h-[180px] sm:h-[300px] bg-pink-400/30 blur-[120px] rounded-full animate-pulse"></div>

      <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center gap-10 lg:gap-20 relative z-10">

        {/* LEFT CONTENT */}
        <div className="w-full lg:w-[40%] text-white text-center lg:text-left">

          {/* SMALL TITLE */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm sm:text-base md:text-lg font-medium tracking-widest text-white/80 mb-2"
          >
            WELCOME TO
          </motion.h1>

          {/* MAIN TITLE */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-extrabold leading-tight mb-6"
          >
            <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-white bg-clip-text text-transparent">
              VIDIT MEDIA
            </span>
            <br />
            <span className="text-white">SOLUTIONS</span>
          </motion.h2>

          {/* DESCRIPTION */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white/90 text-sm sm:text-base md:text-lg mb-6 max-w-xl mx-auto lg:mx-0"
          >
            A creative awesome design for super easy to use.
            Our creativity passion brings{" "}
            <span className="underline font-semibold">
              Vidit Media Solutions
            </span>.
          </motion.p>

          {/* BUTTON */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2
              bg-yellow-400 hover:bg-purple-700
              text-black hover:text-white
              font-semibold px-6 py-3 rounded-full
              shadow-lg transition-all duration-300"
            >
              Contact Us <FaPhoneAlt />
            </Link>
          </motion.div>
        </div>

        {/* RIGHT VIDEO */}
        <div className="w-full lg:w-[60%] flex justify-center relative">

          {/* 💡 GLOW */}
          <div className="absolute w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-purple-500/30 blur-[100px] rounded-full"></div>

          {/* VIDEO CONTAINER */}
          <div className="w-full max-w-full sm:max-w-[700px] md:max-w-[850px] relative z-10">
            <VideoSlider />
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;