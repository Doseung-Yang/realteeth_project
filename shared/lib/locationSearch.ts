import districtsData from "./data/korea_districts.json";
import { Location } from "@/entities/location/model/types";
import { enrichLocationWithCoordinates } from "./locationCoordinates";
import { SearchEnum } from "./searchEnum";

const districts: string[] = districtsData as string[];

const createSearchIndex = (districts: string[]): Map<string, Location[]> => {
  const index = new Map<string, Location[]>();

  districts.forEach((district) => {
    const parts = district.split("-");
    const baseLocation = {
      id: district,
      name: parts[parts.length - 1],
      fullPath: district,
      level: (parts.length === 1 ? "시" : parts.length === 2 ? "구" : "동") as "시" | "구" | "동",
    };
    const enriched = enrichLocationWithCoordinates(baseLocation);
    const location: Location = {
      ...enriched,
      level: baseLocation.level,
    };

    parts.forEach((part) => {
      const key = part.toLowerCase();
      if (!index.has(key)) {
        index.set(key, []);
      }
      index.get(key)!.push(location);
    });

    const fullKey = district.toLowerCase();
    if (!index.has(fullKey)) {
      index.set(fullKey, []);
    }
    index.get(fullKey)!.push(location);
  });

  return index;
};

const searchIndex = createSearchIndex(districts);

export function searchLocations(
  query: string,
  limit: number = SearchEnum.RESULT_LIMIT
): Location[] {
  if (!query.trim()) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();
  
  if (normalizedQuery.length < SearchEnum.MIN_LENGTH) {
    return [];
  }
  
  const results: Location[] = [];
  const seen = new Set<string>();

  if (searchIndex.has(normalizedQuery)) {
    const exactMatches = searchIndex.get(normalizedQuery)!;
    exactMatches.forEach((location) => {
      if (!seen.has(location.id)) {
        seen.add(location.id);
        results.push(location);
      }
    });
  }

  searchIndex.forEach((locations, key) => {
    if (key.includes(normalizedQuery) && results.length < limit) {
      locations.forEach((location) => {
        if (!seen.has(location.id) && results.length < limit) {
          seen.add(location.id);
          results.push(location);
        }
      });
    }
  });

  return results.slice(0, limit);
}

export function getLocationById(id: string): Location | null {
  const location = districts.find((d) => d === id);
  if (!location) return null;

  const parts = location.split("-");
  const baseLocation = {
    id: location,
    name: parts[parts.length - 1],
    fullPath: location,
    level: (parts.length === 1 ? "시" : parts.length === 2 ? "구" : "동") as "시" | "구" | "동",
  };
  const enriched = enrichLocationWithCoordinates(baseLocation);
  return {
    ...enriched,
    level: baseLocation.level,
  } as Location;
}

export function formatLocationName(location: Location): string {
  return location.fullPath.replace(/-/g, " ");
}
