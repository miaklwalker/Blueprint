import { ItemImpl } from "../interface/Item";

export enum Rank {
    // Number Cards
    R_2 = "2",
    R_3 = "3",
    R_4 = "4",
    R_5 = "5",
    R_6 = "6",
    R_7 = "7",
    R_8 = "8",
    R_9 = "9",
    R_10 = "10",

    // Face Cards
    R_JACK = "Jack",
    R_QUEEN = "Queen",
    R_KING = "King",
    R_ACE = "Ace"
}

export class RankItem extends ItemImpl {
    constructor(readonly name: Rank) {
        super(name);
    }

    getName(): string {
        return this.name;
    }
}