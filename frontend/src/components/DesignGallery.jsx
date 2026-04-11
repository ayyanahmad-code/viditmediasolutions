import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Video1 from "../Images/DesignGallery/VMS.mp4";

const DesignGallery = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");

  // ⏱ Format time
  const formatTime = (time) => {
    if (!time) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${mins}:${secs}`;
  };

  // 👁️ Auto play when visible
  useEffect(() => {
    const video = videoRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().then(() => {
            video.muted = false;
            setIsPlaying(true);
          }).catch(() => {
            video.muted = true;
            video.play();
            setIsPlaying(true);
          });
        } else {
          video.pause();
          video.currentTime = 0;
          setIsPlaying(false);
        }
      },
      { threshold: 0.6 }
    );

    if (video) observer.observe(video);

    return () => {
      if (video) observer.unobserve(video);
    };
  }, []);

  // ⏳ Update progress + time
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    const percent = (video.currentTime / video.duration) * 100;
    setProgress(percent);
    setCurrentTime(formatTime(video.currentTime));
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    setDuration(formatTime(video.duration));
  };

  // ▶️ Play / Pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  // ⏩ Seek
  const handleSeek = (e) => {
    const video = videoRef.current;
    const rect = e.target.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    video.currentTime = percent * video.duration;
  };

  return (
    <section className="relative overflow-hidden bg-black">
      
      <motion.video
  ref={videoRef}
  src={Video1}
  onTimeUpdate={handleTimeUpdate}
  onLoadedMetadata={handleLoadedMetadata}
  playsInline
  className="w-[94%] h-auto object-cover 
             border-4 border-gray-800 
             rounded-2xl 
             mx-auto block 
             shadow-lg"
/>
    </section>
  );
};

export default DesignGallery;