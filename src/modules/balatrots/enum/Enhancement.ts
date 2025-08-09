import { ItemImpl } from "../interface/Item";

export enum Enhancement {
    BONUS = "Bonus",
    MULT = "Mult",
    WILD = "Wild",
    GLASS = "Glass",
    STEEL = "Steel",
    STONE = "Stone",
    GOLD = "Gold",
    LUCK = "Lucky"
}

export class EnhancementItem extends ItemImpl {
    constructor(readonly name: Enhancement) {
        super(name);
    }

    getName(): string {
        return this.name;
    }
}