//   import React from "react";
// import { FaPhoneAlt, FaEnvelope, FaFacebookF, FaLinkedinIn, FaInstagram, FaYoutube } from "react-icons/fa";

// const SocialBox = () => {
// return (
//   <div className="bg-[#ECFFFF] p-8 rounded-lg shadow-sm">
//                     <p className="font-semibold text-[#0B2C3D] mb-4">Follow us:</p>
//                     <div className="flex gap-4 text-gray-600 text-lg">
//         <a
//           href="https://www.facebook.com/vmsindiainfinity"
//           target="_blank"
//           rel="noopener noreferrer"
//           aria-label="Facebook"
//           className="hover:text-blue-600 transition"
//         >
//           <FaFacebookF />
//         </a>

//         <a
//           href="https://www.linkedin.com/authwall?trk=bf&trkInfo=AQHWAcN2HuFGVQAAAZuSKYBAMQLw5CRS2Ot-VgFmdAsAv077AMDcmNfjGfI6mEndQaW-NmXg0efgx3-8_1DVOSJAb8cxdqE0bR9SALhoJnf2rlZ_ivWFQUwtQbHmMQL0sFSt_oE=&original_referer=&sessionRedirect=https%3A%2F%2Fwww.linkedin.com%2Fin%2Fnidhi-raikwar-6702745"
//           target="_blank"
//           rel="noopener noreferrer"
//           aria-label="LinkedIn"
//           className="hover:text-blue-700 transition"
//         >
//           <FaLinkedinIn />
//         </a>

//         <a
//           href="https://www.instagram.com/viditmediasolutions/"
//           target="_blank"
//           rel="noopener noreferrer"
//           aria-label="Instagram"
//           className="hover:text-pink-600 transition"
//         >
//           <FaInstagram />
//         </a>

//         <a
//           href="https://www.youtube.com/channel/UCaDBWHhaTzKVzZANKuMjpLA"
//           target="_blank"
//           rel="noopener noreferrer"
//           aria-label="YouTube"
//           className="hover:text-red-600 transition"
//         >
//           <FaYoutube />
//         </a>
//       </div>

//   </div>
//             );
//         };
//         export default SocialBox;


import React from "react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

const SocialBox = () => {
  return (
    <div className="bg-[#ECFFFF] p-6 rounded-xl shadow-md hover:shadow-lg transition">
      <h4 className="text-xl font-semibold text-[#0B2C3D] mb-4">
        Follow Us
      </h4>

      <div className="flex gap-4">
        {[
          { icon: <FaFacebookF />, link: "https://www.facebook.com/vmsindiainfinity", color: "hover:text-blue-600" },
          { icon: <FaLinkedinIn />, link: "https://www.linkedin.com", color: "hover:text-blue-700" },
          { icon: <FaInstagram />, link: "https://www.instagram.com/viditmediasolutions/", color: "hover:text-pink-600" },
          { icon: <FaYoutube />, link: "https://www.youtube.com/channel/UCaDBWHhaTzKVzZANKuMjpLA", color: "hover:text-red-600" },
        ].map((item, index) => (
          <a
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-12 h-12 rounded-full bg-white flex items-center justify-center shadow ${item.color} transition`}
          >
            {item.icon}
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialBox;
