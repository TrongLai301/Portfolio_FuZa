import React, { useEffect, useRef } from "react";
import { useMusic } from "../commons/MusicContext";

interface AudioVisualizerProps {
  size: number;
  color?: string;
  isPlaying: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ size, color = "#6366f1", isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { analyser } = useMusic();
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    if (!canvasRef.current || !analyser) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = size / 2;
      const barWidth = 3;
      const bars = 60; // Total lines in the circle

      for (let i = 0; i < bars; i++) {
        // Map frequency data to limited bars
        const dataIndex = Math.floor((i / bars) * (bufferLength / 2));
        const value = isPlaying ? dataArray[dataIndex] : 0;
        
        // Smooth transition for bars to return to 0
        const barHeight = (value / 255) * (size * 0.15); // max 15% of size

        const angle = (i * (360 / bars) * Math.PI) / 180;
        const xStart = centerX + Math.cos(angle) * (radius + 5);
        const yStart = centerY + Math.sin(angle) * (radius + 5);
        const xEnd = centerX + Math.cos(angle) * (radius + 5 + barHeight);
        const yEnd = centerY + Math.sin(angle) * (radius + 5 + barHeight);

        ctx.strokeStyle = color;
        ctx.lineWidth = barWidth;
        ctx.lineCap = "round";
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;

        ctx.beginPath();
        ctx.moveTo(xStart, yStart);
        ctx.lineTo(xEnd, yEnd);
        ctx.stroke();
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [analyser, isPlaying, size, color]);

  return (
    <canvas
      ref={canvasRef}
      width={size * 1.5}
      height={size * 1.5}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: -1,
        transition: 'opacity 0.5s ease',
        opacity: isPlaying ? 1 : 0
      }}
    />
  );
};

export default AudioVisualizer;
