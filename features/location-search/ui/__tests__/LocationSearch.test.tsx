import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LocationSearch } from "../LocationSearch";
import { Location } from "@/entities/location/model/types";

jest.mock("@/shared/lib/locationSearch", () => ({
  ensureSearchIndex: jest.fn(() => Promise.resolve()),
  searchLocations: jest.fn((query: string) => {
    if (query === "서울") {
      return [
        {
          id: "서울특별시",
          name: "서울특별시",
          fullPath: "서울특별시",
          level: "시",
        },
        {
          id: "서울특별시-종로구",
          name: "종로구",
          fullPath: "서울특별시-종로구",
          level: "구",
        },
      ];
    }
    return [];
  }),
  formatLocationName: jest.fn((location: Location) =>
    location.fullPath.replace(/-/g, " ")
  ),
}));

describe("LocationSearch", () => {
  const mockOnSelectLocation = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("검색어 입력 시 결과를 표시해야 함", async () => {
    const user = userEvent.setup();
    render(<LocationSearch onSelectLocation={mockOnSelectLocation} />);

    const input = screen.getByPlaceholderText(
      /장소를 검색하세요/i
    ) as HTMLInputElement;

    await user.type(input, "서울");

    await waitFor(() => {
      expect(screen.getByText("서울특별시")).toBeInTheDocument();
      expect(screen.getByText("서울특별시 종로구")).toBeInTheDocument();
    });
  });

  it("검색 결과를 클릭하면 onSelectLocation이 호출되어야 함", async () => {
    const user = userEvent.setup();
    render(<LocationSearch onSelectLocation={mockOnSelectLocation} />);

    const input = screen.getByPlaceholderText(
      /장소를 검색하세요/i
    ) as HTMLInputElement;

    await user.type(input, "서울");

    await waitFor(() => {
      expect(screen.getByText("서울특별시")).toBeInTheDocument();
    });

    const firstResult = screen.getByText("서울특별시");
    await user.click(firstResult);

    expect(mockOnSelectLocation).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "서울특별시",
      })
    );
  });

  it("검색 결과 선택 후 입력창이 비워져야 함", async () => {
    const user = userEvent.setup();
    render(<LocationSearch onSelectLocation={mockOnSelectLocation} />);

    const input = screen.getByPlaceholderText(
      /장소를 검색하세요/i
    ) as HTMLInputElement;

    await user.type(input, "서울");

    await waitFor(() => {
      expect(screen.getByText("서울특별시")).toBeInTheDocument();
    });

    const firstResult = screen.getByText("서울특별시");
    await user.click(firstResult);

    await waitFor(() => {
      expect(input.value).toBe("");
    });
  });

  it("검색 결과가 없을 때 메시지를 표시해야 함", async () => {
    const user = userEvent.setup();
    render(<LocationSearch onSelectLocation={mockOnSelectLocation} />);

    const input = screen.getByPlaceholderText(
      /장소를 검색하세요/i
    ) as HTMLInputElement;

    await user.type(input, "존재하지않는장소123");

    await waitFor(() => {
      expect(
        screen.getByText("검색 결과가 없습니다.")
      ).toBeInTheDocument();
    });
  });

  it("검색어가 2자 미만일 때 결과를 표시하지 않아야 함", async () => {
    const user = userEvent.setup();
    render(<LocationSearch onSelectLocation={mockOnSelectLocation} />);

    const input = screen.getByPlaceholderText(
      /장소를 검색하세요/i
    ) as HTMLInputElement;

    await user.type(input, "서");

    await waitFor(() => {
      expect(screen.queryByText("서울특별시")).not.toBeInTheDocument();
    });
  });

  it("외부 클릭 시 검색 결과가 닫혀야 함", async () => {
    const user = userEvent.setup();
    render(<LocationSearch onSelectLocation={mockOnSelectLocation} />);

    const input = screen.getByPlaceholderText(
      /장소를 검색하세요/i
    ) as HTMLInputElement;

    await user.type(input, "서울");

    await waitFor(() => {
      expect(screen.getByText("서울특별시")).toBeInTheDocument();
    });

    const overlay = document.querySelector(".fixed.inset-0");
    if (overlay) {
      await user.click(overlay);
    }

    await waitFor(() => {
      expect(screen.queryByText("서울특별시")).not.toBeInTheDocument();
    });
  });

  it("커스텀 placeholder를 사용할 수 있어야 함", () => {
    render(
      <LocationSearch
        onSelectLocation={mockOnSelectLocation}
        placeholder="커스텀 플레이스홀더"
      />
    );

    expect(
      screen.getByPlaceholderText("커스텀 플레이스홀더")
    ).toBeInTheDocument();
  });
});
