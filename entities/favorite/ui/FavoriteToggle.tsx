"use client";

import React, { useCallback } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { Button } from "@/shared/ui/Button";
import { useFavoriteStore } from "@/entities/favorite/model/store";
import { Location } from "@/entities/location/model/types";

interface FavoriteToggleProps {
  location: Location;
  size?: "sm" | "md" | "lg";
}

export const FavoriteToggle: React.FC<FavoriteToggleProps> = ({
  location,
  size = "md",
}) => {
  const { isFavorite, addFavorite, removeFavorite, favorites, maxFavorites } =
    useFavoriteStore();

  const isFav = isFavorite(location.id);
  const isMaxReached = favorites.length >= maxFavorites && !isFav;

  const handleToggle = useCallback(() => {
    if (isFav) {
      removeFavorite(location.id);
    } else {
      if (favorites.length < maxFavorites) {
        addFavorite(location);
      }
    }
  }, [isFav, favorites.length, maxFavorites, location.id, removeFavorite, addFavorite]);

  return (
    <Button
      variant={isFav ? "danger" : "secondary"}
      size={size}
      onClick={handleToggle}
      disabled={isMaxReached}
      icon={isFav ? FaStar : FaRegStar}
      title={
        isMaxReached
          ? `즐겨찾기는 최대 ${maxFavorites}개까지 추가할 수 있습니다`
          : isFav
          ? "즐겨찾기에서 제거"
          : "즐겨찾기에 추가"
      }
      className={`transition-all duration-200 ${
        isFav ? "hover:scale-110" : "hover:scale-105"
      }`}
    />
  );
};
