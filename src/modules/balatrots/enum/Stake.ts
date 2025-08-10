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
export const stakeMap: Record<string, StakeType> = {
    "White Stake": StakeType.WHITE_STAKE,
    "Red Stake": StakeType.RED_STAKE,
    "Green Stake": StakeType.GREEN_STAKE,
    "Black Stake": StakeType.BLACK_STAKE,
    "Blue Stake": StakeType.BLUE_STAKE,
    "Purple Stake": StakeType.PURPLE_STAKE,
    "Orange Stake": StakeType.ORANGE_STAKE,
    "Gold Stake": StakeType.GOLD_STAKE
}
export class Stake {
    constructor(private name: StakeType) { }

    getName() {
        return this.name;
    }

}