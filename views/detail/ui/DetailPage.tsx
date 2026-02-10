"use client";

import { useParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { IoArrowBack } from "react-icons/io5";
import { getLocationById } from "@/shared/lib/locationSearch";
import { useWeatherQuery } from "@/entities/weather/api/useWeatherQuery";
import { WeatherCard } from "@/features/weather-display/ui/WeatherCard";
import { HourlyWeather } from "@/features/weather-display/ui/HourlyWeather";
import { FavoriteToggle } from "@/entities/favorite/ui/FavoriteToggle";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Loading } from "@/shared/ui/Loading";

export const DetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  
  const locationId = params?.locationId 
    ? decodeURIComponent(params.locationId as string)
    : null;
  const location = locationId ? getLocationById(locationId) : null;
  const { data: weather, isLoading, error } = useWeatherQuery(
    location?.coordinates?.lat || 0,
    location?.coordinates?.lon || 0
  );
  
  if (!params || !params.locationId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-4xl">
          <Card>
            <div className="text-center py-12">
              <p className="text-red-600 dark:text-red-400 font-medium mb-4">
                해당 장소의 정보가 제공되지 않습니다.
              </p>
              <Button variant="secondary" onClick={() => router.back()} icon={IoArrowBack}>
                뒤로가기
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-4xl">
          <Card>
            <div className="text-center py-12">
              <p className="text-red-600 dark:text-red-400 font-medium mb-4">
                해당 장소의 정보가 제공되지 않습니다.
              </p>
              <Button variant="secondary" onClick={() => router.back()} icon={IoArrowBack}>
                뒤로가기
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-4xl">
        <div className="mb-6">
          <Button variant="secondary" onClick={() => router.back()} icon={IoArrowBack}>
            뒤로가기
          </Button>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            날씨 상세 정보
          </h1>
          <FavoriteToggle location={location} />
        </div>

        {isLoading ? (
          <Loading text="날씨 정보를 불러오는 중..." />
        ) : error || !weather ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-red-600 dark:text-red-400 font-medium mb-4">
                해당 장소의 정보가 제공되지 않습니다.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {error?.message || "날씨 정보를 가져올 수 없습니다."}
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            <WeatherCard
              location={location}
              weather={weather}
              showDetails={false}
            />

            {weather.hourly.length > 0 && (
              <Card>
                <HourlyWeather hourly={weather.hourly} />
              </Card>
            )}

            <Card>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                추가 정보
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    습도
                  </span>
                  <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {weather.current.humidity}%
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    풍속
                  </span>
                  <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {weather.current.windSpeed} m/s
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
