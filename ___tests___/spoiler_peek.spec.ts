import { expect, test } from "vitest";
import { analyzeSeed } from "../src/modules/ImmolateWrapper";
import { options } from "../src/modules/const";

function getAnte2BossArcanaSpoilerJokers(cardsPerAnte: number): string[] {
  const results = analyzeSeed(
    {
      seed: "TYTWAA1P",
      deck: "Plasma Deck",
      stake: "White Stake",
      gameVersion: "10106",
      antes: 2,
      cardsPerAnte,
    },
    {
      buys: {},
      sells: {},
      showCardSpoilers: true,
      unlocks: options,
      events: [],
      lockedCards: {},
    }
  ) as any;

  const packs = results?.antes?.[2]?.blinds?.bossBlind?.packs ?? [];
  const arcanaPacks = packs.filter((p: any) => p?.name === "Arcana");
  const jokerNames = arcanaPacks.flatMap((p: any) =>
    (p?.cards ?? [])
      .filter((c: any) => c?.type === "Joker")
      .map((c: any) => c?.name)
  );

  return jokerNames;
}

test("TYTWAA1P: Judgement spoiler does not change when Cards per Ante changes", () => {
  const at50 = getAnte2BossArcanaSpoilerJokers(50);
  const at100 = getAnte2BossArcanaSpoilerJokers(100);
  const at150 = getAnte2BossArcanaSpoilerJokers(150);

  expect(at50.length).toBeGreaterThan(0);
  expect(at50).toEqual(at100);
  expect(at50).toEqual(at150);

  expect(at50).toContain("Ice Cream");
  expect(at50).not.toContain("Sixth Sense");
});

