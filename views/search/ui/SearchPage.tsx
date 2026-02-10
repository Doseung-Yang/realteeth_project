"use client";

import { useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { IoArrowBack, IoSearch } from "react-icons/io5";
import { LocationSearch } from "@/features/location-search/ui/LocationSearch";
import { useLocationById } from "@/shared/lib/useLocationById";
import { Location } from "@/entities/location/model/types";
import { WeatherCard } from "@/features/weather-display/ui/WeatherCard";
import { useWeatherQuery } from "@/entities/weather/api/useWeatherQuery";
import { FavoriteToggle } from "@/entities/favorite/ui/FavoriteToggle";
import { MESSAGES } from "@/shared/config/messages";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Loading } from "@/shared/ui/Loading";
import { PageLayout } from "@/shared/ui/PageLayout";

export const SearchPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locationIdParam = searchParams?.get("location") ?? null;
  const locationId = locationIdParam ? decodeURIComponent(locationIdParam) : null;
  const locationState = useLocationById(locationId);
  const selectedLocation = locationState === "loading" ? null : locationState;

  const { data: weather, isLoading } = useWeatherQuery(
    selectedLocation?.coordinates?.lat || 0,
    selectedLocation?.coordinates?.lon || 0
  );

  const handleSelectLocation = useCallback(
    (location: Location) => {
      router.push(`/search?location=${encodeURIComponent(location.id)}`);
    },
    [router]
  );

  return (
    <PageLayout>
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

        {locationState === "loading" ? (
          <Loading text="장소 정보를 불러오는 중..." />
        ) : selectedLocation ? (
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
                    ? MESSAGES.LOCATION_NOT_AVAILABLE
                    : !isLoading && !weather
                    ? MESSAGES.WEATHER_FETCH_FAILED
                    : undefined
                }
              />

              {selectedLocation.coordinates && (
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/detail/${encodeURIComponent(selectedLocation.id)}`}
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                  >
                    상세 정보 보기
                  </Link>
                </div>
              )}
            </Card>
          </div>
        ) : (
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
    </PageLayout>
  );
};
