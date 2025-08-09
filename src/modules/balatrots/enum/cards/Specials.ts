import { ItemImpl } from "../../interface/Item";

export enum Specials {
    BLACKHOLE = "Black Hole",
    THE_SOUL = "The Soul"
}

export class SpecialsItem extends ItemImpl {
    constructor(readonly name: Specials) {
        super(name);
    }

    getName(): string {
        return this.name;
    }
}