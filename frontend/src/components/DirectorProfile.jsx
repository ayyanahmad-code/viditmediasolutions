// src/components/DirectorProfile.jsx
import React from "react";
import { FaQuoteLeft } from "react-icons/fa";
import Profile from "../Images/DirectorProfile/Nadhi Mam.jpeg";

const DirectorProfile = () => {
  return (
    <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-500 py-20">
      {/* Heading */}
      <div className="text-center text-white mb-14">
        <h2 className="text-4xl font-bold mb-3">
          Join Our Community Of Digital Creators
        </h2>
        <p className="text-white/80">
          From beginners to industry leaders, everyone loves Vidit Media Solutions.
        </p>
      </div>

      {/* Card */}
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-6xl mx-auto p-10">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            
            {/* Left Image */}
            <div className="flex justify-center">
              <img
                src={Profile}
                alt="Director"
                className="w-60 h-63  rounded-md "
              />
            </div>

            {/* Right Content */}
            <div>
              <FaQuoteLeft className="text-purple-500 text-3xl mb-4" />

              <p className="text-gray-600 leading-relaxed mb-6">
                VMS INDIA is not just a advertising agency its a dream company for me
                and under the head of the company we provide 360° services to our
                clients. With the thought of providing advertising services with all
                the dedication utmost efforts we can put into, we are proud to be a
                Beginner in advertising agency. We have specialized designing personnel
                with great ideas, given 100% to each of our clients to gain their
                confidence in us.
              </p>

              <h4 className="font-bold text-purple-600">Nidhi Raikwar</h4>
              <span className="text-sm text-gray-500">Director</span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default DirectorProfile;
