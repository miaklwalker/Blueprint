

class CardEngineWrapper {
    constructor() {
    }
    static printAnalysis(seedAnalysis) {
        let output = "";
        let antes = Object.entries(seedAnalysis.antes);

        for (let [ante, details] of antes) {
            output += `==Ante ${ante}==\n`;
            output += `Boss: ${details.boss}\n`;
            output += `Tags: ${details.tags.join(', ')}\n`
            output += `Shop Queue: \n`
            let count = 0;
            for (let i = 0; i < details.queue.length; i++) {
                output += `${++count}) ${details.queue[i].name}\n`
            }
            output += '\n'
            output += "Packs: \n"
            for (let pack of details.packs) {
                output += `${pack.name} - ${pack.cards.map(card => card.name).join(', ')}\n`
            }
            output += '\n'
        }
        return output
    }
}

class Card {
    name: string | null;
    type: string ;
    constructor(name: string, type: string) {
        this.name = name;
        this.type = type;
    }
}

class Joker extends Card {
    joker: string;
    edition: string | undefined;
    rarity: string | undefined;
    stickers:(string | null)[]
    constructor(card: NextShopItem) {
        super('', "Joker");
        this.joker = card?.item;
        this.edition = card?.['jokerData']?.edition;
        this.rarity = card?.['jokerData']?.rarity;
        this.stickers = [
            card?.['jokerData']?.stickers?.['eternal'] ? 'Eternal ' : null,
            card?.['jokerData']?.stickers?.['perishable'] ? 'Perishable ' : null,
            card?.['jokerData']?.stickers?.['rental'] ? 'Rental ' : null,
        ].filter(Boolean)
        this.init();
    }
    init(){
        let name  = '';
        name += this.stickers.join('')
        if (this.edition !== "No Edition") name += this.edition + " ";
        name += this.joker
        this.name = name;
    }
}

class Consumables extends Card {
    constructor(card: string, type: string) {
        super(card?.item ?? card, type);
    }
}

class StandardCard extends Card {
    constructor(card) {
        super(null,'Standard');
        this.base = null;
        this.edition = null;
        this.enhancements = null;
        this.seal = null;
        this.rank = null;
        this.suit = null;
        this.init(card)
    }
    init(cardData){
        let name = ''
        if(cardData.seal !== "No Seal") {
            this.seal = cardData.seal;
            name += `${this.seal} `
        }
        if(cardData.edition !== 'No Edition') {
            this.edition = cardData.edition;
            name += `${this.edition} `
        }
        if(cardData.enhancement !== 'No Enhancement') {
            this.enhancement = cardData.enhancement;
            name += `${this.enhancement} `
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
        cardData.delete();
        this.name = name;
    }
}

class Pack {
    constructor(pack) {
        this.name = pack.type;
        this.choices = pack.choices;
        this.size = pack.size;
        this.cards = []
    }

    init(instance, ante, spoilers = false) {
        let cards, factory;
        switch (this.name) {
            case "Celestial Pack":
                cards = instance.nextCelestialPack(this.size, ante);
                factory = Consumables
                break;
            case "Arcana Pack":
                cards = instance.nextArcanaPack(this.size, ante);
                factory = Consumables
                break;
            case "Spectral Pack":
                cards = instance.nextSpectralPack(this.size, ante);
                factory = Consumables
                break;
            case "Buffoon Pack":
                cards = instance.nextBuffoonPack(this.size, ante);
                factory = Joker
                break;
            case "Standard Pack":
                cards = instance.nextStandardPack(this.size, ante);
                factory = StandardCard
                break;
            default:
                console.log("unknown pack type");
                return;
        }
        for (let i = 0; i < this.size; i++) {
            let data = cards.get(i);
            if( this.name.includes('Buffoon') ) {
                console.log(data)
            }

            if ((data === "The Soul" || data === "Judgement" || data === "Wraith") && spoilers) {
                let source = engine.commonSources[data];
                this.cards.push(
                    new Joker(
                        engine.nextJoker(source, ante, false)
                    )
                )
                continue;
            }
            let card = new factory(data);
            this.cards.push(card)
        }
        cards.delete();
    }
}

class Seed {
    constructor() {
        this.antes = {}
    }
}

class Ante {
    ante: number;
    boss: string | null;
    voucher: string | null;
    queue : any[];
    tags: any[];
    blinds:{[key:string]: {[key:string]: any[]}}
    constructor(ante:number) {
        this.ante = ante;
        this.boss = null;
        this.voucher = null;
        this.queue = [];
        this.tags = [];
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
        return Object.values(this.blinds).reduce((acc:any[], {packs}) => [...acc, ...packs], [])
    }
}



interface NextShopItem {
    edition: string | undefined;
    item: string;
    type: string;
    jokerData: {
        edition: string;
        rarity: string;
        joker: string;
        stickers: {
            eternal: boolean;
            perishable: boolean;
            rental: boolean;
        }
    } | undefined
}
class NextShopCard {
    edition:string | undefined;
    type: string;
    item: string;
    jokerData: {
        edition:string | undefined,
        rarity:string | undefined,
        joker:string | undefined,
        stickers:{
            eternal: boolean | undefined;
            perishable: boolean | undefined;
            rental: boolean | undefined;
        } | undefined
    } | undefined
    constructor(shopItem: NextShopItem) {
        this.edition = shopItem.edition
        this.item = shopItem.item;
        this.type = shopItem.type;
        this.jokerData = {
            edition: shopItem?.jokerData?.edition,
            rarity: shopItem?.jokerData?.rarity,
            joker: shopItem?.jokerData?.joker,
            stickers: {
                eternal: shopItem?.jokerData?.stickers.eternal,
                perishable: shopItem?.jokerData?.stickers.perishable,
                rental: shopItem?.jokerData?.stickers.rental,
            }
        }

    }
}

class ImmolateClassic extends CardEngineWrapper {
    sources : {[key:string] : string };
    commonSources : {[key:string] : string };
    instance: any;
    VOUCHERS: string[];
    constructor(seed: string) {
        super();
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
        }
        // @ts-ignore
        this.instance = new Immolate.Instance(seed);
        // @ts-ignore
        this.VOUCHERS = Immolate.VOUCHERS;
    }

