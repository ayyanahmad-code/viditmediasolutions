// src/pages/CareerRightSideForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUpload, FaFile, FaCheckCircle, FaExternalLinkAlt, FaInfoCircle } from "react-icons/fa";

// ✅ API URL - Use port 5000 for backend
const API_BASE_URL = 'http://localhost:5000';

const CareerRightSideForm = ({ preSelectedPosition }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: preSelectedPosition || "",
    experience: "",
    message: "",
    file: null
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [fileName, setFileName] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submissionData, setSubmissionData] = useState(null);

  useEffect(() => {
    if (preSelectedPosition && preSelectedPosition !== formData.position) {
      setFormData((prev) => ({
        ...prev,
        position: preSelectedPosition
      }));
    }
  }, [preSelectedPosition]);

  // API call function
 // ✅ API call function (FULLY FIXED)
const submitCareerApplication = async (applicationData, resumeFile) => {
  try {
    const safeName = (applicationData.name || "").trim();
    const safeEmail = (applicationData.email || "").trim();
    const safePhone = (applicationData.phone || "").trim();
    const safePosition = (applicationData.position || preSelectedPosition || "").trim();
    const safeExperience = (applicationData.experience || "").trim();
    const safeMessage = (applicationData.message || "").trim();

    if (!safeName || !safeEmail || !safePosition) {
      throw new Error('Validation failed: Please provide name, email and position.');
    }

    console.log("🚀 Preparing to submit career application:", {
      name: safeName,
      email: safeEmail,
      phone: safePhone,
      position: safePosition,
      experience: safeExperience,
      message: safeMessage,
      file: resumeFile ? resumeFile.name : "<none>"
    });

    const formDataToSend = new FormData();

    formDataToSend.append('name', safeName);
    formDataToSend.append('email', safeEmail);
    formDataToSend.append('phone', safePhone);
    formDataToSend.append('position', safePosition);
    formDataToSend.append('experience', safeExperience);

    if (safeMessage) {
      formDataToSend.append('message', safeMessage);
    }

    if (resumeFile) {
      formDataToSend.append('resume', resumeFile);
    }

    // ✅ FIXED ENDPOINT
    const response = await fetch(`http://localhost:5000/api/career/apply`, {
      method: 'POST',
      body: formDataToSend,
    });

    // ✅ SAFE JSON PARSE
    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      throw new Error("Server returned invalid response: " + text);
    }

    const result = await response.json();

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSubmitStatus({
          type: "error",
          message: "File size should be less than 5MB"
        });
        return;
      }

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setSubmitStatus({
          type: "error",
          message: "Please upload PDF, DOC, DOCX, JPG, or PNG files only"
        });
        return;
      }

      setFormData(prev => ({ ...prev, file }));
      setFileName(file.name);
      
      if (submitStatus?.type === "error") {
        setSubmitStatus(null);
      }
    }
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, file: null }));
    setFileName("");
  };

  const validateForm = (data = formData) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const selectedPosition = (data.position || preSelectedPosition || "").trim();

    if (!(data.name || "").trim()) {
      return "Please enter your full name";
    }

    if (!emailRegex.test((data.email || "").trim())) {
      return "Please enter a valid email address";
    }

    if (!(data.phone || "").trim()) {
      return "Please enter your phone number";
    }

    if (!selectedPosition) {
      return "Please select a position";
    }

    if (!(data.experience || "").trim()) {
      return "Please select your years of experience";
    }

    if (!data.file) {
      return "Please upload your resume/CV";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus(null);

    const effectivePosition = formData.position || preSelectedPosition || "";
    const finalFormData = {
      ...formData,
      position: effectivePosition,
      name: (formData.name || "").trim(),
      email: (formData.email || "").trim(),
      phone: (formData.phone || "").trim(),
      experience: (formData.experience || "").trim(),
      message: (formData.message || "").trim()
    };

    const validationError = validateForm(finalFormData);
    if (validationError) {
      setSubmitStatus({
        type: "error",
        message: validationError
      });
      setIsLoading(false);
      return;
    }

    setFormData(finalFormData);

    if (!finalFormData.name || !finalFormData.email || !finalFormData.position) {
      setSubmitStatus({ type: 'error', message: 'Please provide name, email and position.' });
      setIsLoading(false);
      return;
    }

    console.log("🚀 FINAL FORM DATA:", {
      name: finalFormData.name,
      email: finalFormData.email,
      position: finalFormData.position,
      phone: finalFormData.phone,
      experience: finalFormData.experience,
      file: finalFormData.file ? finalFormData.file.name : "<none>"
    });

    try {
      const result = await submitCareerApplication(finalFormData, finalFormData.file);

      if (result.success) {
        setSubmissionData(result.data);
        
        setSubmitStatus({
          type: "success",
          message: `Thank you ${finalFormData.name}! Your application has been submitted successfully.`
        });
        
        setShowSuccessModal(true);
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          position: preSelectedPosition || "",
          experience: "",
          message: "",
          file: null
        });
        setFileName("");

      } else {
        throw new Error(result.message || 'Application submission failed');
      }

    } catch (error) {
      console.error('Submission error:', error);
      
      let errorMessage = "Failed to submit application. Please try again.";
      
      if (error.message.includes("NetworkError") || error.message.includes("Failed to fetch")) {
        errorMessage = "Network error. Please make sure the backend server is running on port 5000.";
      } else if (error.message.includes("file")) {
        errorMessage = error.message;
      }
      
      setSubmitStatus({
        type: "error",
        message: errorMessage
      });
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleBrowseJobs = () => {
    navigate('/career');
  };

  const handleApplyForAnother = () => {
    setShowSuccessModal(false);
    setSubmitStatus(null);
    setSubmissionData(null);
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

  return (
    <>
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
        {/* Submit Status */}
        {submitStatus && !showSuccessModal && (
          <div className={`mb-6 p-4 rounded-lg ${
            submitStatus.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {submitStatus.message}
          </div>
        )}

        {/* FORM */}
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="John Doe"
              disabled={isLoading}
              required
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="john@example.com"
                disabled={isLoading}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="+91 98765 43210"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          {/* Position & Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position Applied For <span className="text-red-500">*</span>
              </label>
              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
                disabled={isLoading || !!preSelectedPosition}
                required
              >
                <option value="">Select Position</option>
                {positionOptions.map((pos, index) => (
                  <option key={index} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
              {preSelectedPosition && (
                <p className="text-xs text-purple-600 mt-1 flex items-center gap-1">
                  <FaInfoCircle /> Position pre-selected from job listing
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience <span className="text-red-500">*</span>
              </label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
                disabled={isLoading}
                required
              >
                <option value="">Select Experience</option>
                <option value="0-1"> Fresher</option>
                <option value="0-1">0-1 years</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5-10">5-10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Resume/CV <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors bg-gray-50/50">
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                disabled={isLoading}
              />
              
              {!fileName ? (
                <label htmlFor="file-upload" className={`cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <div className="flex flex-col items-center">
                    <FaUpload className={`text-3xl mb-3 ${isLoading ? 'text-gray-300' : 'text-gray-400'}`} />
                    <span className={`font-medium ${isLoading ? 'text-gray-400' : 'text-gray-600'}`}>
                      {isLoading ? 'Processing...' : 'Click to upload resume'}
                    </span>
                    <span className="text-sm text-gray-500 mt-1">
                      Supported: PDF, DOC, DOCX, JPG, PNG (Max 5MB)
                    </span>
                  </div>
                </label>
              ) : (
                <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <FaFile className="text-purple-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{fileName}</p>
                      <p className="text-sm text-gray-500">
                        {(formData.file?.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                    disabled={isLoading}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Letter / Message (Optional)
            </label>
            <textarea
              rows="4"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              placeholder="Tell us why you'd be a great fit for this position..."
              disabled={isLoading}
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`
                relative overflow-hidden w-full
                ${isLoading ? 'bg-gray-400' : 'bg-gradient-to-r from-purple-600 to-purple-700'}
                text-white font-semibold py-4 rounded-xl shadow-lg
                transition-all duration-300
                ${!isLoading && 'hover:shadow-xl hover:-translate-y-0.5'}
                ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting Application...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Submit Application
                  <FaExternalLinkAlt className="text-sm" />
                </span>
              )}
            </button>
          </div>

          {/* Browse Jobs Button */}
          <div className="text-center pt-4">
            <button
              type="button"
              onClick={handleBrowseJobs}
              className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center justify-center gap-2 mx-auto"
            >
              Browse other job openings
              <FaExternalLinkAlt className="text-xs" />
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-green-500 text-3xl" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Application Submitted!
              </h3>
              
              {submissionData && submissionData.referenceId && (
                <div className="bg-purple-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-purple-600">Reference ID</p>
                  <p className="font-mono font-bold text-purple-700">{submissionData.referenceId}</p>
                </div>
              )}
              
              <p className="text-gray-600 mb-6">
                Thank you for applying to Vidit Media Solutions!
                <br /><br />
                Our recruitment team will review your application and contact you within 5-7 business days.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={handleApplyForAnother}
                  className="w-full bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Apply for Another Position
                </button>
                
                <button
                  onClick={handleBrowseJobs}
                  className="w-full border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Browse More Jobs
                </button>
                
                <button
                  onClick={() => navigate('/')}
                  className="w-full text-gray-600 font-medium py-2 hover:text-purple-600 transition-colors"
                >
                  Return to Homepage
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CareerRightSideForm;