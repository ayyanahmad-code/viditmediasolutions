// src/components/BubbleRain.jsx
import React, { useEffect, useState } from "react";

const BubbleRain = () => {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now() + Math.random();

      const newBubble = {
        id,
        left: Math.random() * 100,      // random horizontal start
        size: 6,                         // fixed very small size
        duration: Math.random() * 3 + 6, // random float duration
        sway: Math.random() * 20 - 10,   // left/right sway (-10px to 10px)
      };

      setBubbles((prev) => [...prev, newBubble]);

      // remove bubble after animation
      setTimeout(() => {
        setBubbles((prev) => prev.filter((b) => b.id !== id));
      }, newBubble.duration * 1000);
    }, 300); // faster bubble spawn for denser effect

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bubble-container">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="bubble animate-bubble-float"
          style={{
            left: `${bubble.left}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            "--float-duration": `${bubble.duration}s`,
            "--sway": `${bubble.sway}px`,
          }}
        />
      ))}
    </div>
  );
};

export default BubbleRain;
