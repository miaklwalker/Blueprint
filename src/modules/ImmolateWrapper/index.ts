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
import {AnalyzeOptions} from "../../App.tsx";


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
    analyzeAnte(ante: number, cardsPerAnte: number, options?: AnalyzeOptions): Ante {
        let itemsWithSpoilers: string[] = ["The Soul", "Judgment", "Wraith"];
        let spoilerSources = [this.engine.sources.S_Soul, this.engine.sources.S_Judgement, this.engine.sources.S_Wraith]
        let result = new Ante(ante);
        this.engine.initUnlocks(ante, false);

        result.boss = this.engine.nextBoss(ante)
        result.voucher = this.engine.nextVoucher(ante);
        result.tags.push(this.engine.nextTag(ante));
        result.tags.push(this.engine.nextTag(ante));
        let max = ante === 1 ? 15 : cardsPerAnte;
        for (let i = 0; i < max; i++) {
            let key = `${ante}-Shop-${i}`;
            let item = this.engine.nextShopItem(ante);
            result.queue.push(
                this.makeCard(
                    item
                )
            )
            item.delete()
            if(options && options?.showCardSpoilers ) {
                if (itemsWithSpoilers.includes(result.queue[i].name)) {
                    result.queue[i] = Pack.PackCardToCard(this.engine.nextJoker(spoilerSources[itemsWithSpoilers.indexOf(result.queue[i].name)], ante, false),'Joker')
                }
            }
            if(options && options.buys[key]) {
                console.log(result.queue[i])
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
                pack.init(this.engine, ante, options?.showCardSpoilers ?? false);
                result.blinds[blind].packs.push(pack)
                for ( let k = 0; k < packInfo.size; k++) {
                    let key = `${ante}-${packString}-${k}`;
                    if(options && options.buys[key]) {
                        this.engine.lock(pack.cards[k].name)
                    }

                }
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
            arcanaPack: [],
            emperor: [],
            vagabond: [],
            purpleSeal: [],
            // spectral cards
            spectral: [],
        }
        for (let i = 0 ; i<15; i++) {
            if(i<6){
                result.miscCardSources.riffRaff.push( Pack.PackCardToCard(this.engine.nextJoker(this.engine.sources.S_Riff_Raff, ante, false),"Joker"))
            }

            result.miscCardSources.uncommonTag.push( Pack.PackCardToCard(this.engine.nextJoker(this.engine.sources.S_Uncommon_Tag, ante, false),"Joker"))
            result.miscCardSources.rareTag.push( Pack.PackCardToCard(this.engine.nextJoker(this.engine.sources.S_Rare_Tag, ante, false),"Joker"))
            result.miscCardSources.topUpTag.push( Pack.PackCardToCard(this.engine.nextJoker(this.engine.sources.S_Top_Up, ante, false),"Joker"))
            result.miscCardSources.judgement.push( Pack.PackCardToCard(this.engine.nextJoker(this.engine.sources.S_Judgement, ante, false),"Joker"))
            result.miscCardSources.wraith.push( Pack.PackCardToCard(this.engine.nextJoker(this.engine.sources.S_Wraith, ante, false),"Joker"))

            result.miscCardSources.highPriestess.push( Pack.PackCardToCard(this.engine.nextPlanet(this.engine.sources.S_High_Priestess, ante, false),"Planet"))
            result.miscCardSources.emperor.push( Pack.PackCardToCard(this.engine.nextTarot(this.engine.sources.S_Emperor, ante, false),"Tarot"))
            result.miscCardSources.vagabond.push( Pack.PackCardToCard(this.engine.nextTarot(this.engine.sources.S_Vagabond, ante, false),"Tarot"))
            result.miscCardSources.purpleSeal.push( Pack.PackCardToCard(this.engine.nextTarot(this.engine.sources.S_Purple_Seal, ante, false),"Tarot"));
            const arcanaCard = this.engine.nextTarot(this.engine.sources.S_Arcana, ante, true) as unknown as string;
            if( arcanaCard === 'The Soul' && options?.showCardSpoilers) {
                result.miscCardSources.arcanaPack.push(
                    Pack.PackCardToCard(this.engine.nextJoker(this.engine.sources.S_Soul, ante, false),'Joker')
                )
            }else{
                result.miscCardSources.arcanaPack.push( Pack.PackCardToCard(arcanaCard,"Tarot"))
            }

            result.miscCardSources.spectral.push( Pack.PackCardToCard(this.engine.nextSpectral(this.engine.sources.S_Spectral, ante, false),"Spectral"))



        }
        return result
    }
    analyzeSeed(antes: number, cardsPerAnte: number = 50, options?: AnalyzeOptions): Seed {
        let result = new Seed();
        this.engine.lockLevelTwoVouchers();
        for (let ante = 1; ante <= antes; ante++) {
            result.antes[ante] = this.analyzeAnte(ante,cardsPerAnte, options);
        }
        return result
    }
}






