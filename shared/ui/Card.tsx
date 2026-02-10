import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  padding?: "sm" | "md" | "lg";
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  onClick,
  padding = "md",
}) => {
  const baseStyles =
    "bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700";

  const paddingStyles = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  const clickStyles = onClick ? "cursor-pointer" : "";

  return (
    <div
      className={`${baseStyles} ${paddingStyles[padding]} ${clickStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
