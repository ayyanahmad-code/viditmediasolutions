// // src/pages/CareerPage.jsx
// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FaGraduationCap, FaUsers, FaRocket, FaAward, FaChartLine, FaHeart, FaExternalLinkAlt, FaBriefcase, FaMapMarkerAlt, FaClock, FaSpinner } from "react-icons/fa";
// import { useAuth } from "../context/AuthContext";

// const CareerPage = () => {
//   const navigate = useNavigate();
//   const { isAuthenticated } = useAuth();
//   const [jobListings, setJobListings] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const API_BASE_URL = 'http://localhost:5000/api';

//   // Fetch jobs from backend
//   const fetchJobs = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(`${API_BASE_URL}/career-hiring/all`, {
//         headers: {
//           'Authorization': token ? `Bearer ${token}` : {},
//           'Content-Type': 'application/json'
//         }
//       });
      
//       const data = await response.json();
      
//       if (data.success) {
//         // Transform backend data to match job listing format
//         const transformedJobs = data.data
//           .filter(job => job.status === 'active') // Only show active jobs
//           .map(job => ({
//             id: job.id,
//             title: job.position,
//             type: job.employment_type,
//             location: job.work_mode,
//             experience: job.experience,
//             skills: job.keywords?.split(',').map(s => s.trim()) || [],
//             description: job.message || `We are hiring for ${job.position} position. Join our team!`,
//             status: job.status
//           }));
//         setJobListings(transformedJobs);
//         console.log(`✅ Loaded ${transformedJobs.length} active jobs`);
//       } else {
//         throw new Error(data.message || 'Failed to fetch jobs');
//       }
//     } catch (error) {
//       console.error('Error fetching jobs:', error);
//       setError('Failed to load job listings. Please try again later.');
//       setJobListings([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch jobs when component mounts
//   useEffect(() => {
//     fetchJobs();
//   }, []);

//   // Function to handle apply button click
//   const handleApplyClick = (jobTitle) => {
//     if (jobTitle) {
//       navigate(`/career/apply?position=${encodeURIComponent(jobTitle)}`);
//     } else {
//       navigate('/career/apply');
//     }
//   };

//   // Benefits data
//   const benefits = [
//     {
//       icon: <FaGraduationCap className="text-3xl text-purple-600" />,
//       title: "Learning & Development",
//       description: "Continuous learning opportunities and professional development programs"
//     },
//     {
//       icon: <FaUsers className="text-3xl text-purple-600" />,
//       title: "Collaborative Culture",
//       description: "Work with talented professionals in a supportive environment"
//     },
//     {
//       icon: <FaRocket className="text-3xl text-purple-600" />,
//       title: "Growth Opportunities",
//       description: "Fast-paced growth with clear career advancement paths"
//     },
//     {
//       icon: <FaAward className="text-3xl text-purple-600" />,
//       title: "Recognition & Rewards",
//       description: "Performance-based bonuses and recognition programs"
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
//       {/* Hero Section */}
//       <section className="relative bg-gradient-to-r from-[#5B2EDB] via-[#7C3AED] to-[#9F3DDE] text-white py-16 md:py-24 overflow-hidden">
//         <div className="absolute inset-0 opacity-10">
//           <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
//           <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
//         </div>
        
//         <div className="container mx-auto px-4 md:px-6 relative z-10">
//           <div className="max-w-4xl mx-auto text-center">
//             <h1 className="text-4xl md:text-6xl font-bold mb-6">
//               Build Your Career With Us
//             </h1>
//             <p className="text-xl md:text-2xl opacity-90 mb-8">
//               Join a team that values innovation, creativity, and growth. 
//               Together, we create digital experiences that make a difference.
//             </p>
            
//             <button
//               onClick={() => handleApplyClick()}
//               className="inline-flex items-center gap-2 bg-white text-purple-600 font-semibold px-8 py-4 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
//             >
//               Quick Apply Now
//               <FaExternalLinkAlt className="text-sm" />
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Main Content */}
//       <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
//         <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
//           {/* Left Content - Career Details */}
//           <div className="lg:w-2/3">
//             {/* Open Positions Section */}
//             <div className="mb-12">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
//                   Current Openings
//                 </h2>
//                 <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-semibold">
//                   {jobListings.length} Positions
//                 </span>
//               </div>
              
