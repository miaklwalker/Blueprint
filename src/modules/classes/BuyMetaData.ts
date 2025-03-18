import {
    Card_Final,
    Joker_Final,
    Planet_Final,
    Spectral_Final,
    Tarot_Final
} from "../ImmolateWrapper/CardEngines/Cards.ts";



export class BuyMetaData {
    transactionType: 'buy' | 'sell' = 'buy';
    location: string;
    locationType: string;
    index: number;
    ante: string;
    blind: string;
    link?: string;
    name?: string;
    card?: Card_Final | Joker_Final | Spectral_Final | Tarot_Final | Planet_Final

    constructor({location, locationType, index, ante, blind, card, link, name}: {
        location: string,
        locationType: string,
        index: number,
        ante: string,
        blind: string,
        itemType?: string,
        link?: string,
        name?: string
        card?: Card_Final | Joker_Final | Spectral_Final | Tarot_Final | Planet_Final
    }) {
        this.transactionType = 'buy';
        this.location = location;
        this.locationType = locationType;
        this.index = index;
        this.ante = ante;
        this.blind = blind;
        this.link = link;
        this.card = card;
        this.name = name;
    }
}
