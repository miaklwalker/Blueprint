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
import { LOCATIONS } from "../const.ts";
import {ImmolateClassic} from "./CardEngines/immolateClassic.ts";


export interface MiscCardSource {
    name: string;
    cardsToGenerate: number;
    cardType: string;
    source: string;
    hasStickers?: boolean,
    soulable?: boolean,
    cards: PackCard[]
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
    engine: CardEngine;

    constructor(engine: CardEngine) {
        this.engine = engine;
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
        let allVouchers = this.engine.VOUCHERS;
        for (let i = 0; i < allVouchers.size(); i += 2) {
            if (allVouchers.get(i) === key) {
                return allVouchers.get(i + 1);
            }
        }
    }

    handleBuy(key: string, type: string, makeAnalyzer?: any) {
        if (type === 'Card') {
            this.engine.lock(key)
            if (key === 'Showman' && makeAnalyzer) {
                makeAnalyzer(true);
            }
        }
        if (type === 'Voucher') {
            this.engine.activateVoucher(key)
        }
    }

    handleSell(key: string, type: string, makeAnalyzer: any) {
        if (type === 'Card') {
            this.engine.unlock(key)
            if (key === 'Showman') {
                makeAnalyzer(false);
            }
        }
    }
}
interface AnalyzeSettings {
    seed: string;
    deck: string;
    stake: string;
    gameVersion: string;
    antes: number;
    cardsPerAnte: number;
}
interface AnalyzeOptions {
    buys: { [key: string]: any };
    sells: { [key: string]: any };
    showCardSpoilers: boolean;
    unlocks: string[];
    events: Event[];
    updates?: any[],
    maxMiscCardSource?: number
}




