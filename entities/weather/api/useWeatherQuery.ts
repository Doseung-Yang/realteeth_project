"use client";

import { useQuery } from "@tanstack/react-query";
import { weatherApi, WeatherData, WeatherApiError } from "@/shared/api/weather";
import { WeatherCacheEnum } from "@/shared/api/weatherEnum";

export function useWeatherQuery(lat: number, lon: number) {
  return useQuery<WeatherData, WeatherApiError>({
    queryKey: ["weather", lat, lon],
    queryFn: () => weatherApi.getWeatherByCoordinates(lat, lon),
    enabled: !!lat && !!lon,
    staleTime: WeatherCacheEnum.STALE_TIME_MS,
  });
}
