const locationCoordinates: Record<string, { lat: number; lon: number }> = {
  "서울특별시": { lat: 37.5665, lon: 126.978 },
  "서울특별시-종로구": { lat: 37.5735, lon: 126.9788 },
  "서울특별시-종로구-청운동": { lat: 37.5892, lon: 126.9706 },
  "부산광역시": { lat: 35.1796, lon: 129.0756 },
  "대구광역시": { lat: 35.8714, lon: 128.6014 },
  "인천광역시": { lat: 37.4563, lon: 126.7052 },
  "광주광역시": { lat: 35.1595, lon: 126.8526 },
  "대전광역시": { lat: 36.3504, lon: 127.3845 },
  "울산광역시": { lat: 35.5384, lon: 129.3114 },
  "세종특별자치시": { lat: 36.480, lon: 127.289 },
  "경기도": { lat: 37.4138, lon: 127.5183 },
  "강원도": { lat: 37.8228, lon: 128.1555 },
  "충청북도": { lat: 36.8001, lon: 127.7002 },
  "충청남도": { lat: 36.5184, lon: 126.8 },
  "전라북도": { lat: 35.7175, lon: 127.153 },
  "전라남도": { lat: 34.8679, lon: 126.991 },
  "경상북도": { lat: 36.4919, lon: 128.8889 },
  "경상남도": { lat: 35.4606, lon: 128.2132 },
  "제주특별자치도": { lat: 33.4996, lon: 126.5312 },
};

export function getLocationCoordinates(
  locationId: string
): { lat: number; lon: number } | null {
  if (locationCoordinates[locationId]) {
    return locationCoordinates[locationId];
  }

  const parts = locationId.split("-");
  for (let i = parts.length; i > 0; i--) {
    const partialId = parts.slice(0, i).join("-");
    if (locationCoordinates[partialId]) {
      return locationCoordinates[partialId];
    }
  }

  return null;
}

export function enrichLocationWithCoordinates<T extends { id: string }>(
  location: T
): T & { coordinates?: { lat: number; lon: number } } {
  const coords = getLocationCoordinates(location.id);
  return {
    ...location,
    coordinates: coords || undefined,
  };
}
