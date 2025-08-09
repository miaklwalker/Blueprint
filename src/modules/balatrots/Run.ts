import { JokerImpl } from "./interface/Joker";
import { JokerData } from "./struct/JokerData";

//todo implement all elements besides jokers
export class Run {
    jokers = new Set<string>();
    legendary_jokers = new Set<JokerImpl>();
    has_the_soul = false;
    constructor(private seed: string){

    }

    getSeed(): string {
        return this.seed;
    }

    addJoker(joker: string): void {
        this.jokers.add(joker);
    }

    addLegendaryJoker(joker: JokerData): void {
        this.legendary_jokers.add(joker.joker);
    }

    get hasTheSoul(): boolean {
        return this.has_the_soul;
    }

    set hasTheSoul(has_the_soul: boolean) {
        this.has_the_soul = has_the_soul;
    }

}