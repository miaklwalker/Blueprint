import { ItemImpl } from "../../interface/Item";

export enum Spectral {
    // Mystical Entities
    FAMILIAR = "Familiar",
    GRIM = "Grim",
    WRAITH = "Wraith",
    MEDIUM = "Medium",
    CRYPTID = "Cryptid",

    // Spiritual Objects
    TALISMAN = "Talisman",
    SIGIL = "Sigil",
    OUIJA = "Ouija",
    ANKH = "Ankh",

    // Paranormal Phenomena
    INCANTATION = "Incantation",
    AURA = "Aura",
    ECTOPLASM = "Ectoplasm",
    IMMOLATE = "Immolate",
    DEJA_VU = "Deja Vu",
    HEX = "Hex",
    TRANCE = "Trance",

    // System
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