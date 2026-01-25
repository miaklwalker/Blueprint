import {getMiscCardSources} from "../ImmolateWrapper";
import {PackKind} from "./enum/packs/PackKind";
import {ItemImpl} from "./interface/Item";
import {Type} from "./enum/cards/CardType";
import {Edition} from "./enum/Edition";
import {Game} from "./Game";
import {Result} from "./Result";
import {Run} from "./Run";
import {AbstractCard} from "./struct/AbstractCard";
import {CardNameBuilder} from "./struct/CardNameBuilder";
import {InstanceParams} from "./struct/InstanceParams";
import {Option} from "./struct/Option";
import {RNGSource} from "./enum/QueueName.ts";
import type {QueueNames} from "./enum/QueueName.ts";
import type {JokerData} from "./struct/JokerData";
import type {AnalysisParams} from "./interface/AnalysisParams";
import type {Version} from "./enum/Version";
import type {Stake} from "./enum/Stake";
import type {Configurations} from "./interface/Configurations";
import type {Deck} from "./enum/Deck";
import type {SpoilableItems} from "../ImmolateWrapper";
import type {Card} from "./enum/cards/Card";
import type {BossBlind} from "./enum/BossBlind.ts";
import type {PackCard} from "../ImmolateWrapper/CardEngines/Cards.ts";
import type {PackInfo} from "./struct/PackInfo.ts";


export class BalatroAnalyzer {
    static readonly OPTIONS: ReadonlyArray<string> = [
        // Tags
        "Negative Tag",
        "Foil Tag",
        "Holographic Tag",
        "Polychrome Tag",
        "Rare Tag",

        // Special Cards
        "Golden Ticket",

        // Characters
        "Mr. Bones",
        "Acrobat",
        "Sock and Buskin",
        "Swashbuckler",
        "Troubadour",

        // Items & Certificates
        "Certificate",
        "Smeared Joker",
        "Throwback",
        "Hanging Chad",

        // Gems & Materials
        "Rough Gem",
        "Bloodstone",
        "Arrowhead",
        "Onyx Agate",
        "Glass Joker",

        // Performance & Entertainment
        "Showman",
        "Flower Pot",
        "Blueprint",
        "Wee Joker",
        "Merry Andy",

        // Special Effects
        "Oops! All 6s",
        "The Idol",
        "Seeing Double",
        "Matador",
        "Hit the Road",

        // Card Sets
        "The Duo",
        "The Trio",
        "The Family",
        "The Order",
        "The Tribe",

        // Special Characters
        "Stuntman",
        "Invisible Joker",
        "Brainstorm",
        "Satellite",
        "Shoot the Moon",

        // Licenses & Professions
        "Driver's License",
        "Cartomancer",
        "Astronomer",
        "Burnt Joker",
        "Bootstraps",

        // Shop & Economy
        "Overstock Plus",
        "Liquidation",
        "Glow Up",
        "Reroll Glut",
        "Omen Globe",

        // Tools & Equipment
        "Observatory",
        "Nacho Tong",
        "Recyclomancy",

        // Merchants
        "Tarot Tycoon",
        "Planet Tycoon",

        // Special Items
        "Money Tree",
        "Antimatter",
        "Illusion",
        "Petroglyph",
        "Retcon",
        "Palette"
    ] as const;
    // seed: string;
    ante: number;
    cardsPerAnte: Array<number>;
    deck: Deck;
    stake: Stake;
    version: Version;
    configurations: Configurations;
    result: Result;
    hasSpoilers: boolean;
    hasSpoilersMap: Record<SpoilableItems, RNGSource>;


    constructor(ante: number, cardsPerAnte: Array<number>, deck: Deck, stake: Stake, version: Version, configurations: Configurations) {
        // this.seed = seed;
        this.ante = ante;
        this.cardsPerAnte = cardsPerAnte;
        this.deck = deck;
        this.stake = stake;
        this.version = version;
        this.configurations = configurations;
        this.result = new Result();
        this.hasSpoilers = true
        this.hasSpoilersMap = {
            "The Soul": RNGSource.S_Soul,
            "Judgement": RNGSource.S_Judgement,
            "Wraith": RNGSource.S_Wraith,
        }
    }

