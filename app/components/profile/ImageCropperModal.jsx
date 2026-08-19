"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Check,
  X,
  Move,
  Crop,
} from "lucide-react";

export default function ImageCropperModal({
  imageSrc,
  onCancel,
  onCropComplete,
  isProcessing = false,
}) {
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cropShape, setCropShape] = useState("circle");

  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setImage(img);
      setZoom(1);
      setRotation(0);
      setPan({ x: 0, y: 0 });
    };
    img.src = imageSrc;
  }, [imageSrc]);

  const drawPreview = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(width / 2 + pan.x, height / 2 + pan.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    const imgRatio = image.width / image.height;
    let drawWidth = width;
    let drawHeight = height;

    if (imgRatio > 1) {
      drawWidth = height * imgRatio;
      drawHeight = height;
    } else {
      drawWidth = width;
      drawHeight = width / imgRatio;
    }

    ctx.drawImage(
      image,
      -drawWidth / 2,
      -drawHeight / 2,
      drawWidth,
      drawHeight
    );

    ctx.restore();

    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    ctx.beginPath();
    ctx.rect(0, 0, width, height);

    const cropSize = Math.min(width, height) * 0.82;
    const cropX = (width - cropSize) / 2;
    const cropY = (height - cropSize) / 2;

    if (cropShape === "circle") {
      ctx.arc(width / 2, height / 2, cropSize / 2, 0, Math.PI * 2, true);
    } else {
      const r = 24;
      ctx.moveTo(cropX + r, cropY);
      ctx.lineTo(cropX + cropSize - r, cropY);
      ctx.quadraticCurveTo(cropX + cropSize, cropY, cropX + cropSize, cropY + r);
      ctx.lineTo(cropX + cropSize, cropY + cropSize - r);
      ctx.quadraticCurveTo(cropX + cropSize, cropY + cropSize, cropX + cropSize - r, cropY + cropSize);
      ctx.lineTo(cropX + r, cropY + cropSize);
      ctx.quadraticCurveTo(cropX, cropY + cropSize, cropX, cropY + cropSize - r);
      ctx.lineTo(cropX, cropY + r);
      ctx.quadraticCurveTo(cropX, cropY, cropX + r, cropY);
      ctx.closePath();
    }

    ctx.fill("evenodd");

    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#10B981";
    ctx.beginPath();
    if (cropShape === "circle") {
      ctx.arc(width / 2, height / 2, cropSize / 2, 0, Math.PI * 2);
    } else {
      const r = 24;
      if (ctx.roundRect) {
        ctx.roundRect(cropX, cropY, cropSize, cropSize, r);
      } else {
        ctx.rect(cropX, cropY, cropSize, cropSize);
      }
    }
    ctx.stroke();

    ctx.lineWidth = 0.75;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.beginPath();
    ctx.moveTo(cropX, cropY + cropSize / 3);
    ctx.lineTo(cropX + cropSize, cropY + cropSize / 3);
    ctx.moveTo(cropX, cropY + (cropSize * 2) / 3);
    ctx.lineTo(cropX + cropSize, cropY + (cropSize * 2) / 3);
    ctx.moveTo(cropX + cropSize / 3, cropY);
    ctx.lineTo(cropX + cropSize / 3, cropY + cropSize);
    ctx.moveTo(cropX + (cropSize * 2) / 3, cropY);
    ctx.lineTo(cropX + (cropSize * 2) / 3, cropY + cropSize);
    ctx.stroke();

    ctx.restore();
  }, [image, zoom, rotation, pan, cropShape]);

  useEffect(() => {
    drawPreview();
  }, [drawPreview]);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    const clientX = e.clientX || e.touches?.[0]?.clientX || 0;
    const clientY = e.clientY || e.touches?.[0]?.clientY || 0;
    setDragStart({ x: clientX - pan.x, y: clientY - pan.y });
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX || e.touches?.[0]?.clientX || 0;
    const clientY = e.clientY || e.touches?.[0]?.clientY || 0;
    setPan({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y,
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleApplyCrop = () => {
    if (!image) return;

    const outputCanvas = document.createElement("canvas");
    const outputSize = 256; // Optimized 256x256 avatar resolution
    outputCanvas.width = outputSize;
    outputCanvas.height = outputSize;

    const ctx = outputCanvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const previewCanvas = canvasRef.current;
    if (!previewCanvas) return;

    const cropSize = Math.min(previewCanvas.width, previewCanvas.height) * 0.82;
    const scaleFactor = outputSize / cropSize;

    ctx.save();
    ctx.translate(outputSize / 2, outputSize / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom * scaleFactor, zoom * scaleFactor);
    ctx.translate(pan.x / zoom, pan.y / zoom);

    const imgRatio = image.width / image.height;
    let drawWidth = previewCanvas.width;
    let drawHeight = previewCanvas.height;

    if (imgRatio > 1) {
      drawWidth = previewCanvas.height * imgRatio;
      drawHeight = previewCanvas.height;
    } else {
      drawWidth = previewCanvas.width;
      drawHeight = previewCanvas.width / imgRatio;
    }

    ctx.drawImage(
      image,
      -drawWidth / 2,
      -drawHeight / 2,
      drawWidth,
      drawHeight
    );

    ctx.restore();

    const croppedDataUrl = outputCanvas.toDataURL("image/jpeg", 0.85);
    onCropComplete(croppedDataUrl);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3.5 sm:p-4">
      <div className="bg-white rounded-3xl sm:rounded-[32px] p-5 sm:p-8 max-w-md w-full shadow-2xl border border-black/10 flex flex-col gap-4 sm:gap-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-emerald-50 text-emerald-700">
              <Crop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#111111]">Crop Profile Photo</h3>
              <p className="text-xs text-[#494D4D]">Position and zoom to frame your picture.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative flex justify-center items-center bg-neutral-900 rounded-3xl overflow-hidden shadow-inner p-2">
          <canvas
            ref={canvasRef}
            width={320}
            height={320}
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
            className="rounded-2xl cursor-grab active:cursor-grabbing touch-none select-none max-w-full"
            style={{ width: "100%", maxHeight: "320px", aspectRatio: "1/1" }}
          />

          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1.5 pointer-events-none">
            <Move className="w-3 h-3 text-emerald-400" />
            <span>Drag to Position</span>
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setCropShape("circle")}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                cropShape === "circle"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-neutral-300 hover:text-white"
              }`}
            >
              Circle
            </button>
            <button
              type="button"
              onClick={() => setCropShape("square")}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                cropShape === "square"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-neutral-300 hover:text-white"
              }`}
            >
              Square
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 px-1">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.6, Number((z - 0.1).toFixed(2))))}
              className="p-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl transition-colors cursor-pointer shrink-0"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <div className="flex-1 flex items-center gap-2">
              <input
                type="range"
                min="0.6"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 h-2 bg-neutral-200 rounded-lg cursor-pointer"
              />
              <span className="text-[11px] font-mono font-bold text-neutral-600 w-10 text-right">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(3, Number((z + 0.1).toFixed(2))))}
              className="p-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl transition-colors cursor-pointer shrink-0"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleRotate}
              className="p-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl transition-colors cursor-pointer shrink-0 flex items-center gap-1 text-xs font-bold"
              title="Rotate 90°"
            >
              <RotateCw className="w-4 h-4 text-emerald-600" />
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="px-2.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 rounded-xl text-[11px] font-bold transition-colors cursor-pointer shrink-0"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-xs font-bold text-[#494D4D] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isProcessing || !image}
            onClick={handleApplyCrop}
            className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-md flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{isProcessing ? "Saving..." : "Apply & Save Crop"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