//               {isLoading ? (
//                 <div className="flex justify-center items-center py-12">
//                   <FaSpinner className="animate-spin text-4xl text-purple-600" />
//                   <span className="ml-3 text-gray-600">Loading jobs...</span>
//                 </div>
//               ) : error ? (
//                 <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
//                   <p>{error}</p>
//                   <button 
//                     onClick={fetchJobs}
//                     className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//                   >
//                     Try Again
//                   </button>
//                 </div>
//               ) : jobListings.length === 0 ? (
//                 <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-center">
//                   <p>No active job openings at the moment. Please check back later!</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {jobListings.map((job, index) => (
//                     <div 
//                       key={job.id} 
//                       className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-purple-500 group"
//                     >
//                       <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
//                         <div className="flex-1">
//                           <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
//                             {job.title}
//                           </h3>
//                           <div className="flex flex-wrap gap-2 mb-3">
//                             <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
//                               <FaBriefcase className="text-xs" />
//                               {job.type}
//                             </span>
//                             <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
//                               <FaMapMarkerAlt className="text-xs" />
//                               {job.location}
//                             </span>
//                             <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
//                               <FaClock className="text-xs" />
//                               {job.experience} experience
//                             </span>
//                           </div>
//                           <p className="text-gray-600 text-sm mb-3">
//                             {job.description}
//                           </p>
//                           <div className="flex flex-wrap gap-2">
//                             {job.skills.map((skill, skillIndex) => (
//                               <span key={skillIndex} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
//                                 {skill}
//                               </span>
//                             ))}
//                           </div>
//                         </div>
//                         <button
//                           onClick={() => handleApplyClick(job.title)}
//                           className="mt-4 md:mt-0 md:ml-4 inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-md hover:shadow-lg whitespace-nowrap"
//                         >
//                           Apply Now
//                           <FaExternalLinkAlt className="text-sm" />
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

           

