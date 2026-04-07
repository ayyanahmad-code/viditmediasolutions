import React from 'react';
import { useAuth } from '../context/AuthContext';
import HeroSection from '../components/HeroSection';
import LogoSlider from '../components/LogoSlider';
import Testimonials from '../components/Testimonials';
import Content from '../components/Content';
import Features from '../components/Features';
import MultimediaSection from '../components/MultimediaSection';
import WhatDoYouWant from '../components/WhatDoYouWant';
import MoreReasons from '../components/MoreReasons';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <>
      {/* ================= HERO SLIDER ================= */}
      <HeroSection />

      {/* Logo Slider */}
      <LogoSlider />

      {/* Testimonials */}
      <Testimonials />

      {/* Video + Content */}
      <Content />

      {/* Features */}
      <Features />

      {/* Multimedia Section */}
      <MultimediaSection />

      {/* What Do You Want */}
      <WhatDoYouWant />

      {/* More Reasons */}
      <MoreReasons />
    </>
  );
};

export default Home;