    InstParams(deck:string, stake:string, showman:boolean = false, version : string) {
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
    initLocks(ante:number, fresh_profile:boolean, fresh_run:boolean) {
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
    lock(item:string) {
        this.instance.lock(item);
    }

    /**
     * @method unlock Unlocks an item, enabling it to appear in packs and shops.
     * @param item
     */
    unlock(item:string) {
        this.instance.unlock(item);
    }

    /**
     * @method nextBoss
     * @param ante {Number} The integer of the current ante.
     * @returns {String}
     */
    nextBoss(ante:number): string {
        return this.instance.nextBoss(ante);
    }

    /**
     * @method nextVoucher
     * @param ante {Number} The integer of the current ante.
     * @returns {String}
     */
    nextVoucher(ante:number): string {
        return this.instance.nextVoucher(ante);
    }

    /**
     * @method nextTag Gets the next tag.
     * @param ante {Number}
     */
    nextTag(ante:number) {
        return this.instance.nextTag(ante);
    }

    /**
     * @method nextShopItem
     * @param ante {Number} The integer of the current ante
     * @returns {*}
     */
    nextShopItem(ante:number): NextShopCard {
        return new NextShopCard(this.instance.nextShopItem(ante));
    }

    /**
     * @method nextJoker
     * @param source
     * @param ante
     * @param hasStickers
     * @returns {*}
     */
    nextJoker(source:string, ante:number, hasStickers:boolean = false): any {
        return this.instance.nextJoker(source, ante, hasStickers);
    }

    /**
     * @method nextPack
     * @param ante {Number}
     * @returns {String}
     */
    nextPack(ante: number): string {
        return this.instance.nextPack(ante);
    }

    packInfo(pack:string) {
        // @ts-ignore
        return Immolate.packInfo(pack)
    }

    nextCelestialPack(size:number, ante:number):string {
        return this.instance.nextCelestialPack(size, ante);
    }

    nextArcanaPack(size:number, ante:number):string {
        return this.instance.nextArcanaPack(size, ante);
    }

    nextSpectralPack(size:number, ante:number):string {
        return this.instance.nextSpectralPack(size, ante);
    }

    nextBuffoonPack(size:number, ante:number):string {
        return this.instance.nextBuffoonPack(size, ante);
    }

    nextStandardPack(size:number, ante:number):string {
        return this.instance.nextStandardPack(size, ante)
    }


    /**
     * @method isLocked This method returns the locked status of an item.
     * @param item
     * @returns {Boolean}
     */
    isLocked(item:string): boolean {
        return this.instance.isLocked(item);
    }

    /**
     * @method activateVoucher
     * @param voucher
     */
    activateVoucher(voucher:string) {
        this.instance.activateVoucher(voucher);
    }

    isVoucherActive(voucher:string) {
        return this.instance.isVoucherActive(voucher);
    }

    makeCard(card: NextShopItem) {
        let type = card.type;
        if (type === 'Joker') {
            return new Joker(card)
        } else if (type === 'Tarot' || type === 'Planet' || type === 'Spectral') {
            return new Consumables(card, type)
        } else {
            return new StandardCard(card)
        }
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

}

const seed:string = '5YVHAEP'
// const ante = 1;
const antes:number = 1;
const cardsPerAnte:number = 15;
const engine:ImmolateClassic = new ImmolateClassic(seed);

engine.InstParams('Red Deck', 'Gold Stake', false, '10106');
engine.initLocks(1, false, false);
engine.lockLevelTwoVouchers();




export function preformFullAnalysis() {
    let result:{[key:number | string] : Ante} = {}

    for (let ante = 1; ante <= antes; ante++) {
        result[ante] = new Ante(ante)
        result[ante].boss = engine.nextBoss(ante)
        result[ante].voucher = engine.nextVoucher(ante);

        result[ante].tags.push(engine.nextTag(ante));
        result[ante].tags.push(engine.nextTag(ante));
        let max = ante === 1 ? 15 : cardsPerAnte;
        for (let i = 0; i < max; i++) {
            result[ante].queue.push(
                engine.makeCard(
                    engine.nextShopItem(ante)
                )
            )
        }
        for (let blind of Object.keys(result[ante].blinds)) {
            if (ante === 1 && blind === 'smallBlind') {
                continue;
            }
            for (let j = 0; j < 2; j++) {
                let packString = engine.nextPack(ante);
                let packInfo = engine.packInfo(packString);
                let pack = new Pack(packInfo);
                pack.init(engine, ante);
                result[ante].blinds[blind].packs.push(pack)
            }
        }
    }
    let seed = new Seed();
    seed.antes = result;
    return seed
}

// let seedAnalysis = preformFullAnalysis();
// console.log(seedAnalysis)
// console.log(CardEngineWrapper.printAnalysis(seedAnalysis))