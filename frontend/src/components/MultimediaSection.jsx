import React from "react";
import { FaSearch, FaBullseye, FaEye } from "react-icons/fa";

const MultimediaSection = () => {
  return (
    <section className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 py-24">
      {/* Heading */}
      <div className="max-w-6xl mx-auto px-4 text-center text-white">
        <h2 className="text-4xl font-bold mb-4">
          Best Multimedia Designs
        </h2>
        <p className="max-w-3xl mx-auto text-base text-white/90">
          Multimedia design allows for a much higher level of interaction
          because it's less restrictive than other forms of design.
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto px-4 mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Card 1 */}
        <div className="
          group relative bg-white rounded-xl shadow-lg
          p-8 text-center
          border-2 border-transparent
          hover:border-indigo-500
          transition-all duration-300
        ">
          {/* Top line */}
          <span className="absolute top-0 left-0 w-full h-[3px] bg-indigo-500 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500"></span>
          {/* Bottom line */}
          <span className="absolute bottom-0 left-0 w-full h-[3px] bg-indigo-500 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500"></span>

          <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mb-6 text-2xl">
            <FaSearch />
          </div>

          <h3 className="text-2xl font-bold mb-3">
            WHAT WE BELIEVE?
          </h3>

          <p className="text-lg text-gray-600 leading-relaxed">
            We believe that creativity for its own sake is fool’s gold.
            It must be founded on sound strategy, simplicity, and relevance.
          </p>
        </div>

        {/* Card 2 */}
        <div className="
          group relative bg-white rounded-xl shadow-lg
          p-8 text-center
          border-2 border-transparent
          hover:border-indigo-500
          transition-all duration-300
        ">
          <span className="absolute top-0 left-0 w-full h-[3px] bg-indigo-500 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500"></span>
          <span className="absolute bottom-0 left-0 w-full h-[3px] bg-indigo-500 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500"></span>

          <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mb-6 text-2xl">
            <FaBullseye />
          </div>

          <h3 className="text-2xl font-bold mb-3">
            OUR MISSION
          </h3>

          <p className="text-lg text-gray-600 leading-relaxed">
            We listen, understand client goals, and deliver the most
            effective solutions using our expertise.
          </p>
        </div>

        {/* Card 3 */}
        <div className="
        group relative
        bg-white rounded-xl shadow-lg
        p-8 text-center
        hover:scale-105 transition-transform duration-300
        border-2 border-transparent
      ">
        {/* TOP SLIDE LINE */}
        <span className="
          absolute top-0 left-0 w-full h-[3px]
          bg-[#7C3AED]
          scale-x-0 origin-left
          group-hover:scale-x-100
          transition-transform duration-500
        "></span>

        {/* BOTTOM SLIDE LINE */}
        <span className="
          absolute bottom-0 left-0 w-full h-[3px]
          bg-[#7C3AED]
          scale-x-0 origin-left
          group-hover:scale-x-100
          transition-transform duration-500
        "></span>

        {/* Icon */}
        <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mb-6 text-2xl">
          <FaSearch />
        </div>

        <h3 className="text-2xl font-bold mb-3">
          WHAT WE BELIEVE?
        </h3>

        <p className="text-lg text-gray-600 leading-relaxed">
          We believe that creativity for its own sake is fool’s gold, it must
          be founded on sound overall strategy. If there’s anything that
          distinguishes our style, it is our stress on hard facts,
          simplicity and relevance.
        </p>
         </div>


      </div>
    </section>
  );
};

export default MultimediaSection;
