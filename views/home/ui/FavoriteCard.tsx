"use client";

import { useState } from "react";
import { FaEdit, FaTimes } from "react-icons/fa";
import { FavoriteLocation } from "@/entities/favorite/model/types";
import { useWeatherQuery } from "@/entities/weather/api/useWeatherQuery";
import { WeatherCard } from "@/features/weather-display/ui/WeatherCard";
import { FavoriteEdit } from "@/features/favorite-edit/ui/FavoriteEdit";
import { useFavoriteStore } from "@/entities/favorite/model/store";
import { Card } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";

interface FavoriteCardProps {
  favorite: FavoriteLocation;
  onClick: () => void;
}

export const FavoriteCard: React.FC<FavoriteCardProps> = ({
  favorite,
  onClick,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const { removeFavorite } = useFavoriteStore();
  const hasCoordinates = !!favorite.coordinates;
  const { data: weather, isLoading } = useWeatherQuery(
    favorite.coordinates?.lat || 0,
    favorite.coordinates?.lon || 0
  );

  if (isEditing) {
    return (
      <Card>
        <FavoriteEdit
          favorite={favorite}
          onClose={() => setIsEditing(false)}
        />
      </Card>
    );
  }

  return (
    <div className="relative">
      <WeatherCard
        location={favorite}
        weather={weather}
        isLoading={isLoading && hasCoordinates}
        error={
          !hasCoordinates
            ? "좌표 정보가 없습니다"
            : !isLoading && !weather
            ? "날씨 정보를 가져올 수 없습니다"
            : undefined
        }
        onClick={onClick}
      />
      <div className="absolute top-2 right-2 flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          icon={FaEdit}
          title="별칭 수정"
        />
        <Button
          variant="danger"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            removeFavorite(favorite.id);
          }}
          icon={FaTimes}
          title="즐겨찾기 제거"
        />
      </div>
      {favorite.alias && (
        <div className="absolute bottom-2 left-8 transform -translate-x-1/2">
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded">
            {favorite.alias}
          </span>
        </div>
      )}
    </div>
  );
};
