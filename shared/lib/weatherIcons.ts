import {
  FaSun,
  FaCloud,
  FaCloudRain,
  FaSnowflake,
  FaBolt,
  FaSmog,
} from "react-icons/fa";
import { IconType } from "react-icons";

export type WeatherCondition =
  | "맑음"
  | "구름많음"
  | "흐림"
  | "비"
  | "소나기"
  | "비/눈"
  | "눈"
  | "눈비"
  | "천둥번개"
  | "안개";

const weatherIconMap: Record<string, IconType> = {
  맑음: FaSun,
  구름많음: FaCloud,
  흐림: FaCloud,
  비: FaCloudRain,
  소나기: FaCloudRain,
  "비/눈": FaCloudRain,
  눈: FaSnowflake,
  눈비: FaSnowflake,
  천둥번개: FaBolt,
  안개: FaSmog,
};

export function getWeatherIcon(description: string): IconType {
  const normalized = description.trim();
  
  for (const [key, icon] of Object.entries(weatherIconMap)) {
    if (normalized.includes(key)) {
      return icon;
    }
  }
  
  return FaSun;
}

export function getWeatherIconColor(description: string): string {
  const normalized = description.trim();
  
  if (normalized.includes("맑음")) {
    return "text-yellow-500";
  }
  if (normalized.includes("구름") || normalized.includes("흐림")) {
    return "text-gray-500";
  }
  if (normalized.includes("비") || normalized.includes("소나기")) {
    return "text-blue-500";
  }
  if (normalized.includes("눈")) {
    return "text-blue-300";
  }
  if (normalized.includes("천둥")) {
    return "text-purple-500";
  }
  if (normalized.includes("안개")) {
    return "text-gray-400";
  }
  
  return "text-gray-600 dark:text-gray-400";
}
