export enum WeatherApiEnum {
  NUM_OF_ROWS = 1000,
  PAGE_NO = 1,
}

export enum WeatherCacheEnum {
  STALE_TIME_MS = 5 * 60 * 1000,
}

export enum WeatherTimeEnum {
  HOURS_PER_DAY = 24,
}

export const WeatherTimeEnumValues = {
  BASE_HOURS: [2, 5, 8, 11, 14, 17, 20, 23] as const,
} as const;

export enum WeatherMockEnum {
  BASE_TEMP = 15,
  HUMIDITY = 60,
}

export const WeatherMockEnumValues = {
  WIND_SPEED: 2.5,
} as const;

export enum WeatherGridEnum {
  BASE_X = 43,
  BASE_Y = 136,
}

export const WeatherGridEnumValues = {
  DISTANCE_KM: 5.0,
  PROJECTION_LAT1: 30.0,
  PROJECTION_LAT2: 60.0,
  BASE_LON: 126.0,
  BASE_LAT: 38.0,
} as const;
