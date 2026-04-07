import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlay, FaTimes } from "react-icons/fa";

// Thumbnail Images
import Nib from "../Images/Thumbnail/nib1.jpg";
import Vidit from "../Images/Thumbnail/Vidit.jpeg";
import Accidental from "../Images/Thumbnail/Accidental_Insurance.jpeg";
import Balloon from "../Images/Thumbnail/Balloon_City1.jpg";
import Bindu from "../Images/Thumbnail/Bindu_sweets1.jpg";
import Kalakri from "../Images/Thumbnail/Kalakri_India1.jpg";

/* ================= VIDEO DATA ================= */
const videos = [
  {
    thumbnail: Nib,
    youtube: "https://www.youtube.com/watch?v=otBbIxW49kI",
  },
  {
    thumbnail: Vidit,
    youtube: "https://www.youtube.com/watch?v=yBjES9O4Z-4",
  },
  {
    thumbnail: Accidental,
    youtube: "https://www.youtube.com/watch?v=uLN0c2moqps",
  },
  {
    thumbnail: Balloon,
    youtube: "https://www.youtube.com/watch?v=2DeQKAjDHOA",
  },
  {
    thumbnail: Bindu,
    youtube: "https://www.youtube.com/watch?v=0nylwlpbMw8",
  },
   {
    thumbnail: Kalakri,
    youtube: "https://www.youtube.com/watch?v=WQXqQEj_h6I",
  },
];

/* ================= YOUTUBE LINK TO ID ================= */
const getYouTubeId = (url) => {
  if (!url) return null;

  if (!url.includes("http")) return url;

  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  return match && match[2].length === 11 ? match[2] : null;
};

const VideoSlider2 = () => {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <>
      {/* ================= VIDEO SLIDER ================= */}
      <div className="relative overflow-hidden">
        <div className="flex gap-6 overflow-x-auto py-6 hide-scrollbar">
          {videos.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="relative min-w-[300px] h-[180px] rounded-xl overflow-hidden shadow-lg cursor-pointer"
              onClick={() => setActiveVideo(getYouTubeId(item.youtube))}
            >
              <img
                src={item.thumbnail}
                alt="Video thumbnail"
                className="w-full h-full "
              />

              {/* Play Button */}
              <div className="absolute inset-0  flex items-center justify-center">
                <div className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center">
                  <FaPlay className="text-white ml-1" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ================= VIDEO MODAL ================= */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              className="relative w-[90%] md:w-[70%] lg:w-[60%]"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute -top-10 right-0 text-white text-2xl"
              >
                <FaTimes />
              </button>

              {/* YouTube Player */}
              <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-xl">
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

export default VideoSlider2;
