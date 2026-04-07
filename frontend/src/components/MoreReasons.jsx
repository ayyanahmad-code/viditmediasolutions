import React from "react";
import {
  FaFacebook,
  FaYoutube,
  FaBullhorn,
  FaVideo,
  FaEnvelopeOpenText,
  FaPlayCircle,
} from "react-icons/fa";

const reasons = [
  {
    icon: <FaFacebook />,
    title: "Facebook Videos Make",
    desc: "The success of a Facebook video depends on tons of factors like content quality, sharability and sometimes even the music that is part of the content. Vidit Media Solutions is a platform that helps you check all the boxes needed for a sharable video.",
  },
  {
    icon: <FaYoutube />,
    title: "Youtube Video Make",
    desc: "If you want to unleash your creativity then start with a blank canvas! Customize the way you want. Replace any element on the template with your choice of animated texts, images, characters, backgrounds, properties, colors and more to make Youtube Videos.",
  },
  {
    icon: <FaBullhorn />,
    title: "Advertisement Video Make",
    desc: "Your advertisement video ad production by selecting a template from the library. With over 100+ professionally crafted video ad templates, you don’t have to break a sweat to create a truly awe-worthy advertisement. Don’t feel like using templates?",
  },
  {
    icon: <FaVideo />,
    title: "Marketing Video Make",
    desc: "Vidit Media Solutions is the easy marketing video maker that lets you pick from hundreds of templates to kickstart your video creation. Customize as much as you like – swap colors, fonts, characters, properties and more.",
  },
  {
    icon: <FaEnvelopeOpenText />,
    title: "Invitation Video Make",
    desc: "Birthdays? Weddings? Baby Showers? Be it any event – we’ve got you covered! Begin with our wow-looking invitation templates, personalize it with your photos and event info. Make it special. Make it your own!",
  },
  {
    icon: <FaPlayCircle />,
    title: "Intro Video Make",
    desc: "Wanna create an intro video? Vidit Media Solutions create professional-looking intro videos easily with customizable layouts, text animations and properties. Add royalty-free music or upload your own tracks.",
  },
];

const MoreReasons = () => {
  return (
    <section className="relative py-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Some More Reasons to Vidit Media Solutions
          </h2>
          <p className="text-2xl md:text-base text-white/80 max-w-3xl mx-auto">
            Create Powerful Videos Besides design, speed and endless
            customizability, there are many reasons to consider Vidit Media
            Solutions. Let’s take a look!
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14">
          {reasons.map((item, index) => (
            <div key={index}>
              <div className="text-3xl mb-4 text-white">
                {item.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-3">
                {item.title}
              </h3>
              <p className="text-md text-white leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MoreReasons;
