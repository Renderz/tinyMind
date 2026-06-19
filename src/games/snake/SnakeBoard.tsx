import { useState, useEffect, useCallback, useRef } from "react";
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

export function SnakeBoard({ speed, onComplete }: SnakeBoardProps) {
  const { t } = useTranslation();
  const [snake, setSnake] = useState<Point[]>(() => createInitialSnake(COLS, ROWS));
  const [food, setFood] = useState<Point>(() => generateFood(snake, COLS, ROWS));
  const [score, setScore] = useState(0);
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
      const ate = checkFood(snake, food);
      const { snake: newSnake } = moveSnake(snake, directionRef.current, COLS, ROWS, ate);

      if (ate) {
        playSound("correct");
        setScore((s) => s + 1);
        setFood(generateFood(newSnake, COLS, ROWS));
      }
      setSnake(newSnake);
    }, speed);
    return () => clearInterval(interval);
  }, [snake, food, speed]);

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

  const isSnake = (x: number, y: number) => snake.some((s) => s.x === x && s.y === y);
  const isFood = (x: number, y: number) => food.x === x && food.y === y;
  const isHead = (x: number, y: number) => snake[0].x === x && snake[0].y === y;

  const dirButtons: { dir: Direction; label: string }[] = [
    { dir: "up", label: "↑" },
    { dir: "left", label: "←" },
    { dir: "down", label: "↓" },
    { dir: "right", label: "→" },
  ];

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
          const meal = isFood(x, y);
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
