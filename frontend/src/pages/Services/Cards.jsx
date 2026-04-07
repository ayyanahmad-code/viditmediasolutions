import React from "react";
import { motion } from "framer-motion";
import OUTDOORMEDIA from "../../Images/Services/sem.png";
import ProductionImg from "../../Images/Services/social-media-marketing.png";
import ActivationImg from "../../Images/Services/seo.png";
import BrandingImg from "../../Images/Services/web-design.png";
import ContentImg from "../../Images/Services/content-writing.png";
import AppDevImg from "../../Images/Services/app-development.png";

const Cards = () => {
  const services = [
    {
      image: OUTDOORMEDIA,
      title: "OUTDOOR MEDIA",
      description:
        "Outdoor advertising reaches consumers when they are outside their homes. Some major Outdoor Advertising Associations in world suggests that’s where consumers spend 70 percent of their time.",
    },
    {
      image: ProductionImg,
      title: "PRODUCTION",
      description:
        "Audio Visuals are a powerful medium to reach out to and connect with present and potential customers of your brand.",
    },
    {
      image: ActivationImg,
      title: "ACTIVATION AND EVENT",
      description:
        "We provide services in conceptualization, planning, management and execution of Events & Promotions.",
    },
    {
      image: BrandingImg,
      title: "BRANDING AND CONSULTANCY",
      description:
        "Brand consultants analyze and rectify errors in promotion channels to improve marketing effectiveness.",
    },
    {
      image: ContentImg,
      title: "CONTENT MARKETING",
      description:
        "Our writers ensure customers resonate with your brand, improving engagement and SEO.",
    },
    {
      image: AppDevImg,
      title: "APP DEVELOPMENT",
      description:
        "Advanced app solutions for Android & iOS helping businesses grow faster.",
    },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-14 max-w-6xl mx-auto">
      {services.map((service, index) => (
       <motion.div
        key={index}
        whileHover={{ y: -10, scale: 1.1 }} // bigger zoom
        whileTap={{ scale: 0.95 }}         // optional tap shrink
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="
          group relative bg-white rounded-2xl
          pt-10 pb-8 px-8
          flex flex-col
          min-h-[420px]
          border border-gray-200
          shadow-md hover:shadow-2xl
          transition-all duration-500
          overflow-hidden
        "
      >

          {/* 🔥 BACKGROUND GLOW */}
          <span className="
            absolute inset-0
           
            opacity-0 group-hover:opacity-100
            transition-opacity duration-500
          " />

          {/* TOP SLIDE LINE */}
          <span className="
            absolute top-0 left-0 w-full h-[3px]
            bg-[#7C3AED]
            scale-x-0 origin-left
            group-hover:scale-x-100
            transition-transform duration-500
          " />

          {/* IMAGE */}
          <div className="flex justify-center mb-6 relative z-10">
            <div className="
              w-20 h-20 rounded-xl
              flex items-center justify-center
              
            ">
              <img
                src={service.image}
                alt={service.title}
                className="w-20 h-20 object-contain"
              />
            </div>
          </div>

          {/* CONTENT */}
          <div className="flex-grow text-center relative z-10">
            <h3 className="
              text-2xl font-bold mb-4
              text-gray-800
              group-hover:text-[#7C3AED]
              transition-colors duration-300
            ">
              {service.title}
            </h3>

            <p className="
            text-lg
               text-gray-600 leading-relaxed
              group-hover:text-gray-700
              transition-colors duration-300
            ">
              {service.description}
            </p>
          </div>

          {/* BUTTON */}
          <div className="flex justify-center mt-6 relative z-10">
            <button className="
              relative overflow-hidden
              px-6 py-2 rounded-full font-medium
              border-2 border-[#7C3AED]
              text-[#7C3AED]
              transition-all duration-300
            ">
              <span className="
                absolute inset-0 bg-[#7C3AED]
                scale-x-0 origin-left
                transition-transform duration-500
                group-hover:scale-x-100
                z-0
              " />

              <span className="relative z-10 group-hover:text-white">
                READ MORE →
              </span>
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Cards;




// import React from "react";
// import { motion } from "framer-motion";
// import {
//   FaBullhorn,
//   FaVideo,
//   FaCalendarAlt,
//   FaChartLine,
//   FaFileAlt,
//   FaMobileAlt,
// } from "react-icons/fa";
// import OUTDOORMEDIA from "../../Images/Services/sem.png";
// import ProductionImg from "../../Images/Services/social-media-marketing.png";
// import ActivationImg from "../../Images/Services/seo.png";
// import BrandingImg from "../../Images/Services/web-design.png";
// import ContentImg from "../../Images/Services/content-writing.png";
// import AppDevImg from "../../Images/Services/app-development.png";

// const Cards = () => {
//  const services = [
//     {
//       image: OUTDOORMEDIA,
//       title: "OUTDOOR MEDIA",
//       description:
//         "Outdoor advertising reaches consumers when they are outside their homes. Some major Outdoor Advertising Associations in world suggests that’s where consumers spend 70 percent of their time.",
//     },
//     {
//       image: ProductionImg,
//       title: "PRODUCTION",
//       description:
//         "Audio Visuals are a powerful medium to reach out to and connect with present and potential customers of your brand. Films also help in communicating with your staff and team members, to engage, motivate.",
//     },
//     {
//       image: ActivationImg,
//       title: "ACTIVATION AND EVENT",
//       description:
//         "At VMS We provide services in conceptualization, planning, management and execution of Events, Promotions .Our team comprises experts and professionals with experience in their specializations.",
//     },
//     {
//       image: BrandingImg,
//       title: "BRANDING AND CONSULTANCY",
//       description:
//         "We provide Brand consultants who analysis, and rectify the errors in the promotion channel and bring a solution, in general marketing expertise for companies to sell their products. Potential resources as they describe the company’s product.",
//     },
//     {
//       image: ContentImg,
//       title: "CONTENT MARKETING",
//       description:
//         "Vidit Media Solutions’ impressive team of writers work tirelessly to ensure that your customers resonate with your brand generating customer loyalty and engagement. Quality content is key to SEO improvement.",
//     },
//     {
//       image: AppDevImg,
//       title: "APP DEVELOPMENT",
//       description:
//         "Apps are now the new website with smartphones, the convenience of an app is unparalleled. Our advanced developers have delivered over 100+ apps on android & iOS platforms helping businesses sales & business growth.",
//     },
//   ];

//   return (
//     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
//       {services.map((service, index) => (
//         <motion.div
//           key={index}
//           whileHover={{ y: -8 }}
//           transition={{ duration: 0.3 }}
//           className="
//             group relative bg-white rounded-xl shadow-lg
//             pt-16 pb-8 px-8
//             flex flex-col justify-between
//             min-h-[420px]
//             border-2 border-transparent
//             hover:border-[#7C3AED]
//             transition-all duration-300
//           "
//         >
//           {/* TOP SLIDE LINE */}
//           <span className="absolute top-0 left-0 w-full h-[3px] bg-[#7C3AED] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500"></span>

//           {/* BOTTOM SLIDE LINE */}
//           <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#7C3AED] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500"></span>

          
//          {/* FLOATING IMAGE */}
//         <div className="absolute -top-10 left-1/2 -translate-x-1/2">
//           <div
//             className="
//               w-20 h-20 rounded-full
//               bg-white
//               border-2 border-[#7C3AED]
//               flex items-center justify-center
//               shadow-lg
//               group-hover:scale-110
//               transition-transform duration-300
//               overflow-hidden
//             "
//           >
//             <img
//               src={service.image}
//               alt={service.title}
//               className="w-12 h-12 object-contain"
//             />
//           </div>
//         </div>


//           {/* CONTENT */}
//           <div className="flex-grow text-center">
//             <h3 className="text-2xl font-bold text-gray-800 mb-4">
//               {service.title}
//             </h3>
//             <p className=" text-xl text-gray-600 leading-relaxed">
//               {service.description}
//             </p>
//           </div>

//           {/* BUTTON */}
//           <div className="flex justify-center mt-6">
//             <button
//               className="
//                 relative overflow-hidden
//                 px-6 py-2 rounded-full font-medium
//                 border-2 border-[#7C3AED]
//                 text-[#7C3AED]
//                 transition-colors duration-300
//                 group
//               "
//             >
//               {/* Sliding background */}
//               <span
//                 className="
//                   absolute inset-0
//                   bg-[#7C3AED]
//                   scale-x-0 origin-left
//                   transition-transform duration-500
//                   group-hover:scale-x-100
//                   z-0
//                 "
//               ></span>

//               {/* Button text */}
//               <span className="relative z-10 group-hover:text-white">
//                 READ MORE →
//               </span>
//             </button>
//           </div>
//         </motion.div>
//       ))}
//     </div>
//   );
// };

// export default Cards;