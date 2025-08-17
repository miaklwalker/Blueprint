import {ItemImpl} from "../interface/Item";

export enum Voucher {
    // Sales & Discounts
    OVERSTOCK = "Overstock",
    OVERSTOCK_PLUS = "Overstock Plus",
    CLEARANCE_SALE = "Clearance Sale",
    LIQUIDATION = "Liquidation",

    // Enhancement
    HONE = "Hone",
    GLOW_UP = "Glow Up",

    // Reroll Related
    REROLL_SURPLUS = "Reroll Surplus",
    REROLL_GLUT = "Reroll Glut",

    // Mystical Viewing
    CRYSTAL_BALL = "Crystal Ball",
    OMEN_GLOBE = "Omen Globe",
    TELESCOPE = "Telescope",
    OBSERVATORY = "Observatory",

    // Tools
    GRABBER = "Grabber",
    NACHO_TONG = "Nacho Tong",
    WASTEFUL = "Wasteful",
    RECYCLOMANCY = "Recyclomancy",

    // Merchants
    TAROT_MERCHANT = "Tarot Merchant",
    TAROT_TYCOON = "Tarot Tycoon",
    PLANET_MERCHANT = "Planet Merchant",
    PLANET_TYCOON = "Planet Tycoon",

    // Money
    SEED_MONEY = "Seed Money",
    MONEY_TREE = "Money Tree",

    // Special
    BLANK = "Blank",
    ANTIMATTER = "Antimatter",

    // Magic & Illusion
    MAGIC_TRICK = "Magic Trick",
    ILLUSION = "Illusion",

    // Ancient Writing
    HIEROGLYPH = "Hieroglyph",
    PETROGLYPH = "Petroglyph",

    // Editing
    DIRECTORS_CUT = "Director's Cut",
    RETCON = "Retcon",

    // Art Tools
    PAINT_BRUSH = "Paint Brush",
    PALETTE = "Palette"
}

export class VoucherItem extends ItemImpl {
    constructor(readonly name: Voucher) {
        super(name);
    }

    getName(): string {
        return this.name;
    }

    isPresent(): boolean {
        return this.isPresent();
    }//TODO fix Filter/Voucher Filter implementation
}