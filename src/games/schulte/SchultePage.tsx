import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { GameShell } from "../../components/GameShell";
import { Confetti } from "../../components/Confetti";
import { SchulteSetup } from "./SchulteSetup";
import { SchulteBoard } from "./SchulteBoard";
import type { SchulteMode } from "./schulteLogic";
import { getBestTime, setBestTime } from "../../lib/storage";

type Phase = "setup" | "playing" | "done";

export function SchultePage() {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<Phase>("setup");
  const [mode, setMode] = useState<SchulteMode>("forward");
  const [size, setSize] = useState(3);
  const [finalTime, setFinalTime] = useState(0);
  const [bestTimes, setBestTimes] = useState<Record<string, number | null>>({});

  const refreshBestTime = useCallback((m: SchulteMode, s: number) => {
    const key = `schulte-${m}-${s}`;
    setBestTimes((prev) => ({ ...prev, [key]: getBestTime(key) }));
  }, []);

  const handleStart = useCallback((m: SchulteMode, s: number) => {
    setMode(m);
    setSize(s);
    setPhase("playing");
  }, []);

  const handleComplete = useCallback(
    (elapsed: number) => {
      setFinalTime(elapsed);
      const key = `schulte-${mode}-${size}`;
      setBestTime(key, elapsed);
      setPhase("done");
    },
    [mode, size]
  );

  const handleRestart = useCallback(() => {
    refreshBestTime(mode, size);
    setPhase("setup");
  }, [mode, size, refreshBestTime]);

  return (
    <GameShell title={t("schulte.title")}>
      <AnimatePresence mode="wait">
        {phase === "setup" && (
          <motion.div key="setup" exit={{ opacity: 0 }} className="w-full">
            <SchulteSetup onStart={handleStart} bestTimes={bestTimes} />
          </motion.div>
        )}

        {phase === "playing" && (
          <motion.div key="playing" exit={{ opacity: 0 }} className="w-full">
            <SchulteBoard mode={mode} size={size} onComplete={handleComplete} />
          </motion.div>
        )}

        {phase === "done" && (
          <motion.div
            key="done"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <Confetti />
            <h2 className="text-4xl font-bold text-purple-600">{t("common.completed")}</h2>
            <p className="text-2xl font-bold text-purple-500">
              {t("common.timeUsed", { seconds: finalTime.toFixed(1) })}
            </p>
            <button
              onClick={handleRestart}
              className="px-8 py-3 rounded-full bg-purple-500 text-white font-bold text-xl shadow-lg active:scale-95 transition-transform"
            >
              {t("common.restart")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </GameShell>
  );
}
