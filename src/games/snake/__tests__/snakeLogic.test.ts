import { describe, it, expect } from "vitest";
import {
  createInitialSnake,
  moveSnake,
  generateFood,
  checkFood,
  type Direction,
  type Point,
} from "../snakeLogic";

describe("createInitialSnake", () => {
  it("creates a snake with 3 segments in the center", () => {
    const snake = createInitialSnake(10, 10);
    expect(snake).toHaveLength(3);
    expect(snake[0]).toEqual({ x: 5, y: 5 });
    expect(snake[1]).toEqual({ x: 4, y: 5 });
    expect(snake[2]).toEqual({ x: 3, y: 5 });
  });
});

describe("moveSnake", () => {
  const snake = [
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 },
  ];

  it("moves right without growing", () => {
    const result = moveSnake(snake, "right", 10, 10, false);
    expect(result.snake).toEqual([
      { x: 6, y: 5 },
      { x: 5, y: 5 },
      { x: 4, y: 5 },
    ]);
    expect(result.ateFood).toBe(false);
  });

  it("moves up without growing", () => {
    const result = moveSnake(snake, "up", 10, 10, false);
    expect(result.snake[0]).toEqual({ x: 5, y: 4 });
    expect(result.snake).toHaveLength(3);
  });

  it("grows when ateFood is true", () => {
    const result = moveSnake(snake, "right", 10, 10, true);
    expect(result.snake).toHaveLength(4);
    expect(result.ateFood).toBe(true);
  });

  it("wraps around right wall", () => {
    const edgeSnake = [{ x: 9, y: 5 }];
    const result = moveSnake(edgeSnake, "right", 10, 10, false);
    expect(result.snake[0]).toEqual({ x: 0, y: 5 });
  });

  it("wraps around left wall", () => {
    const edgeSnake = [{ x: 0, y: 5 }];
    const result = moveSnake(edgeSnake, "left", 10, 10, false);
    expect(result.snake[0]).toEqual({ x: 9, y: 5 });
  });

  it("wraps around top wall", () => {
    const edgeSnake = [{ x: 5, y: 0 }];
    const result = moveSnake(edgeSnake, "up", 10, 10, false);
    expect(result.snake[0]).toEqual({ x: 5, y: 9 });
  });

  it("wraps around bottom wall", () => {
    const edgeSnake = [{ x: 5, y: 9 }];
    const result = moveSnake(edgeSnake, "down", 10, 10, false);
    expect(result.snake[0]).toEqual({ x: 5, y: 0 });
  });
});

describe("generateFood", () => {
  it("generates food not on snake body", () => {
    const snake = [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
    ];
    const food = generateFood(snake, 10, 10);
    expect(food).toHaveProperty("x");
    expect(food).toHaveProperty("y");
    expect(snake.some((s) => s.x === food.x && s.y === food.y)).toBe(false);
  });

  it("generates within bounds", () => {
    const food = generateFood([], 10, 10);
    expect(food.x).toBeGreaterThanOrEqual(0);
    expect(food.x).toBeLessThan(10);
    expect(food.y).toBeGreaterThanOrEqual(0);
    expect(food.y).toBeLessThan(10);
  });
});

describe("checkFood", () => {
  it("returns true when snake head is on food", () => {
    const snake = [{ x: 5, y: 5 }];
    const food = { x: 5, y: 5 };
    expect(checkFood(snake, food)).toBe(true);
  });

  it("returns false when snake head is not on food", () => {
    const snake = [{ x: 5, y: 5 }];
    const food = { x: 3, y: 3 };
    expect(checkFood(snake, food)).toBe(false);
  });
});
