
export enum Edition {
    // Special Editions
    NEGATIVE = "Negative",
    POLYCHROME = "Polychrome",
    HOLOGRAPHIC = "Holographic",
    FOIL = "Foil",

    // Base Edition
    NO_EDITION = "No Edition",

    // Duration-based Editions
    ETERNAL = "Eternal",
    PERISHABLE = "Perishable",
    RENTAL = "Rental"
}

export class EditionItem {
    constructor(readonly name: Edition) {
        
    }

    getName(): string {
        return this.name;
    }
}