import {
    Ante, BoosterPack,
    Card_Final, CardAttributes,
    Consumables_Final,
    Joker_Final, NextPackCard,
    NextShopItem, Pack, PackCard, Planet_Final,
    Seed, Spectral_Final,
    StandardCard_Final, Tarot_Final
} from "./CardEngines/Cards.ts";



export interface CardEngine {
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

    // Cleanup
    delete(): void;
}
export interface EngineWrapper {
    // Card creation and analysis
    makeCard(card: NextShopItem): Joker_Final | StandardCard_Final | Consumables_Final;
    analyzeAnte(ante: number, cardsPerAnte: number): Ante;
    analyzeSeed(antes: number, cardsPerAnte?: number): Seed;
}
export class CardEngineWrapper implements EngineWrapper{
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
        }else if ( cardType === "Tarot") {
            return new Tarot_Final({
                name: card.item,
                type: cardType
            } as Card_Final)
        }else if ( cardType === "Planet") {
            return new Planet_Final({
                name: card.item,
                type: cardType
            } as Card_Final)
        }else if  ( cardType === "Spectral") {
            return new Spectral_Final({
                name: card.item,
                type: cardType
            } as Card_Final)
        }else{
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
    analyzeAnte(ante: number, cardsPerAnte: number): Ante {
        let result = new Ante(ante);
        this.engine.initUnlocks(ante, false);
        result.boss = this.engine.nextBoss(ante)
        result.voucher = this.engine.nextVoucher(ante);
        result.tags.push(this.engine.nextTag(ante));
        result.tags.push(this.engine.nextTag(ante));
        let max = ante === 1 ? 15 : cardsPerAnte;
        for (let i = 0; i < max; i++) {
            result.queue.push(
                this.makeCard(
                    this.engine.nextShopItem(ante)
                )
            )
        }
        for (let blind of Object.keys(result.blinds)) {
            if (ante === 1 && blind === 'smallBlind') {
                continue;
            }
            for (let j = 0; j < 2; j++) {
                let packString = this.engine.nextPack(ante);
                let packInfo = this.engine.packInfo(packString);
                let pack = new Pack(packInfo);
                pack.init(this.engine, ante);
                result.blinds[blind].packs.push(pack)
            }
        }
        result.miscCardSources = {
            // jokers
            riffRaff: [],
            uncommonTag: [],
            rareTag: [],
            topUpTag: [],
            judgement: [],
            wraith: [],
            // planet cards
            highPriestess: [],
            // tarot cards
            emperor: [],
            vagabond: [],
            purpleSeal: [],
            // spectral cards
            spectral: [],
        }
        for (let i = 0 ; i<9; i++) {
            result.miscCardSources.riffRaff.push( Pack.PackCardToCard(this.engine.nextJoker(this.engine.sources.S_Riff_Raff, ante, false),"Joker"))
            result.miscCardSources.uncommonTag.push( Pack.PackCardToCard(this.engine.nextJoker(this.engine.sources.S_Uncommon_Tag, ante, false),"Joker"))
            result.miscCardSources.rareTag.push( Pack.PackCardToCard(this.engine.nextJoker(this.engine.sources.S_Rare_Tag, ante, false),"Joker"))
            result.miscCardSources.topUpTag.push( Pack.PackCardToCard(this.engine.nextJoker(this.engine.sources.S_Top_Up, ante, false),"Joker"))
            result.miscCardSources.judgement.push( Pack.PackCardToCard(this.engine.nextJoker(this.engine.sources.S_Judgement, ante, false),"Joker"))
            result.miscCardSources.wraith.push( Pack.PackCardToCard(this.engine.nextJoker(this.engine.sources.S_Wraith, ante, false),"Joker"))

            result.miscCardSources.highPriestess.push( Pack.PackCardToCard(this.engine.nextPlanet(this.engine.sources.S_High_Priestess, ante, false),"Planet"))
            result.miscCardSources.emperor.push( Pack.PackCardToCard(this.engine.nextTarot(this.engine.sources.S_Emperor, ante, false),"Tarot"))
            result.miscCardSources.vagabond.push( Pack.PackCardToCard(this.engine.nextTarot(this.engine.sources.S_Vagabond, ante, false),"Tarot"))
            result.miscCardSources.purpleSeal.push( Pack.PackCardToCard(this.engine.nextTarot(this.engine.sources.S_Purple_Seal, ante, false),"Tarot"))
            result.miscCardSources.spectral.push( Pack.PackCardToCard(this.engine.nextSpectral(this.engine.sources.S_Spectral, ante, false),"Spectral"))


        }
        return result
    }
    analyzeSeed(antes: number, cardsPerAnte: number = 50): Seed {
        let result = new Seed();
        for (let ante = 1; ante <= antes; ante++) {
            result.antes[ante] = this.analyzeAnte(ante,cardsPerAnte);
        }
        return result
    }
}






