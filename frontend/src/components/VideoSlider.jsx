// src/components/VideoSlider.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  FaPlay,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";

const API_BASE_URL = "http://localhost:5000/api";

/* ================= HELPERS ================= */
const getYouTubeId = (url) => {
  if (!url) return null;
  if (!url.includes("http")) return url;

  const match = url.match(
    /^.*(youtu.be\/|v\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  );
  return match && match[2].length === 11 ? match[2] : null;
};

const getThumbnail = (id) =>
  `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

const VideoSlider = () => {
  const [videos, setVideos] = useState([]);
  const [index, setIndex] = useState(0);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const autoRef = useRef(null);

  /* ================= FETCH ================= */
  const fetchVideos = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/videos/slider/slider1`);
      const data = await res.json();

      const formatted = data.data.map((v) => {
        const id = getYouTubeId(v.youtube_url);
        return {
          ...v,
          videoId: id,
          thumbnail: getThumbnail(id),
        };
      });

      setVideos(formatted);
    } catch {
      console.log("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  /* ================= AUTOPLAY ================= */
  const next = useCallback(() => {
    setIndex((prev) => (prev + 1) % videos.length);
  }, [videos.length]);

  useEffect(() => {
    if (videos.length === 0) return;

    autoRef.current = setInterval(next, 4000);
    return () => clearInterval(autoRef.current);
  }, [videos.length, next]);

  const handleNext = () => {
    next();
    resetAuto();
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + videos.length) % videos.length);
    resetAuto();
  };

  const resetAuto = () => {
    clearInterval(autoRef.current);
    autoRef.current = setInterval(next, 4000);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[300px]">
        <FaSpinner className="animate-spin text-white text-3xl" />
      </div>
    );

  if (!videos.length) return null;

  /* ================= 3D POSITION LOGIC ================= */
  const getStyle = (i) => {
    const offset = i - index;

    if (offset === 0)
      return {
        scale: 1,
        rotateY: 0,
        x: 0,
        zIndex: 10,
        opacity: 1,
      };

    if (offset === -1 || offset === videos.length - 1)
      return {
        scale: 0.8,
        rotateY: 40,
        x: -220,
        zIndex: 5,
        opacity: 0.6,
      };

    if (offset === 1 || offset === -(videos.length - 1))
      return {
        scale: 0.8,
        rotateY: -40,
        x: 220,
        zIndex: 5,
        opacity: 0.6,
      };

    return {
      scale: 0.6,
      rotateY: 0,
      x: 0,
      zIndex: 1,
      opacity: 0,
    };
  };

  return (
    <>
      <div className="relative flex justify-center items-center w-full h-[500px] perspective-[1200px] overflow-hidden">
        
        {/* SLIDES */}
        {videos.map((video, i) => {
          const style = getStyle(i);

          return (
            <motion.div
              key={i}
              animate={{
                scale: style.scale,
                rotateY: style.rotateY,
                x: style.x,
                opacity: style.opacity,
              }}
              transition={{ duration: 0.6 }}
              className="absolute w-[260px] sm:w-[320px] md:w-[400px] cursor-pointer"
              style={{
                zIndex: style.zIndex,
                transformStyle: "preserve-3d",
              }}
              onClick={() => setActiveVideo(video.videoId)}
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={video.thumbnail}
                  className="w-full h-[180px] sm:h-[220px] md:h-[260px] object-cover"
                  alt=""
                />

                {/* overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white p-3 rounded-full shadow-lg">
                    <FaPlay className="text-purple-600" />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* BUTTONS */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 
          bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center"
        >
          <FaChevronLeft />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 
          bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* MODAL */}
      {activeVideo && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="text-white text-2xl mb-4"
              onClick={() => setActiveVideo(null)}
            >
              <FaTimes />
            </button>

            <div className="aspect-video">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoSlider;