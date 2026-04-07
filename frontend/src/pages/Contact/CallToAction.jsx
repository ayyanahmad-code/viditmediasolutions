import React from "react";
import { FaArrowRight } from "react-icons/fa";

const CallToAction = () => {
  return (
    <section className="relative py-28 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-5">
          Vidit Media Solutions Now & Forever.
        </h2>

        <p className="text-sm md:text-base text-white/80 mb-10">
          We believe creating beautiful designs should not be expensive.
          That’s why Vidit Media Solutions is for everyone. Get started and
          extend with affordable packages.
        </p>

        <button className="border inline-flex items-center gap-2 bg-yellow-400 hover:bg-[#7d40ec] text-black hover:text-white font-semibold px-8 py-4 rounded-full shadow-lg transition">
          Contact Us
          <FaArrowRight className="text-sm" />
        </button>
      </div>
    </section>
  );
};

export default CallToAction;
