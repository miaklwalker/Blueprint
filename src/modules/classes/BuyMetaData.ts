export class BuyMetaData {
    location: string;
    locationType: string;
    index: number;
    ante: string;
    blind: string;
    name: string;

    constructor({location, locationType, index, ante, blind, name}: {
        location: string,
        locationType: string,
        index: number,
        ante: string,
        blind: string,
        itemType: string,
        name: string
    }) {
        this.location = location;
        this.locationType = locationType;
        this.index = index;
        this.ante = ante;
        this.blind = blind;
        this.name = name;
    }
}
