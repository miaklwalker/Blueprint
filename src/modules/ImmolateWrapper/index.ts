import {
    Ante,
    BoosterPack,
    Card_Final,
    Consumables_Final,
    Joker_Final,
    NextShopItem,
    Pack,
    PackCard,
    Planet_Final,
    SeedResultsContainer,
    Spectral_Final,
    StandardCard_Final,
    Tarot_Final
} from "./CardEngines/Cards.ts";
import { EVENT_UNLOCKS, LOCATIONS, options } from "../const.ts";
import { RandomQueueNames, RNGSource } from "../balatrots/enum/QueueName.ts";
import { Deck, deckMap, DeckType } from "../balatrots/enum/Deck.ts";
import { Stake, StakeType } from "../balatrots/enum/Stake.ts";
import { Game } from "../balatrots/Game.ts";
import { InstanceParams } from "../balatrots/struct/InstanceParams.ts";
import { JokerData } from "../balatrots/struct/JokerData.ts";
import { Type } from "../balatrots/enum/cards/CardType.ts";
import { Card } from "../balatrots/enum/cards/Card.ts";
import { Voucher } from "../balatrots/enum/Voucher.ts";
import { PlanetItem } from "../balatrots/enum/cards/Planet.ts";
import { Tarot } from "../balatrots/enum/cards/Tarot.ts";
import { SpectralItem } from "../balatrots/enum/packs/Spectral.ts";
import { SpecialsItem } from "../balatrots/enum/cards/Specials.ts";
import { BalatroAnalyzer } from "../balatrots/BalatroAnalyzer.ts";
import { Lock } from "../balatrots/Lock.ts"

// implement a third engine to handle the literal unlocks ( user selected )
export interface MiscCardSource {
    name: string;
    cardsToGenerate: number;
    cardType: string;
    source: string;
    hasStickers?: boolean,
    soulable?: boolean,
    cards: PackCard[]
    usesAnte?: boolean | undefined | null;
    beforeGeneration?: ((engine: Game) => void) | undefined;
    afterGeneration?: ((engine: Game) => void) | undefined;
}

export interface CardEngine {
    seed: string;
    VOUCHERS: any;
    sources: { [key: string]: string };
    commonSources: { [key: string]: string };

    // Initialization methods
    InstParams(deck: string, stake: string, showman: boolean, version: string): void;

    initLocks(ante: number, fresh_profile: boolean, fresh_run: boolean): void;

    initUnlocks(ante: number, fresh_profile: boolean): void;

    // Lock management
    lock(item: string): void;

    unlock(item: string): void;

    isLocked(item: string): boolean;

    lockPurchased(item: string): void;

    unlockPurchased(item: string): void;

    isPurchased(item: string): boolean;

    // Next item generators
    nextBoss(ante: number): string;

    nextVoucher(ante: number): string;

    nextTag(ante: number): string;

    nextShopItem(ante: number): NextShopItem;

    nextJoker(source: string, ante: number, hasStickers?: boolean): PackCard;

    nextTarot(source: string, ante: number, hasStickers?: boolean): PackCard;

    nextPlanet(source: string, ante: number, hasStickers?: boolean): PackCard;

    nextSpectral(source: string, ante: number, hasStickers?: boolean): PackCard;

    nextPack(ante: number): string;

    // Pack generators
    nextCelestialPack(size: number, ante: number): Map<number, string>;

    nextArcanaPack(size: number, ante: number): Map<number, string>;

    nextSpectralPack(size: number, ante: number): Map<number, string>;

    nextBuffoonPack(size: number, ante: number): Map<number, PackCard>;

    nextStandardPack(size: number, ante: number): Map<number, PackCard>;

    // Pack info
    packInfo(pack: string): BoosterPack;

    // Voucher methods
    activateVoucher(voucher: string): void;

    isVoucherActive(voucher: string): boolean;

    // Specialized methods
    lockLevelTwoVouchers(): void;

    handleSelectedUnlocks(unlocks: string[]): void;

    // Cleanup
    delete(): void;
}

export interface EngineWrapper {
    // Card creation and analysis
    makeCard(card: NextShopItem): Joker_Final | StandardCard_Final | Consumables_Final;
}


