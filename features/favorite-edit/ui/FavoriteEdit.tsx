"use client";

import { useState } from "react";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import { useFavoriteStore } from "@/entities/favorite/model/store";
import { FavoriteLocation } from "@/entities/favorite/model/types";

interface FavoriteEditProps {
  favorite: FavoriteLocation;
  onClose: () => void;
}

export const FavoriteEdit: React.FC<FavoriteEditProps> = ({
  favorite,
  onClose,
}) => {
  const { updateFavoriteAlias } = useFavoriteStore();
  const [alias, setAlias] = useState(favorite.alias || "");

  const handleSave = () => {
    updateFavoriteAlias(favorite.id, alias.trim());
    onClose();
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">별칭 수정</h3>
      <Input
        label="별칭"
        value={alias}
        onChange={(e) => setAlias(e.target.value)}
        placeholder={favorite.name}
        className="mb-4"
      />
      <div className="flex gap-2 justify-end">
        <Button variant="secondary" onClick={onClose}>
          취소
        </Button>
        <Button variant="primary" onClick={handleSave}>
          저장
        </Button>
      </div>
    </div>
  );
};