export function analyzeSeed(settings: AnalyzeSettings, analyzeOptions: AnalyzeOptions) {

    const seed = settings?.seed?.toUpperCase()?.replace(/0/g, 'O');
    if (!seed) return;
    let output = new SeedResultsContainer();
    // Initialize the engine
    const engine = new ImmolateClassic(seed);
    // Start with showman false by default.
    let params = engine.InstParams(settings.deck, settings.stake, false, settings.gameVersion);

    function updateShowmanOwned(showman: boolean) {
        params.showman = showman;
        engine.instance.params = params;
    }


    engine.initLocks(1, true, true);
    engine.lockLevelTwoVouchers();
    engine.handleSelectedUnlocks(analyzeOptions.unlocks);
    engine.setStake(settings.stake);
    engine.setDeck(settings.deck);
    let engineWrapper = new CardEngineWrapper(engine);
    let itemsWithSpoilers: string[] = ["The Soul", "Judgement", "Wraith"];
    let spoilerSources = [engine.sources.S_Soul, engine.sources.S_Judgement, engine.sources.S_Wraith];

    function generateAnte( ante: number) {
        engine.initUnlocks(ante, false);

        let result = new Ante(ante);
        let showmanIsLocked = engine.isLocked('Showman');
        updateShowmanOwned(false);
        result.boss = engine.nextBoss(ante)
        result.voucher = engine.nextVoucher(ante);
        result.tags.push(engine.nextTag(ante));
        result.tags.push(engine.nextTag(ante));
        updateShowmanOwned(showmanIsLocked);

        let voucherKey = `${ante}-${LOCATIONS.VOUCHER}-0`;
        if (analyzeOptions?.buys && analyzeOptions.buys[voucherKey]) {
            let name = analyzeOptions.buys[voucherKey].name;
            if (name) {
                engineWrapper.handleBuy(name, "Voucher", analyzeOptions)
            }
        }
        for (let blind of Object.keys(result.blinds)) {
            if (analyzeOptions?.events) {
                let currentEvents = analyzeOptions.events.filter((event: any) => event.ante === ante && event.blind === blind);
                currentEvents.forEach((event: any) => {
                    console.log("Found Event", event)
                    engine.unlock(event.name)
                })
            }
            if (ante === 1 && blind === 'smallBlind') {
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
                let pack = new Pack(packInfo);
                pack.init(engine, ante, analyzeOptions?.showCardSpoilers ?? false);
                result.blinds[blind].packs.push(pack)
                for (let k = 0; k < packInfo.size; k++) {
                    let key = `${ante}-${packString}-${k}-${blind}`;
                    if (analyzeOptions && analyzeOptions.buys[key]) {
                        engineWrapper.handleBuy(pack.cards[k].name, "Card", updateShowmanOwned)
                    }
                }
            }
        }
        const maxCards = analyzeOptions?.maxMiscCardSource ?? 15
        const miscCardSources: MiscCardSource[] = [
            // {
            //     name: "riffRaff",
            //     cardsToGenerate: 6,
            //     cardType: "Joker",
            //     source: this.engine.sources.S_Riff_Raff,
            //     hasStickers: false,
            //     cards: []
            // },
            {
                name: "uncommonTag",
                cardsToGenerate: maxCards,
                cardType: "Joker",
                source: engine.sources.S_Uncommon_Tag,
                cards: []
            },
            {
                name: "rareTag",
                cardsToGenerate: maxCards,
                cardType: "Joker",
                source: engine.sources.S_Rare_Tag,
                cards: []
            },
            // {
            //     name: "topUpTag",
            //     cardsToGenerate: maxCards,
            //     cardType: "Joker",
            //     source: engine.sources.S_Top_Up,
            //     hasStickers: false,
            //     cards: []
            // },
            {
                name: "judgement",
                cardsToGenerate: maxCards,
                cardType: "Joker",
                source: engine.sources.S_Judgement,
                cards: []
            },
            {
                name: "wraith",
                cardsToGenerate: maxCards,
                cardType: "Joker",
                source: engine.sources.S_Wraith,
                hasStickers: false,
                cards: []
            },
            {
                name: "highPriestess",
                cardsToGenerate: maxCards,
                cardType: "Planet",
                source: engine.sources.S_High_Priestess,
                cards: []
            },
            {
                name: "emperor",
                cardsToGenerate: maxCards,
                cardType: "Tarot",
                source: engine.sources.S_Emperor,
                cards: []
            },
            {
                name: "vagabond",
                cardsToGenerate: maxCards,
                cardType: "Tarot",
                source: engine.sources.S_Vagabond,
                cards: []
            },
            {
                name: "purpleSeal and 8 Ball",
                cardsToGenerate: maxCards,
                cardType: "Tarot",
                source: engine.sources.S_Purple_Seal,
                cards: []
            },
            {
                name: "arcanaPack",
                cardsToGenerate: maxCards,
                cardType: "Tarot",
                source: engine.sources.S_Arcana,
                soulable: true,
                hasStickers: true,
                cards: []
            },
            {
                name: "buffoonPack",
                cardsToGenerate: maxCards,
                cardType: "Joker",
                source: engine.sources.S_Buffoon,
                cards: [],
                hasStickers: true,
            },
            {
                name: "celestialPack",
                cardsToGenerate: maxCards,
                cardType: "Planet",
                source: engine.sources.S_Celestial,
                cards: []
            },
            {
                name: "standardPack",
                cardsToGenerate: maxCards,
                cardType: "Standard",
                source: engine.sources.R_Standard,
                cards: [],
                hasStickers: false,
            },
            {
                name: "superposition",
                cardsToGenerate: maxCards,
                cardType: "Tarot",
                source: engine.sources.S_Superposition,
                cards: [],
                hasStickers: false,
            },
            {
                name: "seance",
                cardsToGenerate: maxCards,
                cardType: "Spectral",
                source: engine.sources.S_Seance,
                cards: [],
                soulable: true,
                hasStickers: false,
            },
            {
                name: "sixthSense",
                cardsToGenerate: maxCards,
                cardType: "Spectral",
                source: engine.sources.S_Sixth_Sense,
                cards: [],
                soulable: true,
                hasStickers: false,
            },
            {
                name: "certificate",
                cardsToGenerate: maxCards,
                cardType: "Standard",
                source: engine.sources.R_Standard_Has_Seal,
                cards: [],
            }
        ];

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
            "Standard": (_, ante) => engine.nextStandardCard(ante),
        }
        for (let source of miscCardSources) {
            for (let i = 0; i < source.cardsToGenerate; i++) {
                let key = `${ante}-${source.name}-${i}`;
                let generator = generators[source.cardType];
                let card: string | PackCard = generator(source.source, ante, source?.soulable ?? source?.hasStickers ?? false);

                if (typeof card === 'string') {
                    let canBeSpoiled = itemsWithSpoilers.indexOf(card)
                    if (canBeSpoiled !== -1 && analyzeOptions?.showCardSpoilers) {
                        card = generators['Joker'](
                            spoilerSources[canBeSpoiled],
                            ante,
                            true
                        )
                    }
                }

                let generatedCard = Pack.PackCardToCard(
                    card,
                    card === 'Wraith' || card === 'The Soul' ? 'Spectral' : source.cardType
                );
                if (generatedCard && 'name' in generatedCard) {
                    // @ts-ignore
                    source.cards.push(generatedCard)
                    if (analyzeOptions && analyzeOptions.buys[key]) {
                        engineWrapper.handleBuy(generatedCard.name, "Card", updateShowmanOwned)
                    }

                }

            }
        }
        for (let i = 0; i < Math.min(settings.cardsPerAnte, 1000); i++) {
            let key = `${ante}-${LOCATIONS.SHOP}-${i}`;
            let item = engine.nextShopItem(ante);
            let card = engineWrapper.makeCard(
                item
            )
            result.queue.push(
                card
            )
            item.delete()
            if (analyzeOptions && analyzeOptions?.showCardSpoilers) {
                if (itemsWithSpoilers.includes(result.queue[i].name)) {
                    // @ts-ignore
                    result.queue[i] = Pack.PackCardToCard(engine.nextJoker(spoilerSources[itemsWithSpoilers.indexOf(result.queue[i].name)], ante, false), 'Joker')
                }
            }
            if (analyzeOptions && analyzeOptions.buys[key]) {
                engineWrapper.handleBuy(result.queue[i].name, "Card", updateShowmanOwned)
            }

        }



        result.miscCardSources = miscCardSources
        return result;
    }

    for (let ante = 1; ante <= settings.antes; ante++) {
        output.antes[ante] = generateAnte(ante);

    }
    output.antes[0] = generateAnte(0);
    for(let [key, result] of Object.entries(output.antes)){
        let ante = Number(key);
        ante = Number(ante);
        for ( let timeTravel = 0; timeTravel < 2; timeTravel++) {
            let timeTravelAnte = new Ante(ante);
            timeTravelAnte.boss = engine.nextBoss(ante)
            timeTravelAnte.voucher = engine.nextVoucher(ante);
            timeTravelAnte.tags.push(engine.nextTag(ante));
            timeTravelAnte.tags.push(engine.nextTag(ante));
            for (let blind of Object.keys(timeTravelAnte.blinds)) {
                for (let j = 0; j < 2; j++) {
                    let packString = engine.nextPack(ante);
                    let packInfo = engine.packInfo(packString);
                    let pack = new Pack(packInfo);
                    pack.init(engine, ante, analyzeOptions?.showCardSpoilers ?? false);
                    timeTravelAnte.blinds[blind].packs.push(pack)
                    for (let k = 0; k < packInfo.size; k++) {
                        let key = `${ante}-${packString}-${k}-${blind}`;
                        if (analyzeOptions && analyzeOptions.buys[key]) {
                            engineWrapper.handleBuy(pack.cards[k].name, "Card", updateShowmanOwned)
                        }
                    }
                }
            }
            timeTravelAnte.queue = result.queue;
            timeTravelAnte.miscCardSources = result.miscCardSources;
            output.timeTravelAntes[`${ante}-${timeTravel + 1}`] = timeTravelAnte;

        }
    }
    delete output.antes[0];

    engine.delete();
    return output;
}




