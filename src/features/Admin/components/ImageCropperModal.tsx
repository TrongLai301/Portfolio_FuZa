import React, { useState, useEffect, useRef, useCallback } from "react";
import { Modal, Slider, Button, Space, Typography, Radio, Tooltip } from "antd";
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  ScissorOutlined,
  CheckOutlined,
  CloseOutlined,
  RotateRightOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

export interface ImageCropperModalProps {
  open: boolean;
  file: File | null;
  defaultAspect?: number | null; // e.g. 1 for 1:1, 16/9, 3/4
  title?: string;
  onCropComplete: (croppedFile: File) => void;
  onCancel: () => void;
  onSkipCrop?: (originalFile: File) => void;
}

const PRESET_ASPECTS = [
  { label: "1:1 Square", value: 1 },
  { label: "16:9 Wide", value: 16 / 9 },
  { label: "3:4 Portrait", value: 3 / 4 },
  { label: "4:3 Standard", value: 4 / 3 },
  { label: "Free", value: 0 }, // 0 means fit original
];

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  open,
  file,
  defaultAspect = 1,
  title = "Crop & Adjust Display Frame",
  onCropComplete,
  onCancel,
  onSkipCrop,
}) => {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [naturalWidth, setNaturalWidth] = useState<number>(0);
  const [naturalHeight, setNaturalHeight] = useState<number>(0);

  const [aspect, setAspect] = useState<number>(defaultAspect ?? 1);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);

  // Position offset (panning)
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const imageRef = useRef<HTMLImageElement | null>(null);

  // Reset state when file changes or modal opens
  useEffect(() => {
    if (file && open) {
      const objectUrl = URL.createObjectURL(file);
      setImageSrc(objectUrl);
      setZoom(1);
      setRotation(0);
      setOffset({ x: 0, y: 0 });
      setAspect(defaultAspect ?? 1);

      const img = new Image();
      img.onload = () => {
        setNaturalWidth(img.naturalWidth);
        setNaturalHeight(img.naturalHeight);
        imageRef.current = img;
      };
      img.src = objectUrl;

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [file, open, defaultAspect]);

  // Frame dimensions inside the viewport
  const VIEW_WIDTH = 480;
  const VIEW_HEIGHT = 360;

  // Compute crop box target dimensions within view
  const getCropBoxSize = useCallback(() => {
    const currentAspect = aspect === 0 ? (naturalWidth / (naturalHeight || 1)) : aspect;
    let w = VIEW_WIDTH - 40;
    let h = w / currentAspect;

    if (h > VIEW_HEIGHT - 40) {
      h = VIEW_HEIGHT - 40;
      w = h * currentAspect;
    }
    return { width: Math.round(w), height: Math.round(h) };
  }, [aspect, naturalWidth, naturalHeight]);

  const cropBox = getCropBoxSize();

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.002;
    setZoom((prev) => Math.min(Math.max(0.5, prev + delta), 4));
  };

  // Handle Crop Execution
  const handleApplyCrop = () => {
    if (!imageRef.current || !file) return;

    const img = imageRef.current;
    const outputCanvas = document.createElement("canvas");
    const ctx = outputCanvas.getContext("2d");
    if (!ctx) return;

    // High quality export dimensions
    const targetW = cropBox.width * 2;
    const targetH = cropBox.height * 2;
    outputCanvas.width = targetW;
    outputCanvas.height = targetH;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Transform center
    ctx.translate(targetW / 2, targetH / 2);
    ctx.rotate((rotation * Math.PI) / 180);

    // Apply offset and zoom scaled to export canvas
    const scaleFactor = 2;
    ctx.translate(offset.x * scaleFactor, offset.y * scaleFactor);

    // Draw image centered
    const baseScale = Math.max(
      cropBox.width / img.naturalWidth,
      cropBox.height / img.naturalHeight
    );
    const drawW = img.naturalWidth * baseScale * zoom * scaleFactor;
    const drawH = img.naturalHeight * baseScale * zoom * scaleFactor;

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

    // Export blob as File
    const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
    outputCanvas.toBlob(
      (blob) => {
        if (blob) {
          const croppedFile = new File([blob], file.name, {
            type: mimeType,
            lastModified: Date.now(),
          });
          onCropComplete(croppedFile);
        }
      },
      mimeType,
      0.92
    );
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title={
        <div className="flex items-center gap-2.5 text-white">
          <ScissorOutlined className="text-indigo-400" />
          <span>{title}</span>
        </div>
      }
      width={560}
      centered
      destroyOnHidden
      footer={
        <div className="flex items-center justify-between pt-2">
          <Button
            type="text"
            className="text-gray-400 hover:text-white"
            onClick={() => {
              if (file && onSkipCrop) {
                onSkipCrop(file);
              } else if (file) {
                onCropComplete(file);
              }
            }}
          >
            Keep Original (No Crop)
          </Button>
          <Space>
            <Button onClick={onCancel} icon={<CloseOutlined />}>
              Cancel
            </Button>
            <Button
              type="primary"
              className="admin-btn-primary bg-indigo-600 hover:bg-indigo-500 font-bold"
              icon={<CheckOutlined />}
              onClick={handleApplyCrop}
            >
              Crop & Apply
            </Button>
          </Space>
        </div>
      }
      styles={{
        body: {
          background: "#141414",
        },
        header: {
          background: "transparent",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          paddingBottom: 16,
        },
      }}
    >
      <div className="py-2 flex flex-col gap-4">
        {/* Info header */}
        <div className="flex justify-between items-center text-xs text-gray-400">
          <span>
            Original: <strong className="text-gray-200">{naturalWidth} × {naturalHeight} px</strong>
          </span>
          <span className="italic text-gray-500">Drag image to reposition, scroll to zoom</span>
        </div>

        {/* Aspect Ratio Selector */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
          <Text strong className="text-[10px] text-gray-400 uppercase shrink-0">
            Aspect Ratio:
          </Text>
          <Radio.Group
            value={aspect}
            onChange={(e) => setAspect(e.target.value)}
            size="small"
            buttonStyle="solid"
          >
            {PRESET_ASPECTS.map((item) => (
              <Radio.Button key={item.label} value={item.value}>
                {item.label}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>

        {/* Viewport & Crop Box Area */}
        <div
          className="relative bg-[#080808] border border-white/10 rounded-xl overflow-hidden flex items-center justify-center select-none cursor-grab active:cursor-grabbing"
          style={{ width: "100%", height: `${VIEW_HEIGHT}px` }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          {/* Target Crop Highlight Mask */}
          <div
            className="relative pointer-events-none z-10 border-2 border-indigo-400 shadow-[0_0_0_9999px_rgba(0,0,0,0.65)] rounded-lg flex items-center justify-center"
            style={{
              width: `${cropBox.width}px`,
              height: `${cropBox.height}px`,
            }}
          >
            {/* Grid Guidelines */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-30 pointer-events-none">
              <div className="border-r border-b border-indigo-200" />
              <div className="border-r border-b border-indigo-200" />
              <div className="border-b border-indigo-200" />
              <div className="border-r border-b border-indigo-200" />
              <div className="border-r border-b border-indigo-200" />
              <div className="border-b border-indigo-200" />
              <div className="border-r border-indigo-200" />
              <div className="border-r border-indigo-200" />
              <div />
            </div>
            <span className="absolute bottom-2 right-2 text-[10px] bg-black/60 px-1.5 py-0.5 rounded text-indigo-300 font-mono">
              {cropBox.width} × {cropBox.height}
            </span>
          </div>

          {/* Render Image with dynamic scale & transform */}
          {imageSrc && (
            <img
              src={imageSrc}
              alt="Crop target"
              draggable={false}
              className="absolute max-w-none transition-transform duration-75 origin-center pointer-events-none"
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) scale(${zoom})`,
                maxWidth: "none",
                maxHeight: "none",
                width: `${Math.max(cropBox.width, (naturalWidth / (naturalHeight || 1)) * cropBox.height)}px`,
              }}
            />
          )}
        </div>

        {/* Controls: Zoom slider & Rotate */}
        <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
          <ZoomOutOutlined className="text-gray-400 text-sm" />
          <Slider
            min={0.5}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(val) => setZoom(val)}
            className="flex-1"
            tooltip={{ formatter: (v) => `${Math.round((v || 1) * 100)}%` }}
          />
          <ZoomInOutlined className="text-gray-400 text-sm" />

          <Tooltip title="Rotate 90°">
            <Button
              type="text"
              icon={<RotateRightOutlined className="text-gray-300 hover:text-white" />}
              onClick={() => setRotation((prev) => (prev + 90) % 360)}
            />
          </Tooltip>

          <Button
            size="small"
            type="text"
            className="text-gray-400 text-xs hover:text-indigo-300"
            onClick={() => {
              setZoom(1);
              setRotation(0);
              setOffset({ x: 0, y: 0 });
            }}
          >
            Reset
          </Button>
        </div>
      </div>
    </Modal>
  );
};
export default ImageCropperModal;
