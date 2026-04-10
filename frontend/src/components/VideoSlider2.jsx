// src/components/VideoSlider2.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlay,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const API_BASE_URL = "http://localhost:5000/api";

/* ================= HELPERS ================= */
const getYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:v=|youtu\.be\/)([^&]+)/);
  return match ? match[1] : null;
};

const getThumbnail = (id) =>
  `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

/* ================= COMPONENT ================= */
const VideoSlider2 = () => {
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [centerIndex, setCenterIndex] = useState(0);

  const autoRef = useRef(null);
  const pauseRef = useRef(false);

  /* ================= FETCH ================= */
  const fetchVideos = useCallback(async () => {
    const res = await fetch(`${API_BASE_URL}/videos/slider/slider2`);
    const data = await res.json();

    const mapped = data.data.map((v) => {
      const id = getYouTubeId(v.youtube_url);
      return { ...v, videoId: id, thumbnail: getThumbnail(id) };
    });

    setVideos(mapped);
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  /* ================= LOOP INDEX ================= */
  const getIndex = (index) => {
    return (index + videos.length) % videos.length;
  };

  /* ================= NAVIGATION ================= */
  const handleNext = () => {
    pauseAuto();
    setCenterIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    pauseAuto();
    setCenterIndex((prev) => prev - 1);
  };

  /* ================= AUTO SLIDE ================= */
  const startAuto = () => {
    clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      if (!pauseRef.current) {
        setCenterIndex((prev) => prev + 1);
      }
    }, 3000);
  };

  const pauseAuto = () => {
    pauseRef.current = true;
    setTimeout(() => (pauseRef.current = false), 5000);
  };

  useEffect(() => {
    if (videos.length) startAuto();
    return () => clearInterval(autoRef.current);
  }, [videos]);

  /* ================= RENDER ================= */
  return (
    <>
      <div className="relative w-full h-[300px] flex items-center justify-center overflow-hidden">
        {/* BUTTONS */}
        <button
          onClick={handlePrev}
          className="absolute left-6 z-20 bg-black/50 hover:bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center"
        >
          <FaChevronLeft />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-6 z-20 bg-black/50 hover:bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center"
        >
          <FaChevronRight />
        </button>

        {/* SLIDES */}
        <div className="relative w-full flex items-center justify-center">
          {[-2, -1, 0, 1, 2].map((offset) => {
            const index = getIndex(centerIndex + offset);
            const item = videos[index];
            if (!item) return null;

            const isCenter = offset === 0;

            return (
              <motion.div
                key={index}
                className="absolute cursor-pointer"
                animate={{
                  x: offset * 260,
                  scale: isCenter ? 1.1 : 0.85,
                  opacity: Math.abs(offset) > 2 ? 0 : 1,
                  zIndex: isCenter ? 10 : 5,
                }}
                transition={{ duration: 0.5 }}
                onClick={() => setActiveVideo(item.videoId)}
              >
                <div className="w-[240px] h-[150px] rounded-xl overflow-hidden shadow-xl">
                  <img
                    src={item.thumbnail}
                    alt=""
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition">
                    <FaPlay className="text-white text-xl" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ================= MODAL ================= */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              className="w-[80%] max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="text-white mb-3"
              >
                <FaTimes />
              </button>

              <div className="relative pb-[56.25%]">
                <iframe
                  className="absolute w-full h-full"
                  src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VideoSlider2;