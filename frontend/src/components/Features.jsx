// import React from "react";
// import FeatureVideo from "../Images/Features/gif_maker.gif";

// const Features = () => {
//   return (
//     <section className="py-20 bg-white font-sans">
//       <div className="container mx-auto px-1">

//         {/* ===== Heading ===== */}
//         <div className="text-center max-w-4xl mx-auto mb-24">
//           <h2 className="text-5xl font-bold text-gray-900">
//             Features
//           </h2>
//           <p className="text-4xl font-semibold text-gray-900 mt-3">
//             Customize Everything Easily
//           </p>
//           <p className="text-gray-600 mt-5 text-xl leading-relaxed">    
//             Not only will your website be fast, but you will be able to make it look exactly how you want with our visual theme customizer, fast & easy!
//           </p>
//         </div>

//         {/* ===== Main Layout ===== */}
//           <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch">

//             {/* ===== LEFT CONTENT ===== */}
//             <div className="flex flex-col justify-between text-gray-700">
//               <div className="mb-5">
//                 <h4 className="font-semibold text-gray-900 text-3xl mb-4">
//                   Technology
//                 </h4>
//                 <p className="text-2xl  text-gray-600 text-justify">
//                   Our team of experts provides technology solutions for all your needs.
//                   We specialize in creating web apps, mobile apps, and integrated
//                   technology platforms. Marketing automation enables businesses
//                   to streamline, automate,and measure various tasks.
//                 </p>
//               </div>

//               <div>
//                 <h4 className="font-semibold text-gray-900 text-3xl mb-4">
//                   Animated Explainer Videos
//                 </h4>
//                 <p className="text-2xl  text-gray-600 text-justify">
//                   Short videos converting complex ideas into simple, attractive,
//                   engaging, and meaningful stories. These videos help explain
//                   your company's message clearly.
//                 </p>
//               </div>
//             </div>

          
//                 {/* ===== CENTER IMAGE (BIGGER) ===== */}
//                 <div className="flex justify-center items-center lg:col-span-2">
//                   <div
//                     className="
//                       w-full
//                       max-w-[850px]
//                       h-[710px]
//                       rounded-3xl
//                       overflow-hidden
//                       bg-gray-100
//                     "
//                   >
//                     <img
//                       src={FeatureVideo}
//                       alt="Feature video"
//                       className="w-full h-full "
//                     />
//                   </div>
//                 </div>

//             {/* ===== RIGHT CONTENT ===== */}
//             <div className="flex flex-col justify-between text-gray-700">
//               <div className="mb-16">
//                 <h4 className="font-semibold text-gray-900 text-3xl mb-4">
//                   Website Development
//                 </h4>
//                 <p className="text-2xl  text-gray-600 text-justify">
//                   Website design and development based on multiple technology
//                   platforms customized to meet your requirements. Includes
//                   planning, prototyping, development, testing, and release.
//                 </p>
//               </div>

//               <div>
//                 <h4 className="font-semibold text-gray-900 text-3xl mb-4">
//                   Search Engine Optimization
//                 </h4>
//                 <p className="text-2xl  text-gray-600 text-justify">
//                   SEO helps grow website traffic through organic search results.
//                   It involves keyword research, content creation, link building,
//                   and technical optimization.
//                 </p>
//               </div>
//             </div>

//           </div>



//       </div>
//     </section>
//   );
// };

// export default Features;


import React from "react";
import FeatureVideo from "../Images/Features/gif_maker.gif";

const Features = () => {
  return (
    <section className="py-16 lg:py-24 bg-white font-sans">
      <div className="container mx-auto px-4">

        {/* ===== Heading ===== */}
        <div className="text-center max-w-4xl mx-auto mb-16 lg:mb-24">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
            Features
          </h2>
          <p className="text-xl sm:text-2xl lg:text-4xl font-semibold text-gray-900 mt-3">
            Customize Everything Easily
          </p>
          <p className="text-gray-600 mt-4 text-base sm:text-lg lg:text-xl leading-relaxed">
            Not only will your website be fast, but you will be able to make it
            look exactly how you want with our visual theme customizer, fast &
            easy!
          </p>
        </div>

        {/* ===== Main Layout ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-center">

          {/* ===== LEFT CONTENT ===== */}
          <div className="space-y-10">
            <div>
              <h4 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-3">
                Technology
              </h4>
              <p className="text-gray-600 text-base lg:text-lg text-justify">
                Our team of experts provides technology solutions for all your
                needs. We specialize in creating web apps, mobile apps, and
                integrated platforms. Marketing automation enables businesses
                to streamline and measure tasks.
              </p>
            </div>

            <div>
              <h4 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-3">
                Animated Explainer Videos
              </h4>
              <p className="text-gray-600 text-base lg:text-lg text-justify">
                Short videos converting complex ideas into simple, attractive,
                and meaningful stories. These videos help explain your message
                clearly.
              </p>
            </div>
          </div>

          {/* ===== CENTER IMAGE ===== */}
          <div className="lg:col-span-2 flex justify-center">
            <div className="w-full max-w-xl lg:max-w-3xl rounded-3xl overflow-hidden bg-gray-100 shadow-lg">
              <img
                src={FeatureVideo}
                alt="Feature video"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* ===== RIGHT CONTENT ===== */}
          <div className="space-y-10">
            <div>
              <h4 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-3">
                Website Development
              </h4>
              <p className="text-gray-600 text-base lg:text-lg text-justify">
                Website design and development across multiple technology
                platforms customized to your requirements including planning,
                prototyping, development, testing, and release.
              </p>
            </div>

            <div>
              <h4 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-3">
                Search Engine Optimization
              </h4>
              <p className="text-gray-600 text-base lg:text-lg text-justify">
                SEO helps grow website traffic through organic search results
                using keyword research, content creation, link building, and
                technical optimization.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Features;
