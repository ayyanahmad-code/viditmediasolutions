// src/pages/Testimonials.jsx
import React from 'react';
import { motion } from 'framer-motion';
// import TestimonialCard from "../components/TestimonialCard";
import DesignGallery from '../components/DesignGallery';
import DirectorProfile from '../components/DirectorProfile';
import VideoSlider2 from '../components/VideoSlider2';

const Testimonials = () => {
 

  return (
    <div className="min-h-screen">
      <div className='text-center mt-10'>
        <h1 className='text-5xl font-bold mb-10 text-black '>What we do at VMS</h1>
      </div>
<br/>

   {/* ================= DESIGN GALLERY ================= */}
      <DesignGallery />
<br/>
   {/* ================= TESTIMONIALS ================= */}

      <DirectorProfile />

       {/* ================= VIDEO SLIDER ================= */}
            <section className="py-16 bg-white">
              <div className="container mx-auto px-4">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="text-4xl font-bold text-center mb-10"
                >
                  Video Marketing Work
                </motion.h2>

                <VideoSlider2 />
              </div>
            </section>

    </div>


  );
};

export default Testimonials;


