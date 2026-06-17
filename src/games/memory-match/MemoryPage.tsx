import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { GameShell } from "../../components/GameShell";
import { Confetti } from "../../components/Confetti";
import { MemorySetup } from "./MemorySetup";
import { MemoryBoard } from "./MemoryBoard";

type Phase = "setup" | "playing" | "done";

export function MemoryPage() {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<Phase>("setup");
  const [pairs, setPairs] = useState(2);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [finalScores, setFinalScores] = useState<[number, number]>([0, 0]);

  const handleStart = useCallback((p: number, p1: string, p2: string) => {
    setPairs(p);
    setPlayer1(p1);
    setPlayer2(p2);
    setPhase("playing");
  }, []);

  const handleComplete = useCallback((scores: [number, number]) => {
    setFinalScores(scores);
    setPhase("done");
  }, []);

  const winnerText =
    finalScores[0] > finalScores[1]
      ? t("memory.winner", { name: player1 })
      : finalScores[0] < finalScores[1]
      ? t("memory.winner", { name: player2 })
      : t("memory.tie");

  return (
    <GameShell title={t("memory.title")}>
      <AnimatePresence mode="wait">
        {phase === "setup" && (
          <motion.div key="setup" exit={{ opacity: 0 }} className="w-full">
            <MemorySetup onStart={handleStart} />
          </motion.div>
        )}

        {phase === "playing" && (
          <motion.div key="playing" exit={{ opacity: 0 }} className="w-full">
            <MemoryBoard
              pairs={pairs}
              player1={player1}
              player2={player2}
              onComplete={handleComplete}
            />
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
            <h2 className="text-4xl font-bold text-purple-600">{winnerText}</h2>
            <div className="flex gap-6 text-2xl font-bold">
              <span className="text-pink-500">{player1}: {finalScores[0]}</span>
              <span className="text-sky-500">{player2}: {finalScores[1]}</span>
            </div>
            <button
              onClick={() => setPhase("setup")}
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
