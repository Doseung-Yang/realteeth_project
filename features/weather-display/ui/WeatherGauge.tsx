"use client";

interface WeatherGaugeProps {
  label: string;
  value: number;
  max: number;
  unit: string;
  color?: "blue" | "green" | "yellow" | "red";
}

export const WeatherGauge: React.FC<WeatherGaugeProps> = ({
  label,
  value,
  max,
  unit,
  color = "blue",
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const colorClasses = {
    blue: {
      stroke: "stroke-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      text: "text-blue-600 dark:text-blue-400",
    },
    green: {
      stroke: "stroke-green-500",
      bg: "bg-green-50 dark:bg-green-900/20",
      text: "text-green-600 dark:text-green-400",
    },
    yellow: {
      stroke: "stroke-yellow-500",
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      text: "text-yellow-600 dark:text-yellow-400",
    },
    red: {
      stroke: "stroke-red-500",
      bg: "bg-red-50 dark:bg-red-900/20",
      text: "text-red-600 dark:text-red-400",
    },
  };

  const colors = colorClasses[color];

  return (
    <div className="flex flex-col items-center">
      <span className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {label}
      </span>
      <div className="relative">
        <svg
          width="140"
          height="140"
          className="transform -rotate-90"
        >
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`${colors.stroke} transition-all duration-1000`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-2xl font-bold ${colors.text}`}>
              {value.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {unit}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
