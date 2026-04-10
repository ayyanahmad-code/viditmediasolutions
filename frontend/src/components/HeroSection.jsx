// src/components/HeroSection.jsx
import React from "react";
import { motion } from "framer-motion";
import { FaPhoneAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import VideoSlider from "./VideoSlider";

const HeroSection = () => {
  return (
    <section
      className="relative min-h-[50vh] flex items-center justify-center overflow-hidden 
      bg-gradient-to-r from-[#5B2EDB] via-[#7C3AED] to-[#9F3DDE] 
      px-4 sm:px-6 md:px-10 py-12"
    >
      {/* 🔥 BACKGROUND GLOW BLOBS */}
      <div className="absolute top-10 left-10 w-[250px] h-[250px] bg-purple-400/30 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-pink-400/30 blur-[140px] rounded-full animate-pulse"></div>

      <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-20 relative z-10">
        
        {/* LEFT CONTENT (40%) */}
        <div className="w-full lg:w-[40%] text-white text-center lg:text-left">
          
          {/* SMALL TITLE */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-sm sm:text-base md:text-lg font-medium tracking-widest text-white/80 mb-2"
          >
            WELCOME TO
          </motion.h1>

          {/* MAIN TITLE */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-extrabold leading-tight mb-6"
          >
            <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-white bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]">
              VIDIT MEDIA
            </span>
            <br />
            <span className="text-white">SOLUTIONS</span>
          </motion.h2>

          {/* DESCRIPTION */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl mb-8 font-light max-w-xl mx-auto lg:mx-0"
          >
            A creative awesome design for super easy to use.  
            Our creativity passion brings{" "}
            <span className="underline font-semibold">
              Vidit Media Solutions
            </span>.
          </motion.p>

          {/* BUTTON */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link
              to="/contact"
              className="
                group inline-flex items-center gap-2
                bg-yellow-400 hover:bg-purple-700
                text-black hover:text-white
                font-semibold
                px-6 py-3 rounded-full
                shadow-[0_10px_30px_rgba(0,0,0,0.3)]
                transition-all duration-300
              "
            >
              Contact Us
              <span className="flex items-center justify-center">
                <FaPhoneAlt />
              </span>
            </Link>
          </motion.div>
        </div>

        {/* RIGHT VIDEO (60%) */}
        <div className=" lg:w-[45%]  justify-center lg:justify-end relative">
          
          {/* 💡 GLOW BEHIND VIDEO */}
          <div className="absolute w-[600px] h-[600px] bg-purple-500/30 blur-[120px] rounded-full"></div>

          {/* VIDEO CONTAINER */}
          <div className="w-full max-w-[850px] relative z-10 lg:scale-110">
            <VideoSlider />
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;