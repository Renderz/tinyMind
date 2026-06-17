import { motion } from "framer-motion";

interface SchulteCellProps {
  number: number;
  state: "default" | "correct" | "wrong";
  onClick: () => void;
}

export function SchulteCell({ number, state, onClick }: SchulteCellProps) {
  const bg =
    state === "correct"
      ? "bg-green-400 text-white"
      : state === "wrong"
      ? "bg-red-300 text-white"
      : "bg-white text-purple-700";

  return (
    <motion.button
      onClick={onClick}
      animate={
        state === "wrong"
          ? { x: [0, -8, 8, -6, 6, 0] }
          : state === "correct"
          ? { scale: [1, 1.15, 1] }
          : {}
      }
      transition={{ duration: 0.3 }}
      className={`w-full aspect-square rounded-2xl shadow-md font-bold flex items-center justify-center ${bg} transition-colors duration-200`}
      style={{ fontSize: "clamp(1.5rem, 6vw, 2.5rem)" }}
    >
      {number}
    </motion.button>
  );
}
