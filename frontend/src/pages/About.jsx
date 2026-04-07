// src/pages/About.jsx
import React from 'react';
import AboutUsSection from "../pages/About/AboutUsSection";
import StatsSection from "../pages/About/StatsSection";

const About = () => {
  return (
    <div className="w-full mt-10">
      {/* About Us Section */}
      <AboutUsSection />

      {/* Stats Section */}
      <StatsSection />
    </div>
  );
};

export default About;
