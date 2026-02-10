export interface Location {
  id: string;
  name: string;
  fullPath: string;
  level: "시" | "구" | "동";
  coordinates?: {
    lat: number;
    lon: number;
  };
}

export interface LocationCoordinates {
  lat: number;
  lon: number;
}
