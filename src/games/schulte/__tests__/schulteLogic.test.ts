import { describe, it, expect } from "vitest";
import { generateGrid, generateTargetSequence } from "../schulteLogic";

describe("generateGrid", () => {
  it("generates a 3x3 grid with numbers 1-9 shuffled", () => {
    const grid = generateGrid(3);
    expect(grid).toHaveLength(9);
    const sorted = [...grid].sort((a, b) => a - b);
    expect(sorted).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it("generates a 5x5 grid with numbers 1-25 shuffled", () => {
    const grid = generateGrid(5);
    expect(grid).toHaveLength(25);
    const sorted = [...grid].sort((a, b) => a - b);
    expect(sorted).toEqual(Array.from({ length: 25 }, (_, i) => i + 1));
  });

  it("shuffles (two calls unlikely identical)", () => {
    let allSame = true;
    const first = generateGrid(4).join(",");
    for (let i = 0; i < 20; i++) {
      if (generateGrid(4).join(",") !== first) {
        allSame = false;
        break;
      }
    }
    expect(allSame).toBe(false);
  });
});

describe("generateTargetSequence", () => {
  const size = 3;
  const max = size * size;

  it("forward mode: 1 to max", () => {
    const seq = generateTargetSequence("forward", size);
    expect(seq).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it("backward mode: max to 1", () => {
    const seq = generateTargetSequence("backward", size);
    expect(seq).toEqual([9, 8, 7, 6, 5, 4, 3, 2, 1]);
  });

  it("random mode: contains all numbers 1-max, no repeats", () => {
    const seq = generateTargetSequence("random", size);
    expect(seq).toHaveLength(max);
    const sorted = [...seq].sort((a, b) => a - b);
    expect(sorted).toEqual(Array.from({ length: max }, (_, i) => i + 1));
  });
});
