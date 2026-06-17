import { useState, useCallback } from "react";
import { m } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SchulteCell } from "./SchulteCell";
import { generateGrid, generateTargetSequence, type SchulteMode } from "./schulteLogic";
import { useTimer } from "../../hooks/useTimer";
import { playSound } from "../../lib/audio";

interface SchulteBoardProps {
  mode: SchulteMode;
  size: number;
  onComplete: (elapsed: number) => void;
}

export function SchulteBoard({ mode, size, onComplete }: SchulteBoardProps) {
  const { t } = useTranslation();
  const [grid] = useState(() => generateGrid(size));
  const [targetSeq] = useState(() => generateTargetSequence(mode, size));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wrongCell, setWrongCell] = useState<number | null>(null);
  const timer = useTimer();

  const handleCellClick = useCallback(
    (cellValue: number) => {
      if (currentIndex === 0 && !timer.isRunning) {
        timer.start();
      }

      if (cellValue === targetSeq[currentIndex]) {
        playSound("correct");
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);

        if (nextIndex >= targetSeq.length && timer.isRunning) {
          timer.stop();
          playSound("win");
          onComplete(timer.elapsed);
        }
      } else {
        playSound("wrong");
        setWrongCell(cellValue);
        setTimeout(() => setWrongCell(null), 400);
      }
    },
    [currentIndex, targetSeq, timer, onComplete]
  );

  const getCellState = (cellValue: number): "default" | "correct" | "wrong" => {
    const targetIndex = targetSeq.indexOf(cellValue);
    if (targetIndex < currentIndex) return "correct";
    if (wrongCell === cellValue) return "wrong";
    return "default";
  };

  const nextTarget = targetSeq[currentIndex];

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <span className="text-2xl font-bold text-purple-600">
          {t("common.timeUsed", { seconds: timer.elapsed.toFixed(1) })}
        </span>
        {mode === "random" && nextTarget && (
          <m.span
            key={nextTarget}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-bold text-pink-500 bg-pink-100 px-4 py-1 rounded-full"
          >
            {t("schulte.findNext", { target: nextTarget })}
          </m.span>
        )}
      </div>

      <div
        className="grid gap-2 w-full"
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          maxWidth: `${size * 90}px`,
        }}
      >
        {grid.map((number) => (
          <SchulteCell
            key={number}
            number={number}
            state={getCellState(number)}
            onClick={() => handleCellClick(number)}
          />
        ))}
      </div>
    </div>
  );
}
