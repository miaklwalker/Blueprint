import { JokerImpl } from "../../interface/Joker";
import { JokerType } from "../JokerType";

export enum UncommonJoker_100 {
    JOKER_STENCIL = "Joker Stencil",
    FOUR_FINGERS = "Four Fingers",
    MIME = "Mime",
    CEREMONIAL_DAGGER = "Ceremonial Dagger",
    MARBLE_JOKER = "Marble Joker",
    LOYALTY_CARD = "Loyalty Card",
    DUSK = "Dusk",
    FIBONACCI = "Fibonacci",
    STEEL_JOKER = "Steel Joker",
    HACK = "Hack",
    PAREIDOLIA = "Pareidolia",
    SPACE_JOKER = "Space Joker",
    BURGLAR = "Burglar",
    BLACKBOARD = "Blackboard",
    CONSTELLATION = "Constellation",
    HIKER = "Hiker",
    CARD_SHARP = "Card Sharp",
    MADNESS = "Madness",
    VAMPIRE = "Vampire",
    SHORTCUT = "Shortcut",
    HOLOGRAM = "Hologram",
    VAGABOND = "Vagabond",
    CLOUD_9 = "Cloud 9",
    ROCKET = "Rocket",
    MIDAS_MASK = "Midas Mask",
    LUCHADOR = "Luchador",
    GIFT_CARD = "Gift Card",
    TURTLE_BEAN = "Turtle Bean",
    EROSION = "Erosion",
    RESERVED_PARKING = "Reserved Parking",
    TO_THE_MOON = "To the Moon",
    STONE_JOKER = "Stone Joker",
    LUCKY_CAT = "Lucky Cat",
    BULL = "Bull",
    DIET_COLA = "Diet Cola",
    TRADING_CARD = "Trading Card",
    FLASH_CARD = "Flash Card",
    SPARE_TROUSERS = "Spare Trousers",
    RAMEN = "Ramen",
    SELTZER = "Seltzer",
    CASTLE = "Castle",
    MR_BONES = "Mr. Bones",
    ACROBAT = "Acrobat",
    SOCK_AND_BUSKIN = "Sock and Buskin",
    TROUBADOUR = "Troubadour",
    CERTIFICATE = "Certificate",
    SMEARED_JOKER = "Smeared Joker",
    THROWBACK = "Throwback",
    ROUGH_GEM = "Rough Gem",
    BLOODSTONE = "Bloodstone",
    ARROWHEAD = "Arrowhead",
    ONYX_AGATE = "Onyx Agate",
    GLASS_JOKER = "Glass Joker",
    SHOWMAN = "Showman",
    FLOWER_POT = "Flower Pot",
    MERRY_ANDY = "Merry Andy",
    OOPS_ALL_6S = "Oops! All 6s",
    THE_IDOL = "The Idol",
    SEEING_DOUBLE = "Seeing Double",
    MATADOR = "Matador",
    STUNTMAN = "Stuntman",
    SATELLITE = "Satellite",
    CARTOMANCER = "Cartomancer",
    ASTRONOMER = "Astronomer",
    BURNT_JOKER = "Burnt Joker",
    BOOTSTRAPS = "Bootstraps"
}

export class UncommonJoker100Item extends JokerImpl {
    constructor(readonly name: UncommonJoker_100) {
        super(JokerType.UNCOMMON, name);
    }

    getName(): string {
        return this.name;
    }
}