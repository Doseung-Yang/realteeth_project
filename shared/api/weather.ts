import axios from "axios";
import type { WeatherData, WeatherApiError } from "@/entities/weather/model/types";
import {
  WeatherApiEnum,
  WeatherCacheEnum,
  WeatherTimeEnum,
  WeatherTimeEnumValues,
  WeatherMockEnum,
  WeatherMockEnumValues,
  WeatherGridEnum,
  WeatherGridEnumValues,
} from "./weatherEnum";

class WeatherApiClient {
  private baseUrl: string;
  private serviceKey: string;

  constructor() {
    this.baseUrl =
      process.env.NEXT_PUBLIC_WEATHER_API_URL ||
      "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0";
    this.serviceKey =
      process.env.NEXT_PUBLIC_WEATHER_API_KEY || "";
  }

  async getWeatherByCoordinates(
    lat: number,
    lon: number
  ): Promise<WeatherData> {
    try {
      const grid = this.convertToGrid(lat, lon);
      
      if (!this.serviceKey || this.serviceKey === "") {
        return this.getMockWeatherData(lat, lon);
      }
      
      const response = await axios.get(
        `${this.baseUrl}/getVilageFcst`,
        {
          params: {
            serviceKey: this.serviceKey,
            pageNo: WeatherApiEnum.PAGE_NO,
            numOfRows: WeatherApiEnum.NUM_OF_ROWS,
            dataType: "JSON",
            base_date: this.getBaseDate(),
            base_time: this.getBaseTime(),
            nx: grid.nx,
            ny: grid.ny,
          },
        }
      );

      return this.parseWeatherData(response.data, lat, lon);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw {
          message: error.message,
          code: error.code,
        } as WeatherApiError;
      }
      throw {
        message: "날씨 정보를 가져오는 중 오류가 발생했습니다.",
      } as WeatherApiError;
    }
  }

  private getMockWeatherData(lat: number, lon: number): WeatherData {
    const hourly: Array<{ time: string; temp: number }> = [];
    const baseTemp = WeatherMockEnum.BASE_TEMP;
    
    for (let i = 0; i < WeatherTimeEnum.HOURS_PER_DAY; i++) {
      hourly.push({
        time: `${String(i).padStart(2, "0")}:00`,
        temp: baseTemp + Math.sin((i / WeatherTimeEnum.HOURS_PER_DAY) * Math.PI * 2) * 5 + Math.random() * 3,
      });
    }

    const temps = hourly.map((h) => h.temp);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);

    return {
      location: {
        name: "",
        coordinates: { lat, lon },
      },
      current: {
        temp: hourly[new Date().getHours()]?.temp || baseTemp,
        description: "맑음",
        humidity: WeatherMockEnum.HUMIDITY,
        windSpeed: WeatherMockEnumValues.WIND_SPEED,
      },
      daily: {
        min: minTemp,
        max: maxTemp,
      },
      hourly,
    };
  }

  async getWeatherByLocationName(locationName: string): Promise<WeatherData> {
    throw {
      message: "위치 이름으로 조회하는 기능은 아직 구현되지 않았습니다.",
    } as WeatherApiError;
  }

  private convertToGrid(lat: number, lon: number): { nx: number; ny: number } {
    const RE = 6371.00877;
    const GRID = WeatherGridEnumValues.DISTANCE_KM;
    const SLAT1 = WeatherGridEnumValues.PROJECTION_LAT1;
    const SLAT2 = WeatherGridEnumValues.PROJECTION_LAT2;
    const OLON = WeatherGridEnumValues.BASE_LON;
    const OLAT = WeatherGridEnumValues.BASE_LAT;
    const XO = WeatherGridEnum.BASE_X;
    const YO = WeatherGridEnum.BASE_Y;

    const DEGRAD = Math.PI / 180.0;
    const RADDEG = 180.0 / Math.PI;

    const re = RE / GRID;
    const slat1 = SLAT1 * DEGRAD;
    const slat2 = SLAT2 * DEGRAD;
    const olon = OLON * DEGRAD;
    const olat = OLAT * DEGRAD;

    let sn =
      Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
      Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
    let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
    let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    ro = (re * sf) / Math.pow(ro, sn);

    let ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5);
    ra = (re * sf) / Math.pow(ra, sn);
    let theta = lon * DEGRAD - olon;
    if (theta > Math.PI) theta -= 2.0 * Math.PI;
    if (theta < -Math.PI) theta += 2.0 * Math.PI;
    theta *= sn;

    const nx = Math.floor(ra * Math.sin(theta) + XO + 0.5);
    const ny = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);

    return { nx, ny };
  }

  private getBaseDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
  }

  private getBaseTime(): string {
    const now = new Date();
    const hour = now.getHours();
    const BASE_HOURS = WeatherTimeEnumValues.BASE_HOURS;
    let baseHour: typeof BASE_HOURS[number] = BASE_HOURS[0];

    if (hour < BASE_HOURS[0]) {
      baseHour = BASE_HOURS[BASE_HOURS.length - 1];
    } else {
      for (let i = BASE_HOURS.length - 1; i >= 0; i--) {
        if (hour >= BASE_HOURS[i]) {
          baseHour = BASE_HOURS[i];
          break;
        }
      }
    }

    return String(baseHour).padStart(2, "0") + "00";
  }

  private parseWeatherData(
    data: any,
    lat: number,
    lon: number
  ): WeatherData {
    const items = data?.response?.body?.items?.item || [];
    
    const currentTemp = this.findItem(items, "TMP", "1");
    const minTemp = this.findItem(items, "TMN", "1");
    const maxTemp = this.findItem(items, "TMX", "1");
    const sky = this.findItem(items, "SKY", "1");
    const pty = this.findItem(items, "PTY", "1");
    const humidity = this.findItem(items, "REH", "1");
    const windSpeed = this.findItem(items, "WSD", "1");

    const hourly: Array<{ time: string; temp: number }> = [];
    for (let i = 1; i <= WeatherTimeEnum.HOURS_PER_DAY; i++) {
      const temp = this.findItem(items, "TMP", String(i));
      if (temp) {
        hourly.push({
          time: `${String(i).padStart(2, "0")}:00`,
          temp: parseFloat(temp),
        });
      }
    }

    return {
      location: {
        name: "",
        coordinates: { lat, lon },
      },
      current: {
        temp: currentTemp ? parseFloat(currentTemp) : 0,
        description: this.getWeatherDescription(sky, pty),
        humidity: humidity ? parseFloat(humidity) : 0,
        windSpeed: windSpeed ? parseFloat(windSpeed) : 0,
      },
      daily: {
        min: minTemp ? parseFloat(minTemp) : 0,
        max: maxTemp ? parseFloat(maxTemp) : 0,
      },
      hourly,
    };
  }

  private findItem(items: any[], category: string, fcstTime: string): string | null {
    const item = items.find(
      (i: any) => i.category === category && i.fcstTime === fcstTime.padStart(2, "0") + "00"
    );
    return item?.fcstValue || null;
  }

  private getWeatherDescription(sky: string | null, pty: string | null): string {
    if (pty === "1" || pty === "2" || pty === "3" || pty === "4") {
      return "비";
    }
    if (sky === "1") return "맑음";
    if (sky === "3") return "구름많음";
    if (sky === "4") return "흐림";
    return "알 수 없음";
  }
}

export const weatherApi = new WeatherApiClient();