export class CardEngineWrapper implements EngineWrapper {
    engine: CardEngine | Game;

    constructor(engine: CardEngine | Game) {
        this.engine = engine;
    }

    makeGameCard(card: any): Joker_Final | StandardCard_Final | Consumables_Final {
        let instanceOfJoker = card instanceof JokerData;
        let instanceOfTarot = card instanceof Tarot;
        let instanceOfPlanet = card instanceof PlanetItem;
        let instanceOfSpectral = card instanceof SpectralItem || card instanceof SpecialsItem;
        let instanceofStandard = card instanceof Card;
        switch (true) {
            case instanceOfJoker:
                BalatroAnalyzer.getSticker(card);
                return new Joker_Final({
                    name: card.name,
                    type: 'Joker',
                    edition: card.edition,
                    rarity: card.rarity,
                    isEternal: card.stickers.eternal,
                    isPerishable: card.stickers.perishable,
                    isRental: card.stickers.rental,
                } as Card_Final)
            case instanceOfTarot:
                return new Tarot_Final({
                    name: card.name,
                    type: 'Tarot'
                } as Card_Final)
            case instanceOfPlanet:
                return new Planet_Final({
                    name: card.name,
                    type: 'Planet',
                } as Card_Final)
            case instanceOfSpectral:
                return new Spectral_Final({
                    name: card.name,
                    type: 'Spectral',
                } as Card_Final)
            case instanceofStandard:
                return new StandardCard_Final({
                    base: [
                        card.name.split('_')[0],
                        "_",
                        card.name.split('_')[1]
                    ],
                    seal: card._seal?.name,
                    edition: card._edition?.name,
                    enhancements: card._enhancement,
                    type: 'Standard',
                } as unknown as Card_Final)
            default:
                throw new Error("Unknown card type");
        }
    }

    makeCard(card: NextShopItem): Joker_Final | StandardCard_Final | Consumables_Final {
        let cardType = card.type;
        if (cardType === 'Joker') {
            return new Joker_Final({
                name: card.item,
                type: cardType,
                edition: card.jokerData?.edition,
                rarity: card.jokerData?.rarity,
                isEternal: card.jokerData?.stickers?.eternal,
                isPerishable: card.jokerData?.stickers?.perishable,
                isRental: card.jokerData?.stickers?.rental
            } as Card_Final)
        } else if (cardType === "Tarot") {
            return new Tarot_Final({
                name: card.item,
                type: cardType
            } as Card_Final)
        } else if (cardType === "Planet") {
            return new Planet_Final({
                name: card.item,
                type: cardType
            } as Card_Final)
        } else if (cardType === "Spectral") {
            return new Spectral_Final({
                name: card.item,
                type: cardType
            } as Card_Final)
        } else {
            // Not yet implemented by immolate
            return new StandardCard_Final({
                name: card.item,
                type: cardType,
                edition: card.edition,
            } as Card_Final)
        }
    }

    static printAnalysis(seedAnalysis: SeedResultsContainer) {
        let output = "";
        let antes = Object.entries(seedAnalysis.antes);

        for (let [ante, details] of antes) {
            output += `==Ante ${ante}==\n`;
            output += `Boss: ${details.boss}\n`;
            output += `Tags: ${details.tags.join(', ')}\n`
            output += `Voucher: ${details.voucher}\n`
            output += `Shop Queue: \n`
            let count = 0;
            for (let i = 0; i < details.queue.length; i++) {
                output += `${++count}) ${details.queue[i].name}\n`
            }
            output += '\n'
            output += "Packs: \n"
            for (let pack of details.packs) {
                output += `${pack.name} - ${pack.cards.map((card: { name: string; }) => card.name).join(', ')}\n`
            }
            output += '\n'
        }
        return output
    }

    findLevelTwoVoucher(key: string) {
        let allVouchers
        if (!(this.engine instanceof Game)) {
            allVouchers = this.engine?.VOUCHERS;
            for (let i = 0; i < allVouchers.size(); i += 2) {
                if (allVouchers.get(i) === key) {
                    return allVouchers.get(i + 1);
                }
            }
        } else {
            allVouchers = Game.VOUCHERS;
            for (let i = 0; i < Game.VOUCHERS.length; i += 2) {
                if (Game.VOUCHERS[i].getName() === key) {
                    return Game.VOUCHERS[i + 1].getName()

                }
            }
        }

    }

