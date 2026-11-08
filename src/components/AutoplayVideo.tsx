import React, { useEffect, useRef } from "react";

export interface AutoplayVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  className?: string;
  fallbackPoster?: string;
}

/**
 * AutoplayVideo Component
 * Solves React/browser autoplay restrictions (especially on Safari & iOS Safari):
 * - Guarantees el.defaultMuted = true and el.muted = true directly on DOM instance
 * - Sets playsinline and webkit-playsinline attributes
 * - Programmatically executes video.play() on mount, loadeddata, and visibility change
 * - Seamlessly loops short videos without pausing
 */
export const AutoplayVideo: React.FC<AutoplayVideoProps> = ({
  src,
  className = "",
  fallbackPoster,
  ...props
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Direct DOM property enforcement required by WebKit & Blink autoplay engines
    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    const attemptPlay = () => {
      if (video.paused) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Silently caught: handled when user interacts or tab becomes active
          });
        }
      }
    };

    if (video.readyState >= 2) {
      attemptPlay();
    }

    const onCanPlay = () => attemptPlay();
    const onLoadedData = () => attemptPlay();

    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("loadeddata", onLoadedData);

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        attemptPlay();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("loadeddata", onLoadedData);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      poster={fallbackPoster}
      className={className}
      {...props}
    />
  );
};

export default AutoplayVideo;

