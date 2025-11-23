import { describe, expect, suite, test } from "vitest";
import { analyzeSeed } from "../src/modules/ImmolateWrapper";
import { Ante, SeedResultsContainer } from "../src/modules/ImmolateWrapper/CardEngines/Cards";

interface JSONSeedTest {
    analyzeState: any;
    options: any;
    immolateResults: SeedResultsContainer;
}
function loadJSONFiles() {
    // ./seedJson/*.json
    // @ts-ignore
    const files = import.meta.glob('./seedJson/*.json', { eager: true });
    const tests: JSONSeedTest[] = [];
    for (const path in files) {
        const fileName = path.split('/').pop()?.replace('.json', '');
        if (fileName) {
            let temp = (files[path] as { default: JSONSeedTest }).default;
            tests.push(temp);
        }
    }
    return tests;
}

const files = loadJSONFiles()

suite("Accuracy Panel", () => {
    suite.each(files)("Seed: $analyzeState.seed", ({ analyzeState, immolateResults, options }: JSONSeedTest) => {
        const SEED = analyzeState.seed;
        const MaxAnte = analyzeState.antes;
        const verifiedResults = immolateResults;
        const Deck = analyzeState.deck;
        const Stake = analyzeState.stake;
        const Version = analyzeState.gameVersion;
        const cardsPerAnte = analyzeState.cardsPerAnte;
        const results = analyzeSeed(
            {
                seed: SEED,
                deck: Deck,
                stake: Stake,
                gameVersion: Version,
                antes: MaxAnte,
                cardsPerAnte: cardsPerAnte
            },
            options
        ) as SeedResultsContainer;
        if(!verifiedResults.antes[0]){
            delete results.antes[0];
        }

        describe("Ante Suite", () => {
            const verifiedAntes = Object.values(verifiedResults.antes);

            const generatedAntes = Object.values(results.antes);
            const tests = verifiedAntes.map((verified: Ante, index: number) => ({ verified: verified, generated: generatedAntes[index] }))
            describe
                .each(tests)
                ("Verified Ante %$ Antes should match %$ should match generated Ante", ({ verified, generated }) => {
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
                    test("Packs should match", () => {
                        expect(generated.blinds).toMatchObject(verified.blinds);
                    })
                    const miscQueues = verified?.miscCardSources.map((source, index) => ({ v: source, g: generated.miscCardSources[index] }));
                    describe.each(miscQueues)
                        ("Misc Queue $v.name should match", ({ v, g }) => {
                            test("cards should match", () => {
                                g.cards.length = v.cards.length;
                                expect(g.cards).toMatchObject(v.cards);
                            })
                        })
                    describe("Wheel of Fortune", () => {
                        const generatedQueue = generated.wheelQueue || [];
                        const verifiedQueue = verified.wheelQueue || generatedQueue || [];
                        const editions =
                            generatedQueue.map((item, index) => ({ g: item.edition, v: verifiedQueue[index].edition }))
                        describe
                            .each(editions)
                            ("Wheel of fortune should edition should match", ({ g, v }) => {
                                test("edition should match", () => {
                                    expect(g).toEqual(v);
                                })
                            })
                    })
                    describe("Aura", () => {
                        const generatedQueue = generated.auraQueue || [];
                        const verifiedQueue = verified.auraQueue || generatedQueue || [];
                        const editions =
                            generatedQueue.map((item, index) => ({ g: item.edition, v: verifiedQueue[index].edition }))
                        describe
                            .each(editions)
                            ("Aura should edition should match", ({ g, v }) => {
                                test("edition should match", () => {
                                    expect(g).toEqual(v);
                                })
                            })
                    })

                })
        })

    })
})



