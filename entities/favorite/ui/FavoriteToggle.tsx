"use client";

import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { Button } from "@/shared/ui/Button";
import { useFavoriteStore } from "../model/store";
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

  const handleToggle = () => {
    if (isFav) {
      removeFavorite(location.id);
    } else {
      if (favorites.length < maxFavorites) {
        addFavorite(location);
      }
    }
  };

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
    />
  );
};
