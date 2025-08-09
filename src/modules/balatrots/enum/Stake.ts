export enum StakeType {
    WHITE_STAKE = "White Stake",
    RED_STAKE = "Red Stake",
    GREEN_STAKE = "Green Stake",
    BLACK_STAKE = "Black Stake",
    BLUE_STAKE = "Blue Stake",
    PURPLE_STAKE = "Purple Stake",
    ORANGE_STAKE = "Orange Stake",
    GOLD_STAKE = "Gold Stake"
}

export class Stake {
    constructor(private name: StakeType) { }

    getName() {
        return this.name;
    }

}