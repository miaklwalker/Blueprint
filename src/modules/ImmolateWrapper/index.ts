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
    Seed,
    Spectral_Final,
    StandardCard_Final,
    Tarot_Final
} from "./CardEngines/Cards.ts";
import {AnalyzeOptions, LOCATIONS, options} from "../const.ts";

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

    handleSelectedUnlocks(unlocks: boolean[]): void;

    // Cleanup
    delete(): void;
}

export interface EngineWrapper {
    // Card creation and analysis
    makeCard(card: NextShopItem): Joker_Final | StandardCard_Final | Consumables_Final;

    analyzeAnte(ante: number, cardsPerAnte: number): Ante;

    analyzeSeed(antes: number, cardsPerAnte?: number): Seed;
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

    static printAnalysis(seedAnalysis: Seed) {
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

    analyzeAnte(ante: number, cardsPerAnte: number, analyzeOptions?: AnalyzeOptions): Ante {
        let itemsWithSpoilers: string[] = ["The Soul", "Judgement", "Wraith"];
        let spoilerSources = [this.engine.sources.S_Soul, this.engine.sources.S_Judgement, this.engine.sources.S_Wraith]
        let result = new Ante(ante);
        this.engine.initUnlocks(ante, false);

        result.boss = this.engine.nextBoss(ante)
        result.voucher = this.engine.nextVoucher(ante);
        let voucherKey = `${ante}-${LOCATIONS.VOUCHER}-0`;
        if (analyzeOptions && analyzeOptions?.buys && analyzeOptions.buys[voucherKey]) {
            let name = analyzeOptions.buys[voucherKey].name;
            let AllVouchers = this.engine.VOUCHERS;
            let unlocks = analyzeOptions?.unlocks;
            for (let i = 0; i < AllVouchers.size(); i+=2) {
                // if the user has the level two voucher enabled, then allow it!
                if (AllVouchers.get(i) === name) {
                    // the user has bought the level one
                    this.engine.lock(name);
                    this.engine.activateVoucher(name)
                    let levelTwo = AllVouchers.get(i + 1);
                    if(unlocks[i + 1] && options?.includes(levelTwo)) {
                        this.engine.unlock(levelTwo);
                    }
                }
            }
        }

        result.tags.push(this.engine.nextTag(ante));
        result.tags.push(this.engine.nextTag(ante));
        for (let i = 0; i < cardsPerAnte; i++) {
            let key = `${ante}-Shop-${i}`;
            let item = this.engine.nextShopItem(ante);
            result.queue.push(
                this.makeCard(
                    item
                )
            )
            item.delete()
            if (analyzeOptions && analyzeOptions?.showCardSpoilers) {
                if (itemsWithSpoilers.includes(result.queue[i].name)) {
                    result.queue[i] = Pack.PackCardToCard(this.engine.nextJoker(spoilerSources[itemsWithSpoilers.indexOf(result.queue[i].name)], ante, false), 'Joker')
                }
            }
            if (analyzeOptions && analyzeOptions.buys[key]) {
                this.engine.lock(result.queue[i].name)
            }

        }
        for (let blind of Object.keys(result.blinds)) {
            if (ante === 1 && blind === 'smallBlind') {
                continue;
            }
            for (let j = 0; j < 2; j++) {
                let packString = this.engine.nextPack(ante);
                let packInfo = this.engine.packInfo(packString);
                let pack = new Pack(packInfo);
                pack.init(this.engine, ante, analyzeOptions?.showCardSpoilers ?? false);
                result.blinds[blind].packs.push(pack)
                for (let k = 0; k < packInfo.size; k++) {
                    let key = `${ante}-${packString}-${k}`;
                    if (analyzeOptions && analyzeOptions.buys[key]) {
                        this.engine.lock(pack.cards[k].name)
                    }

                }
            }
        }

        const miscCardSources: MiscCardSource[] = [
            {
                name: "riffRaff",
                cardsToGenerate: 6,
                cardType: "Joker",
                source: this.engine.sources.S_Riff_Raff,
                hasStickers: false,
                cards: []
            },
            {
                name: "uncommonTag",
                cardsToGenerate: 12,
                cardType: "Joker",
                source: this.engine.sources.S_Uncommon_Tag,
                cards: []
            },
            {
                name: "rareTag",
                cardsToGenerate: 12,
                cardType: "Joker",
                source: this.engine.sources.S_Rare_Tag,
                cards: []
            },
            {
                name: "topUpTag",
                cardsToGenerate: 12,
                cardType: "Joker",
                source: this.engine.sources.S_Top_Up,
                hasStickers: false,
                cards: []
            },
            {
                name: "judgement",
                cardsToGenerate: 12,
                cardType: "Joker",
                source: this.engine.sources.S_Judgement,
                cards: []
            },
            {
                name: "wraith",
                cardsToGenerate: 12,
                cardType: "Joker",
                source: this.engine.sources.S_Wraith,
                hasStickers: false,
                cards: []
            },
            {
                name: "highPriestess",
                cardsToGenerate: 12,
                cardType: "Planet",
                source: this.engine.sources.S_High_Priestess,
                cards: []
            },
            {
                name: "emperor",
                cardsToGenerate: 12,
                cardType: "Tarot",
                source: this.engine.sources.S_Emperor,
                cards: []
            },
            {
                name: "vagabond",
                cardsToGenerate: 12,
                cardType: "Tarot",
                source: this.engine.sources.S_Vagabond,
                cards: []
            },
            {
                name: "purpleSeal and 8 Ball",
                cardsToGenerate: 12,
                cardType: "Tarot",
                source: this.engine.sources.S_Purple_Seal,
                cards: []
            },
            {
                name: "arcanaPack",
                cardsToGenerate: 12,
                cardType: "Tarot",
                source: this.engine.sources.S_Arcana,
                soulable: true,
                hasStickers: true,
                cards: []
            },
        ]
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
            "Joker": (...args: any) => this.engine.nextJoker(...args),
            // @ts-ignore
            "Planet": (...args: any) => this.engine.nextPlanet(...args),
            // @ts-ignore
            "Tarot": (...args: any) => this.engine.nextTarot(...args),
            // @ts-ignore
            "Spectral": (...args: any) => this.engine.nextSpectral(...args)
        }
        for (let source of miscCardSources) {
            for (let i = 0; i < source.cardsToGenerate; i++) {
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
                source.cards.push(
                    generatedCard
                )
            }
        }

        result.miscCardSources = miscCardSources

        return result
    }

    analyzeSeed(antes: number, cardsPerAnte: number = 50, options?: AnalyzeOptions): Seed {
        let result = new Seed();
        this.engine.lockLevelTwoVouchers();
        if (options?.unlocks) {
            this.engine.handleSelectedUnlocks(options.unlocks);
        }
        for (let ante = 1; ante <= antes; ante++) {
            result.antes[ante] = this.analyzeAnte(ante, cardsPerAnte, options);
        }
        return result
    }
}






