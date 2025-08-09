import { ItemImpl } from "../../interface/Item";

export enum Type {
    JOKER = "Joker",
    TAROT = "Tarot",
    PLANET = "Planet",
    SPECTRAL = "Spectral",
    PLAYING_CARD = "Playing Card"
}

export class CardType extends ItemImpl {
    constructor(readonly name: Type) {
        super(name);
    }

    getName(): string {
        return this.name;
    }
}