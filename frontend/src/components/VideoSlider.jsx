import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlay, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Thumbnails
import Nib from "../Images/Thumbnail/nib1.jpg";
import Vidit from "../Images/Thumbnail/Vidit.jpeg";
import Accidental from "../Images/Thumbnail/Accidental_Insurance.jpeg";
import Balloon from "../Images/Thumbnail/Balloon_City1.jpg";
import Bindu from "../Images/Thumbnail/Bindu_sweets1.jpg";
import Kalakri from "../Images/Thumbnail/Kalakri_India1.jpg";

/* ================= VIDEO DATA ================= */
const videos = [
  { thumbnail: Nib, youtube: "https://www.youtube.com/watch?v=otBbIxW49kI" },
  { thumbnail: Vidit, youtube: "https://www.youtube.com/watch?v=yBjES9O4Z-4" },
  { thumbnail: Accidental, youtube: "https://www.youtube.com/watch?v=uLN0c2moqps" },
  { thumbnail: Balloon, youtube: "https://www.youtube.com/watch?v=2DeQKAjDHOA" },
  { thumbnail: Bindu, youtube: "https://www.youtube.com/watch?v=0nylwlpbMw8" },
  { thumbnail: Kalakri, youtube: "https://www.youtube.com/watch?v=WQXqQEj_h6I" },
];

/* ================= YOUTUBE ID ================= */
const getYouTubeId = (url) => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const VideoSlider = () => {
  const [activeVideo, setActiveVideo] = useState(null);
  const [index, setIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const current = videos[index];

  /* ================= AUTO PLAY ================= */
  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % videos.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying]);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % videos.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  return (
    <>
      {/* ================= MAIN CONTAINER ================= */}
      <div className="ml-36 relative flex flex-col items-start">
        
        {/* Video Container */}
        <div className="relative flex items-center">

          {/* Left Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrev}
            className="absolute -left-16 z-10 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300"
          >
            <FaChevronLeft className="text-white text-2xl" />
          </motion.button>

          {/* Video Frame */}
          <motion.div
            key={index}
            initial={{ opacity: 0.6, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
            className="mr-16 relative rounded-2xl overflow-hidden cursor-pointer shadow-2xl"
            style={{
              width: "700px",
              height: "450px",
            }}
            onClick={() => setActiveVideo(getYouTubeId(current.youtube))}
          >
            <div className="w-full h-full bg-black flex items-center justify-center">
              <img
                src={current.thumbnail}
                alt="video thumbnail"
                className="w-full h-full"
              />
              
            </div>
            

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />

            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.15 }}
                className="w-20 h-20 bg-white/95 rounded-2xl flex items-center justify-center shadow-2xl backdrop-blur-sm"
              >
                <FaPlay className="text-purple-600 ml-1 text-3xl" />
              </motion.div>
            </div>

            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm">
              {index + 1} / {videos.length}
            </div>
          </motion.div>

          {/* Right Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            className="absolute -right-1 z-10 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300"
          >
            <FaChevronRight className="text-white text-2xl" />
          </motion.button>
        </div>
        <button 
          onClick={() => setIsAutoPlaying((prev) => !prev)}
          className="ml-64 mt-4 px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors duration-300"
        >
          {isAutoPlaying ? "Pause Auto-Play" : "Resume Auto-Play"}
        </button>
      </div>

      {/* ================= VIDEO MODAL ================= */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute -top-12 right-0 text-white text-2xl"
              >
                <FaTimes />
              </button>

              <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-2xl shadow-2xl">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0`}
                  title="YouTube video"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
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
export default VideoSlider;
