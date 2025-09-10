"use client";

import React, { useRef, useEffect } from "react";

const CanvasAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const fullPageHeight = Math.max(
      window.innerHeight,
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );

    canvas.width = window.innerWidth;
    canvas.height = fullPageHeight;
    canvas.style.height = `${fullPageHeight}px`;

    // Use the non-null assertion operator to assure TypeScript
    const ctx = canvas.getContext("2d")!;

    const w = canvas.width;
    const h = canvas.height;
    ctx.strokeStyle = "rgba(30,144,225,0.5)";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";

    const maxParts = 1000;
    const init = [];
    for (let a = 0; a < maxParts; a++) {
      init.push({
        x: Math.random() * w,
        y: Math.random() * h,
        l: Math.random(),
        xs: -4 + Math.random() * 4 + 2,
        ys: Math.random() * 10 + 10,
      });
    }

    let particles = [...init];

    function draw() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
        ctx.stroke();
      });
      move();
    }

    function move() {
      particles.forEach((p) => {
        p.x += p.xs;
        p.y += p.ys;
        if (p.x > w || p.y > h) {
          p.x = Math.random() * w;
          p.y = -20;
        }
      });
    }

    const intervalId = setInterval(draw, 30);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <canvas
      className="md:block hidden absolute opacity-30 top-0 w-full -z-20"
      ref={canvasRef}
      id="canvas"
    />
  );
};

export default CanvasAnimation;
