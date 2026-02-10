"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaMapMarkerAlt, FaHeart } from "react-icons/fa";
import { getCurrentLocation } from "@/shared/lib/geolocation";
import { useWeatherQuery } from "@/entities/weather/api/useWeatherQuery";
import { WeatherCard } from "@/features/weather-display/ui/WeatherCard";
import { useFavoriteStore } from "@/entities/favorite/model/store";
import { FavoriteCard } from "@/views/home/ui/FavoriteCard";
import { LocationSearch } from "@/features/location-search/ui/LocationSearch";
import { Location } from "@/entities/location/model/types";
import { Button } from "@/shared/ui/Button";
import { Loading } from "@/shared/ui/Loading";

export const HomePage: React.FC = () => {
  const router = useRouter();
  const [currentCoords, setCurrentCoords] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  const { favorites, loadFavorites } = useFavoriteStore();
  const { data: currentWeather, isLoading: isLoadingWeather } = useWeatherQuery(
    currentCoords?.lat || 0,
    currentCoords?.lon || 0
  );

  useEffect(() => {
    loadFavorites();

    getCurrentLocation()
      .then((coords) => {
        setCurrentCoords(coords);
        setLocationError(null);
      })
      .catch((error) => {
        console.error("위치 가져오기 실패:", error);
        setLocationError("위치 정보를 가져올 수 없습니다.");
      })
      .finally(() => {
        setIsLoadingLocation(false);
      });
  }, [loadFavorites]);

  const handleSelectLocation = (location: Location) => {
    router.push(`/search?location=${encodeURIComponent(location.id)}`);
  };

  const handleFavoriteClick = (locationId: string) => {
    router.push(`/detail/${encodeURIComponent(locationId)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 sm:mb-8">
          날씨 앱
        </h1>

        <div className="mb-6 sm:mb-8">
          <LocationSearch onSelectLocation={handleSelectLocation} />
        </div>

        <section className="mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <FaMapMarkerAlt className="text-gray-600 dark:text-gray-400" />
            현재 위치
          </h2>
          {isLoadingLocation ? (
            <Loading text="위치를 가져오는 중..." />
          ) : locationError ? (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-yellow-800 dark:text-yellow-200">
                {locationError}
              </p>
              <p className="text-sm text-yellow-600 dark:text-yellow-300 mt-2">
                브라우저에서 위치 권한을 허용해주세요.
              </p>
            </div>
          ) : currentCoords ? (
            <WeatherCard
              location={{
                id: "current",
                name: "현재 위치",
                fullPath: "현재 위치",
                level: "시",
                coordinates: currentCoords,
              }}
              weather={currentWeather}
              isLoading={isLoadingWeather}
              error={
                !isLoadingWeather && !currentWeather
                  ? "날씨 정보를 가져올 수 없습니다"
                  : undefined
              }
            />
          ) : null}
        </section>

        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <FaHeart className="text-gray-600 dark:text-gray-400" />
              즐겨찾기
            </h2>
            {favorites.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                즐겨찾기를 추가하여 빠르게 날씨를 확인하세요
              </p>
            )}
          </div>

          {favorites.length === 0 ? (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                즐겨찾기가 없습니다
              </p>
              <Button
                variant="primary"
                onClick={() => router.push("/search")}
              >
                장소 검색하기
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((favorite) => (
                <FavoriteCard
                  key={favorite.id}
                  favorite={favorite}
                  onClick={() => handleFavoriteClick(favorite.id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
