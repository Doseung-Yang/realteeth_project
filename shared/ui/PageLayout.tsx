import React from "react";

type PageLayoutMaxWidth = "4xl" | "7xl";

interface PageLayoutProps {
  children: React.ReactNode;
  maxWidth?: PageLayoutMaxWidth;
  className?: string;
}

const maxWidthClasses: Record<PageLayoutMaxWidth, string> = {
  "4xl": "max-w-4xl",
  "7xl": "max-w-7xl",
};

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  maxWidth = "4xl",
  className = "",
}) => {
  return (
    <div
      className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`.trim()}
    >
      <div
        className={`container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 ${maxWidthClasses[maxWidth]}`}
      >
        {children}
      </div>
    </div>
  );
};
