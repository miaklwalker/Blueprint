import type {MiscCardSource} from "../index.ts";

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

    delete: () => void;
}

export interface BoosterPack {
    type: string;
    choices: number;
    size: number;
}

export interface PackCard {
    name: string
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
        this.base = packCard.base;
        this.edition = packCard.edition;
        this.enhancement = packCard.enhancement;
        this.seal = packCard.seal;
        this.type = packCard.type;
        this.jokerData = {
            edition: packCard.edition,
            joker: packCard.joker,
            rarity: packCard.rarity,
            stickers: {
                eternal: packCard.stickers?.eternal,
                perishable: packCard.stickers?.perishable,
                rental: packCard.stickers?.rental,
            }
        }


    }
}

export interface Stringifies {
    rarity?: number | undefined;
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

    constructor(joker: Omit<Card_Final, 'seal' | 'rank' | 'suit' | 'base' | 'enhancements'| 'joker'>) {
        this.name = joker.name;
        this.type = joker.type;
        this.edition = joker.edition === "No Edition" ? '' : joker.edition ?? '';
        this.rarity = joker.rarity ?? 0;
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
        this.edition = planet.edition;
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
        const rank = this.base[2];
        if (rank === "T") this.rank = "10";
        else if (rank === "J") this.rank = "Jack";
        else if (rank === "Q") this.rank = "Queen";
        else if (rank === "K") this.rank = "King";
        else if (rank === "A") this.rank = "Ace";
        else this.rank = rank;
        name += this.rank
        name += " of "
        const suit = this.base[0];
        if (suit === "C") this.suit = "Clubs";
        else if (suit === "S") this.suit = "Spades";
        else if (suit === "D") this.suit = "Diamonds";
        else if (suit === "H") this.suit = "Hearts";
        name += this.suit;
        this.name = name;
    }
}
export type CardTuple = Joker_Final | Planet_Final | Tarot_Final | Spectral_Final | StandardCard_Final;
export class Pack {
    name: string;
    choices: number;
    size: number;
    cards: Array<CardTuple | undefined>

    constructor(pack: BoosterPack) {
        this.name = pack.type;
        this.choices = pack.choices;
        this.size = pack.size;
        this.cards = []
    }

    static PackCardToCard(data: string | PackCard, cardType: string, spoilers? :boolean) {
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
            const packCard = new NextPackCard(data);
            if (cardType === 'Standard') {
                const templateCard = new Card_Final({
                    name: packCard.name,
                    type: cardType,
                    edition: packCard.edition === "No Edition" ? '' : packCard.edition,
                    seal: packCard.seal,
                    base: packCard.base,
                    enhancements: packCard.enhancement,
                } as CardAttributes);
                return new StandardCard_Final(templateCard);
            }
            else {
                const templateCard = new Card_Final({
                    name: packCard.jokerData.joker,
                    type: cardType,
                    edition: packCard.edition,
                    enhancements: packCard.enhancement,
                    rarity: packCard.jokerData.rarity,
                    isEternal: packCard.jokerData.stickers?.eternal,
                    isPerishable: packCard.jokerData.stickers?.perishable,
                    isRental: packCard.jokerData.stickers?.rental
                } as CardAttributes);
                return new Joker_Final(templateCard);
            }
        }
    }
}

export class SeedResultsContainer {
    isLoading: boolean;
    antes: { [key: number]: Ante };
    constructor() {
        this.antes = {}
        this.isLoading = true;
    }
}
export interface Blind {
    packs: Array<Pack>;
    deck: Array<Stringifies>;
}
export class Ante {
    ante: number;
    boss: string | null;
    voucher: string | null;
    queue: Array<Stringifies>;
    tags: Array<string>;
    blinds: {
        smallBlind: Blind;
        bigBlind: Blind;
        bossBlind: Blind;
    }
    miscCardSources: Array<MiscCardSource>
    voucherQueue: Array<string> = [];
    bossQueue: Array<string> = [];
    tagsQueue: Array<string> = [];
    wheelQueue: Array<Stringifies> = [];
    auraQueue: Array<Stringifies> = [];
    packQueue: Array<string> = [];

    constructor(ante: number) {
        this.ante = ante;
        this.boss = null;
        this.voucher = null;
        this.queue = [];
        this.tags = [];
        this.miscCardSources = [];
        this.blinds = {
            smallBlind: {
                packs: [],
                deck: []
            },
            bigBlind: {
                packs: [],
                deck: []
            },
            bossBlind: {
                packs: [],
                deck: []
            }
        }
    }

    get packs() {
        return Object
            .values(this.blinds)
            .reduce((acc, blind) => [...acc, ...blind.packs], [] as Array<Pack>);
    }
}
