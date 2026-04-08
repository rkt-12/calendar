"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import Image from "next/image";
import { Upload, ImageIcon } from "lucide-react";
import { getMonthImage } from "@/data/monthImages";

interface HeroImagePanelProps {
  currentDate: Date;
  customImageUrl?: string | null;
  onImageUpload?: (url: string) => void;
  // layout mode — hero (tall, desktop left panel) or banner (short, mobile top)
  variant?: "hero" | "banner";
}

export default function HeroImagePanel({
  currentDate,
  customImageUrl,
  onImageUpload,
  variant = "hero",
}: HeroImagePanelProps) {
  const monthIndex = currentDate.getMonth();
  const monthImage = getMonthImage(monthIndex);
  const imageUrl = customImageUrl ?? monthImage.url;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState(false);
  const [isHoveringUpload, setIsHoveringUpload] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    onImageUpload?.(objectUrl);
    setImageError(false);
  }

  const isBanner = variant === "banner";

  return (
    <div
      className="hero-panel"
      style={{
        position: "relative",
        width: "100%",
        height: isBanner ? "200px" : "100%",
        minHeight: isBanner ? "200px" : "320px",
        overflow: "hidden",
        borderRadius: isBanner ? "0" : "0",
        flexShrink: 0,
      }}
    >
      {/* Background Image  */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${monthIndex}-${imageUrl}`}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ position: "absolute", inset: 0 }}
        >
          {!imageError ? (
            <Image
              src={imageUrl}
              alt={monthImage.alt}
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
              onError={() => setImageError(true)}
              priority
              unoptimized
            />
          ) : (
            // Fallback gradient when image fails
            <div
              style={{
                width: "100%",
                height: "100%",
                background: `linear-gradient(135deg, var(--accent) 0%, #0a3d7a 100%)`,
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Dark overlay for text readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.45) 100%)",
          zIndex: 1,
        }}
      />

      {/* Blue Chevron SVG overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 2,
          lineHeight: 0,
        }}
      >
        <svg
          viewBox="0 0 400 100"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: isBanner ? "60px" : "90px", display: "block" }}
        >
          {/* Back chevron — slightly darker blue */}
          <polygon
            points="0,100 0,60 130,100 200,35 270,100 400,60 400,100"
            fill="var(--accent)"
            opacity="0.55"
          />
          {/* Front chevron — main accent blue */}
          <polygon
            points="0,100 0,75 110,100 200,52 290,100 400,75 400,100"
            fill="var(--accent)"
            opacity="0.9"
          />
          {/* Bottom fill so no gap */}
          <rect x="0" y="95" width="400" height="5" fill="var(--accent)" opacity="0.9" />
        </svg>
      </div>

      {/* Month + Year label */}
      <div
        style={{
          position: "absolute",
          bottom: isBanner ? "18px" : "22px",
          right: "20px",
          zIndex: 3,
          textAlign: "right",
          lineHeight: 1.1,
        }}
      >
        <motion.div
          key={format(currentDate, "yyyy-MM")}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: isBanner ? "1.5rem" : "1.875rem",
              fontWeight: 700,
              color: "#ffffff",
              textShadow: "0 2px 8px rgba(0,0,0,0.3)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            {format(currentDate, "MMMM")}
          </div>
          <div
            style={{
              fontSize: isBanner ? "0.75rem" : "0.875rem",
              fontWeight: 600,
              color: "rgba(255,255,255,0.85)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            {format(currentDate, "yyyy")}
          </div>
        </motion.div>
      </div>

      {/* Upload button */}
      <motion.button
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          zIndex: 4,
          display: "flex",
          alignItems: "center",
          gap: "5px",
          padding: "5px 10px",
          borderRadius: "20px",
          background: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(6px)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "rgba(255,255,255,0.9)",
          fontSize: "0.6875rem",
          fontWeight: 500,
          cursor: "pointer",
          letterSpacing: "0.04em",
        }}
        whileHover={{ scale: 1.05, background: "rgba(0,0,0,0.55)" }}
        whileTap={{ scale: 0.96 }}
        onClick={() => fileInputRef.current?.click()}
        onMouseEnter={() => setIsHoveringUpload(true)}
        onMouseLeave={() => setIsHoveringUpload(false)}
        aria-label="Upload custom image"
      >
        {isHoveringUpload ? (
          <Upload size={11} />
        ) : (
          <ImageIcon size={11} />
        )}
        <span>{customImageUrl ? "Change" : "Upload"}</span>
      </motion.button>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
}