//             {/* Hiring Process */}
//             <div>
//               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
//                 Our Hiring Process
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 {[
//                   { step: "01", title: "Application", desc: "Submit your application & resume", icon: "📝" },
//                   { step: "02", title: "Screening", desc: "Initial phone/email screening", icon: "📞" },
//                   { step: "03", title: "Interview", desc: "Technical & cultural interviews", icon: "💼" },
//                   { step: "04", title: "Offer", desc: "Job offer & onboarding", icon: "🎉" }
//                 ].map((process, index) => (
//                   <div key={index} className="relative">
//                     <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-all duration-300">
//                       <div className="text-3xl mb-3">{process.icon}</div>
//                       <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
//                         {process.step}
//                       </div>
//                       <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                         {process.title}
//                       </h3>
//                       <p className="text-gray-600 text-sm">
//                         {process.desc}
//                       </p>
//                     </div>
//                     {index < 3 && (
//                       <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
//                         <div className="w-6 h-0.5 bg-gradient-to-r from-purple-300 to-purple-500"></div>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Right Side - Quick Application */}
//           <div className="lg:w-1/3">
//              {/* Why Join Us Section */}
//             <div className="mb-12">
//               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
//                 Why Join Vidit Media?
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {benefits.map((benefit, index) => (
//                   <div 
//                     key={index} 
//                     className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center group"
//                   >
//                     <div className="flex justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300">
//                       {benefit.icon}
//                     </div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                       {benefit.title}
//                     </h3>
//                     <p className="text-gray-600 text-sm">
//                       {benefit.description}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CareerPage;


// src/pages/CareerPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaGraduationCap, FaUsers, FaRocket, FaAward, FaExternalLinkAlt, 
  FaBriefcase, FaMapMarkerAlt, FaClock, FaSpinner 
} from "react-icons/fa";

const CareerPage = () => {
  const navigate = useNavigate();
  const [jobListings, setJobListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:5000/api';

  // Fetch jobs from backend (PUBLIC - no token needed)
  const fetchJobs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // No Authorization header needed - public endpoint
      const response = await fetch(`${API_BASE_URL}/career-hiring/all`);
      
      const data = await response.json();
      
      if (data.success) {
        // Transform backend data to match job listing format
        const transformedJobs = data.data
          .filter(job => job.status === 'active') // Only show active jobs
          .map(job => ({
            id: job.id,
            title: job.position,
            type: job.shift || 'Full Time',
            location: job.work_mode || 'Remote / On-site',
            experience: job.experience || 'Fresher',
            skills: job.keywords?.split(',').map(s => s.trim()) || [],
            description: job.message || `We are hiring for ${job.position} position. Join our team!`,
            status: job.status
          }));
        setJobListings(transformedJobs);
        console.log(`✅ Loaded ${transformedJobs.length} active jobs`);
      } else {
        throw new Error(data.message || 'Failed to fetch jobs');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to load job listings. Please try again later.');
      setJobListings([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch jobs when component mounts
  useEffect(() => {
    fetchJobs();
  }, []);

  // Function to handle apply button click
  const handleApplyClick = (jobTitle) => {
    if (jobTitle) {
      navigate(`/career/apply?position=${encodeURIComponent(jobTitle)}`);
    } else {
      navigate('/career/apply');
    }
  };

  // Benefits data
  const benefits = [
    {
      icon: <FaGraduationCap className="text-3xl text-purple-600" />,
      title: "Learning & Development",
      description: "Continuous learning opportunities and professional development programs"
    },
    {
      icon: <FaUsers className="text-3xl text-purple-600" />,
      title: "Collaborative Culture",
      description: "Work with talented professionals in a supportive environment"
    },
    {
      icon: <FaRocket className="text-3xl text-purple-600" />,
      title: "Growth Opportunities",
      description: "Fast-paced growth with clear career advancement paths"
    },
    {
      icon: <FaAward className="text-3xl text-purple-600" />,
      title: "Recognition & Rewards",
      description: "Performance-based bonuses and recognition programs"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#5B2EDB] via-[#7C3AED] to-[#9F3DDE] text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Build Your Career With Us
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8">
              Join a team that values innovation, creativity, and growth. 
              Together, we create digital experiences that make a difference.
            </p>
            
            <button
              onClick={() => handleApplyClick()}
              className="inline-flex items-center gap-2 bg-white text-purple-600 font-semibold px-8 py-4 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Quick Apply Now
              <FaExternalLinkAlt className="text-sm" />
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Left Content - Career Details */}
          <div className="lg:w-2/3">
            {/* Open Positions Section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Current Openings
                </h2>
                <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {jobListings.length} Positions
                </span>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <FaSpinner className="animate-spin text-4xl text-purple-600" />
                  <span className="ml-3 text-gray-600">Loading jobs...</span>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
                  <p>{error}</p>
                  <button 
                    onClick={fetchJobs}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : jobListings.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-center">
                  <p>No active job openings at the moment. Please check back later!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobListings.map((job) => (
                    <div 
                      key={job.id} 
                      className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-purple-500 group"
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                              <FaBriefcase className="text-xs" />
                              {job.type}
                            </span>
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                              <FaMapMarkerAlt className="text-xs" />
                              {job.location}
                            </span>
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                              <FaClock className="text-xs" />
                              {job.experience} experience
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">
                            {job.description}
                          </p>
                          {job.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {job.skills.map((skill, skillIndex) => (
                                <span key={skillIndex} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleApplyClick(job.title)}
                          className="mt-4 md:mt-0 md:ml-4 inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-md hover:shadow-lg whitespace-nowrap"
                        >
                          Apply Now
                          <FaExternalLinkAlt className="text-sm" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Hiring Process */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
                Our Hiring Process
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { step: "01", title: "Application", desc: "Submit your application & resume", icon: "📝" },
                  { step: "02", title: "Screening", desc: "Initial phone/email screening", icon: "📞" },
                  { step: "03", title: "Interview", desc: "Technical & cultural interviews", icon: "💼" },
                  { step: "04", title: "Offer", desc: "Job offer & onboarding", icon: "🎉" }
                ].map((process, index) => (
                  <div key={index} className="relative">
                    <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-all duration-300">
                      <div className="text-3xl mb-3">{process.icon}</div>
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                        {process.step}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {process.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {process.desc}
                      </p>
                    </div>
                    {index < 3 && (
                      <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                        <div className="w-6 h-0.5 bg-gradient-to-r from-purple-300 to-purple-500"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Why Join Us */}
          <div className="lg:w-1/3">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
                Why Join Vidit Media?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <div 
                    key={index} 
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center group"
                  >
                    <div className="flex justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      {benefit.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerPage;