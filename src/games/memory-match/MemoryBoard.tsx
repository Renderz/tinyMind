import { useReducer, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MemoryCard } from "./MemoryCard";
import { generateCards, isMatch, type MemoryCardData } from "./memoryLogic";
import { playSound } from "../../lib/audio";

interface MemoryBoardProps {
  pairs: number;
  player1: string;
  player2: string;
  onComplete: (scores: [number, number]) => void;
}

interface GameState {
  cards: MemoryCardData[];
  flippedIds: number[];
  currentPlayer: 0 | 1;
  scores: [number, number];
  locked: boolean;
}

type GameAction =
  | { type: "FLIP"; flippedIds: number[] }
  | { type: "LOCK"; flippedIds: number[] }
  | { type: "MATCH_SUCCESS" }
  | { type: "MATCH_FAIL" };

function init(pairs: number): GameState {
  return {
    cards: generateCards(pairs),
    flippedIds: [],
    currentPlayer: 0,
    scores: [0, 0],
    locked: false,
  };
}

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "FLIP":
      return { ...state, flippedIds: action.flippedIds };
    case "LOCK":
      return { ...state, flippedIds: action.flippedIds, locked: true };
    case "MATCH_SUCCESS":
      return {
        ...state,
        cards: state.cards.map((c) =>
          state.flippedIds.includes(c.id) ? { ...c, isMatched: true } : c
        ),
        scores: state.currentPlayer === 0
          ? [state.scores[0] + 1, state.scores[1]] as [number, number]
          : [state.scores[0], state.scores[1] + 1] as [number, number],
        flippedIds: [],
        locked: false,
      };
    case "MATCH_FAIL":
      return {
        ...state,
        flippedIds: [],
        currentPlayer: state.currentPlayer === 0 ? 1 : 0,
        locked: false,
      };
    default:
      return state;
  }
}

export function MemoryBoard({ pairs, player1, player2, onComplete }: MemoryBoardProps) {
  const { t, i18n } = useTranslation();
  const [state, dispatch] = useReducer(reducer, pairs, init);

  const allMatched = state.cards.every((c) => c.isMatched);

  useEffect(() => {
    if (allMatched && state.cards.length > 0) {
      playSound("win");
      const timer = setTimeout(() => onComplete(state.scores), 1500);
      return () => clearTimeout(timer);
    }
  }, [allMatched, state.cards.length, state.scores, onComplete]);

  const handleClick = useCallback(
    (cardId: number) => {
      const { cards, flippedIds, locked } = state;
      if (locked) return;
      const card = cards.find((c) => c.id === cardId);
      if (!card || card.isMatched || flippedIds.includes(cardId)) return;

      playSound("flip");
      const newFlipped = [...flippedIds, cardId];

      if (newFlipped.length < 2) {
        dispatch({ type: "FLIP", flippedIds: newFlipped });
        return;
      }

      dispatch({ type: "LOCK", flippedIds: newFlipped });
      const [idA, idB] = newFlipped;
      const cardA = cards.find((c) => c.id === idA)!;
      const cardB = cards.find((c) => c.id === idB)!;

      if (isMatch(cardA, cardB)) {
        setTimeout(() => {
          playSound("correct");
          dispatch({ type: "MATCH_SUCCESS" });
        }, 600);
      } else {
        setTimeout(() => {
          dispatch({ type: "MATCH_FAIL" });
        }, 1200);
      }
    },
    [state]
  );

  const { currentPlayer, scores, locked, cards, flippedIds } = state;
  const playerName = currentPlayer === 0 ? player1 : player2;
  const playerColor = currentPlayer === 0 ? "text-pink-500" : "text-sky-500";
  const playerBg = currentPlayer === 0 ? "bg-pink-100" : "bg-sky-100";
  const cols = pairs <= 2 ? 2 : 4;

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="w-full flex justify-center gap-6">
        <div className={`px-4 py-2 rounded-2xl font-bold text-lg ${currentPlayer === 0 ? "bg-pink-200 text-pink-700 scale-105" : "bg-white text-pink-400"}`}>
          {player1}: {scores[0]}
        </div>
        <div className={`px-4 py-2 rounded-2xl font-bold text-lg ${currentPlayer === 1 ? "bg-sky-200 text-sky-700 scale-105" : "bg-white text-sky-400"}`}>
          {player2}: {scores[1]}
        </div>
      </div>

      <div className={`px-6 py-2 rounded-full font-bold text-lg ${playerBg} ${playerColor}`}>
        {t("memory.turn", { name: playerName })}
      </div>

      <div
        className="grid gap-2 w-full"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, maxWidth: `${cols * 90}px` }}
      >
        {cards.map((card) => (
          <MemoryCard
            key={card.id}
            card={card}
            isRevealed={flippedIds.includes(card.id)}
            lang={i18n.language as "zh" | "en"}
            onClick={() => handleClick(card.id)}
            disabled={locked}
          />
        ))}
      </div>
    </div>
  );
}
