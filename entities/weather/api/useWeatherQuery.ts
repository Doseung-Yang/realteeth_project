"use client";

import { useQuery } from "@tanstack/react-query";
import type { WeatherData, WeatherApiError } from "@/entities/weather/model/types";
import { weatherApi } from "@/shared/api/weather";
import { WeatherCacheEnum } from "@/shared/api/weatherEnum";
import { getOfflineWeatherData, saveOfflineWeatherData, isOnline } from "@/shared/lib/offlineStorage";

export function useWeatherQuery(lat: number, lon: number) {
  return useQuery<WeatherData, WeatherApiError>({
    queryKey: ["weather", lat, lon],
    queryFn: async () => {
      try {
        const data = await weatherApi.getWeatherByCoordinates(lat, lon);
        if (isOnline()) {
          saveOfflineWeatherData(lat, lon, data);
        }
        return data;
      } catch (error) {
        if (!isOnline()) {
          const offlineData = getOfflineWeatherData(lat, lon);
          if (offlineData) {
            return offlineData;
          }
        }
        throw error;
      }
    },
    enabled: !!lat && !!lon,
    staleTime: WeatherCacheEnum.STALE_TIME_MS,
    initialData: () => {
      if (!isOnline()) {
        return getOfflineWeatherData(lat, lon) || undefined;
      }
      return undefined;
    },
  });
}
