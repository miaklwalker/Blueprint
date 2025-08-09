import { ItemImpl } from "../../interface/Item";

export enum TarotEnum {
    THE_FOOL = "The Fool",
    THE_MAGICIAN = "The Magician",
    THE_HIGH_PRIESTESS = "The High Priestess",
    THE_EMPRESS = "The Empress",
    THE_EMPEROR = "The Emperor",
    THE_HIEROPHANT = "The Hierophant",
    THE_LOVERS = "The Lovers",
    THE_CHARIOT = "The Chariot",
    JUSTICE = "Justice",
    THE_HERMIT = "The Hermit",
    THE_WHEEL_OF_FORTUNE = "The Wheel of Fortune",
    STRENGTH = "Strength",
    THE_HANGED_MAN = "The Hanged Man",
    DEATH = "Death",
    TEMPERANCE = "Temperance",
    THE_DEVIL = "The Devil",
    THE_TOWER = "The Tower",
    THE_STAR = "The Star",
    THE_MOON = "The Moon",
    THE_SUN = "The Sun",
    JUDGEMENT = "Judgement",
    THE_WORLD = "The World"
};

export class Tarot extends ItemImpl {
    constructor(readonly name: TarotEnum) {
        super(name);
    }

    public getName(): string {
        return this.name;
    }
}