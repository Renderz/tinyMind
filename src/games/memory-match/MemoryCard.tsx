import { motion } from "framer-motion";
import type { MemoryCardData } from "./memoryLogic";

interface MemoryCardProps {
  card: MemoryCardData;
  isRevealed: boolean;
  lang: "zh" | "en";
  onClick: () => void;
  disabled: boolean;
}

export function MemoryCard({ card, isRevealed, lang, onClick, disabled }: MemoryCardProps) {
  const showFront = isRevealed || card.isMatched;

  return (
    <div className="w-full" style={{ perspective: "800px" }}>
      <motion.button
        onClick={onClick}
        disabled={disabled}
        animate={{ rotateY: showFront ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-full aspect-square rounded-2xl shadow-md disabled:cursor-default"
      >
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-3xl"
          style={{ backfaceVisibility: "hidden" }}
        >
          ❓
        </div>
        <div
          className={`absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-1 ${
            card.isMatched ? "bg-green-200" : "bg-white"
          }`}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <span className="text-4xl">{card.emoji}</span>
          {card.isMatched && (
            <span className="text-xs font-bold text-purple-500">
              {lang === "zh" ? card.nameZh : card.nameEn}
            </span>
          )}
        </div>
      </motion.button>
    </div>
  );
}
