export type SchulteMode = "forward" | "backward" | "random";

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateGrid(size: number): number[] {
  const total = size * size;
  return shuffle(Array.from({ length: total }, (_, i) => i + 1));
}

export function generateTargetSequence(mode: SchulteMode, size: number): number[] {
  const total = size * size;
  const numbers = Array.from({ length: total }, (_, i) => i + 1);

  switch (mode) {
    case "forward":
      return numbers;
    case "backward":
      return numbers.reverse();
    case "random":
      return shuffle(numbers);
  }
}
