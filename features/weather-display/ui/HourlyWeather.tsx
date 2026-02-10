"use client";

import { WeatherData } from "@/entities/weather/model/types";
import { getWeatherIcon, getWeatherIconColor } from "@/shared/lib/weatherIcons";
import { getTemperatureColor, getTemperatureBorderColor } from "@/shared/lib/weatherColors";

interface HourlyWeatherProps {
  hourly: WeatherData["hourly"];
}

export const HourlyWeather: React.FC<HourlyWeatherProps> = ({ hourly }) => {
  if (hourly.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
        시간대별 기온 정보가 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        시간대별 기온
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
        {hourly.map((hour, index) => {
          const tempColor = getTemperatureColor(hour.temp);
          const borderColor = getTemperatureBorderColor(hour.temp);
          
          return (
            <div
              key={index}
              className={`border ${borderColor} rounded-lg p-3 text-center transition-all hover:scale-105`}
            >
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {hour.time}
              </div>
              <div className={`text-lg font-bold ${tempColor}`}>
                {Math.round(hour.temp)}°
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
