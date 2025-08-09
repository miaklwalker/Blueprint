import { JokerImpl } from "../../interface/Joker";
import { JokerType } from "../JokerType";

export enum RareJoker_101C {
    DNA = "DNA",
    VAMPIRE = "Vampire",
    VAGABOND = "Vagabond",
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
    DRIVERS_LICENSE = "Drivers License",
    BURNT_JOKER = "Burnt Joker"
}

export class RareJoker101CItem extends JokerImpl {
    constructor(readonly name: RareJoker_101C) {
        super(JokerType.RARE, name);
    }

    getName(): string {
        return this.name;
    }
}