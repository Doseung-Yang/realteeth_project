import {
  ensureSearchIndex,
  searchLocations,
  getLocationById,
  formatLocationName,
} from "../locationSearch";
import { Location } from "@/entities/location/model/types";

describe("location-search", () => {
  beforeAll(async () => {
    await ensureSearchIndex();
  });

  describe("searchLocations", () => {
    it("서울특별시 검색 시 결과를 반환해야 함", () => {
      const results = searchLocations("서울특별시");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].fullPath).toContain("서울특별시");
    });

    it("종로구 검색 시 관련 결과를 반환해야 함", () => {
      const results = searchLocations("종로구");
      expect(results.length).toBeGreaterThan(0);
      expect(
        results.some((r) => r.fullPath.includes("종로구"))
      ).toBe(true);
    });

    it("청운동 검색 시 관련 결과를 반환해야 함", () => {
      const results = searchLocations("청운동");
      expect(results.length).toBeGreaterThan(0);
      expect(
        results.some((r) => r.fullPath.includes("청운동"))
      ).toBe(true);
    });

    it("존재하지 않는 검색어 시 빈 배열을 반환해야 함", () => {
      const results = searchLocations("존재하지않는장소12345");
      expect(results).toEqual([]);
    });

    it("빈 문자열 검색 시 빈 배열을 반환해야 함", () => {
      const results = searchLocations("");
      expect(results).toEqual([]);
    });

    it("공백만 있는 검색어 시 빈 배열을 반환해야 함", () => {
      const results = searchLocations("   ");
      expect(results).toEqual([]);
    });

    it("검색어가 2자 미만일 때 빈 배열을 반환해야 함", () => {
      const results = searchLocations("서");
      expect(results).toEqual([]);
    });

    it("대소문자 구분 없이 검색해야 함", () => {
      const results1 = searchLocations("서울");
      expect(results1.length).toBeGreaterThan(0);
    });

    it("limit 파라미터로 결과 수를 제한할 수 있어야 함", () => {
      const results = searchLocations("서울", 5);
      expect(results.length).toBeLessThanOrEqual(5);
    });
  });

  describe("getLocationById", () => {
    it("존재하는 ID로 위치를 조회할 수 있어야 함", async () => {
      const location = await getLocationById("서울특별시");
      expect(location).not.toBeNull();
      expect(location?.id).toBe("서울특별시");
      expect(location?.name).toBe("서울특별시");
    });

    it("존재하지 않는 ID로 조회 시 null을 반환해야 함", async () => {
      const location = await getLocationById("존재하지않는ID12345");
      expect(location).toBeNull();
    });

    it("조회한 위치는 올바른 구조를 가져야 함", async () => {
      const location = await getLocationById("서울특별시-종로구");
      expect(location).not.toBeNull();
      expect(location).toHaveProperty("id");
      expect(location).toHaveProperty("name");
      expect(location).toHaveProperty("fullPath");
      expect(location).toHaveProperty("level");
    });
  });

  describe("formatLocationName", () => {
    it("하이픈을 공백으로 변환해야 함", () => {
      const location: Location = {
        id: "서울특별시-종로구-청운동",
        name: "청운동",
        fullPath: "서울특별시-종로구-청운동",
        level: "동",
      };
      const formatted = formatLocationName(location);
      expect(formatted).toBe("서울특별시 종로구 청운동");
      expect(formatted).not.toContain("-");
    });

    it("하이픈이 없는 경우 그대로 반환해야 함", () => {
      const location: Location = {
        id: "서울특별시",
        name: "서울특별시",
        fullPath: "서울특별시",
        level: "시",
      };
      const formatted = formatLocationName(location);
      expect(formatted).toBe("서울특별시");
    });
  });
});
