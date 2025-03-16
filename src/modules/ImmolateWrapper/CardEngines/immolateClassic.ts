import {CardEngine} from "../index.ts";
import {NextShopItem, PackCard} from "./Cards.ts";
import {options} from "../../const.ts";

export class ImmolateClassic implements CardEngine{
    sources: { [key: string]: string };
    commonSources: { [key: string]: string };
    instance: any;
    VOUCHERS: Map<any, any>;

    constructor(seed: string) {
        this.sources = {
            R_Joker_Common: "Joker1",
            R_Joker_Uncommon: "Joker2",
            R_Joker_Rare: "Joker3",
            R_Joker_Legendary: "Joker4",
            R_Joker_Rarity: "rarity",
            R_Joker_Edition: "edi",
            R_Misprint: "misprint",
            R_Standard_Has_Enhancement: "stdset",
            R_Enhancement: "Enhanced",
            R_Card: "front",
            R_Standard_Edition: "standard_edition",
            R_Standard_Has_Seal: "stdseal",
            R_Standard_Seal: "stdsealtype",
            R_Shop_Pack: "shop_pack",
            R_Tarot: "Tarot",
            R_Spectral: "Spectral",
            R_Tags: "Tag",
            R_Shuffle_New_Round: "nr",
            R_Card_Type: "cdt",
            R_Planet: "Planet",
            R_Lucky_Mult: "lucky_mult",
            R_Lucky_Money: "lucky_money",
            R_Sigil: "sigil",
            R_Ouija: "ouija",
            R_Wheel_of_Fortune: "wheel_of_fortune",
            R_Gros_Michel: "gros_michel",
            R_Cavendish: "cavendish",
            R_Voucher: "Voucher",
            R_Voucher_Tag: "Voucher_fromtag",
            R_Orbital_Tag: "orbital",
            R_Soul: "soul_",
            R_Erratic: "erratic",
            R_Eternal: "stake_shop_joker_eternal",
            R_Perishable: "ssjp",
            R_Rental: "ssjr",
            R_Eternal_Perishable: "etperpoll",
            R_Rental_Pack: "packssjr",
            R_Eternal_Perishable_Pack: "packetper",
            R_Boss: "boss",

            S_Shop: "sho",
            S_Emperor: "emp",
            S_High_Priestess: "pri",
            S_Judgement: "jud",
            S_Wraith: "wra",
            S_Arcana: "ar1",
            S_Celestial: "pl1",
            S_Spectral: "spe",
            S_Standard: "sta",
            S_Buffoon: "buf",
            S_Vagabond: "vag",
            S_Superposition: "sup",
            S_8_Ball: "8ba",
            S_Seance: "sea",
            S_Sixth_Sense: "sixth",
            S_Top_Up: "top",
            S_Rare_Tag: "rta",
            S_Uncommon_Tag: "uta",
            S_Blue_Seal: "blusl",
            S_Purple_Seal: "8ba",
            S_Soul: "sou",
            S_Riff_Raff: "rif",
            S_Cartomancer: "car",
        };
        this.commonSources = {
            "The Soul": this.sources.S_Soul,
            "Judgment": this.sources.S_Judgement,
            "Wraith": this.sources.S_Wraith,
            "RiffRaff": this.sources.S_Riff_Raff,
        }
        // @ts-ignore
        this.instance = new Immolate.Instance(seed);
        // @ts-ignore
        this.VOUCHERS = Immolate.VOUCHERS;
    }

