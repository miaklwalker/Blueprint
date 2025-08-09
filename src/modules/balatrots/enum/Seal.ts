import { ItemImpl } from "../interface/Item";

export enum Seal {
    // Base State
    NO_SEAL = "No Seal",

    // Color Seals
    RED_SEAL = "Red Seal",
    BLUE_SEAL = "Blue Seal",
    GOLD_SEAL = "Gold Seal",
    PURPLE_SEAL = "Purple Seal"
}

export class SealItem extends ItemImpl {
    constructor(readonly name: Seal) {
        super(name);
    }

    getName() {
        return this.name;
    }
}