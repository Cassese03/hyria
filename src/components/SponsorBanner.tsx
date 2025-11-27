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
  invert?: boolean; // nuovo: inverte i colori del logo
}

const SponsorBanner: React.FC<SponsorBannerProps> = ({
  src,
  alt,
  height = 312,
  width = 780,
  bgColor = "#fff",
  shadow = true,
  fit = "contain",
  padding = 24,
  invert = false // default: non invertire
}) => (
  <div
    style={{
      width,
      height,
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
        height: "100%",
        objectFit: fit,
        objectPosition: "center",
        borderRadius: 20,
        background: bgColor, // usa lo stesso colore del contenitore
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        filter: invert ? "invert(1) grayscale(1) brightness(0.2)" : undefined // inverte e scurisce
      }}
      loading="lazy"
      draggable={false}
    />
  </div>
);

export default SponsorBanner;
