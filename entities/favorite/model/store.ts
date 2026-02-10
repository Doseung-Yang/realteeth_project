"use client";

import { create } from "zustand";
import { FavoriteLocation } from "./types";
import {
  saveToStorage,
  loadFromStorage,
} from "@/shared/lib/storage";
import { FavoriteEnum } from "./favoriteEnum";

interface FavoriteStore {
  favorites: FavoriteLocation[];
  maxFavorites: number;
  addFavorite: (location: Omit<FavoriteLocation, "addedAt"> & { addedAt?: number }) => boolean;
  removeFavorite: (locationId: string) => void;
  updateFavoriteAlias: (locationId: string, alias: string) => void;
  isFavorite: (locationId: string) => boolean;
  loadFavorites: () => void;
}

const STORAGE_KEY = "favorites";

export const useFavoriteStore = create<FavoriteStore>((set, get) => ({
  favorites: [],
  maxFavorites: FavoriteEnum.MAX_FAVORITES,

  loadFavorites: () => {
    const stored = loadFromStorage<FavoriteLocation[]>(STORAGE_KEY);
    if (stored) {
      set({ favorites: stored });
    }
  },

  addFavorite: (location) => {
    const state = get();
    if (state.favorites.length >= state.maxFavorites) {
      return false;
    }

    if (state.favorites.some((f) => f.id === location.id)) {
      return false;
    }

    const newFavorite: FavoriteLocation = {
      ...location,
      addedAt: Date.now(),
    } as FavoriteLocation;

    const updated = [...state.favorites, newFavorite];
    set({ favorites: updated });
    saveToStorage(STORAGE_KEY, updated);
    return true;
  },

  removeFavorite: (locationId) => {
    const state = get();
    const updated = state.favorites.filter((f) => f.id !== locationId);
    set({ favorites: updated });
    saveToStorage(STORAGE_KEY, updated);
  },

  updateFavoriteAlias: (locationId, alias) => {
    const state = get();
    const updated = state.favorites.map((f) =>
      f.id === locationId ? { ...f, alias } : f
    );
    set({ favorites: updated });
    saveToStorage(STORAGE_KEY, updated);
  },

  isFavorite: (locationId) => {
    return get().favorites.some((f) => f.id === locationId);
  },
}));
