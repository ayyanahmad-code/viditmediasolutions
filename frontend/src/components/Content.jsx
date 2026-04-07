import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Vms from "../Images/Home/vms.mp4";

const Content  = () => {

return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
    <div className="grid lg:grid-cols-2 gap-14 items-center">

      {/* LEFT SIDE – VIDEO */}
      <motion.div
        initial={{ opacity: 0, x: -60, scale: 0.95 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative rounded-3xl overflow-hidden shadow-2xl"
      >
        <video
          src={Vms}   // 👉 put your video path here
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover rounded-3xl"
        />
      </motion.div>

      {/* RIGHT SIDE – TEXT */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold mb-6 text-gray-900">
          Branding & Consultancy
        </h2>

        <p className="text-gray-600 text-lg leading-relaxed mb-6">
          We provide expert brand consultancy services that analyze, refine,
          and optimize your brand’s positioning across all digital platforms.
          Our strategies help businesses understand market behavior, evaluate
          competitors, and create impactful branding solutions.
        </p>

        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          From market analysis and content marketing to website audits,
          keyword research, and video branding — our team transforms brands
          into powerful digital identities.
        </p>

        <Link
          to="/services"
          className="inline-flex items-center px-8 py-4 bg-primary text-black font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
        >
          Explore Our Services →
        </Link>
      </motion.div>

      </div>
    </div>
       </section>
);
};
export default Content;
