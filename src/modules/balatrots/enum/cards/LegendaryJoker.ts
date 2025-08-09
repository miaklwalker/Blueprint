import { JokerImpl } from "../../interface/Joker";
import { JokerType } from "../JokerType";

export enum LegendaryJoker {
    CANIO = "Canio",
    TRIBOULET = "Triboulet",
    YORICK = "Yorick",
    CHICOT = "Chicot",
    PERKEO = "Perkeo"
}

export class LegendaryJokerItem extends JokerImpl {
    constructor(readonly name: LegendaryJoker) {
        super(JokerType.LEGENDARY, name);
    }

    getName(): string {
        return this.name;
    }
}