    handleBuy(key: string, type: string, makeAnalyzer?: any, analyzeOptions?: AnalyzeOptions) {
        if (type === 'Card') {
            this.engine.lockPurchased(key)
            console.log("Card bought: ", key)
            if (key === 'Showman' && makeAnalyzer) {
                makeAnalyzer(true);
            }
        }
        if (type === 'Voucher') {
            this.engine.activateVoucher(key as Voucher)
            const isLevelOneVoucher = !options.includes(key);
            if (isLevelOneVoucher) {
                let levelTwo = this.findLevelTwoVoucher(key);
                if (analyzeOptions?.unlocks?.includes(levelTwo)) {
                    this.engine.unlock(levelTwo);
                } else {
                    this.engine.lock(levelTwo);
                }
            }
        }
    }

    handleSell(key: string, type: string, makeAnalyzer: any) {
        if (type === 'Card') {
            this.engine.unlockPurchased(key)
            if (key === 'Showman') {
                makeAnalyzer(false);
            }
        }
    }
}

export interface AnalyzeSettings {
    seed: string;
    deck: string;
    stake: string;
    gameVersion: string;
    antes: number;
    cardsPerAnte: number;
}

export interface AnalyzeOptions {
    buys: { [key: string]: any };
    sells: { [key: string]: any };
    showCardSpoilers: boolean;
    unlocks: string[];
    events: Event[];
    updates?: any[],
    maxMiscCardSource?: number
    lockedCards?: any
}
export const getMiscCardSources: (maxCards: number) => MiscCardSource[] = (maxCards: number) => {
    let state: { [key: string]: boolean } = {};
    return ([
        {
            name: "riffRaff",
            cardsToGenerate: maxCards,
            cardType: "Joker",
            source: RNGSource.S_Riff_Raff,
            hasStickers: false,
            soulable: false,
            cards: [],
            beforeGeneration: (engine: Game) => {
                state["riffRaff"] = engine.isPurchased("Riff-raff");
                engine.lockPurchased("Riff-raff");
            },
            afterGeneration: (engine: Game) => {
                if (!state["riffRaff"]) {
                    engine.unlockPurchased("Riff-raff");
                }
            }
        },
        {
            name: "uncommonTag",
            cardsToGenerate: maxCards,
            cardType: "Joker",
            source: RNGSource.S_Uncommon_Tag,
            cards: []
        },
        {
            name: "rareTag",
            cardsToGenerate: maxCards,
            cardType: "Joker",
            source: RNGSource.S_Rare_Tag,
            cards: []
        },
        {
            name: "topUpTag",
            cardsToGenerate: maxCards,
            cardType: "Joker",
            source: RNGSource.S_Top_Up,
            hasStickers: false,
            cards: []
        },
        {
            name: "arcanaPack",
            cardsToGenerate: maxCards,
            cardType: "Tarot",
            source: RNGSource.S_Arcana,
            soulable: true,
            hasStickers: true,
            cards: []
        },
        {
            name: "emperor",
            cardsToGenerate: maxCards,
            cardType: "Tarot",
            source: RNGSource.S_Emperor,
            cards: []
        },
        {
            name: "vagabond",
            cardsToGenerate: maxCards,
            cardType: "Tarot",
            source: RNGSource.S_Vagabond,
            cards: []
        },
        {
            name: "purpleSeal and 8 Ball",
            cardsToGenerate: maxCards,
            cardType: "Tarot",
            source: RNGSource.S_Purple_Seal,
            cards: []
        },
        {
            name: "superposition",
            cardsToGenerate: maxCards,
            cardType: "Tarot",
            source: RNGSource.S_Superposition,
            cards: [],
            hasStickers: false,
        },
        {
            name: "judgement",
            cardsToGenerate: maxCards,
            cardType: "Joker",
            source: RNGSource.S_Judgement,
            cards: [],
            hasStickers: false,
        },
        {
            name: "buffoonPack",
            cardsToGenerate: maxCards,
            cardType: "Joker",
            source: RNGSource.S_Buffoon,
            cards: [],
            hasStickers: true,
        },
        {
            name: "wraith",
            cardsToGenerate: maxCards,
            cardType: "Joker",
            source: RNGSource.S_Wraith,
            hasStickers: false,
            cards: []
        },
        {
            name: "highPriestess",
            cardsToGenerate: maxCards,
            cardType: "Planet",
            source: RNGSource.S_High_Priestess,
            cards: []
        },
        {
            name: "celestialPack",
            cardsToGenerate: maxCards,
            cardType: "Planet",
            source: RNGSource.S_Celestial,
            cards: []
        },
        {
            name: 'spectralPack',
            cardsToGenerate: maxCards,
            cardType: "Spectral",
            source: RNGSource.S_Spectral,
            cards: [],
            soulable: true,
            hasStickers: true,
        },
        {
            name: "seance",
            cardsToGenerate: maxCards,
            cardType: "Spectral",
            source: RNGSource.S_Seance,
            cards: [],
            soulable: false,
            hasStickers: false,
        },
        {
            name: "sixthSense",
            cardsToGenerate: maxCards,
            cardType: "Spectral",
            source: RNGSource.S_Sixth_Sense,
            cards: [],
            soulable: false,
            hasStickers: false,
        },
        {
            name: "certificate",
            cardsToGenerate: maxCards * 3,
            cardType: "Standard",
            source: RandomQueueNames.R_Cert,
            cards: [],
            usesAnte: false,
        },
        {
            name: "standardPack",
            cardsToGenerate: maxCards,
            cardType: "Standard",
            source: RandomQueueNames.R_Standard_Edition,
            cards: [],
            hasStickers: false,
        },
    ])
};

