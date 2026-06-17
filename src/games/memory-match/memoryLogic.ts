export interface MemoryCardData {
  id: number;
  emoji: string;
  nameZh: string;
  nameEn: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const EMOJI_POOL: { emoji: string; nameZh: string; nameEn: string }[] = [
  { emoji: "🐶", nameZh: "小狗", nameEn: "Dog" },
  { emoji: "🐱", nameZh: "小猫", nameEn: "Cat" },
  { emoji: "🐰", nameZh: "兔子", nameEn: "Rabbit" },
  { emoji: "🐻", nameZh: "小熊", nameEn: "Bear" },
  { emoji: "🐼", nameZh: "熊猫", nameEn: "Panda" },
  { emoji: "🦁", nameZh: "狮子", nameEn: "Lion" },
  { emoji: "🐸", nameZh: "青蛙", nameEn: "Frog" },
  { emoji: "🐵", nameZh: "猴子", nameEn: "Monkey" },
  { emoji: "🚗", nameZh: "汽车", nameEn: "Car" },
  { emoji: "🍎", nameZh: "苹果", nameEn: "Apple" },
  { emoji: "🍌", nameZh: "香蕉", nameEn: "Banana" },
  { emoji: "⚽", nameZh: "足球", nameEn: "Ball" },
];

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateCards(pairs: number): MemoryCardData[] {
  const selected = shuffle(EMOJI_POOL).slice(0, pairs);
  const cards: MemoryCardData[] = selected.flatMap((item, pairIndex) => {
    const baseId = pairIndex * 2;
    return [
      { ...item, id: baseId, isFlipped: false, isMatched: false },
      { ...item, id: baseId + 1, isFlipped: false, isMatched: false },
    ];
  });
  return shuffle(cards);
}

export function isMatch(cardA: Pick<MemoryCardData, "emoji">, cardB: Pick<MemoryCardData, "emoji">): boolean {
  return cardA.emoji === cardB.emoji;
}
