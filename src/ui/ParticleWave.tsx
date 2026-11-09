"use client";

import { useEffect, useRef } from "react";

/**
 * A field of particles rolling in slow waves, coloured from antique gold (early game)
 * to violet (late game). Static frame when the user prefers reduced motion.
 */
export function ParticleWave({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const gold = [185, 163, 139];
    const violet = [155, 123, 208];
    const mix = (t: number) => gold.map((g, i) => Math.round(g + (violet[i] - g) * t));

    const draw = (time: number) => {
      const t = time / 1000;
      context.clearRect(0, 0, width, height);
      const rows = 22;
      const step = 9;
      for (let row = 0; row < rows; row++) {
        const depth = row / rows; // 0 = far, 1 = near
        const baseline = height * (0.25 + depth * 0.7);
        const amplitude = 10 + depth * 26;
        for (let x = 0; x <= width; x += step) {
          const u = x / width;
          const y =
            baseline +
            Math.sin(u * 9 + t * 0.6 + row * 0.35) * amplitude * 0.6 +
            Math.sin(u * 3.3 - t * 0.35 + row * 0.2) * amplitude;
          const [r, g, b] = mix(u);
          const alpha = 0.12 + depth * 0.55 * (0.6 + 0.4 * Math.sin(u * 14 + t + row));
          context.fillStyle = `rgba(${r},${g},${b},${alpha})`;
          context.fillRect(x, y, 1.1 + depth * 1.3, 1.1 + depth * 1.3);
        }
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

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
