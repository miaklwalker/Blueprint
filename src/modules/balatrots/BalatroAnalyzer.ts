import {Card} from "./enum/cards/Card";
import {Type} from "./enum/cards/CardType";
import {Deck} from "./enum/Deck";
import {Edition} from "./enum/Edition";
import {PackKind} from "./enum/packs/PackKind";
import {Stake} from "./enum/Stake";
import {Version} from "./enum/Version";
import {Game} from "./Game";
import {AnalysisParams} from "./interface/AnalysisParams";
import {Configurations} from "./interface/Configurations";
import {ItemImpl} from "./interface/Item";
import {Result} from "./Result";
import {Run} from "./Run";
import {AbstractCard} from "./struct/AbstractCard";
import {CardNameBuilder} from "./struct/CardNameBuilder";
import {InstanceParams} from "./struct/InstanceParams";
import {JokerData} from "./struct/JokerData";
import {Option} from "./struct/Option";
import {RandomQueueNames, RNGSource} from "./enum/QueueName.ts";
import {MiscCardSource} from "../ImmolateWrapper";
import {BossBlind} from "./enum/BossBlind.ts";

// @ts-ignore



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
    cardsPerAnte: number[];
    deck: Deck;
    stake: Stake;
    version: Version;
    configurations: Configurations;
    result: Result;
    hasSpoilers: boolean;
    hasSpoilersMap: { [key: string]: RNGSource };


    constructor(ante: number, cardsPerAnte: number[], deck: Deck, stake: Stake, version: Version, configurations: Configurations) {
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

        const selectedOptions: boolean[] = new Array(BalatroAnalyzer.OPTIONS.length).fill(true);
        const game = new Game(seed, new InstanceParams(deck, stake, false, version.getVersion()));
        game.initLocks(1, true, false);
        game.firstLock();

        this.lockOptions(game, selectedOptions);
        game.setDeck(deck);

        const run = new Run(seed);

        for (let a = 1; a <= ante; a++) {
            this.result.setCurrentAnte = a;
            this.processAnte(game, run, a, cardsPerAnte[a - 1], selectedOptions);
        }

        return {run, game};
    }

    private lockOptions(game: Game, selectedOptions: boolean[]): void {
        for (let i = 0; i < BalatroAnalyzer.OPTIONS.length; i++) {
            if (!selectedOptions[i]) {
                game.lock(BalatroAnalyzer.OPTIONS[i]);
            }else{
                game.unlock(BalatroAnalyzer.OPTIONS[i]);
            }
        }
    }

    // @ts-ignore
    private processAnte(game: Game, run: Run, ante: number, cardsCount: number, selectedOptions: boolean[]): void {
        game.initUnlocks(ante, false);




        const voucher = game.nextVoucher(ante).getName();
        // game.lock(voucher);
        this.result.addVoucher(voucher);

        this.result.addTag(game.nextTag(ante).name)
        this.result.addTag(game.nextTag(ante).name)

        const boss = game.nextBoss(ante) as BossBlind
        this.result.addBoss(boss)

        // this.unlockVouchers(game, voucher, selectedOptions);

        if (this.configurations.analyzeShopQueue) {
            for (let i = 0; i < cardsCount; i++) {
                this.processShopItem(game, run, ante);
            }
        }

        const numPacks = ante === 1 ? 4 : 6;
        for (let p = 1; p <= numPacks; p++) {
            this.processPack(game, run, ante, p);
        }
        this.processQueues(game, run)


    }

    private processQueues(game: Game, run: Run): MiscCardSource[] {
        let maxCards = 15;
        const miscCardSources: MiscCardSource[] = [
            {
                name: "riffRaff",
                cardsToGenerate: 6,
                cardType: "Joker",
                source: RNGSource.S_Riff_Raff,
                hasStickers: false,
                soulable: false,
                cards: []
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
                cards: []
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
                cardsToGenerate: maxCards,
                cardType: "Standard",
                source: RandomQueueNames.R_Standard_Has_Seal,
                cards: [],
            },
            {
                name: "standardPack",
                cardsToGenerate: maxCards,
                cardType: "Standard",
                source: RandomQueueNames.R_Standard_Edition,
                cards: [],
                hasStickers: false,
            },
        ];
        let generators: any = {
            // @ts-ignore
            "Joker": (...args: any) => game.nextJoker(...args),
            // @ts-ignore
            "Planet": (...args: any) => game.nextPlanet(...args),
            // @ts-ignore
            "Tarot": (...args: any) => game.nextTarot(...args),
            // @ts-ignore
            "Spectral": (...args: any) => game.nextSpectral(...args),
            // @ts-ignore
            "Standard": (source, ante) => game.nextStandardCard(ante, source),
        }

        for (let source of miscCardSources) {
            for (let i = 0; i < source.cardsToGenerate; i++) {
                let generator = generators[source.cardType];
                let card = generator(
                    source.source,
                    this.result.ante,
                    source.soulable ?? source.hasStickers ?? false
                )
                let spoilerSource = this.hasSpoilersMap[card.name];
                if( this.hasSpoilers && spoilerSource) {
                    let joker = game.nextJoker(spoilerSource, this.result.ante, true);
                    // @ts-ignore
                    BalatroAnalyzer.getSticker(joker);
                    card = joker
                    run.addJoker(card.joker.name);
                }
                source.cards.push(card);
            }
            this.result.addMiscCardSourcesToQueue([source])
            // console.log(`Generated ${source.cards.length} cards from ${source.name}`);
        }
        return miscCardSources;
    }

    // private unlockVouchers(game: Game, voucher: string, selectedOptions: boolean[]): void {
    //     for (let i = 0; i < Game.VOUCHERS.length; i += 2) {
    //         if (Game.VOUCHERS[i].getName() === voucher) {
    //             if (selectedOptions[BalatroAnalyzer.OPTIONS.indexOf(Game.VOUCHERS[i + 1].getName())]) {
    //                 game.unlock(Game.VOUCHERS[i + 1].getName());
    //             }
    //         }
    //     }
    // }

    private processShopItem(game: Game, run: Run, ante: number): void {
        const shopItem = game.nextShopItem(ante);
        // @ts-ignore
        let sticker: Edition | null = null;
        let spoilerSource = this.hasSpoilersMap[shopItem.item.name];
        if (this.hasSpoilers && spoilerSource) {
            const joker: JokerData = game.nextJoker(spoilerSource, ante, true);
            run.addJoker(joker.joker.getName());
            sticker = BalatroAnalyzer.getSticker(joker);
            this.result.addItemToShopQueue(joker);
        } else if (shopItem.type === Type.JOKER) {
            run.addJoker(shopItem.jokerData.joker.getName());
            sticker = BalatroAnalyzer.getSticker(shopItem.jokerData);
            this.result.addItemToShopQueue(shopItem.jokerData);
        } else {
            this.result.addItemToShopQueue(shopItem.item as Card);
        }


        // console.log(` Card ${i + 1}: ${shopItem.item.getName()} ${sticker ? `(${new EditionItem(sticker).getName()})` : ""}`);
    }

    // @ts-ignore
    private processPack(game: Game, run: Run, ante: number, packNumber: number): void {
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

        this.result.addPackToQueue(packInfo.getKind(), cards as (Card | JokerData)[]);
    }

    private processCard(run: Run, packInfo: any, card: any, options: Set<Option>, game: Game): Card | JokerData {
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
            let item = (card as ItemImpl).getName();
            let spoilerSource = this.hasSpoilersMap[item];
            if (spoilerSource && this.hasSpoilers) {
                if (item === "The Soul") {
                    run.hasTheSoul = true;
                }
                let joker = game.nextJoker(spoilerSource, this.result.ante, true);
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
