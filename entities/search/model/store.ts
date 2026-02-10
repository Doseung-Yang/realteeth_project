import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Location } from "@/entities/location/model/types";

interface SearchHistoryState {
  history: Location[];
  maxHistorySize: number;
  addToHistory: (location: Location) => void;
  removeFromHistory: (locationId: string) => void;
  clearHistory: () => void;
}

export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set) => ({
      history: [],
      maxHistorySize: 10,
      addToHistory: (location) => {
        set((state) => {
          const filtered = state.history.filter((item) => item.id !== location.id);
          const newHistory = [location, ...filtered].slice(0, state.maxHistorySize);
          return { history: newHistory };
        });
      },
      removeFromHistory: (locationId) => {
        set((state) => ({
          history: state.history.filter((item) => item.id !== locationId),
        }));
      },
      clearHistory: () => {
        set({ history: [] });
      },
    }),
    {
      name: "search-history-storage",
    }
  )
);
