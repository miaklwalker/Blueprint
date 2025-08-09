// import path from 'path';
// import { BalatroAnalyzer } from './BalatroAnalyzer';
// import { Deck, DeckType } from './enum/Deck';
// import { Stake, StakeType } from './enum/Stake';
// import { Version } from './enum/Version';

// import { LuaRandom } from "./utils/LuaRandom";

// const indexPath = path.join(import.meta.dir, '..', 'client', 'index.html');

// Bun.serve({
// 	port: 3000,
// 	static: {
// 		"/index.html": new Response(await Bun.file(indexPath).bytes(), {
// 			headers: {
// 				"Content-Type": "text/html",
// 			},
// 		}),
// 		"/": Response.redirect("/index.html"),
// 	},
// 	fetch(req) {
// 		const url = new URL(req.url);
// 		if (url.pathname === "/analyze") {
// 			console.log("analysis requested...")
// 			const analyzer = new BalatroAnalyzer(
// 				// seed,
// 				1,
// 				[13], new Deck(DeckType.RED_DECK), new Stake(StakeType.BLACK_STAKE), Version.v_101c, {
// 				analyzeArcana: true,
// 				analyzeBoss: true,
// 				analyzeCelestialPacks: true,
// 				analyzeJokers: true,
// 				analyzeShopQueue: false,
// 				analyzeSpectral: true,
// 				analyzeStandardPacks: true,
// 				analyzeTags: true,
// 			});

// 			const foundSeeds = [];
// 			let processedSeeds = 0;

// 			for (let i = 0; i < 20000; i++) {
// 				const seed = generateRandomSeed();
// 				const run = analyzer.performAnalysis({
// 					seed,
// 					ante: 1,
// 					cardsPerAnte: [15, 50, 50, 50, 50, 50, 50, 50],
// 					deck: new Deck(DeckType.RED_DECK),
// 					stake: new Stake(StakeType.BLACK_STAKE),
// 					version: Version.v_101c
// 				});
// 				processedSeeds++;
// 				if (run.hasTheSoul) {
// 					foundSeeds.push(run.getSeed());
// 				}
// 				// performAnalysisAsync(seed, 1, [15, 50, 50, 50, 50, 50, 50, 50], new Deck(DeckType.RED_DECK), new Stake(StakeType.BLACK_STAKE), Version.v_101c);
// 			}

// 			return Response.json({
// 				processedSeeds,
// 				foundSeeds
// 			})
// 		}
// 		return new Response("404!");
// 	},
// });

// console.log(`Listening on port: 3000`)

// const CHARACTERS = "123456789ABCDEFGHIJKLMNPQRSTUVWXYZ";

// const generateRandomSeed = (length = 7) => {
// 	let seed = "";
// 	for (let i = 0; i < length; i++) {
// 		seed += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
// 	}
// 	return seed;
// }
// const lua = new LuaRandom(0.0);
// console.log("Random number:", lua.random()); // Example usage of LuaRandom
// ECEM83FA
// const analyzer = new BalatroAnalyzer(
// 	// seed,
// 	8,
// 	[13], new Deck(DeckType.RED_DECK), new Stake(StakeType.BLACK_STAKE), Version.v_101c, {
// 	analyzeArcana: true,
// 	analyzeBoss: true,
// 	analyzeCelestialPacks: true,
// 	analyzeJokers: true,
// 	analyzeShopQueue: true,
// 	analyzeSpectral: true,
// 	analyzeStandardPacks: true,
// 	analyzeTags: true,
// });
//
// const analysis = analyzer.performAnalysis({
// 	seed: "ECEM83FA",
// 	ante: 8,
// 	cardsPerAnte: [15, 50, 50, 50, 50, 50, 50, 50],
// 	deck: new Deck(DeckType.RED_DECK),
// 	stake: new Stake(StakeType.BLACK_STAKE),
// 	version: Version.v_101c
// });
//
// console.log("Analysis Result:", JSON.parse(JSON.stringify(analyzer.result.getResult)));
//
// export { };