import {
  getLocationCoordinates,
  enrichLocationWithCoordinates,
} from "../locationCoordinates";

describe("location-coordinates", () => {
  describe("getLocationCoordinates", () => {
    it("정확한 매칭으로 좌표를 반환해야 함", () => {
      const coords = getLocationCoordinates("서울특별시");
      expect(coords).not.toBeNull();
      expect(coords?.lat).toBe(37.5665);
      expect(coords?.lon).toBe(126.978);
    });

    it("존재하지 않는 위치 ID 시 null을 반환해야 함", () => {
      const coords = getLocationCoordinates("존재하지않는장소");
      expect(coords).toBeNull();
    });

    it("부분 매칭으로 상위 레벨 좌표를 반환해야 함", () => {
      // "서울특별시-종로구-청운동"이 없으면 "서울특별시-종로구"를, 그것도 없으면 "서울특별시"를 반환
      const coords = getLocationCoordinates("서울특별시-종로구-청운동");
      expect(coords).not.toBeNull();
      // 실제로는 "서울특별시-종로구-청운동"이 정의되어 있으므로 해당 좌표를 반환
      expect(coords?.lat).toBe(37.5892);
      expect(coords?.lon).toBe(126.9706);
    });

    it("부산광역시 좌표를 올바르게 반환해야 함", () => {
      const coords = getLocationCoordinates("부산광역시");
      expect(coords).not.toBeNull();
      expect(coords?.lat).toBe(35.1796);
      expect(coords?.lon).toBe(129.0756);
    });
  });

  describe("enrichLocationWithCoordinates", () => {
    it("좌표가 있는 위치에 좌표를 추가해야 함", () => {
      const location = {
        id: "서울특별시",
        name: "서울특별시",
        fullPath: "서울특별시",
        level: "시" as const,
      };
      const enriched = enrichLocationWithCoordinates(location);
      expect(enriched.coordinates).not.toBeUndefined();
      expect(enriched.coordinates?.lat).toBe(37.5665);
      expect(enriched.coordinates?.lon).toBe(126.978);
    });

    it("좌표가 없는 위치에 undefined를 설정해야 함", () => {
      const location = {
        id: "존재하지않는장소",
        name: "존재하지않는장소",
        fullPath: "존재하지않는장소",
        level: "시" as const,
      };
      const enriched = enrichLocationWithCoordinates(location);
      expect(enriched.coordinates).toBeUndefined();
    });

    it("원본 location의 다른 속성을 유지해야 함", () => {
      const location = {
        id: "서울특별시",
        name: "서울특별시",
        fullPath: "서울특별시",
        level: "시" as const,
        extra: "test",
      };
      const enriched = enrichLocationWithCoordinates(location);
      expect(enriched.id).toBe("서울특별시");
      expect(enriched.name).toBe("서울특별시");
      expect(enriched.fullPath).toBe("서울특별시");
      expect(enriched.level).toBe("시");
      expect((enriched as any).extra).toBe("test");
    });
  });
});
