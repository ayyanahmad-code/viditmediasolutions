//   import React from "react";
// import { FaPhoneAlt, FaEnvelope, FaFacebookF, FaLinkedinIn, FaInstagram, FaYoutube } from "react-icons/fa";

//   const PhoneBox = () => {
//   return (
//   <div className="bg-[#FFF7EE] p-8 rounded-lg shadow-sm">
//               <div className="flex items-center gap-3 mb-4 text-[#0B2C3D] font-semibold text-lg">
//                 <FaPhoneAlt />
//                 <span>Phone:</span>
//               </div>
//               <p className="text-gray-600 mb-4">Call us any time!</p>
//               <p className="font-semibold text-[#0B2C3D]">+91 9827666706</p>
//               <p className="font-semibold text-[#0B2C3D]">+91 7000612748</p>
//             </div>
//             );
//         };
//         export default PhoneBox;

import React from "react";
import { FaPhoneAlt } from "react-icons/fa";

const PhoneBox = () => {
  return (
    <div className="bg-[#FFF7EE] p-6 rounded-xl shadow-md hover:shadow-lg transition">
      <div className="flex items-center gap-4 mb-3">
        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
          <FaPhoneAlt />
        </div>
        <h4 className="text-xl font-semibold text-[#0B2C3D]">
          Contact
        </h4>
      </div>

      <p className="text-gray-600 mb-2">Call us any time</p>

      {/* CLICK → NUMBER AUTO FILLS */}
      <a
        href="tel:+919827666706"
        className="block font-semibold text-[#0B2C3D] hover:text-orange-600 transition"
      >
        +91 9827666706
      </a>

      <a
        href="tel:+917000612748"
        className="block font-semibold text-[#0B2C3D] hover:text-orange-600 transition"
      >
        +91 7000612748
      </a>
    </div>
  );
};

export default PhoneBox;
