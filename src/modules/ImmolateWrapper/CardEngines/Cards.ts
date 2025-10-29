import {CardEngine, MiscCardSource} from "../index.ts";

export interface NextShopItem {
    edition: string | undefined;
    item: string;
    type: string;
    jokerData: {
        edition: string;
        rarity: number;
        joker: string;
        stickers: {
            eternal: boolean;
            perishable: boolean;
            rental: boolean;
        }
    } | undefined

    delete(): void;
}

export interface BoosterPack {
    type: string;
    choices: number;
    size: number;
}

export interface PackCard {
    base: string | undefined;
    type: string;
    edition: string;
    enhancement: string | undefined;
    seal: string | undefined;
    joker: string | undefined;
    rarity: number | undefined;
    stickers: {
        eternal: boolean | undefined;
        perishable: boolean | undefined;
        rental: boolean | undefined;
    } | undefined

}

export class NextPackCard {
    name: string | null;
    type: string;
    base: string | undefined;
    edition: string;
    enhancement: string | undefined;
    seal: string | undefined;
    jokerData: {
        edition: string;
        joker: string | undefined;
        rarity: number | undefined;
        stickers: {
            eternal: boolean | undefined;
            perishable: boolean | undefined;
            rental: boolean | undefined;
        } | undefined
    }

    constructor(packCard: PackCard) {
        this.name = null;
        this.base = packCard?.base;
        this.edition = packCard.edition;
        this.enhancement = packCard?.enhancement;
        this.seal = packCard?.seal;
        this.type = packCard.type;
        this.jokerData = {
            edition: packCard.edition,
            joker: packCard?.joker,
            rarity: packCard?.rarity,
            stickers: {
                eternal: packCard?.stickers?.eternal,
                perishable: packCard?.stickers?.perishable,
                rental: packCard?.stickers?.rental,
            }
        }


    }
}

export interface Stringifies {
    name: string;
    type: string;
    edition?: string | undefined;
}

export interface CardAttributes {
    name: string;
    type: string;
    edition: string | undefined;
    seal?: string | undefined;
    rank?: string | undefined;
    suit?: string | undefined;
    base?: string | undefined;
    enhancements?: string | undefined;
    joker?: string | undefined;
    rarity?: number | undefined;
    isEternal?: boolean;
    isPerishable?: boolean;
    isRental?: boolean;
}

export class Card_Final implements Stringifies {
    name: string;
    type: string;
    edition: string | undefined;
    seal: string | undefined;
    rank: string | undefined;
    suit: string | undefined;
    base: string | undefined;
    enhancements: string | undefined;
    joker: string | undefined;
    rarity: number | undefined;
    isEternal: boolean | undefined;
    isPerishable: boolean | undefined;
    isRental: boolean | undefined;

    constructor(card: CardAttributes) {
        // base line card attributes
        this.name = card.name;
        this.type = card.type;
        // common card attributes
        this.edition = card.edition;
        // Standard Card Attributes
        this.seal = card.seal;
        this.rank = card.rank;
        this.suit = card.suit;
        this.base = card.base;
        this.enhancements = card.enhancements;
        // Joker Card Attributes
        this.joker = card.joker;
        this.rarity = card.rarity;
        this.isEternal = card.isEternal;
        this.isPerishable = card.isPerishable;
        this.isRental = card.isRental;
    }
}

export class Joker_Final implements Stringifies {
    name: string;
    type: string;
    edition: string;
    rarity: number;
    isEternal: boolean | undefined;
    isPerishable: boolean | undefined;
    isRental: boolean | undefined;

    constructor(joker: Card_Final) {
        this.name = joker.name;
        this.type = joker.type;
        this.edition = joker?.edition === "No Edition" ? '' : joker?.edition ?? '';
        this.rarity = joker?.rarity ?? 0;
        this.isEternal = joker.isEternal;
        this.isPerishable = joker.isPerishable;
        this.isRental = joker.isRental;
    }
}

export class Consumables_Final implements Stringifies {
    name: string;
    type: string;
    edition: string | undefined;

    constructor(planet: Card_Final) {
        this.name = planet.name;
        this.type = planet.type;
        this.edition = planet?.edition;
    }
}

export class Planet_Final extends Consumables_Final implements Stringifies {
}

export class Tarot_Final extends Consumables_Final implements Stringifies {
}

export class Spectral_Final extends Consumables_Final implements Stringifies {
}

export class StandardCard_Final extends Card_Final implements Stringifies {
    constructor(card: Card_Final) {
        super(card);
        this.init(card)
    }

    init(cardData: Card_Final) {
        if (cardData.base === undefined) return;
        let name = ''
        if (cardData.seal !== "No Seal") {
            this.seal = cardData.seal;
            name += `${this.seal} `
        }
        if (cardData.edition !== 'No Edition') {
            this.edition = cardData.edition;
            name += `${this.edition} `
        }
        if (cardData.enhancements !== 'No Enhancement') {
            this.enhancements = cardData.enhancements;
            name += `${this.enhancements} `
        }
        this.base = cardData.base;
        let rank = this.base[2];
        if (rank === "T") this.rank = "10";
        else if (rank === "J") this.rank = "Jack";
        else if (rank === "Q") this.rank = "Queen";
        else if (rank === "K") this.rank = "King";
        else if (rank === "A") this.rank = "Ace";
        else this.rank = rank;
        name += this.rank
        name += " of "
        let suit = this.base[0];
        if (suit === "C") this.suit = "Clubs";
        else if (suit === "S") this.suit = "Spades";
        else if (suit === "D") this.suit = "Diamonds";
        else if (suit === "H") this.suit = "Hearts";
        name += this.suit;
        this.name = name;
    }
}

