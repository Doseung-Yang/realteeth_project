"use client";

import { Card } from "@/shared/ui/Card";
import { Loading } from "@/shared/ui/Loading";
import { WeatherData } from "@/entities/weather/model/types";
import { formatLocationName } from "@/shared/lib/locationSearch";
import { Location } from "@/entities/location/model/types";

interface WeatherCardProps {
  location: Location;
  weather?: WeatherData;
  isLoading?: boolean;
  error?: string;
  onClick?: () => void;
  showDetails?: boolean;
  hourlyDisplayCount?: number;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  location,
  weather,
  isLoading,
  error,
  onClick,
  showDetails = false,
  hourlyDisplayCount = 8,
}) => {
  if (isLoading) {
    return (
      <Card className="min-h-[200px] flex items-center justify-center">
        <Loading size="md" text="날씨 정보를 불러오는 중..." />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="min-h-[200px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 font-medium">
            {error}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            해당 장소의 정보가 제공되지 않습니다.
          </p>
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

  return (
    <Card
      onClick={onClick}
      className={`min-h-[200px] ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {formatLocationName(location)}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {weather.current.description}
          </p>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            {Math.round(weather.current.temp)}°
          </span>
          <span className="text-gray-500 dark:text-gray-400">C</span>
        </div>

        <div className="flex gap-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">최저</span>
            <span className="ml-1 font-medium text-gray-700 dark:text-gray-300">
              {Math.round(weather.daily.min)}°
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">최고</span>
            <span className="ml-1 font-medium text-gray-700 dark:text-gray-300">
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
