"use client";

import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";

const TOTAL_FRAMES = 51;
const FRAME_DURATION = 100; // ms per frame

const RoamingFrames = () => {
  const [phase, setPhase] = useState("moving");
  const [frameIndex, setFrameIndex] = useState(1);
  const controls = useAnimation();

  // Asynchronously move to a random position and await completion.
  const moveImage = async () => {
    const maxX = window.innerWidth - 124;
    const maxY = window.innerHeight - 152;
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;

    setPhase("moving");
    await controls.start({
      x: newX,
      y: newY,
      transition: { type: "spring", stiffness: 10, damping: 25 },
    });

    setPhase("break");
    setTimeout(() => {
      moveImage();
    }, 12000);
  };

  // Start moving on mount.
  useEffect(() => {
    moveImage();
  }, []);

  // Cycle through PNG frames continuously.
  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev % TOTAL_FRAMES) + 1);
    }, FRAME_DURATION);
    return () => clearInterval(interval);
  }, []);

  // Helper: format frame number to two digits.
  const formatFrameNumber = (num: number) =>
    num < 10 ? `0${num}` : num;
  const frameSrc = `/random-pics/minecraft-allay/frame_apngframe${formatFrameNumber(frameIndex)}.png`;

  return (
    <motion.div
      animate={controls}
      className="left-0 top-0"
      style={{
        position: "absolute",
        width: "124px",
        height: "152px",
      }}
    >
      {/* The animated image with levitation effect */}
      <motion.div
        animate={
          phase === "moving" ? { y: 0 } : { y: [0, -5, 0] }
        }
        transition={
          phase === "moving"
            ? {}
            : { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <Image
          className="-z-10 absolute [image-rendering:pixelated]"
          src={frameSrc}
          alt="Minecraft Allay animation"
          width={124}
          height={152}
        />
      </motion.div>
      {/* The anchor overlay sits on top of the image */}
      <a
        href="https://minecraft.net"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "124px",
          height: "152px",
          zIndex: 10,
          display: "block",
        }}
      >
        {/* You can optionally add content here */}
      </a>
    </motion.div>
  );
};

export default RoamingFrames;
