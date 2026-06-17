import { useState } from "react";
import { m } from "framer-motion";
import { useTranslation } from "react-i18next";

const PAIR_OPTIONS = [2, 4, 6];

interface MemorySetupProps {
  onStart: (pairs: number, player1: string, player2: string) => void;
}

export function MemorySetup({ onStart }: MemorySetupProps) {
  const { t } = useTranslation();
  const [pairs, setPairs] = useState(2);
  const [player1, setPlayer1] = useState(() => t("memory.player1"));
  const [player2, setPlayer2] = useState(() => t("memory.player2"));

  return (
    <div className="w-full flex flex-col items-center gap-8">
      <div className="w-full">
        <p className="text-lg font-bold text-purple-600 mb-3 text-center">❤️</p>
        <div className="flex flex-col gap-3 items-center">
          <input
            type="text"
            value={player1}
            onChange={(e) => setPlayer1(e.target.value)}
            maxLength={10}
            aria-label={t("memory.player1")}
            className="px-4 py-3 rounded-2xl bg-white shadow-md text-center font-bold text-pink-600 text-lg w-48 outline-none focus:ring-2 ring-pink-300"
            placeholder={t("memory.player1")}
          />
          <span className="text-2xl">🆚</span>
          <input
            type="text"
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
            maxLength={10}
            aria-label={t("memory.player2")}
            className="px-4 py-3 rounded-2xl bg-white shadow-md text-center font-bold text-sky-600 text-lg w-48 outline-none focus:ring-2 ring-sky-300"
            placeholder={t("memory.player2")}
          />
        </div>
      </div>

      <div className="w-full">
        <p className="text-lg font-bold text-purple-600 mb-3 text-center">🎮</p>
        <div className="flex gap-3 justify-center flex-wrap">
          {PAIR_OPTIONS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPairs(p)}
              className={`px-5 py-3 rounded-2xl font-bold text-lg transition-all active:scale-95 ${
                pairs === p
                  ? "bg-sky-500 text-white shadow-lg scale-105"
                  : "bg-white text-sky-500 shadow-md"
              }`}
            >
              {t(`memory.difficulty.${p}`)}
            </button>
          ))}
        </div>
      </div>

      <m.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onStart(pairs, player1 || t("memory.player1"), player2 || t("memory.player2"))}
        className="px-10 py-4 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 text-white font-bold text-2xl shadow-xl"
      >
        {t("common.start")}
      </m.button>
    </div>
  );
}
