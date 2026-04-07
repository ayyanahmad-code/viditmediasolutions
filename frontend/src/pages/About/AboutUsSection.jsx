import React from "react";
import { FaVideo, FaBriefcase, FaCalendarAlt } from "react-icons/fa";

const AboutUsSection = () => {
  return (
    <section className="bg-gradient-to-r from-[#5B2EDB] via-[#7C3AED] to-[#9F3DDE] text-white py-20">
      <div className="container mx-auto px-4 text-center">

        {/* Heading */}
        <h2 className="text-4xl font-serif mb-6">ABOUT US</h2>
        <p className="max-w-3xl mx-auto mb-16 text-lg text-white/90">
          We started our creative agency as a basic advertising agency with a
          ideation of providing all the media related solutions at one place.
          We have been making inroads in the field of Advertising & Communication,
          Design, Media Planning, Market research, Data Collection, Digital and
          Public Relation services to hundreds of customers.
        </p>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-12 text-left">

          {/* Feature 1 */}
          <div className="flex flex-col items-start">
            <FaVideo className="text-3xl mb-4 text-white" />
            <h3 className="font-bold text-2xl mb-3">
              ANIMATED EXPLAINER VIDEOS
            </h3>
            <p className="text-white/80 text-md leading-relaxed">
              Short videos converting complex ideas into simple, attractive,
              engaging, and meaningful way. In today's market, these videos are
              the most potential resources as they describe the company's product
              in a way that resonates with the target audience.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-start">
            <FaBriefcase className="text-3xl mb-4 text-white" />
            <h3 className="font-bold text-2xl mb-3">
              BRANDING AND CONSULTANCY
            </h3>
            <p className="text-white/80 text-md leading-relaxed">
              We provide brand consultants who analyze and rectify errors in
              promotion channels and bring solutions through strategic marketing
              expertise. Our team evaluates brand performance against competitors
              to drive growth.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-start">
            <FaCalendarAlt className="text-3xl mb-4 text-white" />
            <h3 className="font-bold text-2xl mb-3">
              ACTIVATION AND EVENT
            </h3>
            <p className="text-white/80 text-md leading-relaxed">
              At VMS, we provide services in conceptualization, planning,
              management, and execution of events, promotions, and activations.
              Our team consists of experienced professionals in their
              specializations.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
