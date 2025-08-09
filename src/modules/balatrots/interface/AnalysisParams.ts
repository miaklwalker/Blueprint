import { Deck } from "../enum/Deck";
import { Stake } from "../enum/Stake";
import { Version } from "../enum/Version";

export interface AnalysisParams {
    seed: string;
    ante: number;
    cardsPerAnte: number[];
    deck: Deck;
    stake: Stake;
    version: Version;
}