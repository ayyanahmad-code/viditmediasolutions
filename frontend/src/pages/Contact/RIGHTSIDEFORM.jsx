import React, { useState } from "react";

const RIGHTSIDEFORM = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact_number: "",
    subject: "",
    message: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear any previous status messages
    if (submitStatus) setSubmitStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus(null);

    // Client-side validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

 


    try {
      // Prepare clean data
      const cleanData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        contact_number: formData.contact_number.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim()
      };

      console.log("Sending data:", cleanData);

      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanData),
      });

      const data = await response.json();

      if (data.success) {
        // Success message with reference ID
        const refId = data.data?.reference || data.data?.id || '';
        const successMsg = `Thank you! Your request has been submitted successfully.${refId ? ` Reference ID: ${refId}` : ''}`;
        
        setSubmitStatus({
          type: "success",
          message: successMsg
        });
        
        alert(successMsg);
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          contact_number: "",
          subject: "",
          message: "",
        });
      } else {
        setSubmitStatus({
          type: "error",
          message: data.message || "Something went wrong. Please try again."
        });
        alert(data.message || "Something went wrong. Please try again.");
      }

    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus({
        type: "error",
        message: "Failed to connect to server. Please check your connection."
      });
      alert("Failed to connect to server. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-4xl font-semibold text-[#0B2C3D] mb-2">
        Request A Callback!
      </h2>

      <p className="text-gray-600 mb-8">
        Fill in this form or{" "}
        <span className="font-semibold">send us an e-mail</span> with your inquiry.
      </p>

      {/* Status Messages */}
      {submitStatus && (
        <div className={`mb-4 p-4 rounded-md ${submitStatus.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {submitStatus.message}
        </div>
      )}

      {/* FORM */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-6">
          <input
            type="text"
            name="name"
            placeholder="Enter name"
            value={formData.name}
            onChange={handleChange}
            className="border border-gray-200 p-4 rounded-md w-full focus:outline-none focus:border-gray-400"
            required
            disabled={isLoading}
          />

          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-200 p-4 rounded-md w-full focus:outline-none focus:border-gray-400"
            required
            disabled={isLoading}
          />
        </div>
{/* // The field name should be 'contact_number' not 'phone' */}
        <div className="grid md:grid-cols-2 gap-6">
        <input
          type="text"
          name="contact_number"  // This must match the database field name
          placeholder="Phone Number"
          value={formData.contact_number}
          onChange={handleChange}
          className="border border-gray-200 p-4 rounded-md w-full focus:outline-none focus:border-gray-400"
          required
        />
          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="border border-gray-200 p-4 rounded-md w-full text-gray-700 focus:outline-none focus:border-gray-400"
            required
            disabled={isLoading}
          >
            <option value="">Select Requirement</option>
            <option value="seo">Search Engine Optimization</option>
            <option value="smm">Social Media Marketing</option>
            <option value="web">Web Design & Development</option>
            <option value="app">App Development</option>
            <option value="content">Content Management</option>
            <option value="logo">Logo Design</option>
            <option value="others">Others</option>
          </select>
        </div>

        <textarea
          rows="4"
          name="message"
          placeholder="Enter your message"
          value={formData.message}
          onChange={handleChange}
          className="border border-gray-200 p-4 rounded-md w-full focus:outline-none focus:border-gray-400"
          required
          disabled={isLoading}
        ></textarea>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={isLoading}
          className={`
            relative overflow-hidden
            w-full
            ${isLoading ? 'bg-gray-400' : 'bg-[#FFC107]'}
            text-black
            font-semibold py-4
            rounded-full
            shadow-md
            transition-all duration-500
            ${!isLoading && 'hover:scale-105 hover:bg-[#7d40ec] hover:text-white'}
            group
            ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <span
            className="
              absolute inset-[-50%]
              bg-[#343a4031]
              rotate-[-45deg]
              translate-y-[-100%]
              opacity-0
              transition-all duration-500
              group-hover:translate-y-[100%]
              group-hover:opacity-100
            "
          ></span>

          <span className="relative z-10">
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              "Send Message!"
            )}
          </span>
        </button>
      </form>
    </div>
  );
};

export default RIGHTSIDEFORM;