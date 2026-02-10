import React from "react";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  className = "",
  variant = "rectangular",
  lines,
}) => {
  const baseStyles = "animate-pulse bg-gray-200 dark:bg-gray-700 rounded";

  const variantStyles = {
    text: "h-4",
    circular: "rounded-full",
    rectangular: "rounded",
  };

  if (lines && lines > 1) {
    return (
      <div className={className}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseStyles} ${variantStyles.text} mb-2 ${
              index === lines - 1 ? "w-3/4" : "w-full"
            }`}
            style={index === lines - 1 ? {} : { width }}
          />
        ))}
      </div>
    );
  }

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={style}
    />
  );
};
