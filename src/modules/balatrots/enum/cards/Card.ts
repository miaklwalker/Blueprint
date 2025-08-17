import {ItemImpl} from "../../interface/Item";
import {EditionItem} from "../Edition";
import {SealItem} from "../Seal";

export enum PlayingCard {
    // Clubs
    C_2 = "C_2",
    C_3 = "C_3",
    C_4 = "C_4",
    C_5 = "C_5",
    C_6 = "C_6",
    C_7 = "C_7",
    C_8 = "C_8",
    C_9 = "C_9",
    C_A = "C_A",
    C_J = "C_J",
    C_K = "C_K",
    C_Q = "C_Q",
    C_T = "C_T",

    // Diamonds
    D_2 = "D_2",
    D_3 = "D_3",
    D_4 = "D_4",
    D_5 = "D_5",
    D_6 = "D_6",
    D_7 = "D_7",
    D_8 = "D_8",
    D_9 = "D_9",
    D_A = "D_A",
    D_J = "D_J",
    D_K = "D_K",
    D_Q = "D_Q",
    D_T = "D_T",

    // Hearts
    H_2 = "H_2",
    H_3 = "H_3",
    H_4 = "H_4",
    H_5 = "H_5",
    H_6 = "H_6",
    H_7 = "H_7",
    H_8 = "H_8",
    H_9 = "H_9",
    H_A = "H_A",
    H_J = "H_J",
    H_K = "H_K",
    H_Q = "H_Q",
    H_T = "H_T",

    // Spades
    S_2 = "S_2",
    S_3 = "S_3",
    S_4 = "S_4",
    S_5 = "S_5",
    S_6 = "S_6",
    S_7 = "S_7",
    S_8 = "S_8",
    S_9 = "S_9",
    S_A = "S_A",
    S_J = "S_J",
    S_K = "S_K",
    S_Q = "S_Q",
    S_T = "S_T"
}

export class Card extends ItemImpl {
    _enhancement?: string;
    _edition?: EditionItem;
    _seal?: SealItem;

    constructor(readonly name: PlayingCard, enhancement?: string, edition?: EditionItem, seal?: SealItem) {
        super(name);
        this._enhancement = enhancement;
        this._edition = edition;
        this._seal = seal;
    }

    getName(): string {
        return this.name;
    }

    getEnhancement(): string | undefined {
        return this._enhancement;
    }

    getEdition(): EditionItem | undefined {
        return this._edition;
    }

    getSeal(): SealItem | undefined {
        return this._seal;
    }

}