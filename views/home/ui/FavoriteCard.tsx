"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import { FaEdit, FaTimes } from "react-icons/fa";
import { FavoriteLocation } from "@/entities/favorite/model/types";
import { useWeatherQuery } from "@/entities/weather/api/useWeatherQuery";
import { WeatherCard } from "@/features/weather-display/ui/WeatherCard";
import { FavoriteEdit } from "@/features/favorite-edit/ui/FavoriteEdit";
import { useFavoriteStore } from "@/entities/favorite/model/store";
import { MESSAGES } from "@/shared/config/messages";
import { Card } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";

interface FavoriteCardProps {
  favorite: FavoriteLocation;
}

const FavoriteCardComponent: React.FC<FavoriteCardProps> = ({ favorite }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { removeFavorite } = useFavoriteStore();
  const hasCoordinates = !!favorite.coordinates;
  const { data: weather, isLoading, refetch } = useWeatherQuery(
    favorite.coordinates?.lat || 0,
    favorite.coordinates?.lon || 0
  );

  const handleRetry = useCallback(() => refetch(), [refetch]);
  const handleCloseEdit = useCallback(() => setIsEditing(false), []);

  if (isEditing) {
    return (
      <Card>
        <FavoriteEdit
          favorite={favorite}
          onClose={handleCloseEdit}
        />
      </Card>
    );
  }

  return (
    <div className="group transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between mb-2 px-1 min-h-[32px]">
        {favorite.alias ? (
          <span className="text-xs font-medium text-blue-600 dark:text-blue-400 px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded">
            {favorite.alias}
          </span>
        ) : (
          <div />
        )}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            icon={FaEdit}
            title="별칭 수정"
            className="!px-2 !py-1.5"
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
            className="!px-2 !py-1.5"
          />
        </div>
      </div>
      <Link
        href={`/detail/${encodeURIComponent(favorite.id)}`}
        className="block"
      >
        <WeatherCard
          location={favorite}
          weather={weather}
          isLoading={isLoading && hasCoordinates}
          error={
            !hasCoordinates
              ? MESSAGES.NO_COORDINATES
              : !isLoading && !weather
              ? MESSAGES.WEATHER_FETCH_FAILED
              : undefined
          }
          onRetry={hasCoordinates ? handleRetry : undefined}
        />
      </Link>
    </div>
  );
};

export const FavoriteCard = React.memo(FavoriteCardComponent);
