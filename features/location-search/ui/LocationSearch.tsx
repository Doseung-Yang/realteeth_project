"use client";

import { useState, useMemo, useCallback } from "react";
import { Input } from "@/shared/ui/Input";
import { searchLocations, formatLocationName } from "@/shared/lib/locationSearch";
import { Location } from "@/entities/location/model/types";
import { SearchEnum } from "@/shared/lib/searchEnum";

interface LocationSearchProps {
  onSelectLocation: (location: Location) => void;
  placeholder?: string;
  zIndex?: number;
  maxHeight?: number;
}

const DEFAULT_PLACEHOLDER = "장소를 검색하세요 (예시 검색어: 서울특별시 종로구 청운동)";
const DEFAULT_Z_INDEX = 50;
const DEFAULT_MAX_HEIGHT = 60;

export const LocationSearch: React.FC<LocationSearchProps> = ({
  onSelectLocation,
  placeholder = DEFAULT_PLACEHOLDER,
  zIndex = DEFAULT_Z_INDEX,
  maxHeight = DEFAULT_MAX_HEIGHT,
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const searchResults = useMemo(() => {
    if (!query.trim() || query.length < SearchEnum.MIN_LENGTH) {
      return [];
    }
    return searchLocations(query, SearchEnum.DISPLAY_LIMIT);
  }, [query]);

  const handleSelect = useCallback(
    (location: Location) => {
      onSelectLocation(location);
      setQuery("");
      setIsOpen(false);
    },
    [onSelectLocation]
  );

  return (
    <div className="relative w-full">
      <Input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className="w-full"
      />

      {isOpen && searchResults.length > 0 && (
        <div 
          className="absolute w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-y-auto"
          style={{ zIndex, maxHeight: `${maxHeight}rem` }}
        >
          {searchResults.map((location) => (
            <div
              key={location.id}
              className="px-4 py-2 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
              onClick={() => handleSelect(location)}
            >
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {formatLocationName(location)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {location.level}
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && query.length >= SearchEnum.MIN_LENGTH && searchResults.length === 0 && (
        <div 
          className="absolute w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          style={{ zIndex }}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-2">
            검색 결과가 없습니다.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            시/구/동 단위로 검색해보세요
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-1">
            예시 검색어: 서울특별시 종로구 청운동
          </p>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0"
          style={{ zIndex: zIndex - 10 }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
