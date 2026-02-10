"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IoArrowBack, IoSearch } from "react-icons/io5";
import { LocationSearch } from "@/features/location-search/ui/LocationSearch";
import { getLocationById } from "@/shared/lib/locationSearch";
import { Location } from "@/entities/location/model/types";
import { WeatherCard } from "@/features/weather-display/ui/WeatherCard";
import { useWeatherQuery } from "@/entities/weather/api/useWeatherQuery";
import { FavoriteToggle } from "@/entities/favorite/ui/FavoriteToggle";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";

export const SearchPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locationId = searchParams?.get("location") || null;

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  useEffect(() => {
    if (locationId) {
      const location = getLocationById(decodeURIComponent(locationId));
      setSelectedLocation(location);
    }
  }, [locationId]);

  const { data: weather, isLoading } = useWeatherQuery(
    selectedLocation?.coordinates?.lat || 0,
    selectedLocation?.coordinates?.lon || 0
  );

  const handleSelectLocation = (location: Location) => {
    setSelectedLocation(location);
    router.push(`/search?location=${encodeURIComponent(location.id)}`);
  };

  const handleViewDetails = () => {
    if (selectedLocation) {
      router.push(`/detail/${encodeURIComponent(selectedLocation.id)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-4xl">
        <div className="mb-6">
          <Button variant="secondary" onClick={() => router.back()} icon={IoArrowBack}>
            뒤로가기
          </Button>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 sm:mb-8 flex items-center gap-2">
          <IoSearch className="text-gray-600 dark:text-gray-400" />
          장소 검색
        </h1>

        <div className="mb-6 sm:mb-8">
          <LocationSearch onSelectLocation={handleSelectLocation} />
        </div>

        {selectedLocation && (
          <div className="space-y-4">
            <Card>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                  선택한 장소
                </h2>
                <FavoriteToggle location={selectedLocation} />
              </div>

              <WeatherCard
                location={selectedLocation}
                weather={weather}
                isLoading={isLoading && !!selectedLocation.coordinates}
                error={
                  !selectedLocation.coordinates
                    ? "해당 장소의 정보가 제공되지 않습니다."
                    : !isLoading && !weather
                    ? "날씨 정보를 가져올 수 없습니다"
                    : undefined
                }
              />

              {selectedLocation.coordinates && (
                <div className="mt-4 flex gap-2">
                  <Button variant="primary" onClick={handleViewDetails}>
                    상세 정보 보기
                  </Button>
                </div>
              )}
            </Card>
          </div>
        )}

        {!selectedLocation && (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                검색어를 입력하여 장소를 찾아보세요
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                예: 서울특별시, 종로구, 청운동
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
