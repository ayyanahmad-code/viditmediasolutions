// src/pages/CareerApplicationPage.jsx
import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaHome } from "react-icons/fa";
import CareerRightSideForm from "./CareerRightSideForm";

const CareerApplicationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const position = searchParams.get("position") || "";

  // ✅ DEBUG (VERY IMPORTANT)
  useEffect(() => {
    console.log("✅ Position from URL:", position);
  }, [position]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            
            <button
              onClick={() => navigate('/career')}
              className="flex items-center gap-2 text-gray-600 hover:text-purple-600"
            >
              <FaArrowLeft />
              <span>Back to Careers</span>
            </button>

            <Link
              to="/"
              className="flex items-center gap-2 text-gray-600 hover:text-purple-600"
            >
              <FaHome />
              <span>Home</span>
            </Link>

          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {position ? `Apply for ${position}` : 'Career Application'}
            </h1>
          </div>

          {/* ✅ PASS POSITION PROPERLY */}
          <CareerRightSideForm preSelectedPosition={position} />

        </div>
      </div>
    </div>
  );
};

export default CareerApplicationPage;