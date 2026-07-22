import { expect, test } from "vitest";
import { analyzeSeed } from "../src/modules/ImmolateWrapper";
import { options } from "../src/modules/const";

// The store keys pack purchases as `${ante}-${kind}-${cardIndex}-p${packIndex}-${blind}`.
// analyzeSeed used to omit the `-p${packIndex}` segment, so every pack buy was
// silently dropped - most visibly The Soul, which never locked the legendary
// joker it grants and so kept showing the same one.
function run(buys: Record<string, any> = {}) {
    return analyzeSeed(
        { seed: "ALEEB", deck: "Ghost Deck", stake: "White Stake", gameVersion: "10106", antes: 4, cardsPerAnte: 60 },
        { buys, sells: {}, showCardSpoilers: true, unlocks: options, events: [], lockedCards: {} }
    ) as any;
}

// Spoilers on, so each Soul renders as the legendary joker it would grant.
function spoiledJokers(results: any): string[] {
    const out: string[] = [];
    for (const [ante, data] of Object.entries<any>(results.antes)) {
        if (ante === "0") continue;
        for (const [blind, b] of Object.entries<any>(data.blinds)) {
            b.packs.forEach((pack: any, packIndex: number) =>
                pack.cards.forEach((card: any, cardIndex: number) => {
                    if (pack.name !== "Buffoon" && card?.type === "Joker") {
                        out.push(`a${ante}/${blind}/${pack.name}#${packIndex}/c${cardIndex}=${card.name}`);
                    }
                }));
        }
    }
    return out;
}

// ALEEB has The Soul at ante 1 / bigBlind / Arcana pack 1 / card 2.
const SOUL_BUY = "1-Arcana-2-p1-bigBlind";

test("buying The Soul from a pack locks the legendary joker it grants", () => {
    const before = spoiledJokers(run());
    const after = spoiledJokers(run({ [SOUL_BUY]: { name: "The Soul" } }));

    // Untouched, every Soul in the run grants the same legendary.
    expect(before.filter(s => s.includes("Canio")).length).toBeGreaterThan(1);

    // Once bought, only the purchased one is Canio; the rest advance to the next.
    expect(after[0]).toContain("Canio");
    expect(after.filter(s => s.includes("Canio")).length).toBe(1);
    expect(after[1]).toContain("Perkeo");
});

test("a pack buy applies only to the pack index it was made in", () => {
    const base = spoiledJokers(run());
    const wrongPack = spoiledJokers(run({ "1-Arcana-2-p0-bigBlind": { name: "The Soul" } }));

    // Two packs of the same kind can share a blind, so the index must disambiguate.
    expect(wrongPack).toEqual(base);
});
