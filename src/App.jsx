import "@mantine/core/styles.css";
import '@mantine/code-highlight/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/spotlight/styles.css';
import {AppShell, MantineProvider, Title} from "@mantine/core";
import {theme} from "./theme";
import {Header} from "./components/layout/header/header.jsx";
import {Settings} from "./components/layout/settingsDrawer/settingsDrawer.jsx";
import {Output} from "./components/layout/outputDrawer/outputDrawer.jsx";
import {Footer} from "./components/layout/footer/footer.jsx";
import {UI} from "./components/layout/ui/index.jsx";
import {useBlueprintStore} from "./modules/store.js";


function BluePrint() {
    const settingsOpened = useBlueprintStore(state => state.settingsOpen);
    const outputOpened = useBlueprintStore(state => state.outputOpen);
    return (
        <AppShell
            header={{height: {base: 60, md: 70, lg: 80}}}
            aside={{
                width: {base: 200, md: 300, lg: 550},
                breakpoint: 'md',
                collapsed: {desktop: !outputOpened, mobile: !outputOpened}
            }}
            navbar={{
                width: {base: 200, md: 300, lg: 400},
                breakpoint: 'sm',
                collapsed: {desktop: !settingsOpened, mobile: settingsOpened},
            }}
            padding="md"
        >
            <Header/>
            <Settings/>
            <UI/>
            <Output/>
            <Footer/>
        </AppShell>
    )
}

class CardEngineWrapper {
    constructor() {}

    /**
     * @param seedAnalysis {Seed}
     */
    static printAnalysis( seedAnalysis ){
        let output = "";
        let antes = Object.entries(seedAnalysis.antes);

        for(let [ante, details] of antes) {
            output += `==Ante ${ante}==\n`;
            output += `Boss: ${details.boss}\n`;
            output += `Tags: ${details.tags.join(', ')}\n`
            output += `Shop Queue: \n`
            let count = 0;
            for (let i = 0 ; i < details.queue.length; i++) {
                output += `${++count}) ${details.queue[i].name}\n`
            }
            output += '\n'
            output += ''
        }
        return output
    }
}

class Card {
    constructor(card) {
        this.edition = card.edition;
    }
}

class Joker extends Card {
    constructor(card) {
        super(card);
        this.name = card.item;
        this.rarity = card?.jokerData?.rarity;
        this.stickers = [
            card?.jokerData?.stickers?.['eternal'],
            card?.jokerData?.stickers?.['perishable'],
            card?.jokerData?.stickers?.['rental'],
        ].filter(Boolean)
    }
}

class Consumables extends Card {
    constructor(card) {
        super(card);
        this.type = card.type;
        this.name = card.item;
    }
}

class StandardCard extends Card {
    constructor(card) {
        super(card);

        this.base = card.base;
        this.enhancement = card.enhancement
        this.seal = card.seal;
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
    }
}

class Seed {
    constructor() {
        this.antes = {}
    }
}
class Ante {
    constructor(ante) {
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
}
class ImmolateClassic extends CardEngineWrapper {
    constructor(seed) {
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
        this.instance = new Immolate.Instance(seed);
        this.VOUCHERS = Immolate.VOUCHERS;
    }

    /**
     * @method initParams
     * @param deck {String}
     * @param stake {String}
     * @param showman {Boolean}
     * @param version {String}
     */
    InstParams(deck, stake, showman, version) {
        // defaulting the showman to false with double shebang ( !! )
        this.instance.params = new Immolate.InstParams(deck, stake, !!showman, version);
    }

    /**
     * @method initLocks
     * @param ante {Number} The integer value of the current ante
     * @param fresh_profile {Boolean} Whether this should be initialized like a fresh profile.
     * @param fresh_run {Boolean} Whether this should be initialized like a fresh run.
     */
    initLocks(ante, fresh_profile, fresh_run) {
        this.instance.initLocks(ante, fresh_profile, fresh_run);
    }

