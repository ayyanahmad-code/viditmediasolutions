  // frontend/src/components/LogoSlider.jsx
  import React, { useState, useEffect, useCallback } from "react";
  import { FaSpinner } from "react-icons/fa";
  import Director from "../Images/DirectorProfile/Image.png";

  const API_BASE_URL = "http://localhost:5000/api";

  const LogoSlider = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const fetchClients = useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/our-clients/all`);
        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
          setClients(data.data);
        } else {
          setError(data.message || "Failed to load clients");
          setClients([]);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to connect to server");
        setClients([]);
      } finally {
        setLoading(false);
      }
    }, []);

    useEffect(() => {
      fetchClients();
    }, [fetchClients]);

    // 🔄 Loading
    if (loading) {
      return (
        <section className="py-16 bg-white text-center">
          <FaSpinner className="animate-spin text-3xl mx-auto text-purple-600" />
          <p className="text-gray-500 mt-2">Loading clients...</p>
        </section>
      );
    }

    // ❌ Error
    if (error) {
      return (
        <section className="py-16 bg-white text-center">
          <p className="text-red-500 mb-3">⚠️ {error}</p>
          <button
            onClick={fetchClients}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Retry
          </button>
        </section>
      );
    }

    if (!clients.length) return null;

    const duplicatedClients = [...clients, ...clients];

    return (
      <section className="py-16 bg-white overflow-hidden">
        <div className="container mx-auto px-4 text-center">

          {/* Heading */}
          <h2 className="text-xl md:text-2xl font-medium text-gray-700 mb-12">
            <span className="font-bold text-gray-900">
              Vidit Media Solutions
            </span>{" "}
            trusted by leading brands.
          </h2>

          {/* Slider */}
          <div className="relative w-full overflow-hidden">
            <div
              className="flex gap-16 items-center"
              style={{
                width: "max-content",
                animation: "logoScroll 25s linear infinite",
                animationPlayState:
                  hoveredIndex !== null ? "paused" : "running",
              }}
            >
              {duplicatedClients.map((client, index) => {
                const isActive = hoveredIndex === index;

                return (
                  <div
                    key={`${client.id}-${index}`}
                    className="relative flex flex-col items-center justify-center"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Logo */}
                    <img
                      src={`http://localhost:5000${client.logo_path}`}
                      alt={client.client_name}
                      loading="lazy"
                      onClick={() => {
                        if (client.website) {
                          window.open(client.website, "_blank");
                        }
                      }}
                      className={`h-20 lg:h-28 w-48 object-contain cursor-pointer 
                        transition-all duration-500 ease-out
                        ${
                          isActive
                            ? "scale-125 opacity-100 drop-shadow-2xl"
                            : "scale-100 opacity-60"
                        }`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='100'%3E%3Crect width='200' height='100' fill='%23f3f4f6'/%3E%3Ctext x='100' y='55' font-size='12' fill='%239ca3af' text-anchor='middle'%3ELogo%3C/text%3E%3C/svg%3E";
                      }}
                    />

                    {/* 🔥 Popup */}
                    <div
                      className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-5 
                        w-60 px-4 py-3 rounded-xl text-center
                        backdrop-blur-lg bg-white/40 border border-white/50 shadow-2xl
                        transition-all duration-300 ease-out pointer-events-none
                        ${
                          isActive
                            ? "opacity-100 translate-y-0 scale-100"
                            : "opacity-0 translate-y-2 scale-95"
                        }`}
                    >
                      <p className="text-sm font-semibold text-gray-900">
                        {client.client_name}
                      </p>

                      {client.website && (
                        <p className="text-xs text-blue-600 mt-1">
                          Click to visit
                        </p>
                      )}

                      {/* Arrow */}
                      <div className="absolute left-1/2 -translate-x-1/2 top-full 
                                      w-3 h-3 bg-white/40 rotate-45 
                                      border-r border-b border-white/50"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Director */}
          <div className="max-w-4xl mx-auto mt-16 bg-white border border-gray-200 
                          rounded-xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-6 items-center text-left">

            <img
              src={Director}
              alt="Director"
              className="w-24 h-24 object-cover rounded-full"
            />

            <div>
              <h4 className="text-lg font-semibold text-gray-900">
                Nidhi Raikwar
              </h4>
              <p className="text-sm text-gray-500 mb-3 uppercase">
                Director
              </p>

              <p className="text-gray-700 leading-relaxed">
                We started our creative agency as a basic advertising agency with
                an ideation of providing all the media related solutions at one
                place.
              </p>
            </div>
          </div>

        </div>

        {/* Keyframes */}
        <style>
          {`
            @keyframes logoScroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
          `}
        </style>
      </section>
    );
  };

  export default LogoSlider;