import { useReducer, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  createInitialSnake,
  moveSnake,
  generateFood,
  checkFood,
  type Direction,
  type Point,
} from "./snakeLogic";
import { playSound } from "../../lib/audio";

const COLS = 10;
const ROWS = 10;

interface SnakeBoardProps {
  speed: number;
  onComplete: (score: number) => void;
}

const OPPOSITE: Record<Direction, Direction> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

interface GameState {
  snake: Point[];
  food: Point;
  score: number;
}

type GameAction = { type: "TICK"; direction: Direction };

function init(): GameState {
  const snake = createInitialSnake(COLS, ROWS);
  return { snake, food: generateFood(snake, COLS, ROWS), score: 0 };
}

function reducer(state: GameState, action: GameAction): GameState {
  if (action.type !== "TICK") return state;

  const ate = checkFood(state.snake, state.food);
  const { snake: newSnake } = moveSnake(state.snake, action.direction, COLS, ROWS, ate);

  if (ate) {
    playSound("correct");
    return {
      snake: newSnake,
      food: generateFood(newSnake, COLS, ROWS),
      score: state.score + 1,
    };
  }
  return { ...state, snake: newSnake };
}

export function SnakeBoard({ speed, onComplete }: SnakeBoardProps) {
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(reducer, undefined, init);
  const directionRef = useRef<Direction>("right");
  const nextDirectionRef = useRef<Direction>("right");

  const handleDirection = useCallback((dir: Direction) => {
    if (OPPOSITE[dir] !== directionRef.current) {
      nextDirectionRef.current = dir;
    }
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const map: Record<string, Direction> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
      };
      const dir = map[e.key];
      if (dir) {
        e.preventDefault();
        handleDirection(dir);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleDirection]);

  useEffect(() => {
    const interval = setInterval(() => {
      directionRef.current = nextDirectionRef.current;
      dispatch({ type: "TICK", direction: directionRef.current });
    }, speed);
    return () => clearInterval(interval);
  }, [speed]);

  const handleTouchStart = useRef<Point | null>(null);

  const handleTouchStartEvent = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleTouchStart.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!handleTouchStart.current) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - handleTouchStart.current.x;
      const dy = touch.clientY - handleTouchStart.current.y;

      if (Math.abs(dx) > Math.abs(dy)) {
        handleDirection(dx > 0 ? "right" : "left");
      } else {
        handleDirection(dy > 0 ? "down" : "up");
      }
      handleTouchStart.current = null;
    },
    [handleDirection]
  );

  const { snake, food, score } = state;
  const isSnake = (x: number, y: number) => snake.some((s) => s.x === x && s.y === y);
  const isHead = (x: number, y: number) => snake[0].x === x && snake[0].y === y;

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <span className="text-2xl font-bold text-green-600">{t("snake.score", { score })}</span>
        <button
          type="button"
          onClick={() => onComplete(score)}
          className="px-4 py-1.5 rounded-full bg-white shadow-md text-sm font-bold text-purple-600 active:scale-95 transition-transform"
        >
          {t("common.completed")}
        </button>
      </div>

      <div
        onTouchStart={handleTouchStartEvent}
        onTouchEnd={handleTouchEnd}
        className="grid gap-0.5 bg-green-50 p-2 rounded-2xl shadow-inner"
        style={{
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          width: "min(90vw, 360px)",
          aspectRatio: "1",
        }}
      >
        {Array.from({ length: COLS * ROWS }, (_, i) => {
          const x = i % COLS;
          const y = Math.floor(i / COLS);
          const head = isHead(x, y);
          const body = isSnake(x, y);
          const meal = food.x === x && food.y === y;
          return (
            <div
              key={i}
              className={`rounded-sm ${
                head
                  ? "bg-green-600"
                  : body
                  ? "bg-green-400"
                  : meal
                  ? "bg-red-400 rounded-full"
                  : "bg-green-100"
              }`}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-2 w-48 mt-2">
        <div />
        <button type="button" onClick={() => handleDirection("up")} className="h-14 rounded-2xl bg-white shadow-md text-2xl text-green-600 active:scale-90 transition-transform">↑</button>
        <div />
        <button type="button" onClick={() => handleDirection("left")} className="h-14 rounded-2xl bg-white shadow-md text-2xl text-green-600 active:scale-90 transition-transform">←</button>
        <button type="button" onClick={() => handleDirection("down")} className="h-14 rounded-2xl bg-white shadow-md text-2xl text-green-600 active:scale-90 transition-transform">↓</button>
        <button type="button" onClick={() => handleDirection("right")} className="h-14 rounded-2xl bg-white shadow-md text-2xl text-green-600 active:scale-90 transition-transform">→</button>
      </div>
    </div>
  );
}