    /**
     * @method initUnlocks
     * @param ante
     * @param fresh_profile
     */
    initUnlocks(ante, fresh_profile) {
        this.instance.initUnlocks(ante, fresh_profile);
    }

    /**
     * @method lock Locks an item from appearing. ( Player has in hand or hasn't unlocked it yet )
     * @param item {String} The item to lock.
     */
    lock(item) {
        this.instance.lock(item);
    }

    /**
     * @method unlock Unlocks an item, enabling it to appear in packs and shops.
     * @param item
     */
    unlock(item) {
        this.instance.unlock(item);
    }

    /**
     * @method nextBoss
     * @param ante {Number} The integer of the current ante.
     * @returns {String}
     */
    nextBoss(ante) {
        return this.instance.nextBoss(ante);
    }

    /**
     * @method nextVoucher
     * @param ante {Number} The integer of the current ante.
     * @returns {String}
     */
    nextVoucher(ante) {
        return this.instance.nextVoucher(ante);
    }

    /**
     * @method nextTag Gets the next tag.
     * @param ante {Number}
     */
    nextTag(ante) {
        return this.instance.nextTag(ante);
    }

    /**
     * @method nextShopItem
     * @param ante {Number} The integer of the current ante
     * @returns {*}
     */
    nextShopItem(ante) {
        return this.instance.nextShopItem(ante);
    }

    /**
     * @method nextJoker
     * @param source
     * @param ante
     * @param hasStickers
     * @returns {*}
     */
    nextJoker(source, ante, hasStickers = false) {
        return this.instance.nextJoker(source, ante, hasStickers);
    }

    /**
     * @method nextPack
     * @param ante
     * @returns {String}
     */
    nextPack(ante) {
        return this.instance.nextPack(ante);
    }

    packInfo(pack) {
        return Immolate.packInfo(pack)
    }

    nextCelestialPack(size, ante) {
        return this.instance.nextCelestialPack(size, ante);
    }

    nextArcanaPack(size, ante) {
        return this.instance.nextArcanaPack(size, ante);
    }

    nextSpectralPack(size, ante) {
        return this.instance.nextSpectralPack(size, ante);
    }

    nextBuffoonPack(size, ante) {
        return this.instance.nextBuffoonPack(size, ante);
    }

    nextStandardPack(size, ante) {
        return this.instance.nextStandardPack(size, ante)
    }


    /**
     * @method isLocked This method returns the locked status of an item.
     * @param item
     * @returns {Boolean}
     */
    isLocked(item) {
        return this.instance.isLocked(item);
    }

    /**
     * @method activateVoucher
     * @param voucher
     */
    activateVoucher(voucher) {
        this.instance.activateVoucher(voucher);
    }

    isVoucherActive(voucher) {
        return this.instance.isVoucherActive(voucher);
    }

    makeCard(card) {
        let type = card.type;
        if (type === 'Joker') {
            return new Joker(card)
        } else if (type === 'Tarot' || type === 'Planet' || type === 'Spectral') {
            return new Consumables(card)
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

const seed = '5YVHAEP'
// const ante = 1;
const antes = 1;
const cardsPerAnte = 50;
const engine = new ImmolateClassic(seed);

engine.InstParams('Red Deck', 'White Stake', false, '10106');
engine.initLocks(1, false, false);
engine.lockLevelTwoVouchers()

function preformFullAnalysis() {
    let result = {}

    for (let ante = 1; ante < antes; ante++) {
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
            let packString = engine.nextPack(ante);
            let packInfo = engine.packInfo(packString);
            let pack = new Pack(packInfo);
            pack.init(engine, ante);
            result[ante].blinds[blind].packs.push(pack)
        }
    }
    let seed = new Seed();
    seed.antes = result;
    return seed
}

let seedAnalysis = preformFullAnalysis();
console.log(CardEngineWrapper.printAnalysis(seedAnalysis))

export default function App() {
    return (
        <MantineProvider defaultColorScheme={'dark'} theme={theme}>
            <Title> Hello World!</Title>
            {/*<BluePrint/>*/}
        </MantineProvider>
    );
}
