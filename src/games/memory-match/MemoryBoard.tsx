import { useState, useCallback, useEffect } from "react";
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

export function MemoryBoard({ pairs, player1, player2, onComplete }: MemoryBoardProps) {
  const { t, i18n } = useTranslation();
  const [cards, setCards] = useState<MemoryCardData[]>(() => generateCards(pairs));
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<0 | 1>(0);
  const [scores, setScores] = useState<[number, number]>([0, 0]);
  const [locked, setLocked] = useState(false);

  const allMatched = cards.every((c) => c.isMatched);

  useEffect(() => {
    if (allMatched && cards.length > 0) {
      playSound("win");
      const timer = setTimeout(() => onComplete(scores), 1500);
      return () => clearTimeout(timer);
    }
  }, [allMatched, cards.length, scores, onComplete]);

  const handleClick = useCallback(
    (cardId: number) => {
      if (locked) return;
      const card = cards.find((c) => c.id === cardId);
      if (!card || card.isMatched || flippedIds.includes(cardId)) return;

      playSound("flip");
      const newFlipped = [...flippedIds, cardId];
      setFlippedIds(newFlipped);

      if (newFlipped.length === 2) {
        setLocked(true);
        const [idA, idB] = newFlipped;
        const cardA = cards.find((c) => c.id === idA)!;
        const cardB = cards.find((c) => c.id === idB)!;

        if (isMatch(cardA, cardB)) {
          setTimeout(() => {
            playSound("correct");
            setCards((prev) =>
              prev.map((c) =>
                c.id === idA || c.id === idB ? { ...c, isMatched: true } : c
              )
            );
            setScores((prev) => {
              const next = [...prev] as [number, number];
              next[currentPlayer]++;
              return next;
            });
            setFlippedIds([]);
            setLocked(false);
          }, 600);
        } else {
          setTimeout(() => {
            setFlippedIds([]);
            setCurrentPlayer((p) => (p === 0 ? 1 : 0));
            setLocked(false);
          }, 1200);
        }
      }
    },
    [cards, flippedIds, locked, currentPlayer]
  );

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
