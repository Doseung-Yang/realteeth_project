"use client";

import { useEffect, useState } from "react";
import { Location } from "@/entities/location/model/types";
import { getLocationById } from "./locationSearch";

export type LocationByIdState = Location | null | "loading";

export function useLocationById(locationId: string | null): LocationByIdState {
  const [location, setLocation] = useState<LocationByIdState>(
    locationId ? "loading" : null
  );

  useEffect(() => {
    if (!locationId) {
      setLocation(null);
      return;
    }

    let cancelled = false;
    setLocation("loading");

    getLocationById(locationId).then((loc) => {
      if (!cancelled) {
        setLocation(loc);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [locationId]);

  return location;
}
