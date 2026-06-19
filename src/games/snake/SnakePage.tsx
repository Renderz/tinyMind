import { useReducer, useCallback } from "react";
import { m, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { GameShell } from "../../components/GameShell";
import { Confetti } from "../../components/Confetti";
import { SnakeSetup, SPEEDS, type SnakeDifficulty } from "./SnakeSetup";
import { SnakeBoard } from "./SnakeBoard";

type Phase = "setup" | "playing" | "done";

interface PageState {
  phase: Phase;
  difficulty: SnakeDifficulty;
  finalScore: number;
}

type PageAction =
  | { type: "START"; difficulty: SnakeDifficulty }
  | { type: "COMPLETE"; score: number };

const initialState: PageState = {
  phase: "setup",
  difficulty: "slow",
  finalScore: 0,
};

function reducer(state: PageState, action: PageAction): PageState {
  switch (action.type) {
    case "START":
      return { ...state, difficulty: action.difficulty, phase: "playing" };
    case "COMPLETE":
      return { ...state, finalScore: action.score, phase: "done" };
    default:
      return state;
  }
}

export function SnakePage() {
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleStart = useCallback((difficulty: SnakeDifficulty) => {
    dispatch({ type: "START", difficulty });
  }, []);

  const handleComplete = useCallback((score: number) => {
    dispatch({ type: "COMPLETE", score });
  }, []);

  return (
    <GameShell title={t("snake.title")}>
      <AnimatePresence mode="wait">
        {state.phase === "setup" && (
          <m.div key="setup" exit={{ opacity: 0 }} className="w-full">
            <SnakeSetup onStart={handleStart} initialDifficulty={state.difficulty} />
          </m.div>
        )}

        {state.phase === "playing" && (
          <m.div key="playing" exit={{ opacity: 0 }} className="w-full">
            <SnakeBoard speed={SPEEDS[state.difficulty]} onComplete={handleComplete} />
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
            <h2 className="text-4xl font-bold text-green-600">{t("common.completed")}</h2>
            <p className="text-2xl font-bold text-green-500">
              {t("snake.score", { score: state.finalScore })}
            </p>
            <button
              type="button"
              onClick={() => dispatch({ type: "START", difficulty: state.difficulty })}
              className="px-8 py-3 rounded-full bg-green-500 text-white font-bold text-xl shadow-lg active:scale-95 transition-transform"
            >
              {t("common.restart")}
            </button>
          </m.div>
        )}
      </AnimatePresence>
    </GameShell>
  );
}
