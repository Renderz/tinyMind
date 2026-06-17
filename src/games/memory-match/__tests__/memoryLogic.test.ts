import { describe, it, expect } from "vitest";
import { generateCards, isMatch } from "../memoryLogic";

describe("generateCards", () => {
  it("generates 4 cards for 2 pairs", () => {
    const cards = generateCards(2);
    expect(cards).toHaveLength(4);
    const emojiCounts: Record<string, number> = {};
    cards.forEach((c) => {
      emojiCounts[c.emoji] = (emojiCounts[c.emoji] || 0) + 1;
    });
    expect(Object.keys(emojiCounts)).toHaveLength(2);
    Object.values(emojiCounts).forEach((count) => expect(count).toBe(2));
  });

  it("generates 12 cards for 6 pairs", () => {
    const cards = generateCards(6);
    expect(cards).toHaveLength(12);
  });

  it("each card starts face down and not matched", () => {
    const cards = generateCards(4);
    cards.forEach((card) => {
      expect(card.isFlipped).toBe(false);
      expect(card.isMatched).toBe(false);
    });
  });

  it("shuffles card positions", () => {
    const first = generateCards(4).map((c) => c.emoji).join(",");
    let allSame = true;
    for (let i = 0; i < 20; i++) {
      if (generateCards(4).map((c) => c.emoji).join(",") !== first) {
        allSame = false;
        break;
      }
    }
    expect(allSame).toBe(false);
  });
});

describe("isMatch", () => {
  it("returns true when emojis match", () => {
    expect(isMatch({ emoji: "🐶" }, { emoji: "🐶" })).toBe(true);
  });

  it("returns false when emojis differ", () => {
    expect(isMatch({ emoji: "🐶" }, { emoji: "🐱" })).toBe(false);
  });
});
