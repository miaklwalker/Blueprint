import { ItemImpl } from "../interface/Item";

export enum Tag {
    // Rarity Tags
    UNCOMMON_TAG = "Uncommon Tag",
    RARE_TAG = "Rare Tag",
    NEGATIVE_TAG = "Negative Tag",
    
    // Special Effect Tags
    FOIL_TAG = "Foil Tag",
    HOLOGRAPHIC_TAG = "Holographic Tag",
    POLYCHROME_TAG = "Polychrome Tag",
    
    // Game System Tags
    INVESTMENT_TAG = "Investment Tag",
    VOUCHER_TAG = "Voucher Tag",
    BOSS_TAG = "Boss Tag",
    STANDARD_TAG = "Standard Tag",
    
    // Ability Tags
    CHARM_TAG = "Charm Tag",
    METEOR_TAG = "Meteor Tag",
    BUFFOON_TAG = "Buffoon Tag",
    HANDY_TAG = "Handy Tag",
    GARBAGE_TAG = "Garbage Tag",
    ETHEREAL_TAG = "Ethereal Tag",
    
    // Mechanic Tags
    COUPON_TAG = "Coupon Tag",
    DOUBLE_TAG = "Double Tag",
    JUGGLE_TAG = "Juggle Tag",
    D6_TAG = "D6 Tag",
    TOP_UP_TAG = "Top-up Tag",
    SPEED_TAG = "Speed Tag",
    ORBITAL_TAG = "Orbital Tag",
    ECONOMY_TAG = "Economy Tag"
}

export class TagItem extends ItemImpl {
    constructor(readonly name: Tag) {
        super(name);
    }

    getName(): string {
        return this.name;
    }
}