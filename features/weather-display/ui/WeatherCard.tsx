"use client";

import React from "react";
import { MESSAGES } from "@/shared/config/messages";
import { Card } from "@/shared/ui/Card";
import { Skeleton } from "@/shared/ui/Skeleton";
import { Button } from "@/shared/ui/Button";
import { WeatherData } from "@/entities/weather/model/types";
import { formatLocationName } from "@/shared/lib/locationSearch";
import { Location } from "@/entities/location/model/types";
import { getWeatherIcon, getWeatherIconColor } from "@/shared/lib/weatherIcons";
import { getTemperatureColor, getTemperatureBgColor } from "@/shared/lib/weatherColors";

interface WeatherCardProps {
  location: Location;
  weather?: WeatherData;
  isLoading?: boolean;
  error?: string;
  onClick?: () => void;
  showDetails?: boolean;
  hourlyDisplayCount?: number;
  onRetry?: () => void;
}

const WeatherCardComponent: React.FC<WeatherCardProps> = ({
  location,
  weather,
  isLoading,
  error,
  onClick,
  showDetails = false,
  hourlyDisplayCount = 8,
  onRetry,
}) => {
  if (isLoading) {
    return (
      <Card className="min-h-[200px]">
        <div className="space-y-4">
          <div>
            <Skeleton height={24} width="60%" className="mb-2" />
            <Skeleton height={16} width="40%" />
          </div>
          <Skeleton height={48} width="80px" />
          <div className="flex gap-4">
            <Skeleton height={20} width="60px" />
            <Skeleton height={20} width="60px" />
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="min-h-[200px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 font-medium mb-2">
            {error}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {MESSAGES.LOCATION_NOT_AVAILABLE}
          </p>
          {onRetry && (
            <Button variant="primary" size="sm" onClick={onRetry}>
              다시 시도
            </Button>
          )}
        </div>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card className="min-h-[200px] flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          날씨 정보가 없습니다.
        </p>
      </Card>
    );
  }

  const WeatherIcon = getWeatherIcon(weather.current.description);
  const iconColor = getWeatherIconColor(weather.current.description);
  const tempColor = getTemperatureColor(weather.current.temp);
  const bgColor = getTemperatureBgColor(weather.current.temp);

  return (
    <Card
      onClick={onClick}
      className={`min-h-[220px] sm:min-h-[240px] transition-all duration-300 overflow-hidden ${
        onClick ? "cursor-pointer hover:shadow-xl hover:-translate-y-1" : ""
      } ${bgColor}`}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`${formatLocationName(location)} 날씨 정보`}
      onKeyDown={onClick ? (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex-1 min-w-0 pr-2">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
              {formatLocationName(location)}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">
              {weather.current.description}
            </p>
          </div>
          <div className="ml-2 sm:ml-3 flex-shrink-0">
            <WeatherIcon className={`text-4xl sm:text-5xl ${iconColor} opacity-80`} />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center my-3 sm:my-4">
          <div className="text-center">
            <div className="flex items-baseline justify-center gap-1">
              <span className={`text-5xl sm:text-6xl font-bold ${tempColor} leading-none`}>
                {Math.round(weather.current.temp)}
              </span>
              <span className="text-xl sm:text-2xl text-gray-500 dark:text-gray-400">°</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">최저</span>
            <span className={`text-base sm:text-lg font-semibold ${tempColor}`}>
              {Math.round(weather.daily.min)}°
            </span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">최고</span>
            <span className={`text-base sm:text-lg font-semibold ${tempColor}`}>
              {Math.round(weather.daily.max)}°
            </span>
          </div>
        </div>

        {showDetails && weather.hourly.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              시간대별 기온
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {weather.hourly.slice(0, hourlyDisplayCount).map((hour, index) => (
                <div
                  key={index}
                  className="text-center p-2 border border-gray-200 dark:border-gray-700 rounded"
                >
                  <div className="text-gray-500 dark:text-gray-400">
                    {hour.time}
                  </div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {Math.round(hour.temp)}°
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export const WeatherCard = React.memo(WeatherCardComponent);
