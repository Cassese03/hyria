import React from "react";

interface SponsorBannerProps {
  src: string;
  alt: string;
  height?: number;
  width?: number | string;
  bgColor?: string;
  shadow?: boolean;
  fit?: "cover" | "contain";
  padding?: number; // px
  invert?: boolean;
  className?: string; // opzionale per override css
}

const SponsorBanner: React.FC<SponsorBannerProps> = ({
  src,
  alt,
  height = 312,
  width = "100%", // responsive di default
  bgColor = "#fff",
  shadow = true,
  fit = "contain",
  padding = 24,
  invert = false,
  className = ""
}) => (
  <div
    className={className}
    style={{
      width,
      maxWidth: 900, // limite massimo per desktop
      height: "auto",
      aspectRatio: "13/5", // proporzione banner, fallback per browser moderni
      background: bgColor,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      borderRadius: 28,
      boxShadow: shadow ? "0 4px 24px rgba(0,0,0,0.10)" : undefined,
      margin: "0 auto",
      padding
    }}
  >
    <img
      src={src}
      alt={alt}
      style={{
        width: "100%",
        height: height,
        maxHeight: "32vw", // limita l'altezza su schermi grandi
        minHeight: 100,
        objectFit: fit,
        objectPosition: "center",
        borderRadius: 20,
        background: bgColor,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        filter: invert ? "invert(1) grayscale(1) brightness(0.2)" : undefined,
        display: "block"
      }}
      loading="lazy"
      draggable={false}
    />
  </div>
);

export default SponsorBanner;
