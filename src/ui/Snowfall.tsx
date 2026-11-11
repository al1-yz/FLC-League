"use client";

import { useEffect, useRef } from "react";

/** Slow, sparse snowfall. A single still frame when the user prefers reduced motion. */
export function Snowfall() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let width = 0;
    let height = 0;
    const flakes = Array.from({ length: 140 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.4 + Math.random() * 1.6,
      speed: 0.00012 + Math.random() * 0.0003,
      sway: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      for (const f of flakes) {
        f.y += f.speed * (1 + f.r * 0.4);
        if (f.y > 1.02) {
          f.y = -0.02;
          f.x = Math.random();
        }
        const x = (f.x + Math.sin(time / 2600 + f.sway) * 0.006) * width;
        context.beginPath();
        context.arc(x, f.y * height, f.r, 0, Math.PI * 2);
        context.fillStyle = `rgba(242, 238, 234, ${0.25 + f.r * 0.25})`;
        context.fill();
      }
      if (!reduceMotion) frame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
