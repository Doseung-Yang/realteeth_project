import { Location } from "@/entities/location/model/types";

export interface FavoriteLocation extends Location {
  alias?: string;
  addedAt: number;
}
