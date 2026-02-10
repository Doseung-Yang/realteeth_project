"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { Input } from "@/shared/ui/Input";
import { ensureSearchIndex, searchLocations, formatLocationName } from "@/shared/lib/locationSearch";
import { Location } from "@/entities/location/model/types";
import { SearchEnum } from "@/shared/lib/searchEnum";
import { useSearchHistoryStore } from "@/entities/search/model/store";
import { SearchHistory } from "./SearchHistory";

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
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [indexReady, setIndexReady] = useState(false);
  const [indexLoading, setIndexLoading] = useState(false);
  const loadStartedRef = useRef(false);
  const { addToHistory } = useSearchHistoryStore();

  const ensureIndex = useCallback(() => {
    if (indexReady || loadStartedRef.current) return;
    loadStartedRef.current = true;
    setIndexLoading(true);
    ensureSearchIndex().then(() => {
      setIndexReady(true);
      setIndexLoading(false);
    });
  }, [indexReady]);

  const searchResults = useMemo(() => {
    if (!indexReady || !query.trim() || query.length < SearchEnum.MIN_LENGTH) {
      return [];
    }
    return searchLocations(query, SearchEnum.DISPLAY_LIMIT);
  }, [indexReady, query]);

  const handleSelect = useCallback(
    (location: Location) => {
      addToHistory(location);
      onSelectLocation(location);
      setQuery("");
      setIsOpen(false);
      setSelectedIndex(-1);
    },
    [onSelectLocation, addToHistory]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen || searchResults.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault();
        handleSelect(searchResults[selectedIndex]);
      } else if (e.key === "Escape") {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    },
    [isOpen, searchResults, selectedIndex, handleSelect]
  );

  return (
    <div className="relative w-full">
      <Input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
          setSelectedIndex(-1);
        }}
        onFocus={() => {
          ensureIndex();
          setIsOpen(true);
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full"
        aria-label="장소 검색"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        role="combobox"
      />

      {isOpen && indexLoading && (
        <div
          className="absolute w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-500 dark:text-gray-400"
          style={{ zIndex }}
        >
          검색 데이터 불러오는 중...
        </div>
      )}

      {isOpen && !indexLoading && searchResults.length > 0 && (
        <div 
          className="absolute w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200"
          style={{ zIndex, maxHeight: `${maxHeight}rem` }}
          role="listbox"
          aria-label="검색 결과"
        >
          {searchResults.map((location, index) => (
            <div
              key={location.id}
              className={`px-4 py-2 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors ${
                index === selectedIndex
                  ? "bg-blue-50 dark:bg-blue-900/30"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
              onClick={() => handleSelect(location)}
              role="option"
              aria-selected={index === selectedIndex}
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

      {isOpen && !indexLoading && query.length >= SearchEnum.MIN_LENGTH && searchResults.length === 0 && (
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

      {!isOpen && query.length === 0 && (
        <SearchHistory onSelectLocation={handleSelect} />
      )}
    </div>
  );
};
