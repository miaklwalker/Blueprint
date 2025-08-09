import { ItemImpl } from "../../interface/Item";

export enum PackKind {
    CELESTIAL = "Celestial",
    ARCANA = "Arcana",
    STANDARD = "Standard",
    BUFFOON = "Buffoon",
    SPECTRAL = "Spectral"
}

export class PackKindItem extends ItemImpl {
    constructor(readonly name: PackKind) {
        super(name);
    }

    getName(): string {
        return this.name;
    }
}