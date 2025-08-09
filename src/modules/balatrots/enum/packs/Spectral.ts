import { ItemImpl } from "../../interface/Item";

export enum Spectral {
    FAMILIAR = "Familiar",
    GRIM = "Grim",
    INCANTATION = "Incantation",
    TALISMAN = "Talisman",
    AURA = "Aura",
    WRAITH = "Wraith",
    SIGIL = "Sigil",
    OUIJA = "Ouija",
    ECTOPLASM = "Ectoplasm",
    IMMOLATE = "Immolate",
    ANKH = "Ankh",
    DEJA_VU = "Deja Vu",
    HEX = "Hex",
    TRANCE = "Trance",
    MEDIUM = "Medium",
    CRYPTID = "Cryptid",
    RETRY = "RETRY",
    RETRY2 = "RETRY"
}

export class SpectralItem extends ItemImpl {
    constructor(readonly name: Spectral) {
        super(name);
    }

    getName(): string {
        return this.name;
    }
}
