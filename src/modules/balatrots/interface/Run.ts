import { Queries } from "./Queries";

export interface Run extends Queries {
    seed(): string;
    toJson(): string;
    getAnte(ante: number): Ante;
    antes(): Ante[];

    getFirstAnte(): Ante;
    getSecondAnte(): Ante;
    getThirdAnte(): Ante;

    getBufferedJokerCount(): number;
    getScore(): number;
    getJokers(): Set<string>;
    getRareJokers(): Set<string>;
    getUncommonJokers(): Set<string>;
    getNegativeJokerCount(): number;
    getTarots(): Set<string>;
    getTags(): Set<string>;
    getPlanets(): Set<string>;
    getVouchers(): Set<string>;
    getBosses(): Set<string>;
    getLegendaryJokers(): Set<string>;
    
    getStandardPackCount(): number;
    getJokerPackCount(): number;
    getSpectralPackCount(): number;
    getTarotPackCount(): number;
    getPlanetPackCount(): number;
}