import React from "react";
import { IconType } from "react-icons";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: IconType;
  iconPosition?: "left" | "right";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon: Icon,
  iconPosition = "left",
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "font-medium rounded-lg border focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95";

  const variantStyles = {
    primary:
      "bg-gray-900 text-white border-gray-900 disabled:bg-gray-400 disabled:border-gray-400",
    secondary:
      "bg-white text-gray-900 border-gray-300 disabled:bg-gray-100 disabled:border-gray-200",
    danger: "bg-white text-red-600 border-red-600 disabled:bg-gray-100 disabled:border-gray-200",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>로딩 중...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === "left" && <Icon size={iconSizes[size]} />}
          {children && <span>{children}</span>}
          {Icon && iconPosition === "right" && <Icon size={iconSizes[size]} />}
        </>
      )}
    </button>
  );
};
