import { Card } from "../enum/cards/Card";
import { Edition } from "../enum/Edition";
import { Seal } from "../enum/Seal";

export class CardNameBuilder {
    seal: string;
    edition: string;
    enhancement: string;
    constructor(
        private card: Card
    ) {
        this.seal = this.card.getSeal()?.getName() || Seal.NO_SEAL;
        this.edition = this.card.getEdition()?.getName() || Edition.NO_EDITION;
        this.enhancement = this.card.getEnhancement() || "No Enhancement";
    }

    build(): string {
        let result = '';
        if (this.seal !== Seal.NO_SEAL) {
            result += `${this.seal} `;
        }
        if (this.edition !== Edition.NO_EDITION) {
            result += `${this.edition} `;
        }
        if (this.enhancement !== "No Enhancement") {
            result += `${this.enhancement} `
        }

        const rank = this.card.getName().charAt(2);

        switch (rank) {
            case 'T':
                result += '10';
                break;
            case 'J':
                result += 'Jack';
                break;
            case 'Q':
                result += 'Queen';
                break;
            case 'K':
                result += 'King';
                break;
            case 'A':
                result += 'Ace';
                break;
            default:
                result += rank;
        }
        result += ` of `;

        const suit = this.card.getName().charAt(0);

        switch (suit) {
            case 'H':
                result += 'Hearts';
                break;
            case 'S':
                result += 'Spades';
                break;
            case 'D':
                result += 'Diamonds';
                break;
            case 'C':
                result += 'Clubs';
                break;
        }

        return result;
    }

}