export class Pack {
    name: string;
    choices: number;
    size: number;
    cards: any[]

    constructor(pack: BoosterPack) {
        this.name = pack.type;
        this.choices = pack.choices;
        this.size = pack.size;
        this.cards = []
    }

    static PackCardToCard(data: string | PackCard, cardType: string, spoilers? :boolean) {
        if (data === undefined) {
            console.debug("No data for pack card");
            return [];
        }
        if (typeof data === 'string') {
            if (cardType === 'Planet') {
                return new Planet_Final({
                    name: data,
                    type: cardType
                } as Card_Final);
            }
            if (cardType === 'Tarot') {
                if(data !== 'The Soul') {
                    return new Tarot_Final({
                        name: data,
                        type: cardType
                    } as Card_Final);
                }else{
                    if(!spoilers) {
                        return new Spectral_Final({
                            name: data,
                            type: cardType
                        } as Card_Final);
                    }
                }
            }
            if (cardType === 'Spectral') {
                return new Spectral_Final({
                    name: data,
                    type: cardType
                } as Card_Final);
            }
        }
        else {
            let packCard = new NextPackCard(data);
            if (cardType === 'Standard') {
                let templateCard = new Card_Final({
                    name: packCard.name,
                    type: cardType,
                    edition: packCard?.edition === "No Edition" ? '' : packCard.edition,
                    seal: packCard.seal,
                    base: packCard.base,
                    enhancements: packCard.enhancement,
                } as CardAttributes);
                return new StandardCard_Final(templateCard);
            }
            else {
                let templateCard = new Card_Final({
                    name: packCard.jokerData.joker,
                    type: cardType,
                    edition: packCard.edition,
                    enhancements: packCard.enhancement,
                    rarity: packCard.jokerData?.rarity,
                    isEternal: packCard.jokerData?.stickers?.eternal,
                    isPerishable: packCard.jokerData?.stickers?.perishable,
                    isRental: packCard.jokerData?.stickers?.rental
                } as CardAttributes);
                return new Joker_Final(templateCard);
            }
        }
    }

    init(instance: CardEngine, ante: number, spoilers = true) {
        let itemsWithSpoilers: string[] = ["The Soul", "Judgement", "Wraith"];
        let cards, cardType;
        switch (this.name) {
            case "Celestial Pack":
                cards = instance.nextCelestialPack(this.size, ante);
                cardType = 'Planet'
                break;
            case "Arcana Pack":
                cards = instance.nextArcanaPack(this.size, ante);
                cardType = "Tarot"
                break;
            case "Spectral Pack":
                cards = instance.nextSpectralPack(this.size, ante);
                cardType = "Spectral"
                break;
            case "Buffoon Pack":
                cards = instance.nextBuffoonPack(this.size, ante);
                cardType = "Joker"
                break;
            case "Standard Pack":
                cards = instance.nextStandardPack(this.size, ante);
                cardType = "Standard"
                break;
            default:
                console.debug("unknown pack type");
                return;
        }
        for (let i = 0; i < this.size; i++) {
            let data: string | PackCard | undefined = cards.get(i);
            if (data === undefined) {
                console.debug("No data for pack card");
                continue;
            }
            if (typeof data === 'string' && itemsWithSpoilers.includes(data) && spoilers) {
                let joker = instance.nextJoker(instance.commonSources[data], ante, true);
                let commonCardInterface = {
                    name: joker.joker,
                    type: cardType,
                    edition: joker.edition,
                    seal: joker.seal,
                    isEternal: joker?.stickers?.eternal,
                    isPerishable: joker?.stickers?.perishable,
                    isRental: joker?.stickers?.rental,
                } as Card_Final
                let jokerCard = new Joker_Final(commonCardInterface);
                this.cards.push(jokerCard);
                continue;
            }
            this.cards.push(Pack.PackCardToCard(data, cardType))
        }
        // @ts-ignore
        cards.delete();
    }
}

export class SeedResultsContainer {
    antes: { [key: number]: Ante };
    constructor() {
        this.antes = {}
    }
}

export class Ante {
    ante: number;
    boss: string | null;
    voucher: string | null;
    queue: Stringifies[];
    tags: string[];
    blinds: { [key: string]: { [key: string]: any[] } }
    miscCardSources: MiscCardSource[]
    voucherQueue: string[] = [];
    bossQueue: string[] = [];
    tagsQueue: string[] = [];
    wheelQueue: Stringifies[] = [];
    auraQueue: Stringifies[] = [];
    packQueue: string[] = [];

    constructor(ante: number) {
        this.ante = ante;
        this.boss = null;
        this.voucher = null;
        this.queue = [];
        this.tags = [];
        this.miscCardSources = [];
        this.blinds = {
            smallBlind: {
                packs: []
            },
            bigBlind: {
                packs: []
            },
            bossBlind: {
                packs: []
            }
        }
    }

    get packs() {
        return Object.values(this.blinds).reduce((acc: any[], {packs}) => [...acc, ...packs], [])
    }
}
