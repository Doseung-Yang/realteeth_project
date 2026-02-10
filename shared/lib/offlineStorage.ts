import { WeatherData } from "@/entities/weather/model/types";

const OFFLINE_STORAGE_KEY = "offline-weather-data";
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

interface OfflineWeatherData {
  data: WeatherData;
  timestamp: number;
  lat: number;
  lon: number;
}

export function saveOfflineWeatherData(
  lat: number,
  lon: number,
  data: WeatherData
): void {
  if (typeof window === "undefined") return;
  
  try {
    const offlineData: OfflineWeatherData = {
      data,
      timestamp: Date.now(),
      lat,
      lon,
    };
    localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(offlineData));
  } catch (error) {
    console.error("Failed to save offline weather data:", error);
  }
}

export function getOfflineWeatherData(
  lat: number,
  lon: number
): WeatherData | null {
  if (typeof window === "undefined") return null;
  
  try {
    const stored = localStorage.getItem(OFFLINE_STORAGE_KEY);
    if (!stored) return null;

    const offlineData: OfflineWeatherData = JSON.parse(stored);
    const age = Date.now() - offlineData.timestamp;

    if (age > MAX_AGE_MS) {
      localStorage.removeItem(OFFLINE_STORAGE_KEY);
      return null;
    }

    if (
      Math.abs(offlineData.lat - lat) < 0.01 &&
      Math.abs(offlineData.lon - lon) < 0.01
    ) {
      return offlineData.data;
    }

    return null;
  } catch (error) {
    console.error("Failed to get offline weather data:", error);
    return null;
  }
}

export function isOnline(): boolean {
  if (typeof window === "undefined") return true;
  return typeof navigator !== "undefined" && navigator.onLine;
}
