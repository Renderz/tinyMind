import { describe, it, expect } from "vitest";
import { generateGrid, generateTargetSequence } from "../schulteLogic";

describe("generateGrid", () => {
  it("forward 3x3: numbers 1-9", () => {
    const grid = generateGrid("forward", 3);
    expect(grid).toHaveLength(9);
    const sorted = [...grid].sort((a, b) => a - b);
    expect(sorted).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it("backward 5x5: numbers 1-25", () => {
    const grid = generateGrid("backward", 5);
    expect(grid).toHaveLength(25);
    const sorted = [...grid].sort((a, b) => a - b);
    expect(sorted).toEqual(Array.from({ length: 25 }, (_, i) => i + 1));
  });

  it("odd 3x3: odd numbers 1,3,5,7,9,11,13,15,17", () => {
    const grid = generateGrid("odd", 3);
    expect(grid).toHaveLength(9);
    const sorted = [...grid].sort((a, b) => a - b);
    expect(sorted).toEqual([1, 3, 5, 7, 9, 11, 13, 15, 17]);
    sorted.forEach((n) => expect(n % 2).toBe(1));
  });

  it("even 3x3: even numbers 2,4,6,8,10,12,14,16,18", () => {
    const grid = generateGrid("even", 3);
    expect(grid).toHaveLength(9);
    const sorted = [...grid].sort((a, b) => a - b);
    expect(sorted).toEqual([2, 4, 6, 8, 10, 12, 14, 16, 18]);
    sorted.forEach((n) => expect(n % 2).toBe(0));
  });

  it("random 3x3: non-sequential unique numbers, not 1-9", () => {
    const grid = generateGrid("random", 3);
    expect(grid).toHaveLength(9);
    expect(new Set(grid).size).toBe(9);
    const sorted = [...grid].sort((a, b) => a - b);
    expect(sorted).not.toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it("shuffles positions (two calls unlikely identical)", () => {
    let allSame = true;
    const first = generateGrid("forward", 4).join(",");
    for (let i = 0; i < 20; i++) {
      if (generateGrid("forward", 4).join(",") !== first) {
        allSame = false;
        break;
      }
    }
    expect(allSame).toBe(false);
  });
});

describe("generateTargetSequence", () => {
  it("forward: ascending order", () => {
    const grid = [5, 2, 8, 1, 9];
    const seq = generateTargetSequence("forward", grid);
    expect(seq).toEqual([1, 2, 5, 8, 9]);
  });

  it("backward: descending order", () => {
    const grid = [5, 2, 8, 1, 9];
    const seq = generateTargetSequence("backward", grid);
    expect(seq).toEqual([9, 8, 5, 2, 1]);
  });

  it("random: ascending order (same as forward, non-sequential numbers)", () => {
    const grid = [14, 3, 22, 8, 1];
    const seq = generateTargetSequence("random", grid);
    expect(seq).toEqual([1, 3, 8, 14, 22]);
  });

  it("odd: ascending order", () => {
    const grid = [9, 1, 5, 13, 3];
    const seq = generateTargetSequence("odd", grid);
    expect(seq).toEqual([1, 3, 5, 9, 13]);
  });

  it("even: ascending order", () => {
    const grid = [8, 2, 14, 4, 10];
    const seq = generateTargetSequence("even", grid);
    expect(seq).toEqual([2, 4, 8, 10, 14]);
  });
});
