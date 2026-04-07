import React from "react";

// Import logos
import logo1 from "../Images/LogoSlider/1.png";
import logo2 from "../Images/LogoSlider/2.png";
import logo3 from "../Images/LogoSlider/3.png";
import logo4 from "../Images/LogoSlider/4.png";
import logo5 from "../Images/LogoSlider/5.png";
import logo6 from "../Images/LogoSlider/6.png";
import logo7 from "../Images/LogoSlider/7.png";
import logo8 from "../Images/LogoSlider/8.png";
import logo9 from "../Images/LogoSlider/9.png";
import logo10 from "../Images/LogoSlider/10.png";

// Import profile image
import Director from "../Images/DirectorProfile/Image.png"; // change path if needed

const logos = [
  logo1,
  logo2,
  logo3,
  logo4,
  logo5,
  logo6,
  logo7,
  logo8,
  logo9,
  logo10,
];

const LogoSlider = () => {
  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4 text-center">

        {/* Heading */}
        <h2 className="text-xl md:text-2xl font-medium text-gray-700 mb-12">
          <span className="font-bold text-gray-900">Vidit Media Solutions</span>{" "}
          helped over 10M people create awesome videos by themselves! And is
          trusted by some of the world's leading brands.
        </h2>

        {/* Logo Slider */}
        <div className="relative w-full overflow-hidden mb-16">
          <div className="flex animate-logo-scroll gap-14 items-center">
            {[...logos, ...logos].map((logo, index) => (
              <img
                key={index}
                src={logo}
                alt="Client Logo"
                className="h-20 lg:h-28 w-48 object-contain
                           grayscale opacity-70
                           hover:grayscale-0 hover:opacity-100
                           transition duration-300"
              />
            ))}
          </div>
        </div>

        {/* Director Profile Card */}
        <div className="max-w-4xl mx-auto bg-white border border-gray-200 
                        rounded-xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-6 items-center text-left">

          {/* Profile Image */}
          <div className="flex-shrink-0">
            <img
              src={Director}
              alt="Director"
              className="w-24 h-24 object-cover"
            />
          </div>

          {/* Content */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900">
              Nidhi Raikwar
            </h4>
            <p className="text-sm text-gray-500 mb-3 uppercase">
              Director
            </p>

            <p className="text-gray-700 leading-relaxed">
              We started our creative agency as a basic advertising agency with
              an ideation of providing all the media related solutions at one
              place. <span className="font-semibold">
              We as an agency have a team of highly qualified and experienced
              creative people around us who continuously look after its clients
              and the needs and demands of the market.
              </span>
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default LogoSlider;
