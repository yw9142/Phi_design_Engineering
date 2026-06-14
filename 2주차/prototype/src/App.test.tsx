import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("Wound Routine Player UI", () => {
  it("renders the assignment prototype shell", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /Wound Routine Player/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("대기").length).toBeGreaterThan(0);
  });

  it("connects wind, release, pause, resume, and reset controls", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /감기/i }));
    expect(screen.getAllByText("충전 중").length).toBeGreaterThan(0);
    expect(screen.getAllByText("00:12").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: /방출/i }));
    expect(screen.getAllByText("작동 중").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: /일시정지/i }));
    expect(screen.getAllByText("일시정지").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: /재개/i }));
    expect(screen.getAllByText("작동 중").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: /초기화/i }));
    expect(screen.getAllByText("대기").length).toBeGreaterThan(0);
  });
});
