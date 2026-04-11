// frontend/src/components/LogoSlider.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { FaSpinner } from "react-icons/fa";

const API_BASE_URL = "http://localhost:5000/api";

const LogoSlider = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredClient, setHoveredClient] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sliderRef = useRef(null);

  // 🔄 Fetch Clients
  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/our-clients/all`);
      const data = await res.json();

      if (data.success) setClients(data.data);
      else setError("Failed to load clients");
    } catch {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // 🖱 Mouse move
  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  // ⏳ Loading
  if (loading) {
    return (
      <section className="py-16 text-center">
        <FaSpinner className="animate-spin text-3xl text-purple-600 mx-auto" />
      </section>
    );
  }

  // ❌ Error
  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  const duplicated = [...clients, ...clients];

  return (
    <section
      className="py-16 bg-white overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <div className="container mx-auto px-4 text-center">
        {/* 🏷 Title */}
        <h2 className="text-xl md:text-2xl font-medium text-gray-700 mb-12">
          <span className="font-bold text-gray-900">
            Vidit Media Solutions
          </span>{" "}
          trusted by brands
        </h2>

        {/* 🎯 Slider */}
        <div className="overflow-hidden relative" ref={sliderRef}>
          <div
            className="flex gap-16 items-center"
            style={{
              width: "max-content",
              animation: "scroll 25s linear infinite",
              animationPlayState: hoveredClient ? "paused" : "running",
            }}
          >
            {duplicated.map((client, i) => {
              const isActive = hoveredClient?.id === client.id;

              return (
                <div
                  key={i}
                  className="flex-shrink-0"
                  onMouseEnter={() => setHoveredClient(client)}
                  onMouseLeave={() => setHoveredClient(null)}
                >
                  {/* 🧲 Logo Box */}
                  <div
                    className={`w-52 h-32 md:w-60 md:h-36 flex items-center justify-center 
                    rounded-xl bg-white transition-all duration-500
                    ${
                      isActive
                        ? "scale-125 shadow-2xl z-10"
                        : "hover:scale-110 hover:shadow-xl"
                    }`}
                    style={{
                      transform: isActive
                        ? `translate(${(mousePos.x % 20 - 10) / 4}px, ${
                            (mousePos.y % 20 - 10) / 4
                          }px)`
                        : "none",
                    }}
                  >
                    <img
                      src={`http://localhost:5000${client.logo_path}`}
                      alt={client.client_name}
                      className="max-w-[90%] max-h-[85%] object-contain"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 🔥 PREMIUM GLASS POPUP */}
        {hoveredClient && (
          <div
            className="fixed z-50 pointer-events-none transition-all duration-200"
            style={{
              left: Math.min(mousePos.x + 20, window.innerWidth - 460),
              top: Math.max(mousePos.y - 220, 20),
            }}
          >
            <div
              className="group w-[440px] h-[280px] rounded-3xl p-4
              bg-white/70 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.2)]
              border border-white/40 animate-popup
              transition-all duration-300"
              style={{
                transform: `perspective(800px) rotateX(${
                  (mousePos.y % 30 - 15) / 6
                }deg) rotateY(${(mousePos.x % 30 - 15) / -6}deg)`
              }}
            >
              {/* 🖼 IMAGE */}
              <div className="w-full h-[70%] flex items-center justify-center overflow-hidden rounded-2xl bg-white/40">
                <img
                  src={`http://localhost:5000${hoveredClient.logo_path}`}
                  className="w-full h-full object-contain transition-all duration-500 group-hover:scale-110"
                  alt=""
                />
              </div>

              {/* 📄 TEXT */}
              <div className="h-[30%] flex flex-col items-center justify-center text-center">
                <h4 className="font-semibold text-gray-900 text-lg">
                  {hoveredClient.client_name}
                </h4>

                {hoveredClient.website && (
                  <span className="text-sm text-blue-600 mt-1 opacity-80 group-hover:opacity-100 transition">
                    Visit Website →
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 🎬 Animations */}
      <style>
        {`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes popup {
          0% { opacity:0; transform: translateY(20px) scale(0.9); }
          100% { opacity:1; transform: translateY(0) scale(1); }
        }

        .animate-popup {
          animation: popup 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}
      </style>
    </section>
  );
};

export default LogoSlider;