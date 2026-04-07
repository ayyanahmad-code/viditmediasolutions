// import React from "react";
// import { FaPhoneAlt, FaEnvelope, FaFacebookF, FaLinkedinIn, FaInstagram, FaYoutube } from "react-icons/fa";
// import CallToAction from "../components/CallToAction";
// import PhoneBox from "./Contact/PhoneBox";
// import EmailBox from "./Contact/EmailBox";
// import SocialBox from "./Contact/SocialBox";
// import RIGHTSIDEFORM from "./Contact/RIGHTSIDEFORM";

// const Contact = () => {
//   return (
//     <div className="mt-48 mb-20">
//       <div className="container mx-auto px-4">
//         <div className="grid lg:grid-cols-2 gap-14 items-start">

//           {/* LEFT SIDE */}
//           <div className="space-y-8">

//             {/* Phone Box */}
//             <PhoneBox />

//             {/* Email Box */}
//             <EmailBox />

//             {/* Social Box */}
//             <SocialBox />

//           </div>

//           {/* RIGHT SIDE FORM */}
//           <RIGHTSIDEFORM /> 
//         </div>
//       </div>
//       <br />
//        <CallToAction />
//     </div>
//   );
// };

// export default Contact;


import React from "react";
import CallToAction from "../pages/Contact/CallToAction";
import PhoneBox from "../pages/Contact/PhoneBox";
import EmailBox from "../pages/Contact/EmailBox";
import SocialBox from "../pages/Contact/SocialBox";
import RIGHTSIDEFORM from "../pages/Contact/RIGHTSIDEFORM";

const Contact = () => {
  return (
    <section className="mt-32 mb-24 mt-10">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* LEFT SIDE INFO */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-8">
            <PhoneBox />
            <EmailBox />
            <SocialBox />
          </div>

          {/* RIGHT SIDE FORM */}
          <RIGHTSIDEFORM />

        </div>
      </div>

      <div className="mt-20">
        <CallToAction />
      </div>
    </section>
  );
};

export default Contact;
