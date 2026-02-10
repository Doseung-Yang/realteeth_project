import { Location } from "@/entities/location/model/types";
import { enrichLocationWithCoordinates } from "./locationCoordinates";
import { SearchEnum } from "./searchEnum";

let searchIndex: Map<string, Location[]> | null = null;
let districtsCache: string[] | null = null;


export function districtToLocation(district: string): Location {
  const parts = district.split("-");
  const baseLocation = {
    id: district,
    name: parts[parts.length - 1],
    fullPath: district,
    level: (parts.length === 1 ? "시" : parts.length === 2 ? "구" : "동") as "시" | "구" | "동",
  };
  const enriched = enrichLocationWithCoordinates(baseLocation);
  return {
    ...enriched,
    level: baseLocation.level,
  };
}

const createSearchIndex = (districts: string[]): Map<string, Location[]> => {
  const index = new Map<string, Location[]>();

  districts.forEach((district) => {
    const location = districtToLocation(district);
    const parts = district.split("-");

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

async function loadSearchIndex(): Promise<void> {
  if (searchIndex !== null) return;
  const mod = await import("./data/korea_districts.json");
  const districts = mod.default as string[];
  districtsCache = districts;
  searchIndex = createSearchIndex(districts);
}

export async function ensureSearchIndex(): Promise<void> {
  return loadSearchIndex();
}

export function searchLocations(
  query: string,
  limit: number = SearchEnum.RESULT_LIMIT
): Location[] {
  if (searchIndex === null) return [];
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

export async function getLocationById(id: string): Promise<Location | null> {
  await loadSearchIndex();
  if (!districtsCache) return null;

  const district = districtsCache.find((d) => d === id);
  if (!district) return null;

  return districtToLocation(district);
}

export function formatLocationName(location: Location): string {
  return location.fullPath.replace(/-/g, " ");
}
