import {Edition} from "./enum/Edition";
import type {JokerData} from "./struct/JokerData";

export class BalatroAnalyzer {
    static getSticker(joker: JokerData): Edition {
        if (joker.stickers.eternal) return Edition.ETERNAL;
        if (joker.stickers.perishable) return Edition.PERISHABLE;
        if (joker.stickers.rental) return Edition.RENTAL;
        if (joker.edition !== Edition.NO_EDITION) return joker.edition;
        return Edition.NO_EDITION;
    }
}
