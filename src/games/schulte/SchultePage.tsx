import { useReducer, useCallback } from "react";
import { m, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { GameShell } from "../../components/GameShell";
import { Confetti } from "../../components/Confetti";
import { SchulteSetup } from "./SchulteSetup";
import { SchulteBoard } from "./SchulteBoard";
import type { SchulteMode } from "./schulteLogic";
import { getBestTime, setBestTime } from "../../lib/storage";

type Phase = "setup" | "playing" | "done";

interface PageState {
  phase: Phase;
  mode: SchulteMode;
  size: number;
  finalTime: number;
  bestTimes: Record<string, number | null>;
}

type PageAction =
  | { type: "START"; mode: SchulteMode; size: number }
  | { type: "COMPLETE"; finalTime: number; mode: SchulteMode; size: number }
  | { type: "RESTART"; mode: SchulteMode; size: number; bestTime: number | null };

const initialState: PageState = {
  phase: "setup",
  mode: "forward",
  size: 3,
  finalTime: 0,
  bestTimes: {},
};

function reducer(state: PageState, action: PageAction): PageState {
  switch (action.type) {
    case "START":
      return { ...state, mode: action.mode, size: action.size, phase: "playing" };
    case "COMPLETE":
      return { ...state, finalTime: action.finalTime, phase: "done" };
    case "RESTART": {
      const key = `schulte-${action.mode}-${action.size}`;
      return {
        ...state,
        phase: "setup",
        bestTimes: { ...state.bestTimes, [key]: action.bestTime },
      };
    }
    default:
      return state;
  }
}

export function SchultePage() {
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleStart = useCallback((mode: SchulteMode, size: number) => {
    dispatch({ type: "START", mode, size });
  }, []);

  const handleComplete = useCallback(
    (elapsed: number) => {
      const key = `schulte-${state.mode}-${state.size}`;
      setBestTime(key, elapsed);
      dispatch({ type: "COMPLETE", finalTime: elapsed, mode: state.mode, size: state.size });
    },
    [state.mode, state.size]
  );

  const handleRestart = useCallback(() => {
    const key = `schulte-${state.mode}-${state.size}`;
    dispatch({ type: "RESTART", mode: state.mode, size: state.size, bestTime: getBestTime(key) });
  }, [state.mode, state.size]);

  return (
    <GameShell title={t("schulte.title")}>
      <AnimatePresence mode="wait">
        {state.phase === "setup" && (
          <m.div key="setup" exit={{ opacity: 0 }} className="w-full">
            <SchulteSetup
              onStart={handleStart}
              bestTimes={state.bestTimes}
              initialMode={state.mode}
              initialSize={state.size}
            />
          </m.div>
        )}

        {state.phase === "playing" && (
          <m.div key="playing" exit={{ opacity: 0 }} className="w-full">
            <SchulteBoard mode={state.mode} size={state.size} onComplete={handleComplete} />
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
            <h2 className="text-4xl font-bold text-purple-600">{t("common.completed")}</h2>
            <p className="text-2xl font-bold text-purple-500">
              {t("common.timeUsed", { seconds: state.finalTime.toFixed(1) })}
            </p>
            <button
              type="button"
              onClick={handleRestart}
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
