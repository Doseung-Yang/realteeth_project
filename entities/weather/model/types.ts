export interface WeatherData {
  location: {
    name: string;
    coordinates: {
      lat: number;
      lon: number;
    };
  };
  current: {
    temp: number;
    description: string;
    humidity: number;
    windSpeed: number;
  };
  daily: {
    min: number;
    max: number;
  };
  hourly: Array<{
    time: string;
    temp: number;
  }>;
}

export interface WeatherApiError {
  message: string;
  code?: string;
}