    InstParams(deck: string, stake: string, showman: boolean = false, version: string) {
        // defaulting the showman to false with double shebang ( !! )
        // @ts-ignore
        this.instance.params = new Immolate.InstParams(deck, stake, showman, version);
    }
    /**
     * @method initLocks
     * @param ante {Number} The integer value of the current ante
     * @param fresh_profile {Boolean} Whether this should be initialized like a fresh profile.
     * @param fresh_run {Boolean} Whether this should be initialized like a fresh run.
     */
    initLocks(ante: number, fresh_profile: boolean, fresh_run: boolean) {
        this.instance.initLocks(ante, fresh_profile, fresh_run);
    }
    /**
     * @method initUnlocks
     * @param ante
     * @param fresh_profile
     */
    initUnlocks(ante: number, fresh_profile: boolean) {
        this.instance.initUnlocks(ante, fresh_profile);
    }
    /**
     * @method lock Locks an item from appearing. ( Player has in hand or hasn't unlocked it yet )
     * @param item {String} The item to lock.
     */
    lock(item: string) {
        this.instance.lock(item);
    }
    /**
     * @method unlock Unlocks an item, enabling it to appear in packs and shops.
     * @param item
     */
    unlock(item: string) {
        this.instance.unlock(item);
    }
    /**
     * @method nextBoss
     * @param ante {Number} The integer of the current ante.
     * @returns {String}
     */
    nextBoss(ante: number): string {
        return this.instance.nextBoss(ante);
    }
    /**
     * @method nextVoucher
     * @param ante {Number} The integer of the current ante.
     * @returns {String}
     */
    nextVoucher(ante: number): string {
        return this.instance.nextVoucher(ante);
    }
    /**
     * @method nextTag Gets the next tag.
     * @param ante {Number}
     */
    nextTag(ante: number) {
        return this.instance.nextTag(ante);
    }
    /**
     * @method nextShopItem
     * @param ante {Number} The integer of the current ante
     * @returns {*}
     */
    nextShopItem(ante: number): NextShopItem {
        return this.instance.nextShopItem(ante)
    }
    /**
     * @method nextJoker
     * @param source
     * @param ante
     * @param hasStickers
     * @returns {*}
     */
    nextJoker(source: string, ante: number, hasStickers: boolean = false): PackCard {
        return this.instance.nextJoker(source, ante, hasStickers);
    }
    nextTarot(source: string, ante: number, soulable: boolean = false): PackCard {
        return this.instance.nextTarot(source, ante, soulable);
    }
    nextPlanet(source: string, ante: number, soulable: boolean = false): PackCard {
        return this.instance.nextPlanet(source, ante, soulable);
    }
    nextSpectral(source: string, ante: number, soulable: boolean = false): PackCard {
        return this.instance.nextSpectral(source, ante, soulable);
    }

    /**
     * @method nextPack
     * @param ante {Number}
     * @returns {String}
     */
    nextPack(ante: number): string {
        return this.instance.nextPack(ante);
    }
    packInfo(pack: string) {
        // @ts-ignore
        return Immolate.packInfo(pack)
    }
    nextCelestialPack(size: number, ante: number): Map<number, string> {
        return this.instance.nextCelestialPack(size, ante);
    }
    nextArcanaPack(size: number, ante: number): Map<number, string> {
        return this.instance.nextArcanaPack(size, ante);
    }
    nextSpectralPack(size: number, ante: number): Map<number, string> {
        return this.instance.nextSpectralPack(size, ante);
    }
    nextBuffoonPack(size: number, ante: number): Map<number, PackCard> {
        return this.instance.nextBuffoonPack(size, ante);
    }
    nextStandardPack(size: number, ante: number): Map<number, PackCard>  {
        return this.instance.nextStandardPack(size, ante)
    }
    /**
     * @method isLocked This method returns the locked status of an item.
     * @param item
     * @returns {Boolean}
     */
    isLocked(item: string): boolean {
        return this.instance.isLocked(item);
    }
    /**
     * @method activateVoucher
     * @param voucher
     */
    activateVoucher(voucher: string) {
        return this.instance.activateVoucher(voucher);
    }
    isVoucherActive(voucher: string) {
        return this.instance.isVoucherActive(voucher);
    }
    delete() {
        this.instance.delete();
    }
    lockLevelTwoVouchers() {
        this.instance.lock("Overstock Plus");
        this.instance.lock("Liquidation");
        this.instance.lock("Glow Up");
        this.instance.lock("Reroll Glut");
        this.instance.lock("Omen Globe");
        this.instance.lock("Observatory");
        this.instance.lock("Nacho Tong");
        this.instance.lock("Recyclomancy");
        this.instance.lock("Tarot Tycoon");
        this.instance.lock("Planet Tycoon");
        this.instance.lock("Money Tree");
        this.instance.lock("Antimatter");
        this.instance.lock("Illusion");
        this.instance.lock("Petroglyph");
        this.instance.lock("Retcon");
        this.instance.lock("Palette");
    }

    handleSelectedUnlocks(unlocks: boolean[]): void {
        options.forEach( (option: string, index: number) => {
            if(!unlocks[index]){
                this.instance.lock(option);
            }else{
                this.instance.unlock(option);
            }
        })
    }
}