import { describe, it, expect, beforeEach } from "vitest";
import { getBestTime, setBestTime, getSoundEnabled, setSoundEnabled } from "../storage";

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("getBestTime / setBestTime", () => {
    it("returns null when no best time stored", () => {
      expect(getBestTime("schulte-forward-3")).toBeNull();
    });

    it("stores and retrieves best time", () => {
      setBestTime("schulte-forward-3", 15.5);
      expect(getBestTime("schulte-forward-3")).toBe(15.5);
    });

    it("only keeps the lower value", () => {
      setBestTime("schulte-forward-3", 20);
      setBestTime("schulte-forward-3", 10);
      expect(getBestTime("schulte-forward-3")).toBe(10);
    });

    it("does not overwrite with a worse value", () => {
      setBestTime("schulte-forward-3", 10);
      setBestTime("schulte-forward-3", 20);
      expect(getBestTime("schulte-forward-3")).toBe(10);
    });
  });

  describe("getSoundEnabled / setSoundEnabled", () => {
    it("defaults to true", () => {
      expect(getSoundEnabled()).toBe(true);
    });

    it("stores and retrieves sound setting", () => {
      setSoundEnabled(false);
      expect(getSoundEnabled()).toBe(false);
    });
  });
});
