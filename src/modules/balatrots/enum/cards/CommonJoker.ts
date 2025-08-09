import { JokerImpl } from "../../interface/Joker";
import { JokerType } from "../JokerType";

export enum CommonJoker {
    JOKER = "Joker",
    GREEDY_JOKER = "Greedy Joker",
    LUSTY_JOKER = "Lusty Joker",
    WRATHFUL_JOKER = "Wrathful Joker",
    GLUTTONOUS_JOKER = "Gluttonous Joker",
    JOLLY_JOKER = "Jolly Joker",
    ZANY_JOKER = "Zany Joker",
    MAD_JOKER = "Mad Joker",
    CRAZY_JOKER = "Crazy Joker",
    DROLL_JOKER = "Droll Joker",
    SLY_JOKER = "Sly Joker",
    WILY_JOKER = "Wily Joker",
    CLEVER_JOKER = "Clever Joker",
    DEVIOUS_JOKER = "Devious Joker",
    CRAFTY_JOKER = "Crafty Joker",
    HALF_JOKER = "Half Joker",
    CREDIT_CARD = "Credit Card",
    BANNER = "Banner",
    MYSTIC_SUMMIT = "Mystic Summit",
    EIGHT_BALL = "8 Ball",
    MISPRINT = "Misprint",
    RAISED_FIST = "Raised Fist",
    CHAOS_THE_CLOWN = "Chaos the Clown",
    SCARY_FACE = "Scary Face",
    ABSTRACT_JOKER = "Abstract Joker",
    DELAYED_GRATIFICATION = "Delayed Gratification",
    GROS_MICHEL = "Gros Michel",
    EVEN_STEVEN = "Even Steven",
    ODD_TODD = "Odd Todd",
    SCHOLAR = "Scholar",
    BUSINESS_CARD = "Business Card",
    SUPERNOVA = "Supernova",
    RIDE_THE_BUS = "Ride the Bus",
    EGG = "Egg",
    RUNNER = "Runner",
    ICE_CREAM = "Ice Cream",
    SPLASH = "Splash",
    BLUE_JOKER = "Blue Joker",
    FACELESS_JOKER = "Faceless Joker",
    GREEN_JOKER = "Green Joker",
    SUPERPOSITION = "Superposition",
    TO_DO_LIST = "To Do List",
    CAVENDISH = "Cavendish",
    RED_CARD = "Red Card",
    SQUARE_JOKER = "Square Joker",
    RIFF_RAFF = "Riff-raff",
    PHOTOGRAPH = "Photograph",
    RESERVED_PARKING = "Reserved Parking",
    MAIL_IN_REBATE = "Mail In Rebate",
    HALLUCINATION = "Hallucination",
    FORTUNE_TELLER = "Fortune Teller",
    JUGGLER = "Juggler",
    DRUNKARD = "Drunkard",
    GOLDEN_JOKER = "Golden Joker",
    POPCORN = "Popcorn",
    WALKIE_TALKIE = "Walkie Talkie",
    SMILEY_FACE = "Smiley Face",
    GOLDEN_TICKET = "Golden Ticket",
    SWASHBUCKLER = "Swashbuckler",
    HANGING_CHAD = "Hanging Chad",
    SHOOT_THE_MOON = "Shoot the Moon"
}

export class CommonJokerCard extends JokerImpl {
    name: string;
    constructor(name: CommonJoker) {
        super(JokerType.COMMON, name);
        this.name = name;
    }

    getName(): string {
        return this.name;
    }
}