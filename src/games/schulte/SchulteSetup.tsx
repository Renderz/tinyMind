import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { SchulteMode } from "./schulteLogic";

interface SchulteSetupProps {
  onStart: (mode: SchulteMode, size: number) => void;
  bestTimes: Record<string, number | null>;
}

export function SchulteSetup({ onStart, bestTimes }: SchulteSetupProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<SchulteMode>("forward");
  const [size, setSize] = useState(3);

  const modes: SchulteMode[] = ["forward", "backward", "random"];
  const sizes = [3, 4, 5];

  const bestKey = `schulte-${mode}-${size}`;

  return (
    <div className="w-full flex flex-col items-center gap-8">
      <div className="w-full">
        <p className="text-lg font-bold text-purple-600 mb-3 text-center">{t("schulte.mode.forward")}</p>
        <div className="flex gap-3 justify-center flex-wrap">
          {modes.map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-5 py-3 rounded-2xl font-bold text-lg transition-all active:scale-95 ${
                mode === m
                  ? "bg-purple-500 text-white shadow-lg scale-105"
                  : "bg-white text-purple-500 shadow-md"
              }`}
            >
              {t(`schulte.mode.${m}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full">
        <p className="text-lg font-bold text-purple-600 mb-3 text-center">{t("schulte.difficulty.3").split(" ")[1]}</p>
        <div className="flex gap-3 justify-center">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`px-5 py-3 rounded-2xl font-bold text-lg transition-all active:scale-95 ${
                size === s
                  ? "bg-sky-500 text-white shadow-lg scale-105"
                  : "bg-white text-sky-500 shadow-md"
              }`}
            >
              {t(`schulte.difficulty.${s}`)}
            </button>
          ))}
        </div>
      </div>

      {bestTimes[bestKey] != null && (
        <p className="text-purple-400 font-bold">
          {t("schulte.bestTime", { seconds: bestTimes[bestKey] })}
        </p>
      )}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onStart(mode, size)}
        className="px-10 py-4 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 text-white font-bold text-2xl shadow-xl"
      >
        {t("common.start")}
      </motion.button>
    </div>
  );
}
