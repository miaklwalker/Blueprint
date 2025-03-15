import {ReactNode} from "react";
import {BuyMetaData} from "./classes/BuyMetaData.ts";

export const jokers: any = [
    { "name": "Joker", "pos": { "x": 0, "y": 0 } }, { "name": "Greedy Joker", "pos": { "x": 6, "y": 1 } }, { "name": "Lusty Joker", "pos": { "x": 7, "y": 1 } }, { "name": "Wrathful Joker", "pos": { "x": 8, "y": 1 } }, { "name": "Gluttonous Joker", "pos": { "x": 9, "y": 1 } }, { "name": "Jolly Joker", "pos": { "x": 2, "y": 0 } }, { "name": "Zany Joker", "pos": { "x": 3, "y": 0 } }, { "name": "Mad Joker", "pos": { "x": 4, "y": 0 } }, { "name": "Crazy Joker", "pos": { "x": 5, "y": 0 } }, { "name": "Droll Joker", "pos": { "x": 6, "y": 0 } }, { "name": "Sly Joker", "pos": { "x": 0, "y": 14 } }, { "name": "Wily Joker", "pos": { "x": 1, "y": 14 } }, { "name": "Clever Joker", "pos": { "x": 2, "y": 14 } }, { "name": "Devious Joker", "pos": { "x": 3, "y": 14 } }, { "name": "Crafty Joker", "pos": { "x": 4, "y": 14 } }, { "name": "Half Joker", "pos": { "x": 7, "y": 0 } }, { "name": "Joker Stencil", "pos": { "x": 2, "y": 5 } }, { "name": "Four Fingers", "pos": { "x": 6, "y": 6 } }, { "name": "Mime", "pos": { "x": 4, "y": 1 } }, { "name": "Credit Card", "pos": { "x": 5, "y": 1 } }, { "name": "Ceremonial Dagger", "pos": { "x": 5, "y": 5 } }, { "name": "Banner", "pos": { "x": 1, "y": 2 } }, { "name": "Mystic Summit", "pos": { "x": 2, "y": 2 } }, { "name": "Marble Joker", "pos": { "x": 3, "y": 2 } }, { "name": "Loyalty Card", "pos": { "x": 4, "y": 2 } }, { "name": "8 Ball", "pos": { "x": 0, "y": 5 } }, { "name": "Misprint", "pos": { "x": 6, "y": 2 } }, { "name": "Dusk", "pos": { "x": 4, "y": 7 } }, { "name": "Raised Fist", "pos": { "x": 8, "y": 2 } }, { "name": "Chaos the Clown", "pos": { "x": 1, "y": 0 } }, { "name": "Fibonacci", "pos": { "x": 1, "y": 5 } }, { "name": "Steel Joker", "pos": { "x": 7, "y": 2 } }, { "name": "Scary Face", "pos": { "x": 2, "y": 3 } }, { "name": "Abstract Joker", "pos": { "x": 3, "y": 3 } }, { "name": "Delayed Gratification", "pos": { "x": 4, "y": 3 } }, { "name": "Hack", "pos": { "x": 5, "y": 2 } }, { "name": "Pareidolia", "pos": { "x": 6, "y": 3 } }, { "name": "Gros Michel", "pos": { "x": 7, "y": 6 } }, { "name": "Even Steven", "pos": { "x": 8, "y": 3 } }, { "name": "Odd Todd", "pos": { "x": 9, "y": 3 } }, { "name": "Scholar", "pos": { "x": 3, "y": 6 } }, { "name": "Business Card", "pos": { "x": 1, "y": 4 } }, { "name": "Supernova", "pos": { "x": 2, "y": 4 } }, { "name": "Ride the Bus", "pos": { "x": 1, "y": 6 } }, { "name": "Space Joker", "pos": { "x": 3, "y": 5 } }, { "name": "Egg", "pos": { "x": 0, "y": 10 } }, { "name": "Burglar", "pos": { "x": 1, "y": 10 } }, { "name": "Blackboard", "pos": { "x": 2, "y": 10 } }, { "name": "Runner", "pos": { "x": 3, "y": 10 } }, { "name": "Ice Cream", "pos": { "x": 4, "y": 10 } }, { "name": "DNA", "pos": { "x": 5, "y": 10 } }, { "name": "Splash", "pos": { "x": 6, "y": 10 } }, { "name": "Blue Joker", "pos": { "x": 7, "y": 10 } }, { "name": "Sixth Sense", "pos": { "x": 8, "y": 10 } }, { "name": "Constellation", "pos": { "x": 9, "y": 10 } }, { "name": "Hiker", "pos": { "x": 0, "y": 11 } }, { "name": "Faceless Joker", "pos": { "x": 1, "y": 11 } }, { "name": "Green Joker", "pos": { "x": 2, "y": 11 } }, { "name": "Superposition", "pos": { "x": 3, "y": 11 } }, { "name": "To Do List", "pos": { "x": 4, "y": 11 } }, { "name": "Cavendish", "pos": { "x": 5, "y": 11 } }, { "name": "Card Sharp", "pos": { "x": 6, "y": 11 } }, { "name": "Red Card", "pos": { "x": 7, "y": 11 } }, { "name": "Madness", "pos": { "x": 8, "y": 11 } }, { "name": "Square Joker", "pos": { "x": 9, "y": 11 } }, { "name": "Seance", "pos": { "x": 0, "y": 12 } }, { "name": "Riff-raff", "pos": { "x": 1, "y": 12 } }, { "name": "Vampire", "pos": { "x": 2, "y": 12 } }, { "name": "Shortcut", "pos": { "x": 3, "y": 12 } }, { "name": "Hologram", "pos": { "x": 4, "y": 12 } }, { "name": "Vagabond", "pos": { "x": 5, "y": 12 } }, { "name": "Baron", "pos": { "x": 6, "y": 12 } }, { "name": "Cloud 9", "pos": { "x": 7, "y": 12 } }, { "name": "Rocket", "pos": { "x": 8, "y": 12 } }, { "name": "Obelisk", "pos": { "x": 9, "y": 12 } }, { "name": "Midas Mask", "pos": { "x": 0, "y": 13 } }, { "name": "Luchador", "pos": { "x": 1, "y": 13 } }, { "name": "Photograph", "pos": { "x": 2, "y": 13 } }, { "name": "Gift Card", "pos": { "x": 3, "y": 13 } }, { "name": "Turtle Bean", "pos": { "x": 4, "y": 13 } }, { "name": "Erosion", "pos": { "x": 5, "y": 13 } }, { "name": "Reserved Parking", "pos": { "x": 6, "y": 13 } }, { "name": "Mail In Rebate", "pos": { "x": 7, "y": 13 } }, { "name": "To the Moon", "pos": { "x": 8, "y": 13 } }, { "name": "Hallucination", "pos": { "x": 9, "y": 13 } }, { "name": "Fortune Teller", "pos": { "x": 7, "y": 5 } }, { "name": "Juggler", "pos": { "x": 0, "y": 1 } }, { "name": "Drunkard", "pos": { "x": 1, "y": 1 } }, { "name": "Stone Joker", "pos": { "x": 9, "y": 0 } }, { "name": "Golden Joker", "pos": { "x": 9, "y": 2 } }, { "name": "Lucky Cat", "pos": { "x": 5, "y": 14 } }, { "name": "Baseball Card", "pos": { "x": 6, "y": 14 } }, { "name": "Bull", "pos": { "x": 7, "y": 14 } }, { "name": "Diet Cola", "pos": { "x": 8, "y": 14 } }, { "name": "Trading Card", "pos": { "x": 9, "y": 14 } }, { "name": "Flash Card", "pos": { "x": 0, "y": 15 } }, { "name": "Popcorn", "pos": { "x": 1, "y": 15 } }, { "name": "Spare Trousers", "pos": { "x": 4, "y": 15 } }, { "name": "Ancient Joker", "pos": { "x": 7, "y": 15 } }, { "name": "Ramen", "pos": { "x": 2, "y": 15 } }, { "name": "Walkie Talkie", "pos": { "x": 8, "y": 15 } }, { "name": "Seltzer", "pos": { "x": 3, "y": 15 } }, { "name": "Castle", "pos": { "x": 9, "y": 15 } }, { "name": "Smiley Face", "pos": { "x": 6, "y": 15 } }, { "name": "Campfire", "pos": { "x": 5, "y": 15 } }, { "name": "Golden Ticket", "pos": { "x": 5, "y": 3 } }, { "name": "Mr. Bones", "pos": { "x": 3, "y": 4 } }, { "name": "Acrobat", "pos": { "x": 2, "y": 1 } }, { "name": "Sock and Buskin", "pos": { "x": 3, "y": 1 } }, { "name": "Swashbuckler", "pos": { "x": 9, "y": 5 } }, { "name": "Troubadour", "pos": { "x": 0, "y": 2 } }, { "name": "Certificate", "pos": { "x": 8, "y": 8 } }, { "name": "Smeared Joker", "pos": { "x": 4, "y": 6 } }, { "name": "Throwback", "pos": { "x": 5, "y": 7 } }, { "name": "Hanging Chad", "pos": { "x": 9, "y": 6 } }, { "name": "Rough Gem", "pos": { "x": 9, "y": 7 } }, { "name": "Bloodstone", "pos": { "x": 0, "y": 8 } }, { "name": "Arrowhead", "pos": { "x": 1, "y": 8 } }, { "name": "Onyx Agate", "pos": { "x": 2, "y": 8 } }, { "name": "Glass Joker", "pos": { "x": 1, "y": 3 } }, { "name": "Showman", "pos": { "x": 6, "y": 5 } }, { "name": "Flower Pot", "pos": { "x": 0, "y": 6 } }, { "name": "Blueprint", "pos": { "x": 0, "y": 3 } }, { "name": "Wee Joker", "pos": { "x": 0, "y": 4 } }, { "name": "Merry Andy", "pos": { "x": 8, "y": 0 } }, { "name": "Oops! All 6s", "pos": { "x": 5, "y": 6 } }, { "name": "The Idol", "pos": { "x": 6, "y": 7 } }, { "name": "Seeing Double", "pos": { "x": 4, "y": 4 } }, { "name": "Matador", "pos": { "x": 4, "y": 5 } }, { "name": "Hit the Road", "pos": { "x": 8, "y": 5 } }, { "name": "The Duo", "pos": { "x": 5, "y": 4 } }, { "name": "The Trio", "pos": { "x": 6, "y": 4 } }, { "name": "The Family", "pos": { "x": 7, "y": 4 } }, { "name": "The Order", "pos": { "x": 8, "y": 4 } }, { "name": "The Tribe", "pos": { "x": 9, "y": 4 } }, { "name": "Stuntman", "pos": { "x": 8, "y": 6 } }, { "name": "Invisible Joker", "pos": { "x": 1, "y": 7 } }, { "name": "Brainstorm", "pos": { "x": 7, "y": 7 } }, { "name": "Satellite", "pos": { "x": 8, "y": 7 } }, { "name": "Shoot the Moon", "pos": { "x": 2, "y": 6 } }, { "name": "Drivers License", "pos": { "x": 0, "y": 7 } }, { "name": "Cartomancer", "pos": { "x": 7, "y": 3 } }, { "name": "Astronomer", "pos": { "x": 2, "y": 7 } }, { "name": "Burnt Joker", "pos": { "x": 3, "y": 7 } }, { "name": "Bootstraps", "pos": { "x": 9, "y": 8 } }, { "name": "Canio", "pos": { "x": 3, "y": 8 } }, { "name": "Triboulet", "pos": { "x": 4, "y": 8 } }, { "name": "Yorick", "pos": { "x": 5, "y": 8 } }, { "name": "Chicot", "pos": { "x": 6, "y": 8 } }, { "name": "Perkeo", "pos": { "x": 7, "y": 8 } }
];
export const jokerFaces: any = [
    {
        "name" : "Hologram",
        "pos" : { "x": 2, "y": 9 },
        "animated" : true
    },
    { "name": "Canio", "pos": { "x": 3, "y": 9 },"animated" : true },
    { "name": "Triboulet", "pos": { "x": 4, "y": 9 },"animated" : true  },
    { "name": "Yorick", "pos": { "x": 5, "y": 9 },"animated" : true  },
    { "name": "Chicot", "pos": { "x": 6, "y": 9 },"animated" : true  },
    { "name": "Perkeo", "pos": { "x": 7, "y": 9 },"animated" : true  },
];
export const consumablesFaces: any = [
    {
        "name" : "The Soul",
        "pos" : { "x": 0, "y": 1 },
        "animated" : true
    },
]
export const tarotsAndPlanets: any = [
    { "name": "The Fool", "pos": { "x": 0, "y": 0 } }, { "name": "The Magician", "pos": { "x": 1, "y": 0 } }, { "name": "The High Priestess", "pos": { "x": 2, "y": 0 } }, { "name": "The Empress", "pos": { "x": 3, "y": 0 } }, { "name": "The Emperor", "pos": { "x": 4, "y": 0 } }, { "name": "The Hierophant", "pos": { "x": 5, "y": 0 } }, { "name": "The Lovers", "pos": { "x": 6, "y": 0 } }, { "name": "The Chariot", "pos": { "x": 7, "y": 0 } }, { "name": "Justice", "pos": { "x": 8, "y": 0 } }, { "name": "The Hermit", "pos": { "x": 9, "y": 0 } }, { "name": "The Wheel of Fortune", "pos": { "x": 0, "y": 1 } }, { "name": "Strength", "pos": { "x": 1, "y": 1 } }, { "name": "The Hanged Man", "pos": { "x": 2, "y": 1 } }, { "name": "Death", "pos": { "x": 3, "y": 1 } }, { "name": "Temperance", "pos": { "x": 4, "y": 1 } }, { "name": "The Devil", "pos": { "x": 5, "y": 1 } }, { "name": "The Tower", "pos": { "x": 6, "y": 1 } }, { "name": "The Star", "pos": { "x": 7, "y": 1 } }, { "name": "The Moon", "pos": { "x": 8, "y": 1 } }, { "name": "The Sun", "pos": { "x": 9, "y": 1 } }, { "name": "Judgement", "pos": { "x": 0, "y": 2 } }, { "name": "The World", "pos": { "x": 1, "y": 2 } }, { "name": "Mercury", "pos": { "x": 0, "y": 3 } }, { "name": "Venus", "pos": { "x": 1, "y": 3 } }, { "name": "Earth", "pos": { "x": 2, "y": 3 } }, { "name": "Mars", "pos": { "x": 3, "y": 3 } }, { "name": "Jupiter", "pos": { "x": 4, "y": 3 } }, { "name": "Saturn", "pos": { "x": 5, "y": 3 } }, { "name": "Uranus", "pos": { "x": 6, "y": 3 } }, { "name": "Neptune", "pos": { "x": 7, "y": 3 } }, { "name": "Pluto", "pos": { "x": 8, "y": 3 } }, { "name": "Planet X", "pos": { "x": 9, "y": 2 } }, { "name": "Ceres", "pos": { "x": 8, "y": 2 } }, { "name": "Eris", "pos": { "x": 3, "y": 2 } }, { "name": "Familiar", "pos": { "x": 0, "y": 4 } }, { "name": "Grim", "pos": { "x": 1, "y": 4 } }, { "name": "Incantation", "pos": { "x": 2, "y": 4 } }, { "name": "Talisman", "pos": { "x": 3, "y": 4 } }, { "name": "Aura", "pos": { "x": 4, "y": 4 } }, { "name": "Wraith", "pos": { "x": 5, "y": 4 } }, { "name": "Sigil", "pos": { "x": 6, "y": 4 } }, { "name": "Ouija", "pos": { "x": 7, "y": 4 } }, { "name": "Ectoplasm", "pos": { "x": 8, "y": 4 } }, { "name": "Immolate", "pos": { "x": 9, "y": 4 } }, { "name": "Ankh", "pos": { "x": 0, "y": 5 } }, { "name": "Deja Vu", "pos": { "x": 1, "y": 5 } }, { "name": "Hex", "pos": { "x": 2, "y": 5 } }, { "name": "Trance", "pos": { "x": 3, "y": 5 } }, { "name": "Medium", "pos": { "x": 4, "y": 5 } }, { "name": "Cryptid", "pos": { "x": 5, "y": 5 } }, { "name": "The Soul", "pos": { "x": 2, "y": 2 } }, { "name": "Black Hole", "pos": { "x": 9, "y": 3 } }
];
export const tags: any = [
    { "name": "Uncommon Tag", "pos": { "x": 0, "y": 0 } }, { "name": "Rare Tag", "pos": { "x": 1, "y": 0 } }, { "name": "Negative Tag", "pos": { "x": 2, "y": 0 } }, { "name": "Foil Tag", "pos": { "x": 3, "y": 0 } }, { "name": "Holographic Tag", "pos": { "x": 0, "y": 1 } }, { "name": "Polychrome Tag", "pos": { "x": 1, "y": 1 } }, { "name": "Investment Tag", "pos": { "x": 2, "y": 1 } }, { "name": "Voucher Tag", "pos": { "x": 3, "y": 1 } }, { "name": "Boss Tag", "pos": { "x": 0, "y": 2 } }, { "name": "Standard Tag", "pos": { "x": 1, "y": 2 } }, { "name": "Charm Tag", "pos": { "x": 2, "y": 2 } }, { "name": "Meteor Tag", "pos": { "x": 3, "y": 2 } }, { "name": "Buffoon Tag", "pos": { "x": 4, "y": 2 } }, { "name": "Handy Tag", "pos": { "x": 1, "y": 3 } }, { "name": "Garbage Tag", "pos": { "x": 2, "y": 3 } }, { "name": "Ethereal Tag", "pos": { "x": 3, "y": 3 } }, { "name": "Coupon Tag", "pos": { "x": 4, "y": 0 } }, { "name": "Double Tag", "pos": { "x": 5, "y": 0 } }, { "name": "Juggle Tag", "pos": { "x": 5, "y": 1 } }, { "name": "D6 Tag", "pos": { "x": 5, "y": 3 } }, { "name": "Top-up Tag", "pos": { "x": 4, "y": 1 } }, { "name": "Speed Tag", "pos": { "x": 0, "y": 3 } }, { "name": "Orbital Tag", "pos": { "x": 5, "y": 2 } }, { "name": "Economy Tag", "pos": { "x": 4, "y": 3 } }
];
export const vouchers: any = [
    { "name": "Overstock", "pos": { "x": 0, "y": 0 } }, { "name": "Clearance Sale", "pos": { "x": 3, "y": 0 } }, { "name": "Hone", "pos": { "x": 4, "y": 0 } }, { "name": "Reroll Surplus", "pos": { "x": 0, "y": 2 } }, { "name": "Crystal Ball", "pos": { "x": 2, "y": 2 } }, { "name": "Telescope", "pos": { "x": 3, "y": 2 } }, { "name": "Grabber", "pos": { "x": 5, "y": 0 } }, { "name": "Wasteful", "pos": { "x": 6, "y": 0 } }, { "name": "Tarot Merchant", "pos": { "x": 1, "y": 0 } }, { "name": "Planet Merchant", "pos": { "x": 2, "y": 0 } }, { "name": "Seed Money", "pos": { "x": 1, "y": 2 } }, { "name": "Blank", "pos": { "x": 7, "y": 0 } }, { "name": "Magic Trick", "pos": { "x": 4, "y": 2 } }, { "name": "Hieroglyph", "pos": { "x": 5, "y": 2 } }, { "name": "Director's Cut", "pos": { "x": 6, "y": 2 } }, { "name": "Paint Brush", "pos": { "x": 7, "y": 2 } }, { "name": "Overstock Plus", "pos": { "x": 0, "y": 1 } }, { "name": "Liquidation", "pos": { "x": 3, "y": 1 } }, { "name": "Glow Up", "pos": { "x": 4, "y": 1 } }, { "name": "Reroll Glut", "pos": { "x": 0, "y": 3 } }, { "name": "Omen Globe", "pos": { "x": 2, "y": 3 } }, { "name": "Observatory", "pos": { "x": 3, "y": 3 } }, { "name": "Nacho Tong", "pos": { "x": 5, "y": 1 } }, { "name": "Recyclomancy", "pos": { "x": 6, "y": 1 } }, { "name": "Tarot Tycoon", "pos": { "x": 1, "y": 1 } }, { "name": "Planet Tycoon", "pos": { "x": 2, "y": 1 } }, { "name": "Money Tree", "pos": { "x": 1, "y": 3 } }, { "name": "Antimatter", "pos": { "x": 7, "y": 1 } }, { "name": "Illusion", "pos": { "x": 4, "y": 3 } }, { "name": "Petroglyph", "pos": { "x": 5, "y": 3 } }, { "name": "Retcon", "pos": { "x": 6, "y": 3 } }, { "name": "Palette", "pos": { "x": 7, "y": 3 } }
];
export const bosses: any = [
    { "name": "Small Blind", "pos": { "x": 0, "y": 0 } }, { "name": "Big Blind", "pos": { "x": 0, "y": 1 } }, { "name": "The Ox", "pos": { "x": 0, "y": 2 } }, { "name": "The Hook", "pos": { "x": 0, "y": 7 } }, { "name": "The Mouth", "pos": { "x": 0, "y": 18 } }, { "name": "The Fish", "pos": { "x": 0, "y": 5 } }, { "name": "The Club", "pos": { "x": 0, "y": 4 } }, { "name": "The Manacle", "pos": { "x": 0, "y": 8 } }, { "name": "The Tooth", "pos": { "x": 0, "y": 22 } }, { "name": "The Wall", "pos": { "x": 0, "y": 9 } }, { "name": "The House", "pos": { "x": 0, "y": 3 } }, { "name": "The Mark", "pos": { "x": 0, "y": 23 } }, { "name": "Cerulean Bell", "pos": { "x": 0, "y": 26 } }, { "name": "The Wheel", "pos": { "x": 0, "y": 10 } }, { "name": "The Arm", "pos": { "x": 0, "y": 11 } }, { "name": "The Psychic", "pos": { "x": 0, "y": 12 } }, { "name": "The Goad", "pos": { "x": 0, "y": 13 } }, { "name": "The Water", "pos": { "x": 0, "y": 14 } }, { "name": "The Eye", "pos": { "x": 0, "y": 17 } }, { "name": "The Plant", "pos": { "x": 0, "y": 19 } }, { "name": "The Needle", "pos": { "x": 0, "y": 20 } }, { "name": "The Head", "pos": { "x": 0, "y": 21 } }, { "name": "Verdant Leaf", "pos": { "x": 0, "y": 28 } }, { "name": "Violet Vessel", "pos": { "x": 0, "y": 29 } }, { "name": "The Window", "pos": { "x": 0, "y": 6 } }, { "name": "The Serpent", "pos": { "x": 0, "y": 15 } }, { "name": "The Pillar", "pos": { "x": 0, "y": 16 } }, { "name": "The Flint", "pos": { "x": 0, "y": 24 } }, { "name": "Amber Acorn", "pos": { "x": 0, "y": 27 } }, { "name": "Crimson Heart", "pos": { "x": 0, "y": 25 } }
];
export const editionMap: any = {
    "Foil": 1,
    "Holographic": 2,
    "Polychrome": 3
};
export const stickerMap: any = {
    "Eternal": { x: 0, y: 0 },
    "Perishable": { x: 0, y: 2 },
    "Rental": { x: 1, y: 2 }
};
export const options: any = [
    "Negative Tag",
    "Foil Tag",
    "Holographic Tag",
    "Polychrome Tag",
    "Rare Tag",
    "Golden Ticket",
    "Mr. Bones",
    "Acrobat",
    "Sock and Buskin",
    "Swashbuckler",
    "Troubadour",
    "Certificate",
    "Smeared Joker",
    "Throwback",
    "Hanging Chad",
    "Rough Gem",
    "Bloodstone",
    "Arrowhead",
    "Onyx Agate",
    "Glass Joker",
    "Showman",
    "Flower Pot",
    "Blueprint",
    "Wee Joker",
    "Merry Andy",
    "Oops! All 6s",
    "The Idol",
    "Seeing Double",
    "Matador",
    "Hit the Road",
    "The Duo",
    "The Trio",
    "The Family",
    "The Order",
    "The Tribe",
    "Stuntman",
    "Invisible Joker",
    "Brainstorm",
    "Satellite",
    "Shoot the Moon",
    "Driver's License",
    "Cartomancer",
    "Astronomer",
    "Burnt Joker",
    "Bootstraps",
    "Overstock Plus",
    "Liquidation",
    "Glow Up",
    "Reroll Glut",
    "Omen Globe",
    "Observatory",
    "Nacho Tong",
    "Recyclomancy",
    "Tarot Tycoon",
    "Planet Tycoon",
    "Money Tree",
    "Antimatter",
    "Illusion",
    "Petroglyph",
    "Retcon",
    "Palette"
]
export const blinds: any = ['Small Blind', 'Big Blind', 'Boss Blind']
export const SeedsWithLegendary: string[] = [
    "HPR8Q7K",
    "5YVHAEP",
    "8QBRTPD",
    "9Q2HBUB",
    "9UDETXN",
    "6V8UBX5",
    "VWFNSGW",
    "FV9N9PP",
    "OM4C5SX",
    "BXQOI99",
    "IQPMXNX",
    "4RZ1CIM",
    "7L7ZJHF",
    "QPJ176G",
    "519H44C",
    "5F5VIL1",
    "8N63SBG",
    "5HVI3RM",
    "YL97MTJ",
    "V7IBVQM",
    "ZMQE7AM",
    "5DZSEDQ",
    "OLKJ6ZW",
    "FDFRIK8",
    "V27PHNU",
    "8QEHFLN",
    "CT29RU9",
    "JSN8UI4",
    "OR1XXE3",
    "GPANZA5",
    "DAGKUXJ",
    "1G919GL",
    "JNC47DS",
    "JAIYELM",
    "DMS6GPP",
    "X3KXB3D",
    "Z4PTQ4X",
    "O8QQ89F",
    "K7ABT43",
    "OXLBWJV",
    "CXWQUJV",
    "95A6WF3",
    "54M4758",
    "DZRFNI3",
    "W782DK9",
    "9DG2M8J",
    "8LDYE6L",
    "TICC34H",
    "XBRFZKS",
    "Y9UKTTA",
    "XYWPLPZ",
    "MGIJUOH",
    "MB72QHG",
    "7H5OLS7",
    "6T1X6IO",
    "5N29KQR",
    "QEJR5A5",
    "7XSZ21E",
    "7ODNKXP",
    "Y3UNH78",
    "NSBHHH2",
    "KGR6MNH",
    "7OBR7KH",
    "SZ8C677",
    "MCP64VU",
    "WN7ICR5",
    "M2YPX2F",
    "6RK2SUK",
    "KA3ZAVR",
    "AQOWYID",
    "6YNJUPC",
    "G96MEMU",
    "Z3969N4",
    "I1JGYJL",
    "PJJEZM8",
    "G2VZEU1",
    "E6P8GSO",
    "6A3YDL3",
    "TVXXZ4O",
    "OF22B56",
    "88WSHRC",
    "ETZ3Y2N",
    "X8D6EQ7",
    "JF4LQ7V",
    "2NYI4SU",
    "4BFW92V",
    "YTKDNEO",
    "23SQMC3",
    "E3FC4Y6",
    "AC5AB3X",
    "XZNP87K",
    "5ERISFD",
    "6LZ38CE",
    "OEIKDUR",
    "9RVOERB",
    "1MEF2D3",
    "2OSNAHM",
    "VO2XQNN",
    "YK1KHCJ",
    "BLL8N3C",
    "LALC2D1",
    "HHMBAKQ",
    "MWEQI4T",
    "4BHOFUT",
    "5RTYDUK",
    "1K7CBVU",
    "WRK4MTV",
    "9GJS6GC",
    "ZJWK17V",
    "ASZQXSY",
    "CZV21QS",
    "5H2SJ4L",
    "XZESAEH",
    "KY244RQ",
    "6R7F7XW",
    "ZEFRY57",
    "UN89E4O",
    "JXM4RIA",
    "1SSIK3U",
    "XO4G3PW",
    "PZKFEYF",
    "OL37Y2U",
    "JQ6A2IA",
    "LBVEFKS",
    "SENGKQX",
    "AWRXF7I",
    "B7WCUM9",
    "T3ALPGL",
    "VNBI32O",
    "F9AT8KX",
    "FXLX35X",
    "SU1DQDZ",
    "9ZEC4VU",
    "6E5WYI5",
    "J4LW7TE",
    "QYRBDXB",
    "78JDKTS",
    "RGDRFBE",
    "YDXYS4X",
    "2XJTXUH",
    "YQXIRUC",
    "M1N42MR",
    "H11OF18",
    "6WPP8YO",
    "TZWQHMY",
    "CCZNW71",
    "1TKK31U",
    "8SPGISR",
    "ZSJYNLP",
    "J6M5F3Z",
    "E5N1FIV",
    "F4JW8MD",
    "I3WH3QE",
    "UKTCITC",
    "R4OOQBE",
    "Z2NU11N",
    "QJRXOCU",
    "6YSNVQ7",
    "AOM6X5J",
    "764XZ9J",
    "UPTGH54",
    "IDBT3GC",
    "39LTQ2M",
    "K5NUFWC",
    "N63CQ57",
    "FKWWG6P",
    "7HMKAXU",
    "AY49MMT",
    "387E9ZH",
    "91HXAQR",
    "SMGSXH5",
    "X26N6W8",
    "N7NVIMH",
    "JQI6QEA",
    "PT1D5OZ",
    "89NM5Z1",
    "DCLEWYW",
    "DCU5K1S",
    "JB4XK1I",
    "911DRN2",
    "3PX3PT2",
    "SGKL6X6",
    "S9SUZ32",
    "ZZJMP7X",
    "X34Z8ML",
    "BJKQ4Q3",
    "LEUR6FM",
    "495IZI7",
    "W8AY7LF",
    "ML3KVYY",
    "AISL9JC",
    "M7UC5XX",
    "KR1PIKM",
    "WJH3PBJ",
    "WONYS4V",
    "P89V2OY",
    "74DZFRT",
    "2NRYBHJ",
    "7WRIXML",
    "7ZO64T1",
    "4S2WM23",
    "JGKYTFA",
    "5IKHUDB",
    "EEQPNLN",
    "YIVC5Q1",
    "ERXPOQW",
    "YE3H58O",
    "BL7U2CH",
    "FJ4H1K6",
    "Y58AEO7",
    "YL7Q4A5",
    "L89SWRJ",
    "8W1QOX1",
    "NEVXPAV",
    "4UYEC8Z",
    "PFH7CSO",
    "2STPA3I",
    "IX6AJFR",
    "Z2JOX9X",
    "NFQRHOA",
    "U6V2MY6",
    "DXJVQQA",
    "CED3Z7T",
    "SFZ1KCM",
    "66MU9BQ",
    "7JVPOL1",
    "ALWYMKW",
    "55QOI27",
    "FIZRGML",
    "VCSO13X",
    "QPINMDM",
    "BXQ35VP",
    "O4DC65E",
    "GV24UU4",
    "LHJFLN4",
    "SP5NXMU",
    "SJDYWHU",
    "HSYACD9",
    "4NJMAUT",
    "3S7WESR",
    "D3SRYIV",
    "RB3OUPO",
    "1OA9OU3",
    "2YYKQDL",
    "6CSBFSJ",
    "JLWDTQ7",
    "FQXGT8R",
    "76B7GT2",
    "1GAHG3M",
    "LXFG7XN",
    "4WXAJGN",
    "GAJ5BKF",
    "8VY5194",
    "WKRYCTU",
    "7UKKPRK",
    "8JJ8BI2",
    "1YXYDZ2",
    "W2JNKFT",
    "WNNY4IR",
    "GOXRQGA",
    "HV6MUXN",
    "UFRHVWS",
    "FQDVKV8",
    "OU9AZCY",
    "OIM9AO1",
    "BLAZS5B",
    "R1MN19C",
    "1J7QHQT",
    "S6X74PQ",
    "UZRRHNJ",
    "ZHMO2DV",
    "8Y4YUO6",
    "5M3Q6LA",
    "G2ND5UF",
    "BSVLSMF",
    "8R3PVX9",
    "JQ9UC84",
    "NGU52B5",
    "963FGYO",
    "TKILSRE",
    "5WO7G4O",
    "UVA9G8M",
    "6OWFFVA",
    "W6HTJLV",
    "CMMBQLP",
    "98EFT57",
]

export interface AnalyzeOptions {
    showCardSpoilers: boolean,
    buys: { [key: string]: BuyMetaData },
    sells: { [key: string]: BuyMetaData },
    updates: { [key: string]: any }[]
}
export interface BuyWrapperProps {
    children: ReactNode,
    bottomOffset?: number,
    topOffset?: number,
    metaData?: BuyMetaData
    horizontal?: boolean,
}

export enum LOCATIONS {
    SHOP = 'SHOP',
    PACK = 'PACK',
    MISC = 'MISC',
    VOUCHER = 'VOUCHER'
}
