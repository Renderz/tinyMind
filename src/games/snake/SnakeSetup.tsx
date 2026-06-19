import { useState } from "react";
import { m } from "framer-motion";
import { useTranslation } from "react-i18next";

export type SnakeDifficulty = "slow" | "medium" | "fast";

const SPEEDS: Record<SnakeDifficulty, number> = {
  slow: 400,
  medium: 250,
  fast: 150,
};

interface SnakeSetupProps {
  onStart: (difficulty: SnakeDifficulty) => void;
  initialDifficulty: SnakeDifficulty;
}

export function SnakeSetup({ onStart, initialDifficulty }: SnakeSetupProps) {
  const { t } = useTranslation();
  const [difficulty, setDifficulty] = useState<SnakeDifficulty>(initialDifficulty);
  const difficulties: SnakeDifficulty[] = ["slow", "medium", "fast"];

  return (
    <div className="w-full flex flex-col items-center gap-8">
      <div className="w-full">
        <p className="text-lg font-bold text-purple-600 mb-3 text-center">🎮</p>
        <div className="flex gap-3 justify-center flex-wrap">
          {difficulties.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDifficulty(d)}
              className={`px-5 py-3 rounded-2xl font-bold text-lg transition-all active:scale-95 ${
                difficulty === d
                  ? "bg-green-500 text-white shadow-lg scale-105"
                  : "bg-white text-green-500 shadow-md"
              }`}
            >
              {t(`snake.difficulty.${d}`)}
            </button>
          ))}
        </div>
      </div>

      <m.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onStart(difficulty)}
        className="px-10 py-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold text-2xl shadow-xl"
      >
        {t("common.start")}
      </m.button>
    </div>
  );
}

export { SPEEDS };
