import { useReducer, useCallback } from "react";
import { m, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { GameShell } from "../../components/GameShell";
import { Confetti } from "../../components/Confetti";
import { MemorySetup } from "./MemorySetup";
import { MemoryBoard } from "./MemoryBoard";

type Phase = "setup" | "playing" | "done";

interface PageState {
  phase: Phase;
  pairs: number;
  player1: string;
  player2: string;
  finalScores: [number, number];
}

type PageAction =
  | { type: "START"; pairs: number; player1: string; player2: string }
  | { type: "COMPLETE"; scores: [number, number] }
  | { type: "RESTART" };

const initialState: PageState = {
  phase: "setup",
  pairs: 2,
  player1: "",
  player2: "",
  finalScores: [0, 0],
};

function reducer(state: PageState, action: PageAction): PageState {
  switch (action.type) {
    case "START":
      return {
        ...state,
        pairs: action.pairs,
        player1: action.player1,
        player2: action.player2,
        phase: "playing",
      };
    case "COMPLETE":
      return { ...state, finalScores: action.scores, phase: "done" };
    case "RESTART":
      return { ...state, phase: "setup" };
    default:
      return state;
  }
}

export function MemoryPage() {
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleStart = useCallback((pairs: number, p1: string, p2: string) => {
    dispatch({ type: "START", pairs, player1: p1, player2: p2 });
  }, []);

  const handleComplete = useCallback((scores: [number, number]) => {
    dispatch({ type: "COMPLETE", scores });
  }, []);

  const { player1, player2, finalScores } = state;

  const winnerText =
    finalScores[0] > finalScores[1]
      ? t("memory.winner", { name: player1 })
      : finalScores[0] < finalScores[1]
      ? t("memory.winner", { name: player2 })
      : t("memory.tie");

  return (
    <GameShell title={t("memory.title")}>
      <AnimatePresence mode="wait">
        {state.phase === "setup" && (
          <m.div key="setup" exit={{ opacity: 0 }} className="w-full">
            <MemorySetup onStart={handleStart} />
          </m.div>
        )}

        {state.phase === "playing" && (
          <m.div key="playing" exit={{ opacity: 0 }} className="w-full">
            <MemoryBoard
              pairs={state.pairs}
              player1={player1}
              player2={player2}
              onComplete={handleComplete}
            />
          </m.div>
        )}

        {state.phase === "done" && (
          <m.div
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
              type="button"
              onClick={() => dispatch({ type: "RESTART" })}
              className="px-8 py-3 rounded-full bg-purple-500 text-white font-bold text-xl shadow-lg active:scale-95 transition-transform"
            >
              {t("common.restart")}
            </button>
          </m.div>
        )}
      </AnimatePresence>
    </GameShell>
  );
}
