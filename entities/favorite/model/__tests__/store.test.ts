import { useFavoriteStore } from "../store";
import { FavoriteLocation } from "../types";
import { Location } from "@/entities/location/model/types";
import * as storage from "@/shared/lib/storage";
import { FavoriteEnum } from "../favoriteEnum";

// storage 모듈 모킹
jest.mock("@/shared/lib/storage", () => ({
  saveToStorage: jest.fn(() => true),
  loadFromStorage: jest.fn(() => null),
  removeFromStorage: jest.fn(() => true),
}));

describe("useFavoriteStore", () => {
  beforeEach(() => {
    // 각 테스트 전에 스토어 초기화
    useFavoriteStore.setState({
      favorites: [],
      maxFavorites: FavoriteEnum.MAX_FAVORITES,
    });
    jest.clearAllMocks();
  });

  const createMockLocation = (id: string): Location => ({
    id,
    name: `Location ${id}`,
    fullPath: id,
    level: "시",
    coordinates: { lat: 37.5665, lon: 126.978 },
  });

  describe("addFavorite", () => {
    it("즐겨찾기를 추가할 수 있어야 함", () => {
      const location = createMockLocation("location-1");

      const result = useFavoriteStore.getState().addFavorite(location);
      expect(result).toBe(true);
      
      const state = useFavoriteStore.getState();
      expect(state.favorites.length).toBe(1);
      expect(state.favorites[0].id).toBe("location-1");
    });

    it("최대 6개까지만 추가할 수 있어야 함", () => {
      // 6개 추가
      for (let i = 1; i <= 6; i++) {
        useFavoriteStore.getState().addFavorite(createMockLocation(`location-${i}`));
      }

      expect(useFavoriteStore.getState().favorites.length).toBe(6);

      // 7번째 추가 시도
      const result = useFavoriteStore.getState().addFavorite(createMockLocation("location-7"));
      expect(result).toBe(false);
      expect(useFavoriteStore.getState().favorites.length).toBe(6);
    });

    it("중복 추가를 방지해야 함", () => {
      const location = createMockLocation("location-1");

      useFavoriteStore.getState().addFavorite(location);
      const result = useFavoriteStore.getState().addFavorite(location);

      expect(result).toBe(false);
      expect(useFavoriteStore.getState().favorites.length).toBe(1);
    });

    it("추가 시 localStorage에 저장해야 함", () => {
      const location = createMockLocation("location-1");

      useFavoriteStore.getState().addFavorite(location);

      expect(storage.saveToStorage).toHaveBeenCalledWith(
        "favorites",
        expect.arrayContaining([
          expect.objectContaining({ id: "location-1" }),
        ])
      );
    });

    it("추가된 즐겨찾기에 addedAt 타임스탬프가 있어야 함", () => {
      const location = createMockLocation("location-1");

      useFavoriteStore.getState().addFavorite(location);

      const state = useFavoriteStore.getState();
      expect(state.favorites[0].addedAt).toBeDefined();
      expect(typeof state.favorites[0].addedAt).toBe("number");
    });
  });

  describe("removeFavorite", () => {
    it("즐겨찾기를 제거할 수 있어야 함", () => {
      const location1 = createMockLocation("location-1");
      const location2 = createMockLocation("location-2");

      useFavoriteStore.getState().addFavorite(location1);
      useFavoriteStore.getState().addFavorite(location2);

      expect(useFavoriteStore.getState().favorites.length).toBe(2);

      useFavoriteStore.getState().removeFavorite("location-1");

      const state = useFavoriteStore.getState();
      expect(state.favorites.length).toBe(1);
      expect(state.favorites[0].id).toBe("location-2");
    });

    it("존재하지 않는 즐겨찾기 제거 시 에러 없이 처리해야 함", () => {
      useFavoriteStore.getState().addFavorite(createMockLocation("location-1"));

      expect(() => {
        useFavoriteStore.getState().removeFavorite("non-existent");
      }).not.toThrow();

      expect(useFavoriteStore.getState().favorites.length).toBe(1);
    });

    it("제거 시 localStorage에 저장해야 함", () => {
      const location = createMockLocation("location-1");

      useFavoriteStore.getState().addFavorite(location);
      jest.clearAllMocks();

      useFavoriteStore.getState().removeFavorite("location-1");

      expect(storage.saveToStorage).toHaveBeenCalledWith("favorites", []);
    });
  });

  describe("updateFavoriteAlias", () => {
    it("즐겨찾기 별칭을 수정할 수 있어야 함", () => {
      const location = createMockLocation("location-1");

      useFavoriteStore.getState().addFavorite(location);
      useFavoriteStore.getState().updateFavoriteAlias("location-1", "내가 좋아하는 장소");

      const state = useFavoriteStore.getState();
      expect(state.favorites[0].alias).toBe("내가 좋아하는 장소");
    });

    it("존재하지 않는 즐겨찾기 별칭 수정 시 에러 없이 처리해야 함", () => {
      expect(() => {
        useFavoriteStore.getState().updateFavoriteAlias("non-existent", "별칭");
      }).not.toThrow();
    });

    it("별칭 수정 시 localStorage에 저장해야 함", () => {
      const location = createMockLocation("location-1");

      useFavoriteStore.getState().addFavorite(location);
      jest.clearAllMocks();

      useFavoriteStore.getState().updateFavoriteAlias("location-1", "새 별칭");

      expect(storage.saveToStorage).toHaveBeenCalled();
    });
  });

  describe("isFavorite", () => {
    it("즐겨찾기인 경우 true를 반환해야 함", () => {
      const location = createMockLocation("location-1");

      useFavoriteStore.getState().addFavorite(location);

      expect(useFavoriteStore.getState().isFavorite("location-1")).toBe(true);
    });

    it("즐겨찾기가 아닌 경우 false를 반환해야 함", () => {
      expect(useFavoriteStore.getState().isFavorite("non-existent")).toBe(false);
    });
  });

  describe("loadFavorites", () => {
    it("localStorage에서 즐겨찾기를 로드할 수 있어야 함", () => {
      const mockFavorites: FavoriteLocation[] = [
        {
          ...createMockLocation("location-1"),
          addedAt: Date.now(),
          alias: "테스트",
        },
      ];

      (storage.loadFromStorage as jest.Mock).mockReturnValue(mockFavorites);

      useFavoriteStore.getState().loadFavorites();

      expect(useFavoriteStore.getState().favorites).toEqual(mockFavorites);
    });

    it("localStorage에 데이터가 없으면 빈 배열을 유지해야 함", () => {
      (storage.loadFromStorage as jest.Mock).mockReturnValue(null);

      useFavoriteStore.getState().loadFavorites();

      expect(useFavoriteStore.getState().favorites).toEqual([]);
    });
  });

  describe("통합 테스트", () => {
    it("추가, 수정, 제거 전체 흐름이 작동해야 함", () => {
      const location1 = createMockLocation("location-1");
      const location2 = createMockLocation("location-2");

      // 추가
      useFavoriteStore.getState().addFavorite(location1);
      useFavoriteStore.getState().addFavorite(location2);
      expect(useFavoriteStore.getState().favorites.length).toBe(2);

      // 별칭 수정
      useFavoriteStore.getState().updateFavoriteAlias("location-1", "첫 번째 장소");
      expect(useFavoriteStore.getState().favorites[0].alias).toBe("첫 번째 장소");

      // 제거
      useFavoriteStore.getState().removeFavorite("location-1");
      const state = useFavoriteStore.getState();
      expect(state.favorites.length).toBe(1);
      expect(state.favorites[0].id).toBe("location-2");
    });
  });
});
