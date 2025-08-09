import { ItemImpl } from "../interface/Item";

export enum Suit {
    SPADES = "Spades",
    HEARTS = "Hearts",
    CLUBS = "Clubs",
    DIAMONDS = "Diamonds"
}

export class SuitItem extends ItemImpl {
    constructor(readonly name: Suit) {
        super(name);
    }

    getName(): string {
        return this.name;
    }
}