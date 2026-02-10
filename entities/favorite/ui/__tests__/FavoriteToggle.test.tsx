import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FavoriteToggle } from "../FavoriteToggle";
import { useFavoriteStore } from "../../model/store";
import { Location } from "@/entities/location/model/types";
import { FavoriteEnum } from "../../model/favoriteEnum";

jest.mock("../../model/store", () => ({
  useFavoriteStore: jest.fn(),
}));

describe("FavoriteToggle", () => {
  const mockLocation: Location = {
    id: "test-location",
    name: "Test Location",
    fullPath: "test-location",
    level: "시",
    coordinates: { lat: 37.5665, lon: 126.978 },
  };

  const mockStore = {
    isFavorite: jest.fn(),
    addFavorite: jest.fn(),
    removeFavorite: jest.fn(),
    favorites: [],
    maxFavorites: FavoriteEnum.MAX_FAVORITES,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockStore.favorites = []; // 명시적으로 초기화
    (useFavoriteStore as jest.Mock).mockReturnValue(mockStore);
  });

  it("즐겨찾기가 아닐 때 추가 버튼을 표시해야 함", () => {
    mockStore.isFavorite.mockReturnValue(false);

    render(<FavoriteToggle location={mockLocation} />);

    expect(screen.getByTitle("즐겨찾기에 추가")).toBeInTheDocument();
  });

  it("즐겨찾기일 때 제거 버튼을 표시해야 함", () => {
    mockStore.isFavorite.mockReturnValue(true);

    render(<FavoriteToggle location={mockLocation} />);

    expect(screen.getByTitle("즐겨찾기에서 제거")).toBeInTheDocument();
  });

  it("즐겨찾기 추가 버튼 클릭 시 addFavorite이 호출되어야 함", async () => {
    const user = userEvent.setup();
    mockStore.isFavorite.mockReturnValue(false);
    mockStore.addFavorite.mockReturnValue(true);

    render(<FavoriteToggle location={mockLocation} />);

    const button = screen.getByTitle("즐겨찾기에 추가");
    await user.click(button);

    expect(mockStore.addFavorite).toHaveBeenCalledWith(mockLocation);
  });

  it("즐겨찾기 제거 버튼 클릭 시 removeFavorite이 호출되어야 함", async () => {
    const user = userEvent.setup();
    mockStore.isFavorite.mockReturnValue(true);

    render(<FavoriteToggle location={mockLocation} />);

    const button = screen.getByTitle("즐겨찾기에서 제거");
    await user.click(button);

    expect(mockStore.removeFavorite).toHaveBeenCalledWith("test-location");
  });

  it("최대 개수에 도달했을 때 버튼이 비활성화되어야 함", () => {
    mockStore.isFavorite.mockReturnValue(false);
    mockStore.favorites.length = 6; // 최대 개수

    render(<FavoriteToggle location={mockLocation} />);

    const button = screen.getByTitle("즐겨찾기는 최대 6개까지 추가할 수 있습니다");
    expect(button).toBeDisabled();
  });

  it("최대 개수에 도달했을 때 툴팁을 표시해야 함", () => {
    mockStore.isFavorite.mockReturnValue(false);
    mockStore.favorites.length = 6;

    render(<FavoriteToggle location={mockLocation} />);

    const button = screen.getByTitle("즐겨찾기는 최대 6개까지 추가할 수 있습니다");
    expect(button).toHaveAttribute(
      "title",
      "즐겨찾기는 최대 6개까지 추가할 수 있습니다"
    );
  });

  it("즐겨찾기일 때는 버튼이 비활성화되지 않아야 함", () => {
    mockStore.isFavorite.mockReturnValue(true);
    mockStore.favorites.length = 6;

    render(<FavoriteToggle location={mockLocation} />);

    const button = screen.getByTitle("즐겨찾기에서 제거");
    expect(button).not.toBeDisabled();
  });

  it("다양한 크기 prop을 지원해야 함", () => {
    mockStore.isFavorite.mockReturnValue(false);
    mockStore.favorites = []; // 명시적으로 빈 배열 설정

    const { rerender } = render(
      <FavoriteToggle location={mockLocation} size="sm" />
    );
    let button = screen.getByTitle("즐겨찾기에 추가");
    expect(button).toBeInTheDocument();

    rerender(<FavoriteToggle location={mockLocation} size="lg" />);
    button = screen.getByTitle("즐겨찾기에 추가");
    expect(button).toBeInTheDocument();
  });
});
