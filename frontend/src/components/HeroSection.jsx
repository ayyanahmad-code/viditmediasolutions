import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPhoneAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import VideoSlider from "./VideoSlider";

/* ================= YOUTUBE ID ================= */
const getYouTubeId = (url) => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const HeroSection = () => {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <>
      <section className="relative min-h-screen flex items-center overflow-hidden px-4 md:px-10 z-10 bg-gradient-to-r from-[#5B2EDB] via-[#7C3AED] to-[#9F3DDE]">
        
        {/* LEFT CONTENT */}
        <div className="relative max-w-xl text-white z-20">
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-white text-4xl md:text-7xl font-light -tracking-tight mb-4"
          >
            WELCOME TO{" "}
            <span className="font-extrabold relative">
              VIDIT MEDIA SOLUTION
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/90 max-w-3xl mx-auto text-lg md:text-2xl mb-10 font-thin"
          >
            A creative awesome design for super easy to use.  
            Our creativity passion brings{" "}
            <span className="relative">
              <span className="underline font-semibold">
                Vidit Media Solution
              </span>
            </span>
          </motion.p>

          <motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.5, delay: 0.4 }}
  className="flex justify-center md:justify-start w-full"
>
  <Link
    className="
      group
      inline-flex items-center gap-2
      bg-yellow-400 hover:bg-[#7d40ec]
      text-black hover:text-white
      font-semibold
      px-6 py-3
      md:px-8 md:py-4
      text-sm md:text-base
      rounded-full shadow-lg
      transition-all duration-300
      md:ml-32
    "
  >
    Contact Us
    <span className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full text-sm text-black group-hover:text-white transition-colors duration-300 relative z-10">
      <FaPhoneAlt />
    </span>
  </Link>
</motion.div>
        </div>

        {/* RIGHT BIG CIRCULAR VIDEO */}
    <div className="relative z-20 hidden md:block">
      <VideoSlider />
    </div>

      </section>
    </>
  );
};

export default HeroSection;






// // src/components/HeroSection.jsx
// import React from "react";
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import VideoSlider from "./VideoSlider";
// import { FaPhoneAlt } from "react-icons/fa";


// const HeroSection = () => {
//   return (
//     <section className="relative min-h-screen bg-gradient-to-r from-[#5B2EDB] via-[#7C3AED] to-[#9F3DDE] overflow-hidden flex items-center"> 
//       <div className="relative container mx-auto px-4 text-center">
        
//         {/* Main Heading */}
//         <motion.h1
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7 }}
//           className="text-white text-4xl md:text-6xl font-light tracking-wide mb-4 mt-10"
//         >
//           WELCOME TO{" "}
//           <span className="font-extrabold">
//             VIDIT MEDIA SOLUTION
//           </span>
//         </motion.h1>

//         {/* Subtitle */}
//         <motion.p
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.2 }}
//           className="text-white/90 max-w-3xl mx-auto text-lg md:text-2xl mb-10 font-thin"
//         >
//           A creative awesome design for super easy to use.  
//           Our creativity passion brings{" "}
//           <span className="underline font-semibold">
//             Vidit Media Solution
//           </span>
//         </motion.p>

//         {/* CTA Button */}
//         <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.5, delay: 0.4 }}
//         className="mb-16"
//       >
//         <Link
//           to="/contact"
//           className="
//             group
//             inline-flex items-center gap-2
//             border
//             bg-yellow-400 hover:bg-[#7d40ec]
//             text-black hover:text-white
//             font-semibold px-8 py-4
//             rounded-full shadow-lg
//             transition-all duration-300
//           "
//         >
//           Contact Us

//           <span
//             className="
//               w-6 h-6 flex items-center justify-center
//               rounded-full text-sm
//               text-black
//               group-hover:text-white
//               transition-colors duration-300
//             "
//           >
//             <FaPhoneAlt />
//           </span>
//         </Link>
//       </motion.div>

//         {/* Video Slider */}
//         <VideoSlider />
//       </div>
//     </section>
//   );
// };

// export default HeroSection;