    performAnalysis({seed, ante, cardsPerAnte, deck, stake, version}: AnalysisParams): { run: Run, game: Game } {
        if (ante > cardsPerAnte.length) {
            throw new Error(`cardsPerAnte array does not have enough elements for ante ${ante}`);
        }

        const selectedOptions: Array<boolean> = new Array(BalatroAnalyzer.OPTIONS.length).fill(true);
        const game = new Game(seed, new InstanceParams(deck, stake, false, version.getVersion()));
        game.initLocks(1, true, false);
        game.firstLock();

        this.lockOptions(game, selectedOptions);
        game.setDeck(deck);

        const run = new Run(seed);

        for (let a = 1; a <= ante; a++) {
            this.result.setCurrentAnte = a;
            this.processAnte(game, run, a, cardsPerAnte[a - 1]);
        }

        return {run, game};
    }

    private lockOptions(game: Game, selectedOptions: Array<boolean>): void {
        for (let i = 0; i < BalatroAnalyzer.OPTIONS.length; i++) {
            if (!selectedOptions[i]) {
                game.lock(BalatroAnalyzer.OPTIONS[i]);
            } else {
                game.unlock(BalatroAnalyzer.OPTIONS[i]);
            }
        }
    }

    private processAnte(game: Game, run: Run, ante: number, cardsCount: number): void {
        game.initUnlocks(ante, false);
        const voucher = game.nextVoucher(ante).getName();
        // game.lock(voucher);
        this.result.addVoucher(voucher);

        this.result.addTag(game.nextTag(ante).name)
        this.result.addTag(game.nextTag(ante).name)

        const boss = game.nextBoss(ante) as BossBlind
        this.result.addBoss(boss)

        if (this.configurations.analyzeShopQueue) {
            for (let i = 0; i < cardsCount; i++) {
                this.processShopItem(game, run, ante);
            }
        }

        const numPacks = ante === 1 ? 4 : 6;
        for (let p = 1; p <= numPacks; p++) {
            this.processPack(game, run, ante);
        }
        this.processQueues(game, run)


    }

    private processQueues(game: Game, run: Run) {
        const maxCards = 15;

        interface Generators {
            Joker: (source: QueueNames, ante: number, hasStickers: boolean) => JokerData;
            Planet: (source: QueueNames, ante: number, hasStickers: boolean) => ItemImpl;
            Tarot: (source: QueueNames, ante: number, hasStickers: boolean) => ItemImpl;
            Spectral: (source: QueueNames, ante: number, hasStickers: boolean) => ItemImpl;
            Standard: (source: QueueNames, ante: number) => Card;
        }

        const generators: Generators = {
            "Joker": (...args) => game.nextJoker(...args),
            "Planet": (...args) => game.nextPlanet(...args),
            "Tarot": (...args) => game.nextTarot(...args),
            "Spectral": (...args) => game.nextSpectral(...args),
            "Standard": (source, ante) => game.nextStandardCard(ante, source),
        }
        const miscCardSources = getMiscCardSources(maxCards)

        for (const source of miscCardSources) {
            for (let i = 0; i < source.cardsToGenerate; i++) {
                const generator = generators[source.cardType as keyof Generators];
                let card = generator(
                    source.source,
                    this.result.ante,
                    source.soulable ?? source.hasStickers ?? false
                )
                const isSpoilable = Object.keys(this.hasSpoilersMap)
                    .includes(card.name);

                if (this.hasSpoilers && isSpoilable) {
                    const spoilerSource = this.hasSpoilersMap[card.name as SpoilableItems];
                    const joker = game.nextJoker(spoilerSource, this.result.ante, true);
                    BalatroAnalyzer.getSticker(joker);
                    card = joker
                    run.addJoker(card.joker.name);
                }
                source.cards.push(card as unknown as PackCard);
            }
            this.result.addMiscCardSourcesToQueue([source])
            // console.log(`Generated ${source.cards.length} cards from ${source.name}`);
        }
        return miscCardSources;
    }


