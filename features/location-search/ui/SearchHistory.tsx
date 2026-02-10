"use client";

import { useSearchHistoryStore } from "@/entities/search/model/store";
import { formatLocationName } from "@/shared/lib/locationSearch";
import { Location } from "@/entities/location/model/types";
import { FaTimes, FaHistory } from "react-icons/fa";

interface SearchHistoryProps {
  onSelectLocation: (location: Location) => void;
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({ onSelectLocation }) => {
  const { history, removeFromHistory, clearHistory } = useSearchHistoryStore();

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <FaHistory className="text-gray-500 dark:text-gray-400" size={14} />
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            최근 검색
          </h3>
        </div>
        <button
          onClick={clearHistory}
          className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          전체 삭제
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {history.map((location) => (
          <div
            key={location.id}
            className="group flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            onClick={() => onSelectLocation(location)}
          >
            <span className="text-gray-700 dark:text-gray-300">
              {formatLocationName(location)}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFromHistory(location.id);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FaTimes className="text-gray-500 dark:text-gray-400" size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
