import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTimer } from "../useTimer";

describe("useTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts at 0 seconds", () => {
    const { result } = renderHook(() => useTimer());
    expect(result.current.elapsed).toBe(0);
    expect(result.current.isRunning).toBe(false);
  });

  it("starts counting when start() is called", () => {
    const { result } = renderHook(() => useTimer());
    act(() => result.current.start());
    expect(result.current.isRunning).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(result.current.elapsed).toBeCloseTo(1.5, 1);
  });

  it("stops when stop() is called", () => {
    const { result } = renderHook(() => useTimer());
    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(2000));
    act(() => result.current.stop());
    expect(result.current.isRunning).toBe(false);
    expect(result.current.elapsed).toBeCloseTo(2, 0);

    act(() => vi.advanceTimersByTime(5000));
    expect(result.current.elapsed).toBeCloseTo(2, 0);
  });

  it("resets to 0", () => {
    const { result } = renderHook(() => useTimer());
    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(3000));
    act(() => result.current.reset());
    expect(result.current.elapsed).toBe(0);
    expect(result.current.isRunning).toBe(false);
  });
});