    private processShopItem(game: Game, run: Run, ante: number): void {
        const shopItem = game.nextShopItem(ante);
        const spoilerSource = Object.keys(this.hasSpoilersMap)
            .includes(shopItem.item.name);
        if (this.hasSpoilers && spoilerSource) {
            const joker: JokerData = game.nextJoker(this.hasSpoilersMap[shopItem.item.name as SpoilableItems], ante, true);
            run.addJoker(joker.joker.getName());
            BalatroAnalyzer.getSticker(joker);
            this.result.addItemToShopQueue(joker);
        } else if (shopItem.type === Type.JOKER) {
            run.addJoker(shopItem.jokerData.joker.getName());
            BalatroAnalyzer.getSticker(shopItem.jokerData);
            this.result.addItemToShopQueue(shopItem.jokerData);
        } else {
            this.result.addItemToShopQueue(shopItem.item as Card);
        }
    }

    private processPack(game: Game, run: Run, ante: number): void {
        const pack = game.nextPack(ante);
        const packInfo = game.packInfo(pack);
        const options = new Set<Option>();

        let cards;
        switch (packInfo.getKind()) {
            case PackKind.CELESTIAL:
                cards = game.nextCelestialPack(packInfo.getSize(), ante);
                break;
            case PackKind.ARCANA:
                cards = game.nextArcanaPack(packInfo.getSize(), ante);
                break;
            case PackKind.SPECTRAL:
                cards = game.nextSpectralPack(packInfo.getSize(), ante);
                break;
            case PackKind.BUFFOON:
                cards = game.nextBuffoonPack(packInfo.getSize(), ante);
                break;
            case PackKind.STANDARD:
                cards = game.nextStandardPack(packInfo.getSize(), ante);
                break;
        }

        for (let c = 0; c < packInfo.getSize(); c++) {
            cards[c] = this.processCard(run, packInfo, cards[c], options, game);
        }

        this.result.addPackToQueue(packInfo.getKind(), cards as Array<Card | JokerData>);
    }

    private processCard(run: Run, packInfo: PackInfo, card: ItemImpl | JokerData | Card, options: Set<Option>, game: Game): Card | JokerData | ItemImpl {
        if (packInfo.getKind() === PackKind.BUFFOON) {
            const joker: JokerData = card as JokerData;
            const sticker = BalatroAnalyzer.getSticker(joker);
            run.addJoker(joker.joker.getName());
            options.add(new Option(joker.joker, new ItemImpl(sticker)));
            return joker
        } else if (packInfo.getKind() === PackKind.STANDARD) {
            const cardObj: Card = card as Card;
            const cardName = new CardNameBuilder(cardObj).build();
            options.add(new Option(new AbstractCard(cardName), new ItemImpl(Edition.NO_EDITION)));
            return card;
        } else {
            const item = (card as ItemImpl).getName();
            const isSpoilable = Object.keys(this.hasSpoilersMap)
                .includes(item);

            if (isSpoilable && this.hasSpoilers) {
                const spoilerSource = this.hasSpoilersMap[item as SpoilableItems];
                if (item === "The Soul") {
                    run.hasTheSoul = true;
                }
                const joker = game.nextJoker(spoilerSource, this.result.ante, true);
                run.addJoker(joker.joker.getName());
                const sticker = BalatroAnalyzer.getSticker(joker);
                options.add(new Option(joker.joker, new ItemImpl(sticker)));
                return joker
            }
            options.add(new Option(card as ItemImpl, new ItemImpl(Edition.NO_EDITION)));
            return card as Card;

        }

    }

    static getSticker(joker: JokerData): Edition {
        if (joker.stickers.eternal) return Edition.ETERNAL;
        if (joker.stickers.perishable) return Edition.PERISHABLE;
        if (joker.stickers.rental) return Edition.RENTAL;
        if (joker.edition !== Edition.NO_EDITION) return joker.edition;
        return Edition.NO_EDITION;
    }
}
