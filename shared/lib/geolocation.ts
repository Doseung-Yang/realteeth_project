import { GeolocationEnum } from "./geolocationEnum";

export interface Coordinates {
  lat: number;
  lon: number;
}

export function getCurrentLocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: GeolocationEnum.TIMEOUT_MS,
        maximumAge: 0,
      }
    );
  });
}
