import {describe, test, expect, suite} from "vitest";
import {analyzeSeed} from "../src/modules/ImmolateWrapper";
import {Game} from "../src/modules/balatrots/Game";
import {Ante, SeedResultsContainer} from "../src/modules/ImmolateWrapper/CardEngines/Cards";
import ResultsU8RJYV6N from "./U8RJYV6N.ver";
import Results2K9H9HN from "./2K9H9HN.ver"
import Results7LB2WVPK from "./7LB2WVPK.ver"
import ResultsVNOMH111 from "./VNOMH111.ver"
suite("Accuracy Panel", () => {
    suite.each([
        ["U8RJYV6N", ResultsU8RJYV6N],
        ["2K9H9HN", Results2K9H9HN],
        ["7LB2WVPK", Results7LB2WVPK],
        ["VNOMH111",ResultsVNOMH111]
    ])("Seed: %s", (seed, verifiedResults) => {
        const SEED = seed;
        const MaxAnte = 8;
        const Deck = "Ghost Deck";
        const Stake = "White Stake";
        const Version = "10106";
        const cardsPerAnte = 50;
        const results = analyzeSeed(
            {
                seed: SEED,
                deck: Deck,
                stake: Stake,
                gameVersion: Version,
                antes: MaxAnte,
                cardsPerAnte: cardsPerAnte
            },
            {
                buys: {},
                sells: {},
                showCardSpoilers: false,
                unlocks: [...Game.OPTIONS],
                events: [],
                updates: []
            }
        ) as SeedResultsContainer;
        describe("Antes should match" ,() => {
            const verifiedAntes = Object.values(verifiedResults.antes);
            const generatedAntes = Object.values(results.antes);
            const tests = verifiedAntes.map((verified: Ante, index: number) => ({verified:verified, generated:generatedAntes[index]}))
            describe
                .each(tests)
                ("Verified Ante %$ should match generated Ante", ({verified, generated}) => {
                    test("bosses should match", () => {
                        expect(generated.boss).toEqual(verified.boss);
                    })
                    test("Voucher should match", () => {
                        expect(generated.voucher).toEqual(verified.voucher);
                    })
                    test("Shop Queue should match", () => {
                        expect(generated.queue).toMatchObject(verified.queue);
                    })
                    test("tags should match", () => {
                        expect(generated.tags).toMatchObject(verified.tags);
                    })
                    const miscQueues = verified.miscCardSources.map(( source, index) => ({v:source, g:generated.miscCardSources[index]}));
                    describe.each(miscQueues)
                    ("Misc Queue $v.name should match", ({v, g}) => {
                        test("cards should match", () => {
                            expect(g.cards).toMatchObject(v.cards);
                        })
                    })
                })
        })

    })
})



