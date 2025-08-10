import {ItemImpl} from "../interface/Item";
import {Run} from "../interface/Run";

export enum BossBlindEnum {
    THE_ARM = "The Arm",
    THE_CLUB = "The Club",
    THE_EYE = "The Eye",
    AMBER_ACORN = "Amber Acorn",
    CERULEAN_BELL = "Cerulean Bell",
    CRIMSON_HEART = "Crimson Heart",
    VERDANT_LEAF = "Verdant Leaf",
    VIOLET_VESSEL = "Violet Vessel",
    THE_FISH = "The Fish",
    THE_FLINT = "The Flint",
    THE_GOAD = "The Goad",
    THE_HEAD = "The Head",
    THE_HOOK = "The Hook",
    THE_HOUSE = "The House",
    THE_MANACLE = "The Manacle",
    THE_MARK = "The Mark",
    THE_MOUTH = "The Mouth",
    THE_NEEDLE = "The Needle",
    THE_OX = "The Ox",
    THE_PILLAR = "The Pillar",
    THE_PLANT = "The Plant",
    THE_PSYCHIC = "The Psychic",
    THE_SERPENT = "The Serpent",
    THE_TOOTH = "The Tooth",
    THE_WALL = "The Wall",
    THE_WATER = "The Water",
    THE_WHEEL = "The Wheel",
    THE_WINDOW = "The Window"
}

export class BossBlind extends ItemImpl {
    constructor(readonly name: BossBlindEnum) {
        super(name);
    }

    getName(): string {
        return this.name;
    }

    charAt(index: number) {
        return this.name.charAt(index);
    }

    isPresent(run: Run) {
        return run.hasBoss(this);
    }

    isNotPresent(run: Run) {
        return !run.hasBoss(this);
    }

}