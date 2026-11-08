import React, { useState, useEffect, useRef } from "react";
import { Modal, Slider, Button, Typography, Space, Tooltip } from "antd";
import {
  ScissorOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  CheckOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { toast } from "sonner";

const { Text } = Typography;

export interface VideoTrimmerModalProps {
  open: boolean;
  file: File | null;
  maxDuration?: number; // default 2.0 seconds
  onTrimComplete: (trimmedFile: File) => void;
  onCancel: () => void;
  onUseOriginal?: (originalFile: File) => void;
}

export const VideoTrimmerModal: React.FC<VideoTrimmerModalProps> = ({
  open,
  file,
  maxDuration = 2.0,
  onTrimComplete,
  onCancel,
  onUseOriginal,
}) => {
  const [videoSrc, setVideoSrc] = useState<string>("");
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(2.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [processing, setProcessing] = useState<boolean>(false);
  const [processingProgress, setProcessingProgress] = useState<number>(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Load video when file changes or modal opens
  useEffect(() => {
    if (file && open) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setStartTime(0);
      setEndTime(Math.min(maxDuration, 2.0));
      setIsPlaying(true);
      setProcessing(false);
      setProcessingProgress(0);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file, open, maxDuration]);

  // Read metadata when video is ready
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration || 0;
      setTotalDuration(dur);
      setStartTime(0);
      setEndTime(Math.min(dur, maxDuration));
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  // Keep preview looping strictly within [startTime, endTime]
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      if (current >= endTime || current < startTime) {
        videoRef.current.currentTime = startTime;
        if (isPlaying) {
          videoRef.current.play().catch(() => {});
        }
      }
    }
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  // Slider change handler enforcing (end - start) <= maxDuration
  const handleSliderChange = (values: number[]) => {
    let [newStart, newEnd] = values;
    const currentSpan = newEnd - newStart;

    if (currentSpan > maxDuration) {
      // If user pulled end further, pull start or clamp end
      if (newStart === startTime) {
        newEnd = Math.min(totalDuration, newStart + maxDuration);
      } else {
        newStart = Math.max(0, newEnd - maxDuration);
      }
    }

    if (newEnd - newStart < 0.2) {
      newEnd = Math.min(totalDuration, newStart + 0.2);
    }

    setStartTime(parseFloat(newStart.toFixed(2)));
    setEndTime(parseFloat(newEnd.toFixed(2)));

    if (videoRef.current) {
      videoRef.current.currentTime = newStart;
    }
  };

  // Quick Presets
  const applyPreset = (type: "start" | "middle" | "end") => {
    if (!totalDuration) return;
    if (type === "start") {
      setStartTime(0);
      setEndTime(Math.min(totalDuration, maxDuration));
    } else if (type === "middle") {
      const mid = totalDuration / 2;
      const half = maxDuration / 2;
      const s = Math.max(0, mid - half);
      setStartTime(parseFloat(s.toFixed(2)));
      setEndTime(parseFloat(Math.min(totalDuration, s + maxDuration).toFixed(2)));
    } else if (type === "end") {
      const s = Math.max(0, totalDuration - maxDuration);
      setStartTime(parseFloat(s.toFixed(2)));
      setEndTime(parseFloat(totalDuration.toFixed(2)));
    }

    if (videoRef.current) {
      videoRef.current.currentTime = startTime;
    }
  };

  // Video Trimming Engine using Canvas + MediaRecorder
  const handleTrimAndApply = async () => {
    if (!file || !videoRef.current) return;
    setProcessing(true);
    setProcessingProgress(10);

    try {
      const video = document.createElement("video");
      video.src = videoSrc;
      video.muted = true;
      video.playsInline = true;

      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => resolve();
        video.onerror = () => reject(new Error("Failed to load video metadata for trimming"));
      });

      let width = video.videoWidth || 720;
      let height = video.videoHeight || 720;
      const MAX_DIM = 720;
      if (width > MAX_DIM || height > MAX_DIM) {
        if (width > height) {
          height = Math.round((height * MAX_DIM) / width);
          width = MAX_DIM;
        } else {
          width = Math.round((width * MAX_DIM) / height);
          height = MAX_DIM;
        }
      }
      // Ensure even dimensions required by h264/webm encoders
      width = width - (width % 2);
      height = height - (height % 2);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Canvas context is unavailable");
      }

      // Check supported MIME types for recording (prefer MP4/H.264 for universal iOS & Android playback)
      const mimeTypes = [
        "video/mp4;codecs=avc1",
        "video/mp4",
        "video/webm;codecs=vp8",
        "video/webm",
      ];
      let selectedMime = "video/webm";
      for (const m of mimeTypes) {
        if (MediaRecorder.isTypeSupported(m)) {
          selectedMime = m;
          break;
        }
      }

      const stream = (canvas as any).captureStream ? (canvas as any).captureStream(30) : null;
      if (!stream) {
        throw new Error("captureStream is not supported by your browser");
      }

      // 1.2 Mbps bitrate produces ~300KB for a 2s video loop
      const recorder = new MediaRecorder(stream, {
        mimeType: selectedMime,
        videoBitsPerSecond: 1200000,
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      const trimPromise = new Promise<Blob>((resolve, reject) => {
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: selectedMime });
          resolve(blob);
        };
        recorder.onerror = (err) => reject(err);
      });

      // Seek to start position
      video.currentTime = startTime;
      await new Promise<void>((resolve) => {
        video.onseeked = () => resolve();
      });

      recorder.start();
      video.play().catch(() => {});

      const duration = endTime - startTime;
      let animId: number;

      const drawFrame = () => {
        if (!ctx) return;
        ctx.drawImage(video, 0, 0, width, height);

        const currentProg = Math.min(
          95,
          10 + Math.round(((video.currentTime - startTime) / duration) * 85)
        );
        setProcessingProgress(currentProg);

        if (video.currentTime >= endTime) {
          cancelAnimationFrame(animId);
          video.pause();
          recorder.stop();
        } else {
          animId = requestAnimationFrame(drawFrame);
        }
      };

      animId = requestAnimationFrame(drawFrame);

      // Timeout safety: duration + 1s max
      setTimeout(() => {
        if (recorder.state === "recording") {
          cancelAnimationFrame(animId);
          video.pause();
          recorder.stop();
        }
      }, (duration + 1.2) * 1000);

      const trimmedBlob = await trimPromise;
      setProcessingProgress(100);

      const isMp4 = selectedMime.includes("mp4");
      const ext = isMp4 ? ".mp4" : ".webm";
      const newFileName = file.name.replace(/\.[^.]+$/, ext);
      const outputMime = isMp4 ? "video/mp4" : "video/webm";
      const trimmedFile = new File([trimmedBlob], newFileName, {
        type: outputMime,
        lastModified: Date.now(),
      });

      const sizeKb = Math.round(trimmedBlob.size / 1024);
      toast.success(`Đã cắt video (${duration.toFixed(1)}s, dung lượng siêu nhẹ ~${sizeKb}KB)!`);
      onTrimComplete(trimmedFile);
    } catch (err: any) {
      console.error("Trim failed:", err);
      toast.error("Trimming failed: " + (err.message || "Unknown error"));
      // Fallback: offer to use original
      if (onUseOriginal && file) {
        onUseOriginal(file);
      }
    } finally {
      setProcessing(false);
    }
  };

  const selectedDuration = (endTime - startTime).toFixed(2);
  const isOverLimit = parseFloat(selectedDuration) > maxDuration;

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title={
        <div className="flex items-center gap-2.5 text-white">
          <ScissorOutlined className="text-pink-400" />
          <span>Trim Video for Celebrates (Max {maxDuration}s)</span>
        </div>
      }
      width={600}
      centered
      destroyOnHidden
      footer={
        <div className="flex items-center justify-between pt-2">
          <Button
            type="text"
            className="text-gray-400 hover:text-white"
            onClick={onCancel}
            disabled={processing}
          >
            Cancel
          </Button>

          <Space>
            {onUseOriginal && file && (
              <Tooltip title="Keep original video without trimming">
                <Button
                  type="text"
                  className="text-gray-400 hover:text-white text-xs"
                  onClick={() => onUseOriginal(file)}
                  disabled={processing}
                >
                  Keep Original
                </Button>
              </Tooltip>
            )}

            <Button
              type="primary"
              icon={processing ? <ReloadOutlined spin /> : <CheckOutlined />}
              onClick={handleTrimAndApply}
              loading={processing}
              className="admin-btn-primary"
              style={{
                background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
                borderColor: "#ec4899",
                height: "40px",
                padding: "0 20px",
                fontWeight: 700,
              }}
            >
              {processing ? `Trimming (${processingProgress}%)...` : `Apply Clip (${selectedDuration}s)`}
            </Button>
          </Space>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Notice Info */}
        <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-xs text-pink-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClockCircleOutlined />
            <span>Select any continuous segment under {maxDuration} seconds to auto-loop seamlessly.</span>
          </div>
          <span className="font-mono font-bold text-white bg-pink-500/20 px-2 py-0.5 rounded-full">
            {selectedDuration}s / {maxDuration}s
          </span>
        </div>

        {/* Video Stage & Preview Loop */}
        <div className="relative w-full h-[260px] bg-black/80 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center group">
          <video
            ref={videoRef}
            src={videoSrc}
            playsInline
            muted
            className="w-full h-full object-contain cursor-pointer"
            onClick={togglePlayPause}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
          />

          {/* Floating Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/50 border border-white/30 backdrop-blur-md flex items-center justify-center text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
          </button>

          {/* Top Loop Indicator */}
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 border border-white/15 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Looping: {startTime.toFixed(1)}s - {endTime.toFixed(1)}s</span>
          </div>
        </div>

        {/* Range Scrubber / Dual Slider */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400">
            <span>Start: {startTime.toFixed(2)}s</span>
            <span className={isOverLimit ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
              Duration: {selectedDuration}s
            </span>
            <span>End: {endTime.toFixed(2)}s (Total: {totalDuration.toFixed(1)}s)</span>
          </div>

          <Slider
            range
            min={0}
            max={totalDuration || 10}
            step={0.05}
            value={[startTime, endTime]}
            onChange={handleSliderChange}
            tooltip={{
              formatter: (v) => `${v?.toFixed(2)}s`,
            }}
          />
        </div>

        {/* Quick Position Presets */}
        <div className="flex items-center justify-between pt-1">
          <Text className="text-[11px] text-gray-400 uppercase tracking-wider font-mono">
            Quick Clips:
          </Text>
          <div className="flex items-center gap-2">
            <Button
              size="small"
              className="bg-white/5 border-white/10 text-gray-300 hover:text-white text-xs rounded-lg"
              onClick={() => applyPreset("start")}
            >
              First 2s (0:00)
            </Button>
            <Button
              size="small"
              className="bg-white/5 border-white/10 text-gray-300 hover:text-white text-xs rounded-lg"
              onClick={() => applyPreset("middle")}
            >
              Middle 2s
            </Button>
            <Button
              size="small"
              className="bg-white/5 border-white/10 text-gray-300 hover:text-white text-xs rounded-lg"
              onClick={() => applyPreset("end")}
            >
              Last 2s
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default VideoTrimmerModal;
