"use client";

import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useCallback } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useLocationById } from "@/shared/lib/useLocationById";
import { useWeatherQuery } from "@/entities/weather/api/useWeatherQuery";
import { WeatherCard } from "@/features/weather-display/ui/WeatherCard";
import { FavoriteToggle } from "@/entities/favorite/ui/FavoriteToggle";
import { MESSAGES } from "@/shared/config/messages";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Loading } from "@/shared/ui/Loading";
import { PageLayout } from "@/shared/ui/PageLayout";
import { Skeleton } from "@/shared/ui/Skeleton";
import { Location } from "@/entities/location/model/types";

const TemperatureChart = dynamic(
  () =>
    import("@/features/weather-display/ui/TemperatureChart").then((mod) => ({
      default: mod.TemperatureChart,
    })),
  {
    loading: () => (
      <div className="space-y-3">
        <Skeleton height={24} width="40%" />
        <Skeleton height={200} className="w-full" />
      </div>
    ),
  }
);

const HourlyWeather = dynamic(
  () =>
    import("@/features/weather-display/ui/HourlyWeather").then((mod) => ({
      default: mod.HourlyWeather,
    })),
  {
    loading: () => (
      <div className="space-y-2">
        <Skeleton height={20} width="30%" />
        <div className="flex gap-2 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height={60} width={64} />
          ))}
        </div>
      </div>
    ),
  }
);

const WeatherGauge = dynamic<{
  label: string;
  value: number;
  max: number;
  unit: string;
  color?: "blue" | "green" | "yellow" | "red";
}>(
  () =>
    import("@/features/weather-display/ui/WeatherGauge").then((mod) => ({
      default: mod.WeatherGauge,
    })),
  {
    loading: () => <Skeleton height={80} width="100%" />,
  }
);

const ActivityRecommendation = dynamic(
  () =>
    import("@/features/weather-recommendation/ui/ActivityRecommendation").then(
      (mod) => ({ default: mod.ActivityRecommendation })
    ),
  {
    loading: () => (
      <div className="space-y-2">
        <Skeleton height={20} width="50%" />
        <Skeleton height={48} className="w-full" />
      </div>
    ),
  }
);

export const DetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const locationId = params?.locationId
    ? decodeURIComponent(params.locationId as string)
    : null;
  const location = useLocationById(locationId);

  const resolvedLocation = location === "loading" ? null : location;
  const { data: weather, isLoading, error, refetch } = useWeatherQuery(
    resolvedLocation?.coordinates?.lat || 0,
    resolvedLocation?.coordinates?.lon || 0
  );

  const handleBack = useCallback(() => router.back(), [router]);
  const handleRetry = useCallback(() => refetch(), [refetch]);

  const renderError = useCallback(
    (message: string) => (
      <PageLayout>
        <div className="mb-6">
          <Button variant="secondary" onClick={handleBack} icon={IoArrowBack}>
            뒤로가기
          </Button>
        </div>
        <Card>
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 font-medium mb-4">
              {message}
            </p>
            <Button variant="secondary" onClick={handleBack} icon={IoArrowBack}>
              뒤로가기
            </Button>
          </div>
        </Card>
      </PageLayout>
    ),
    [handleBack]
  );

  if (!params || !params.locationId) {
    return renderError(MESSAGES.LOCATION_NOT_AVAILABLE);
  }

  if (location === "loading" || !resolvedLocation) {
    return (
      <PageLayout>
        <div className="mb-6">
          <Button variant="secondary" onClick={handleBack} icon={IoArrowBack}>
            뒤로가기
          </Button>
        </div>
        <Loading text="장소 정보를 불러오는 중..." />
      </PageLayout>
    );
  }

  const displayLocation = resolvedLocation as Location;

  return (
    <PageLayout>
      <div className="mb-6">
          <Button variant="secondary" onClick={handleBack} icon={IoArrowBack}>
            뒤로가기
          </Button>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            날씨 상세 정보
          </h1>
          <FavoriteToggle location={displayLocation} />
        </div>

        {isLoading ? (
          <Loading text="날씨 정보를 불러오는 중..." />
        ) : error || !weather ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-red-600 dark:text-red-400 font-medium mb-2">
                {MESSAGES.WEATHER_FETCH_FAILED}
              </p>
              {error?.message && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {error.message}
                </p>
              )}
              <Button variant="primary" size="sm" onClick={handleRetry}>
                다시 시도
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            <WeatherCard
              location={displayLocation}
              weather={weather}
              showDetails={false}
              onRetry={handleRetry}
            />

            {weather.hourly.length > 0 && (
              <>
                <Card>
                  <TemperatureChart hourly={weather.hourly} />
                </Card>
                <Card>
                  <HourlyWeather hourly={weather.hourly} />
                </Card>
              </>
            )}

            <Card>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                추가 정보
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <WeatherGauge
                  label="습도"
                  value={weather.current.humidity}
                  max={100}
                  unit="%"
                  color="blue"
                />
                <WeatherGauge
                  label="풍속"
                  value={weather.current.windSpeed}
                  max={20}
                  unit="m/s"
                  color="green"
                />
              </div>
            </Card>

            <ActivityRecommendation weatherDescription={weather.current.description} />
          </div>
        )}
    </PageLayout>
  );
};
