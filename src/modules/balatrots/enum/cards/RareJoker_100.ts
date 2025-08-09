import { JokerImpl } from "../../interface/Joker";
import { JokerType } from "../JokerType";

export enum RareJoker_100 {
    DNA = "DNA",
    SIXTH_SENSE = "Sixth Sense",
    SEANCE = "Seance",
    BARON = "Baron",
    OBELISK = "Obelisk",
    BASEBALL_CARD = "Baseball Card",
    ANCIENT_JOKER = "Ancient Joker",
    CAMPFIRE = "Campfire",
    BLUEPRINT = "Blueprint",
    WEE_JOKER = "Wee Joker",
    HIT_THE_ROAD = "Hit the Road",
    THE_DUO = "The Duo",
    THE_TRIO = "The Trio",
    THE_FAMILY = "The Family",
    THE_ORDER = "The Order",
    THE_TRIBE = "The Tribe",
    INVISIBLE_JOKER = "Invisible Joker",
    BRAINSTORM = "Brainstorm",
    DRIVERS_LICENSE = "Drivers License"
}

export class RareJoker100Item extends JokerImpl {
    constructor(readonly name: RareJoker_100) {
        super(JokerType.RARE, name);
    }

    getName(): string {
        return this.name;
    }
}