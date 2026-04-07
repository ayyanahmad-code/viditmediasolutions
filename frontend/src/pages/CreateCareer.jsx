// src/pages/CreateCareerPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaCheckCircle, FaExternalLinkAlt, FaInfoCircle, FaArrowLeft, FaTimes, FaBriefcase, FaClipboardList } from "react-icons/fa";

const API_BASE_URL = 'http://localhost:5000';

const CreateCareerPage = () => {
  const navigate = useNavigate();
  const [isSkillsDropdownOpen, setIsSkillsDropdownOpen] = useState(false);
  const [isShiftDropdownOpen, setIsShiftDropdownOpen] = useState(false);
  const [isExperienceDropdownOpen, setIsExperienceDropdownOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    position: "",
    shift: [],
    workMode: "",
    keywords: [],
    experience: [],
    status: "active",
    message: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submissionData, setSubmissionData] = useState(null);
  
  // Keyword options based on selected position
  const [keywordOptions, setKeywordOptions] = useState([]);

  // Shift Options
  const shiftOptions = [
    "Full Time",
    "Part Time"
  ];

  // Work Mode Options
  const workModeOptions = [
    "Remote",
    "On-site",
    "Remote / On-site"
  ];

  // Experience Options
  const experienceOptions = [
    "Fresher",
    "0-1 years",
    "1-3 years",
    "3-5 years",
    "5-10 years",
    "10+ years"
  ];

  // Keyword/Skills mapping based on position
  const keywordMapping = {
    "Search Engine Optimization": [
      "SEO Strategy",
      "Keyword Research",
      "Google Analytics",
      "Link Building",
      "On-Page SEO",
      "Off-Page SEO",
      "Technical SEO",
      "SEO Tools (Ahrefs, SEMrush)",
      "Content Optimization"
    ],
    "Social Media Marketing": [
      "Social Media Strategy",
      "Content Creation",
      "Facebook Ads",
      "Instagram Marketing",
      "Twitter/X Management",
      "LinkedIn Marketing",
      "Social Media Analytics",
      "Community Management",
      "Influencer Marketing"
    ],
    "Web Design & Development": [
      "HTML/CSS",
      "JavaScript/React",
      "Responsive Design",
      "UI/UX Design",
      "WordPress",
      "PHP/Laravel",
      "Node.js",
      "Database Management",
      "API Integration"
    ],
    "App Development": [
      "React Native",
      "Flutter",
      "iOS Development",
      "Android Development",
      "Firebase",
      "REST APIs",
      "Mobile UI/UX",
      "App Store Deployment",
      "Cross-Platform Development"
    ],
    "Content Management": [
      "Content Strategy",
      "SEO Writing",
      "Blog Management",
      "Copywriting",
      "Proofreading",
      "Content Calendar",
      "CMS (WordPress)",
      "Social Media Content",
      "Email Marketing"
    ],
    "Logo Designer": [
      "Adobe Illustrator",
      "Adobe Photoshop",
      "Brand Identity",
      "Typography",
      "Color Theory",
      "Vector Design",
      "Creative Thinking",
      "Portfolio Development",
      "Client Communication"
    ],
    "Other": [
      "Communication Skills",
      "Team Player",
      "Problem Solving",
      "Time Management",
      "Leadership",
      "Project Management",
      "Adaptability",
      "Creative Thinking",
      "Attention to Detail"
    ]
  };

  useEffect(() => {
    if (formData.position && keywordMapping[formData.position]) {
      setKeywordOptions(keywordMapping[formData.position]);
      setFormData(prev => ({ ...prev, keywords: [] }));
    } else {
      setKeywordOptions(keywordMapping["Other"] || []);
    }
  }, [formData.position]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.skills-dropdown-container')) {
        setIsSkillsDropdownOpen(false);
      }
      if (!e.target.closest('.shift-dropdown-container')) {
        setIsShiftDropdownOpen(false);
      }
      if (!e.target.closest('.experience-dropdown-container')) {
        setIsExperienceDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const submitCareerApplication = async (applicationData) => {
    try {
      const safePosition = (applicationData.position || "").trim();
      const safeShift = applicationData.shift.join(", ");
      const safeWorkMode = (applicationData.workMode || "").trim();
      const safeKeywords = applicationData.keywords.join(", ");
      const safeExperience = applicationData.experience.join(", ");
      const safeStatus = (applicationData.status || "").trim();
      const safeMessage = (applicationData.message || "").trim();

      if (!safePosition) {
        throw new Error('Validation failed: Please select a position.');
      }

      const requestData = {
        position: safePosition,
        shift: safeShift,
        workMode: safeWorkMode,
        keywords: safeKeywords,
        experience: safeExperience,
        status: safeStatus,
        message: safeMessage
      };

      console.log("🚀 Sending JSON data:", requestData);

      const response = await fetch(`${API_BASE_URL}/api/career-hiring/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      console.log("📥 Response:", result);

      if (!response.ok) {
        throw new Error(result.message || 'Application submission failed');
      }

      return result;

    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (submitStatus) setSubmitStatus(null);
  };

  // Handle multi-select for Keywords
  const handleKeywordsChange = (e) => {
    const value = e.target.value;
    setFormData(prev => {
      if (prev.keywords.includes(value)) {
        return { ...prev, keywords: prev.keywords.filter(item => item !== value) };
      } else {
        return { ...prev, keywords: [...prev.keywords, value] };
      }
    });
    if (submitStatus) setSubmitStatus(null);
  };

  // Handle multi-select for Shift
  const handleShiftChange = (e) => {
    const value = e.target.value;
    setFormData(prev => {
      if (prev.shift.includes(value)) {
        return { ...prev, shift: prev.shift.filter(item => item !== value) };
      } else {
        return { ...prev, shift: [...prev.shift, value] };
      }
    });
    if (submitStatus) setSubmitStatus(null);
  };

  // Handle multi-select for Experience
  const handleExperienceChange = (e) => {
    const value = e.target.value;
    setFormData(prev => {
      if (prev.experience.includes(value)) {
        return { ...prev, experience: prev.experience.filter(item => item !== value) };
      } else {
        return { ...prev, experience: [...prev.experience, value] };
      }
    });
    if (submitStatus) setSubmitStatus(null);
  };

  // Remove functions
  const removeKeyword = (itemToRemove) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(item => item !== itemToRemove)
    }));
  };

  const removeShift = (itemToRemove) => {
    setFormData(prev => ({
      ...prev,
      shift: prev.shift.filter(item => item !== itemToRemove)
    }));
  };

  const removeExperience = (itemToRemove) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter(item => item !== itemToRemove)
    }));
  };

  const validateForm = () => {
    if (!formData.position) return "Please select a position";
    if (formData.shift.length === 0) return "Please select at least one shift option";
    if (!formData.workMode) return "Please select work mode";
    if (formData.keywords.length === 0) return "Please select at least one key skill";
    if (formData.experience.length === 0) return "Please select at least one experience level";
    if (!formData.status) return "Please select status";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus(null);

    const validationError = validateForm();
    if (validationError) {
      setSubmitStatus({ type: "error", message: validationError });
      setIsLoading(false);
      return;
    }

    try {
      const result = await submitCareerApplication(formData);

      if (result.success) {
        setSubmissionData(result.data);
        setShowSuccessModal(true);
        
        setFormData({
          position: "",
          shift: [],
          workMode: "",
          keywords: [],
          experience: [],
          status: "active",
          message: ""
        });
      } else {
        throw new Error(result.message || 'Application submission failed');
      }

    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus({
        type: "error",
        message: "Failed to submit application. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const positionOptions = [
    "Search Engine Optimization",
    "Social Media Marketing", 
    "Web Design & Development",
    "App Development",
    "Content Management",
    "Logo Designer",
    "Other"
  ];

  // Function to get display text for shift button
  const getShiftButtonText = () => {
    if (formData.shift.length === 0) return "Select Shift";
    return `${formData.shift.length} shift(s) selected`;
  };

  // Function to get display text for experience button
  const getExperienceButtonText = () => {
    if (formData.experience.length === 0) return "Select Experience";
    return `${formData.experience.length} level(s) selected`;
  };

  // Function to get display text for keywords button
  const getKeywordsButtonText = () => {
    if (formData.keywords.length === 0) {
      return !formData.position ? "Please select a position first" : "Select Key Skills";
    }
    return `${formData.keywords.length} skill(s) selected`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-4">
      <div className="container mx-auto px-10">
        <div className="mb-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-purple-600">
            <FaArrowLeft /> Back
          </button>
        </div>

        {/* View Hiring List Button - Fixed Link */}
        <div className="absolute right-0 mr-6">
          <Link to="/career/hiring-list" className="flex items-center gap-2 text-purple-600 hover:text-purple-700">
            <FaClipboardList /> View Hiring List
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Create Career Application
            </h1>
            <p className="text-gray-600">Fill out the form below to submit your career application.</p>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
            {submitStatus && !showSuccessModal && (
              <div className={`mb-4 p-3 rounded-lg ${
                submitStatus.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-700' 
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {submitStatus.message}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Row 1: Position */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position Applied For <span className="text-red-500">*</span>
                  </label>
                  <select name="position" value={formData.position} onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
                    disabled={isLoading} required>
                    <option value="">Select Position</option>
                    {positionOptions.map((pos, index) => (
                      <option key={index} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>

                {/* Key Skills / Keywords - Multi Select */}
                <div className="skills-dropdown-container">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Key Skills / Keywords <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-500 ml-2">(You can select multiple)</span>
                  </label>
                  
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsSkillsDropdownOpen(!isSkillsDropdownOpen)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white text-left flex justify-between items-center"
                      disabled={isLoading || !formData.position}
                    >
                      <span className="text-gray-700">
                        {getKeywordsButtonText()}
                      </span>
                      <svg className={`w-4 h-4 transition-transform ${isSkillsDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {isSkillsDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {!formData.position ? (
                          <div className="p-3 text-sm text-gray-500 text-center">Please select a position first</div>
                        ) : keywordOptions.length === 0 ? (
                          <div className="p-3 text-sm text-gray-500 text-center">No skills available for this position</div>
                        ) : (
                          keywordOptions.map((skill, index) => (
                            <label key={index} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.keywords.includes(skill)}
                                onChange={() => handleKeywordsChange({ target: { value: skill } })}
                                className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                              />
                              <span className="text-sm text-gray-700">{skill}</span>
                            </label>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 2: Shift and Work Mode */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Shift - Multi Select */}
                <div className="shift-dropdown-container">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shift <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-500 ml-2">(You can select multiple)</span>
                  </label>
                  
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsShiftDropdownOpen(!isShiftDropdownOpen)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white text-left flex justify-between items-center"
                      disabled={isLoading}
                    >
                      <span className="text-gray-700">
                        {getShiftButtonText()}
                      </span>
                      <svg className={`w-4 h-4 transition-transform ${isShiftDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {isShiftDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {shiftOptions.map((shift, index) => (
                          <label key={index} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.shift.includes(shift)}
                              onChange={() => handleShiftChange({ target: { value: shift } })}
                              className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-700">{shift}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Work Mode <span className="text-red-500">*</span>
                  </label>
                  <select name="workMode" value={formData.workMode} onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
                    disabled={isLoading} required>
                    <option value="">Select Work Mode</option>
                    {workModeOptions.map((mode, index) => (
                      <option key={index} value={mode}>{mode}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Experience and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Years of Experience - Multi Select */}
                <div className="experience-dropdown-container">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-500 ml-2">(You can select multiple)</span>
                  </label>
                  
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsExperienceDropdownOpen(!isExperienceDropdownOpen)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white text-left flex justify-between items-center"
                      disabled={isLoading}
                    >
                      <span className="text-gray-700">
                        {getExperienceButtonText()}
                      </span>
                      <svg className={`w-4 h-4 transition-transform ${isExperienceDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {isExperienceDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {experienceOptions.map((exp, index) => (
                          <label key={index} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.experience.includes(exp)}
                              onChange={() => handleExperienceChange({ target: { value: exp } })}
                              className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-700">{exp}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="active"
                        checked={formData.status === 'active'}
                        onChange={handleChange}
                        className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Active
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="inactive"
                        checked={formData.status === 'inactive'}
                        onChange={handleChange}
                        className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700 flex items-center gap-1">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        Inactive
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Letter / Message (Optional)
                </label>
                <textarea
                  rows="3"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="Tell us why you'd be a great fit for this position..."
                  disabled={isLoading}
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 rounded-xl shadow-lg font-semibold text-white transition-all
                    ${isLoading ? 'bg-gray-400' : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:shadow-xl hover:-translate-y-0.5'}`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Submit Application <FaExternalLinkAlt className="text-sm" />
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-green-500 text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
              <p className="text-gray-600 mb-6">
                Thank you for applying! Our recruitment team will review your application and contact you within 5-7 business days.
              </p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCareerPage;