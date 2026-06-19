export type SchulteMode = "forward" | "backward" | "random" | "odd" | "even";

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function generateNumberSet(mode: SchulteMode, size: number): number[] {
  const total = size * size;

  switch (mode) {
    case "forward":
    case "backward":
      return Array.from({ length: total }, (_, i) => i + 1);
    case "odd":
      return Array.from({ length: total }, (_, i) => i * 2 + 1);
    case "even":
      return Array.from({ length: total }, (_, i) => (i + 1) * 2);
    case "random": {
      const numbers = new Set<number>();
      while (numbers.size < total) {
        numbers.add(Math.floor(Math.random() * (total * 4)) + 1);
      }
      return [...numbers];
    }
  }
}

export function generateGrid(mode: SchulteMode, size: number): number[] {
  return shuffle(generateNumberSet(mode, size));
}

export function generateTargetSequence(mode: SchulteMode, grid: number[]): number[] {
  const sorted = grid.toSorted((a, b) => a - b);
  if (mode === "backward") {
    return sorted.reverse();
  }
  return sorted;
}