export function analyzeSeed(settings: AnalyzeSettings, analyzeOptions: AnalyzeOptions) {
    const seed = settings?.seed?.toUpperCase()?.replace(/0/g, 'O')?.trim();

    if (!seed) return;
    let output = new SeedResultsContainer();
    const deck = new Deck(deckMap[settings.deck] as DeckType)
    const stake = new Stake(settings.stake as StakeType)
    const version = Number(settings.gameVersion)
    let params = new InstanceParams(deck, stake, false, version);
    const engine = new Game(
        seed,
        params
    );
    engine.hasSpoilers = analyzeOptions.showCardSpoilers;
    engine.initLocks(1, true, true);
    engine.handleSelectedUnlocks(analyzeOptions.unlocks);
    engine.lockLevelTwoVouchers()
    engine.lock(Array.from(Lock.firstLock))
    engine.lock(Array.from(Lock.ante2Lock))
    engine.setDeck(deck);
    EVENT_UNLOCKS
        .forEach(item => {
            engine.lock(item.name)
        })

    function updateShowmanOwned(showman: boolean) {
        engine.updateShowman(showman)
    }


    let engineWrapper = new CardEngineWrapper(engine);

    let itemsWithSpoilers: string[] = ["The Soul", "Judgement", "Wraith"];
    let spoilerSources = [RNGSource.S_Soul, RNGSource.S_Judgement, RNGSource.S_Wraith];
    const lockedCards = analyzeOptions?.lockedCards || {};

    let staticAnteQueues: { [key: string]: any[] } = {};

    function generateAnte(ante: number) {
        engine.initUnlocks(ante, false);
        let burnerInstance = new Game(
            seed,
            params
        );
        burnerInstance.initLocks(1, true, true);
        burnerInstance.initUnlocks(ante, false)
        let burnerWrapper = new CardEngineWrapper(burnerInstance);
        let result = new Ante(ante);
        let showmanIsLocked = engine.isLocked('Showman');
        updateShowmanOwned(false);
        result.boss = engine.nextBoss(ante).name
        result.voucher = engine.nextVoucher(ante).name;
        result.tags.push(engine.nextTag(ante).name);
        result.tags.push(engine.nextTag(ante).name);
        updateShowmanOwned(showmanIsLocked);

        for (let i = 0; i < Math.min(settings.cardsPerAnte, 1000); i++) {
            let key = `${ante}-${LOCATIONS.SHOP}-${i}`;
            const lockCardId = `ante_${ante}_shop_${i}`;
            if (lockedCards[lockCardId]) {
                engine.lock(lockedCards[lockCardId].name);
            }
            let shopItem = engine.nextShopItem(ante);
            let spoilerSource = engine.hasSpoilersMap[shopItem.item.name];
            if (engine.hasSpoilers && spoilerSource) {
                const joker: JokerData = engine.nextJoker(spoilerSource, ante, true);
                result.queue.push(
                    engineWrapper.makeGameCard(joker)
                )
            } else if (shopItem.type === Type.JOKER) {
                result.queue.push(
                    engineWrapper.makeGameCard(shopItem.jokerData)
                )
            } else {
                result.queue.push(
                    engineWrapper.makeGameCard(shopItem.item)
                    // shopItem.item as Card
                )
            }
            if (analyzeOptions && analyzeOptions?.showCardSpoilers) {
                if (itemsWithSpoilers.includes(result.queue[i].name)) {
                    // @ts-ignore
                    result.queue[i] = Pack.PackCardToCard(engine.nextJoker(spoilerSources[itemsWithSpoilers.indexOf(result.queue[i].name)], ante, false), 'Joker')
                }
            }
            if (analyzeOptions && analyzeOptions.buys[key]) {
                engineWrapper.handleBuy(result.queue[i].name, "Card", updateShowmanOwned, analyzeOptions)
            }

        }

        let voucherKey = `${ante}-${LOCATIONS.VOUCHER}-0`;
        if (analyzeOptions?.buys && analyzeOptions.buys[voucherKey]) {
            let name = analyzeOptions.buys[voucherKey].name;
            if (name) {
                engineWrapper.handleBuy(name, "Voucher", updateShowmanOwned, analyzeOptions)
                burnerWrapper.handleBuy(name, "Voucher", updateShowmanOwned, analyzeOptions)
            }
        }

        for (let blind of Object.keys(result.blinds)) {
            if (analyzeOptions?.events) {
                let currentEvents = analyzeOptions.events.filter((event: any) => event.ante === ante && event.blind === blind);

                currentEvents.forEach((event: any) => {
                    engine.unlock(event.name)
                })
            }
            if (ante <= 1 && blind === 'smallBlind') {
                continue;
            }
            const sellKey = `${ante}-${blind}`;
            Object
                .keys(analyzeOptions?.sells ?? {})
                .filter((key: string) => key.startsWith(sellKey))
                .forEach(key => {
                    let sell = analyzeOptions.sells[key];
                    if (sell && sell.name) {
                        engineWrapper.handleSell(sell.name, "Card", updateShowmanOwned)
                    }
                })

            for (let j = 0; j < 2; j++) {
                let packString = engine.nextPack(ante);
                let packInfo = engine.packInfo(packString);
                let pack = {
                    name: packInfo.getKind(),
                    choices: packInfo.getChoices(),
                    size: packInfo.getSize(),
                    cards: engine.generatePack(
                        packInfo,
                        ante
                    ).map(engineWrapper.makeGameCard)
                }
                result.blinds[blind].packs.push(pack)
                for (let k = 0; k < pack.size; k++) {
                    //`ante_${key}_${blindName}_pack_${packIndex}_card_${cardIndex}`
                    //todo implment the lock for packs here
                    let key = `${ante}-${packInfo.getKind()}-${k}-${blind}`;
                    if (analyzeOptions && analyzeOptions.buys[key]) {
                        console.log("Buying from pack: ", key, pack.cards[k].name)
                        engineWrapper.handleBuy(pack.cards[k].name, "Card", updateShowmanOwned, analyzeOptions)
                    }
                }
            }
        }
        const maxCards = analyzeOptions?.maxMiscCardSource ?? 15
        const miscCardSources = getMiscCardSources(maxCards);

        const updates = analyzeOptions?.updates;
        if (updates) {
            for (let update of updates) {
                let source = miscCardSources.find((source) => source.name === update.source);
                if (source) {
                    source.cardsToGenerate = update.count;
                    if (update.type) {
                        source.cardType = update.type;
                    }
                }
            }
        }
        let generators: any = {
            // @ts-ignore
            "Joker": (...args: any) => engine.nextJoker(...args),
            // @ts-ignore
            "Planet": (...args: any) => engine.nextPlanet(...args),
            // @ts-ignore
            "Tarot": (...args: any) => engine.nextTarot(...args),
            // @ts-ignore
            "Spectral": (...args: any) => engine.nextSpectral(...args),
            // @ts-ignore
            "Standard": (source, ante) => engine.nextStandardCard(ante, source),
        }
        for (let source of miscCardSources) {
            if (source.usesAnte === false && ante !== 1) {
                const savedResults = output.antes[1].miscCardSources.find(s => s.name === source.name);
                if (savedResults) {
                    source.cards = savedResults.cards;
                }
                continue;
            }
            if (source.beforeGeneration) {
                source.beforeGeneration(engine);
            }
            for (let i = 0; i < source.cardsToGenerate; i++) {
                let key = `${ante}-${source.name}-${i}`;
                let generator = generators[source.cardType];
                let card = generator(
                    source.source,
                    ante,
                    source.soulable ?? source.hasStickers ?? false
                )
                let spoilerSource = engine.hasSpoilersMap[card.name];
                if (engine.hasSpoilers && spoilerSource) {
                    card = engine.nextJoker(spoilerSource, ante, true)
                }
                let generatedCard = engineWrapper.makeGameCard(card);
                if (analyzeOptions && analyzeOptions.buys[key]) {
                    engineWrapper.handleBuy(generatedCard.name, "Card", updateShowmanOwned, analyzeOptions)
                }
                source.cards.push(generatedCard as unknown as PackCard);

            }
            if (source.afterGeneration) {
                source.afterGeneration(engine);
            }
        }


        // voucher queue
        let queueDepth = 20

        result.voucherQueue = Array(queueDepth).fill(null).map(() => burnerInstance.nextVoucherSimple().name)
        for (let i = 1; i <= ante; i++) {
            burnerInstance.nextBoss(ante)
        }
        result.bossQueue = Array(queueDepth).fill(null).map(() => burnerInstance.nextBoss(ante).name)
        burnerInstance.nextTag(ante)
        burnerInstance.nextTag(ante);
        result.tagsQueue = Array(queueDepth).fill(null).map(() => burnerInstance.nextTag(ante).name)
        if (staticAnteQueues["Wheel"]) {
            result.wheelQueue = staticAnteQueues["Wheel"];
        }
        else {
            result.wheelQueue = Array(queueDepth).fill(null).map(() => {
                return {
                    "name": "King of Clubs",
                    "type": "Standard",
                    "edition": engine.nextWheelOfFortuneEdition(),
                    "seal": "No Seal",
                    "rank": "King",
                    "suit": "Clubs",
                    "base": [
                        "C",
                        "_",
                        "K"
                    ],
                    "enhancements": "No Enhancement"
                };
            });
            staticAnteQueues["Wheel"] = result.wheelQueue;
        }

        if (staticAnteQueues["Aura"]) {
            result.auraQueue = staticAnteQueues["Aura"];
        }
        else {
            result.auraQueue = Array(queueDepth).fill(null).map(() => {
                return {
                    "name": "King of Clubs",
                    "type": "Standard",
                    "edition": engine.nextAuraEdition(),
                    "seal": "No Seal",
                    "rank": "King",
                    "suit": "Clubs",
                    "base": [
                        "C",
                        "_",
                        "K"
                    ],
                    "enhancements": "No Enhancement",
                }
            });
            staticAnteQueues["Aura"] = result.auraQueue;
        }
        result.packQueue = Array(queueDepth).fill(null).map(() => engine.nextPack(ante).name)


        result.miscCardSources = miscCardSources
        return result;
    }


    for (let ante = 1; ante <= settings.antes; ante++) {
        output.antes[ante] = generateAnte(ante);
    }
    try {
        output.antes[0] = generateAnte(0)
        output.antes[0].boss = output.antes[1].boss;
    } catch (e) {
        console.error("Error generating ante 0:", e);
    }
    console.log("Final Analysis: ", output);

    return output;
}




