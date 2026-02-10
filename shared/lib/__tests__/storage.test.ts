import {
  saveToStorage,
  loadFromStorage,
  removeFromStorage,
} from "../storage";

describe("storage", () => {
  beforeEach(() => {
    // 각 테스트 전에 localStorage 초기화 (jest.setup.js에서 모킹됨)
    jest.clearAllMocks();
  });

  describe("saveToStorage", () => {
    it("데이터를 localStorage에 저장할 수 있어야 함", () => {
      const testData = { name: "test", value: 123 };
      const result = saveToStorage("test-key", testData);
      expect(result).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it("버전이 포함된 키로 저장해야 함", () => {
      const testData = { name: "test" };
      saveToStorage("test-key", testData);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "test-key:v1",
        JSON.stringify(testData)
      );
    });

    it("JSON 문자열로 변환하여 저장해야 함", () => {
      const testData = { name: "test", nested: { value: 1 } };
      saveToStorage("test-key", testData);
      const call = (localStorage.setItem as jest.Mock).mock.calls[0];
      expect(call[1]).toBe(JSON.stringify(testData));
    });
  });

  describe("loadFromStorage", () => {
    it("저장된 데이터를 로드할 수 있어야 함", () => {
      const testData = { name: "test", value: 123 };
      (localStorage.getItem as jest.Mock).mockReturnValue(
        JSON.stringify(testData)
      );

      const loaded = loadFromStorage<typeof testData>("test-key");
      expect(loaded).toEqual(testData);
      expect(localStorage.getItem).toHaveBeenCalledWith("test-key:v1");
    });

    it("데이터가 없을 때 null을 반환해야 함", () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(null);
      const loaded = loadFromStorage("test-key");
      expect(loaded).toBeNull();
    });

    it("잘못된 JSON 데이터 시 null을 반환해야 함", () => {
      (localStorage.getItem as jest.Mock).mockReturnValue("invalid json{");
      const loaded = loadFromStorage("test-key");
      expect(loaded).toBeNull();
    });

    it("버전이 포함된 키로 조회해야 함", () => {
      (localStorage.getItem as jest.Mock).mockReturnValue(null);
      loadFromStorage("test-key");
      expect(localStorage.getItem).toHaveBeenCalledWith("test-key:v1");
    });
  });

  describe("removeFromStorage", () => {
    it("저장된 데이터를 삭제할 수 있어야 함", () => {
      const result = removeFromStorage("test-key");
      expect(result).toBe(true);
      expect(localStorage.removeItem).toHaveBeenCalledWith("test-key:v1");
    });

    it("버전이 포함된 키로 삭제해야 함", () => {
      removeFromStorage("test-key");
      expect(localStorage.removeItem).toHaveBeenCalledWith("test-key:v1");
    });
  });

  describe("통합 테스트", () => {
    it("저장하고 로드하는 전체 흐름이 작동해야 함", () => {
      const testData = { name: "test", items: [1, 2, 3] };
      
      // 저장
      const saveResult = saveToStorage("integration-test", testData);
      expect(saveResult).toBe(true);

      // 실제 localStorage에 저장된 것처럼 모킹
      (localStorage.getItem as jest.Mock).mockReturnValue(
        JSON.stringify(testData)
      );

      // 로드
      const loaded = loadFromStorage<typeof testData>("integration-test");
      expect(loaded).toEqual(testData);
    });

    it("저장하고 삭제하는 전체 흐름이 작동해야 함", () => {
      const testData = { name: "test" };
      
      // 저장
      saveToStorage("delete-test", testData);
      
      // 삭제
      const deleteResult = removeFromStorage("delete-test");
      expect(deleteResult).toBe(true);
      expect(localStorage.removeItem).toHaveBeenCalledWith("delete-test:v1");
    });
  });
});
