export type Direction = "up" | "down" | "left" | "right";
export interface Point {
  x: number;
  y: number;
}

const DIRECTION_DELTAS: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export function createInitialSnake(cols: number, rows: number): Point[] {
  const midY = Math.floor(rows / 2);
  const midX = Math.floor(cols / 2);
  return [
    { x: midX, y: midY },
    { x: midX - 1, y: midY },
    { x: midX - 2, y: midY },
  ];
}

function wrap(value: number, max: number): number {
  if (value < 0) return max - 1;
  if (value >= max) return 0;
  return value;
}

export interface MoveResult {
  snake: Point[];
  ateFood: boolean;
}

export function moveSnake(
  snake: Point[],
  direction: Direction,
  cols: number,
  rows: number,
  ateFood: boolean
): MoveResult {
  const delta = DIRECTION_DELTAS[direction];
  const newHead: Point = {
    x: wrap(snake[0].x + delta.x, cols),
    y: wrap(snake[0].y + delta.y, rows),
  };

  const newSnake = [newHead, ...snake];
  if (!ateFood) {
    newSnake.pop();
  }

  return { snake: newSnake, ateFood };
}

export function generateFood(snake: Point[], cols: number, rows: number): Point {
  while (true) {
    const food: Point = {
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows),
    };
    if (!snake.some((s) => s.x === food.x && s.y === food.y)) {
      return food;
    }
  }
}

export function checkFood(snake: Point[], food: Point): boolean {
  return snake[0].x === food.x && snake[0].y === food.y;
}
