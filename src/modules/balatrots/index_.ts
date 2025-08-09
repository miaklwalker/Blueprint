// import { BalatroAnalyzer } from "./BalatroAnalyzer";
// import { Deck, DeckType } from "./enum/Deck";
// import { Stake, StakeType } from "./enum/Stake";
// import { Version } from "./enum/Version";
//
// const CHARACTERS = "123456789ABCDEFGHIJKLMNPQRSTUVWXYZ";
//
// const generateRandomSeed = (length = 7) => {
//     let seed = "";
//     for (let i = 0; i < length; i++) {
//         seed += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
//     }
//     return seed;
// }
// // const seed = "SYRULAU" /*  generateRandomSeed() */;
// const analyzer = new BalatroAnalyzer(
//     // seed,
//     1,
//     [13], new Deck(DeckType.RED_DECK), new Stake(StakeType.BLACK_STAKE), Version.v_101c, {
//     analyzeArcana: true,
//     analyzeBoss: true,
//     analyzeCelestialPacks: true,
//     analyzeJokers: true,
//     analyzeShopQueue: false,
//     analyzeSpectral: true,
//     analyzeStandardPacks: true,
//     analyzeTags: true,
// })
//
// // console.log('seed', seed);
// const foundSeeds = new Array();
// let processedSeeds = 0;
//
// console.time('analysis');
// function performAnalysisAsync(seed: string, ante: number, cardsPerAnte: number[], deck: Deck, stake: Stake, version: Version) {
//     const run = analyzer.performAnalysis({
//         seed,
//         ante,
//         cardsPerAnte,
//         deck,
//         stake,
//         version
//     });
//     processedSeeds++;
//     if (run.hasTheSoul) {
//         foundSeeds.push(run.getSeed());
//     }
// }
//
// function runAnalysis() {
//     for (let i = 0; i < 20000; i++) {
//         const seed = generateRandomSeed();
//         const run = analyzer.performAnalysis({
//             seed,
//             ante: 1,
//             cardsPerAnte: [15, 50, 50, 50, 50, 50, 50, 50],
//             deck: new Deck(DeckType.RED_DECK),
//             stake: new Stake(StakeType.BLACK_STAKE),
//             version:  Version.v_101c
//         });
//         processedSeeds++;
//         if (run.hasTheSoul) {
//             foundSeeds.push(run.getSeed());
//         }
//         // performAnalysisAsync(seed, 1, [15, 50, 50, 50, 50, 50, 50, 50], new Deck(DeckType.RED_DECK), new Stake(StakeType.BLACK_STAKE), Version.v_101c);
//     }
//
//     console.timeEnd('analysis');
//     console.log('found seeds', foundSeeds);
// }
//
// runAnalysis();
//
// export { };