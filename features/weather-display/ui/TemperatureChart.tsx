"use client";

import { WeatherData } from "@/entities/weather/model/types";
import { getTemperatureColor } from "@/shared/lib/weatherColors";

interface TemperatureChartProps {
  hourly: WeatherData["hourly"];
}

export const TemperatureChart: React.FC<TemperatureChartProps> = ({ hourly }) => {
  if (hourly.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
        시간대별 기온 정보가 없습니다.
      </div>
    );
  }

  const maxTemp = Math.max(...hourly.map((h) => h.temp));
  const minTemp = Math.min(...hourly.map((h) => h.temp));
  const range = maxTemp - minTemp || 1;
  const chartHeight = 200;

  return (
    <div className="space-y-3 sm:space-y-4">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
        시간대별 기온 추이
      </h3>
      <div className="relative overflow-x-auto" style={{ height: `${chartHeight}px` }}>
        <svg
          width={Math.max(hourly.length * 40, 400)}
          height={chartHeight}
          className="overflow-visible"
          viewBox={`0 0 ${hourly.length * 40} ${chartHeight}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="temperatureGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          
          <polyline
            fill="url(#temperatureGradient)"
            stroke="rgb(59, 130, 246)"
            strokeWidth="2"
            points={hourly
              .map(
                (hour, index) =>
                  `${index * 40 + 20},${
                    chartHeight - ((hour.temp - minTemp) / range) * (chartHeight - 40) - 20
                  }`
              )
              .join(" ")}
          />
          
          <polyline
            fill="none"
            stroke="rgb(59, 130, 246)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={hourly
              .map(
                (hour, index) =>
                  `${index * 40 + 20},${
                    chartHeight - ((hour.temp - minTemp) / range) * (chartHeight - 40) - 20
                  }`
              )
              .join(" ")}
          />
          
          {hourly.map((hour, index) => {
            const x = index * 40 + 20;
            const y =
              chartHeight - ((hour.temp - minTemp) / range) * (chartHeight - 40) - 20;
            const tempColor = getTemperatureColor(hour.temp);
            
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill="rgb(59, 130, 246)"
                  className="hover:r-6 transition-all cursor-pointer"
                />
                <text
                  x={x}
                  y={y - 15}
                  textAnchor="middle"
                  className={`text-xs font-medium ${tempColor.replace("text-", "fill-")}`}
                  fill="currentColor"
                >
                  {Math.round(hour.temp)}°
                </text>
                <text
                  x={x}
                  y={chartHeight - 5}
                  textAnchor="middle"
                  className="text-xs fill-gray-500 dark:fill-gray-400"
                  fill="currentColor"
                >
                  {hour.time}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
        <span>최저: {Math.round(minTemp)}°</span>
        <span>최고: {Math.round(maxTemp)}°</span>
      </div>
    </div>
  );
};
